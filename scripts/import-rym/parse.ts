/**
 * Parses one saved RateYourMusic list page into `ImportedYearData`.
 * Only the fields the site needs are read; scripts, tokens and account data
 * in the page are never touched.
 */
import * as cheerio from 'cheerio';
import type { ImportedAlbum, ImportedYearData } from '../../src/lib/types/imported.ts';
import { assignAlbumSlugs } from '../../src/lib/utils/slug.ts';
import { appleMusicSearchUrl, spotifySearchUrl } from '../../src/lib/utils/streaming.ts';
import { Diagnostics } from './diagnostics.ts';
import { descriptionToLines, parseDescription } from './description.ts';

const RYM_ORIGIN = 'https://rateyourmusic.com';

export interface ParseResult {
	data?: ImportedYearData;
	diagnostics: Diagnostics;
	/** Facts for the report that are not part of the generated data. */
	stats: {
		albumsFound: number;
		withRymUrl: number;
		withPrimaryGenres: number;
		withArtwork: number;
		bucketSum: number;
		expectedAlbumCount?: number;
	};
}

const clean = (text: string) => text.replace(/\s+/g, ' ').trim();

function absoluteRymUrl(href: string | undefined): string | undefined {
	if (!href) return undefined;
	try {
		const url = new URL(href, RYM_ORIGIN);
		if (!/(^|\.)rateyourmusic\.com$/.test(url.hostname)) return undefined;
		url.search = '';
		url.hash = '';
		return url.href;
	} catch {
		return undefined;
	}
}

function detectYear(listTitle: string, pageTitle: string, listUrl: string, releaseYears: number[]) {
	for (const source of [listTitle, pageTitle, listUrl]) {
		const match = /\b(19|20)\d{2}\b/.exec(source);
		if (match) return Number(match[0]);
	}
	if (releaseYears.length) {
		const counts = new Map<number, number>();
		for (const y of releaseYears) counts.set(y, (counts.get(y) ?? 0) + 1);
		return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
	}
	return undefined;
}

