/**
 * Builds the production `YearData` for an imported year from three inputs that
 * stay separate on disk:
 *   generated/{year}.json  — imported list data and local artwork paths
 *   manual/{year}.ts       — hand-supplied exact streaming links
 *   the editorial config   — accent, Brazilian Portuguese intro, share image
 *
 * Components only ever see `YearData`; nothing downstream knows about RYM.
 */
import type { Album, BonusAlbum, Locale, YearData } from '#lib/types/year.js';
import type { ImportedAlbum, ImportedYearData } from '#lib/types/imported.js';
import type { ManualYearOverrides } from './manual/types.ts';
import { ratingLabel } from '#lib/data/ratingLabels.js';
import { resolveServiceLinks } from '#lib/utils/serviceLinks.js';

export interface YearEditorial {
	/** Year accent, chosen by hand to complement the #1 artwork. */
	accent: string;
	/** Intro paragraphs. English defaults to the imported text when omitted. */
	intro: { 'pt-BR': string[]; en?: string[] };
	/** Fallback for the year-over-year comparison when the previous year is not published. */
	previousYearAlbumsRated?: number;
	/** Optional 1200×630 share image; otherwise the #1 artwork is used. */
	shareImage?: string;
	/** Hero collage path; defaults to the file `npm run generate:hero` writes. `null` disables it. */
	heroCollage?: string | null;
	/**
	 * Slugs of imported albums that are unranked bonus selections rather than part of
	 * the Top N. They keep their source rank in the generated data but are never shown
	 * with a number. Must be named explicitly: an extra album is not assumed to be a bonus.
	 */
	bonusSlugs?: string[];
}

export function defaultHeroCollage(year: number): string {
	return `/artwork/${year}/hero-collage.webp`;
}

function toAlbum(
	imported: ImportedAlbum,
	manual: ManualYearOverrides | undefined,
	fallbackRymUrl: string
): BonusAlbum {
	if (!imported.artwork) {
		throw new Error(
			`Album #${imported.rank} "${imported.artist} — ${imported.album}" has no local artwork. Run: npm run enrich:artwork -- <year>`
		);
	}
	const links = resolveServiceLinks(imported, manual?.[imported.slug]);
	return {
		artist: imported.artist,
		album: imported.album,
		artwork: imported.artwork,
		primaryGenres: imported.primaryGenres,
		spotifyUrl: links.spotify?.url,
		appleMusicUrl: links.appleMusic?.url,
		rymUrl: imported.rymUrl ?? fallbackRymUrl
	};
}

/**
 * Separates the imported list into the ranked Top N and the explicitly named bonus
 * selections, then checks that what remains really is a contiguous 1..N ranking.
 * A count that does not match the list title is treated as an error, not a bonus.
 */
function splitAlbums(
	generated: ImportedYearData,
	bonusSlugs: readonly string[]
): { ranked: ImportedAlbum[]; bonus: ImportedAlbum[] } {
	const bySlug = new Set(generated.albums.map((a) => a.slug));
	for (const slug of bonusSlugs) {
		if (!bySlug.has(slug)) {
			throw new Error(`${generated.year}: bonus slug "${slug}" is not in the imported list.`);
		}
	}
	const sorted = [...generated.albums].sort((a, b) => a.rank - b.rank);
	const bonus = sorted.filter((a) => bonusSlugs.includes(a.slug));
	const ranked = sorted.filter((a) => !bonusSlugs.includes(a.slug));

	ranked.forEach((a, i) => {
		if (a.rank !== i + 1) {
			throw new Error(
				`${generated.year}: ranked albums are not a contiguous 1..${ranked.length} list (found rank ${a.rank} at position ${i + 1}). Mark bonus albums with bonusSlugs or fix the import.`
			);
		}
	});
	const expected = generated.importMeta.expectedAlbumCount;
	if (expected !== undefined && expected !== ranked.length) {
		throw new Error(
			`${generated.year}: the list title implies a Top ${expected} but ${ranked.length} ranked albums remain after removing ${bonus.length} bonus album(s).`
		);
	}
	return { ranked, bonus };
}

export function createYear(
	generated: ImportedYearData,
	manual: ManualYearOverrides | undefined,
	editorial: YearEditorial
): YearData {
	const { ranked, bonus } = splitAlbums(generated, editorial.bonusSlugs ?? []);
	const intro: Record<Locale, string[]> = {
		'pt-BR': editorial.intro['pt-BR'],
		en: editorial.intro.en ?? generated.introEn
	};
	return {
		year: generated.year,
		theme: { accent: editorial.accent },
		intro,
		totalAlbumsRated: generated.totalAlbumsRated,
		previousYearAlbumsRated: editorial.previousYearAlbumsRated,
		ratingDistribution: [...generated.ratingDistribution]
			.sort((a, b) => b.rating - a.rating)
			.map((b) => ({ rating: b.rating, label: ratingLabel(b.rating, b.labelEn), count: b.count })),
		rymListUrl: generated.rymListUrl,
		spotifyPlaylistUrl: generated.spotifyPlaylistUrl ?? '',
		shareImage: editorial.shareImage,
		heroCollage:
			editorial.heroCollage === null
				? undefined
				: (editorial.heroCollage ?? defaultHeroCollage(generated.year)),
		rankedAlbums: ranked.map((a): Album => ({
			rank: a.rank,
			...toAlbum(a, manual, generated.rymListUrl)
		})),
		bonusAlbums: bonus.map((a): BonusAlbum => toAlbum(a, manual, generated.rymListUrl))
	};
}
