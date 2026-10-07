/**
 * Turns the list description into editorial paragraphs, rating buckets and the
 * yearly playlist URL. Only plain text and anchor hrefs are read from the HTML.
 */
import type { Cheerio, CheerioAPI } from 'cheerio';
import type { AnyNode } from 'domhandler';
import type { ImportedRatingBucket } from '../../src/lib/types/imported.ts';
import type { Diagnostics } from './diagnostics.ts';

export interface ParsedDescription {
	introEn: string[];
	ratingDistribution: ImportedRatingBucket[];
	statedTotal?: number;
	spotifyPlaylistUrl?: string;
}

/** "5 Stars (Masterpieces): 4 (2.5%)" — the percentage is deliberately ignored. */
const RATING_LINE =
	/^(\d+(?:\.\d+)?)\s*stars?\s*(?:\(([^)]*)\))?\s*:\s*(\d[\d,]*)\s*(?:\([^)]*%\s*\))?\s*$/i;
const LOOKS_LIKE_RATING_LINE = /\bstars?\b.*:/i;
const STATED_TOTAL = /\brated\s+(\d[\d,]*)\s+albums?\b/i;
const SPOTIFY_PLAYLIST = /^https?:\/\/open\.spotify\.com\/playlist\/[A-Za-z0-9]+/i;
const URL_LINE = /^https?:\/\/\S+$/i;

/** Keeps only the canonical playlist address, dropping share-tracking parameters such as `si`. */
function normalizePlaylistUrl(url: string): string {
	return SPOTIFY_PLAYLIST.exec(url)?.[0] ?? url;
}

/** Flattens the description to lines: text nodes and `<br>` breaks; links contribute their href. */
export function descriptionToLines($: CheerioAPI, root: Cheerio<AnyNode>): string[] {
	let text = '';
	const walk = (nodes: AnyNode[]) => {
		for (const node of nodes) {
			if (node.type === 'text') {
				text += node.data;
			} else if (node.type === 'tag') {
				const tag = node.name.toLowerCase();
				if (tag === 'br') {
					text += '\n';
				} else if (tag === 'a') {
					const href = $(node).attr('href') ?? '';
					text += /^https?:\/\//i.test(href) ? href : $(node).text();
				} else if (tag === 'script' || tag === 'style') {
					continue;
				} else if (tag === 'p' || tag === 'div') {
					text += '\n';
					walk(node.children);
					text += '\n';
				} else {
					walk(node.children);
				}
			}
		}
	};
	walk(root.contents().toArray());
	return text.split('\n').map((line) => line.replace(/\s+/g, ' ').trim());
}

export function parseDescription(lines: string[], diagnostics: Diagnostics): ParsedDescription {
	const buckets: ImportedRatingBucket[] = [];
	const paragraphs: string[] = [];
	let spotifyPlaylistUrl: string | undefined;
	let current: string[] = [];

	const flush = () => {
		if (current.length) paragraphs.push(current.join(' '));
		current = [];
	};

	lines.forEach((line, index) => {
		if (line === '') {
			flush();
			return;
		}

		const rating = RATING_LINE.exec(line);
		if (rating) {
			buckets.push({
				rating: Number(rating[1]),
				labelEn: rating[2]?.trim() || undefined,
				count: Number(rating[3].replace(/,/g, ''))
			});
			return;
		}
		if (LOOKS_LIKE_RATING_LINE.test(line)) {
			diagnostics.warn(`Could not parse rating line: "${line}"`);
			return;
		}

		if (SPOTIFY_PLAYLIST.test(line)) {
			if (spotifyPlaylistUrl)
				diagnostics.warn('More than one Spotify playlist URL found; keeping the first.');
			else spotifyPlaylistUrl = normalizePlaylistUrl(line);
			return;
		}
		if (/\bplaylist\b/i.test(line) && !URL_LINE.test(line)) return; // "Playlist of the best songs of 2025:"

		// A lead-in that ends with ":" directly before the rating block belongs to the statistics, not the prose.
		const next = lines.slice(index + 1).find((l) => l !== '');
		if (line.endsWith(':') && next && RATING_LINE.test(next)) {
			flush();
			return;
		}

		current.push(line);
	});
	flush();

	const introEn = paragraphs.map((p) => p.trim()).filter(Boolean);
	const totalMatch = introEn.map((p) => STATED_TOTAL.exec(p)).find(Boolean);
	const statedTotal = totalMatch ? Number(totalMatch[1].replace(/,/g, '')) : undefined;

	// Highest rating first; drop exact duplicates while warning.
	const seen = new Set<number>();
	const ratingDistribution = buckets
		.filter((b) => {
			if (seen.has(b.rating)) {
				diagnostics.warn(`Duplicate rating bucket for ${b.rating} stars; keeping the first.`);
				return false;
			}
			seen.add(b.rating);
			return true;
		})
		.sort((a, b) => b.rating - a.rating);

	return { introEn, ratingDistribution, statedTotal, spotifyPlaylistUrl };
}
