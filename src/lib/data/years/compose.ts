/**
 * Builds the production `YearData` for an imported year from three inputs that
 * stay separate on disk:
 *   generated/{year}.json  — imported list data and local artwork paths
 *   manual/{year}.ts       — hand-supplied exact streaming links
 *   the editorial config   — accent, Brazilian Portuguese intro, share image
 *
 * Components only ever see `YearData`; nothing downstream knows about RYM.
 */
import type { Album, Locale, YearData } from '#lib/types/year.js';
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
}

function toAlbum(
	imported: ImportedAlbum,
	manual: ManualYearOverrides | undefined,
	fallbackRymUrl: string
): Album {
	if (!imported.artwork) {
		throw new Error(
			`Album #${imported.rank} "${imported.artist} — ${imported.album}" has no local artwork. Run: npm run enrich:artwork -- <year>`
		);
	}
	const links = resolveServiceLinks(imported, manual?.[imported.slug]);
	return {
		rank: imported.rank,
		artist: imported.artist,
		album: imported.album,
		artwork: imported.artwork,
		primaryGenres: imported.primaryGenres,
		spotifyUrl: links.spotify?.url,
		appleMusicUrl: links.appleMusic?.url,
		rymUrl: imported.rymUrl ?? fallbackRymUrl
	};
}

export function createYear(
	generated: ImportedYearData,
	manual: ManualYearOverrides | undefined,
	editorial: YearEditorial
): YearData {
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
		albums: [...generated.albums]
			.sort((a, b) => a.rank - b.rank)
			.map((a) => toAlbum(a, manual, generated.rymListUrl))
	};
}