export function parseRymListHtml(html: string, sourceFile: string): ParseResult {
	const diagnostics = new Diagnostics();
	const $ = cheerio.load(html);

	// ---- list metadata ----
	const listTitle = clean($('h1').first().text());
	const pageTitle = clean($('title').first().text()).replace(/\s*-\s*Rate Your Music\s*$/i, '');
	const rymListUrl =
		absoluteRymUrl($('link[rel="canonical"]').attr('href')) ??
		absoluteRymUrl($('meta[property="og:url"]').attr('content')) ??
		'';
	if (!rymListUrl) diagnostics.warn('Could not find the canonical RYM list URL.');
	if (!listTitle && !pageTitle)
		diagnostics.fail('No list title found; this does not look like a saved RYM list page.');

	const expectedMatch = /\btop\s+(\d+)\b/i.exec(listTitle || pageTitle);
	const expectedAlbumCount = expectedMatch ? Number(expectedMatch[1]) : undefined;

	// ---- ranked albums ----
	const rows = $('td.number')
		.closest('tr')
		.filter((_, tr) => $(tr).find('.main_entry').length > 0);
	const albums: ImportedAlbum[] = [];
	let withRymUrl = 0;
	let withPrimaryGenres = 0;
	let withArtwork = 0;

	rows.each((_, tr) => {
		const row = $(tr);
		const rank = Number.parseInt(clean(row.find('td.number').first().text()), 10);
		const artist = clean(row.find('a.list_artist').first().text());
		const albumLink = row.find('a.list_album').first();
		const album = clean(albumLink.text());
		if (!Number.isInteger(rank) || !artist || !album) {
			diagnostics.warn(
				`Skipped a row with incomplete data (rank "${rank}", artist "${artist}", album "${album}").`
			);
			return;
		}

		const rymUrl = absoluteRymUrl(albumLink.attr('href'));
		if (rymUrl) withRymUrl++;

		const releaseMatch = /\((\d{4})\)/.exec(row.find('.rel_date').first().text());
		const releaseYear = releaseMatch ? Number(releaseMatch[1]) : undefined;

		const genres = (selector: string) =>
			row
				.find(`${selector} a.genre`)
				.map((_, a) => clean($(a).text()))
				.get()
				.filter(Boolean);
		const primaryGenres = genres('.extra_metadata_genres');
		const secondaryGenres = genres('.extra_metadata_sec_genres');
		if (primaryGenres.length) withPrimaryGenres++;
		const descriptors = clean(row.find('.extra_metadata_descriptors').first().text())
			.split(',')
			.map((d) => d.trim())
			.filter(Boolean);

		// Lazy-loaded covers carry the real reference in data-src and a 1×1 blank.png in src.
		const img = row.find('td.list_art img').first();
		const isPlaceholder = (value?: string) => !value || /(^|\/)blank\.png$/i.test(value);
		const artworkSource = [img.attr('data-src'), img.attr('src')].find((v) => !isPlaceholder(v));
		if (artworkSource) withArtwork++;

		albums.push({
			rank,
			slug: '', // assigned once all rows are known, see below
			artist,
			album,
			releaseYear,
			rymUrl,
			primaryGenres,
			secondaryGenres,
			descriptors,
			spotifyUrl: spotifySearchUrl(artist, album),
			appleMusicUrl: appleMusicSearchUrl(artist, album),
			streamingLinksAreSearchFallbacks: true,
			artworkSource
		});
	});

	if (albums.length === 0) diagnostics.fail('No ranked albums found in the page.');
	albums.sort((a, b) => a.rank - b.rank);
	for (const [album, slug] of assignAlbumSlugs(albums)) album.slug = slug;

	// ---- rank integrity ----
	const ranks = albums.map((a) => a.rank);
	const duplicates = ranks.filter((r, i) => ranks.indexOf(r) !== i);
	if (duplicates.length)
		diagnostics.fail(`Duplicate ranks found: ${[...new Set(duplicates)].join(', ')}.`);
	if (albums.length) {
		const top = Math.max(...ranks);
		const missing: number[] = [];
		for (let r = 1; r <= top; r++) if (!ranks.includes(r)) missing.push(r);
		if (missing.length) diagnostics.warn(`Missing ranks within 1–${top}: ${missing.join(', ')}.`);
		if (expectedAlbumCount !== undefined && albums.length !== expectedAlbumCount) {
			diagnostics.warn(
				`The list title implies ${expectedAlbumCount} albums but ${albums.length} ranked albums were found.`
			);
		}
	}
	if (albums.length && withRymUrl < albums.length)
		diagnostics.warn(`${albums.length - withRymUrl} album(s) have no RYM release URL.`);
	if (albums.length && withPrimaryGenres < albums.length)
		diagnostics.warn(`${albums.length - withPrimaryGenres} album(s) have no primary genres.`);
	if (albums.length && withArtwork < albums.length)
		diagnostics.warn(`${albums.length - withArtwork} album(s) have no artwork source.`);

	// ---- description: intro, statistics, playlist ----
	const descriptionBlock = $('.rendered_text')
		.toArray()
		.map((el) => $(el))
		.sort((a, b) => b.text().length - a.text().length)[0];
	let description = parseDescription([], diagnostics);
	if (descriptionBlock && descriptionBlock.text().trim()) {
		description = parseDescription(descriptionToLines($, descriptionBlock), diagnostics);
	} else {
		diagnostics.warn('No list description found; introduction, statistics and playlist are empty.');
	}

	const bucketSum = description.ratingDistribution.reduce((sum, b) => sum + b.count, 0);
	let totalAlbumsRated = description.statedTotal;
	if (totalAlbumsRated === undefined) {
		diagnostics.warn(
			description.ratingDistribution.length
				? `No stated "rated N albums" total found; using the rating bucket sum (${bucketSum}) instead.`
				: 'No stated total of albums rated and no rating buckets found.'
		);
		totalAlbumsRated = bucketSum;
	} else if (description.ratingDistribution.length && bucketSum !== totalAlbumsRated) {
		diagnostics.warn(
			`Rating buckets sum to ${bucketSum} while stated total is ${totalAlbumsRated}. Percentages will use ${totalAlbumsRated} as denominator.`
		);
	}
	if (!description.ratingDistribution.length)
		diagnostics.warn('No rating distribution lines found.');
	if (!description.spotifyPlaylistUrl)
		diagnostics.warn('No Spotify playlist URL found in the description.');
	if (!description.introEn.length)
		diagnostics.warn('No introductory text found in the description.');

	// ---- year ----
	const year = detectYear(
		listTitle,
		pageTitle,
		rymListUrl,
		albums.map((a) => a.releaseYear).filter((y): y is number => y !== undefined)
	);
	if (year === undefined)
		diagnostics.fail('Could not determine the list year from the title, URL or releases.');

	const stats = {
		albumsFound: albums.length,
		withRymUrl,
		withPrimaryGenres,
		withArtwork,
		bucketSum,
		expectedAlbumCount
	};
	if (diagnostics.fatal || year === undefined) return { diagnostics, stats };

	// Property order here defines the generated JSON order.
	const data: ImportedYearData = {
		year,
		listTitle: listTitle || pageTitle,
		rymListUrl,
		introEn: description.introEn,
		totalAlbumsRated,
		ratingDistribution: description.ratingDistribution,
		spotifyPlaylistUrl: description.spotifyPlaylistUrl,
		albums,
		importMeta: {
			source: 'rym-saved-html',
			sourceFile,
			expectedAlbumCount,
			warnings: diagnostics.warnings
		}
	};
	return { data, diagnostics, stats };
}
