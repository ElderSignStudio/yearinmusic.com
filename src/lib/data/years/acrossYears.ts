/**
 * Cross-year statistics for the "Across the Years" page, derived entirely from the
 * published `YearData` so a newly registered year updates the page automatically.
 *
 * Rules: a year's `totalAlbumsRated` is its official total and the denominator for its
 * shares; cumulative shares use the sum of those totals. Bonus albums are never counted
 * in ranking-derived statistics (recurring artists, Top 5 appearances, genres).
 */
import type { Album, Localized, RatingBucket, YearData } from '#lib/types/year.js';
import { ratingLabel } from '#lib/data/ratingLabels.js';
import { deriveYearStatistics, type CountShare } from './statistics.js';

export interface YearPoint {
	year: number;
	accent: string;
	totalAlbumsRated: number;
	/** Albums rated exactly 5.0. */
	amazing: number;
	/** Albums rated 4.0 or higher, with its share of the year's total. */
	greatOrBetter: CountShare;
	rankedCount: number;
	bonusCount: number;
}

export interface RecurringArtist {
	/** The credit string as written, from the artist's most recent appearance. */
	artist: string;
	appearances: number;
	/** Chronological. */
	years: number[];
	topFiveAppearances: number;
}

export interface GenreFrequency {
	genre: string;
	/** Ranked albums carrying the genre as a primary genre (at most once per album). */
	albums: number;
	/** Share of all ranked albums. */
	share: number;
}

export interface Winner {
	year: number;
	accent: string;
	album: Album;
}

export interface AcrossYearsStatistics {
	firstYear: number;
	latestYear: number;
	yearCount: number;
	/** Sum of every year's official total. */
	totalAlbumsRated: number;
	amazing: CountShare;
	greatOrBetter: CountShare;
	/** Chronological, earliest first. */
	perYear: YearPoint[];
	mostListenedYear: YearPoint;
	highestGreatOrBetterShareYear: YearPoint;
	/** Highest rating first. Shares are computed against `totalAlbumsRated` and may not sum to 100%. */
	cumulativeDistribution: RatingBucket[];
	rankedAlbumCount: number;
	/** Artists with more than one ranked appearance, most frequent first. */
	recurringArtists: RecurringArtist[];
	/** Most frequent primary genres among ranked albums. */
	genres: GenreFrequency[];
	/** Every year's #1, chronological. */
	winners: Winner[];
}

function share(count: number, total: number): CountShare {
	return { count, share: total > 0 ? count / total : 0 };
}

/** Conservative identity for an artist credit: whitespace collapsed, case ignored. */
function artistKey(artist: string): string {
	return artist.trim().replace(/\s+/g, ' ').toLowerCase();
}

function toYearPoint(data: YearData): YearPoint {
	const stats = deriveYearStatistics(data);
	return {
		year: data.year,
		accent: data.theme.accent,
		totalAlbumsRated: stats.totalAlbumsRated,
		amazing: stats.amazing.count,
		greatOrBetter: stats.greatOrBetter,
		rankedCount: data.rankedAlbums.length,
		bonusCount: data.bonusAlbums.length
	};
}

function cumulativeDistribution(years: readonly YearData[]): RatingBucket[] {
	const counts = new Map<number, { count: number; label: Localized }>();
	for (const year of years) {
		for (const bucket of year.ratingDistribution) {
			const entry = counts.get(bucket.rating) ?? { count: 0, label: ratingLabel(bucket.rating) };
			entry.count += bucket.count;
			counts.set(bucket.rating, entry);
		}
	}
	return [...counts.entries()]
		.sort(([a], [b]) => b - a)
		.map(([rating, { count, label }]) => ({ rating, label, count }));
}

function recurringArtists(years: readonly YearData[]): RecurringArtist[] {
	const byKey = new Map<string, RecurringArtist>();
	for (const year of years) {
		const seenThisYear = new Set<string>();
		for (const album of year.rankedAlbums) {
			const key = artistKey(album.artist);
			const entry = byKey.get(key) ?? {
				artist: album.artist,
				appearances: 0,
				years: [],
				topFiveAppearances: 0
			};
			entry.artist = album.artist; // chronological walk: keep the latest spelling
			entry.appearances += 1;
			if (!seenThisYear.has(key)) entry.years.push(year.year);
			if (album.rank <= 5) entry.topFiveAppearances += 1;
			seenThisYear.add(key);
			byKey.set(key, entry);
		}
	}
	return [...byKey.values()]
		.filter((a) => a.appearances > 1)
		.sort(
			(a, b) =>
				b.appearances - a.appearances ||
				b.topFiveAppearances - a.topFiveAppearances ||
				b.years[b.years.length - 1] - a.years[a.years.length - 1] ||
				a.artist.localeCompare(b.artist)
		);
}

function genreFrequencies(years: readonly YearData[], rankedAlbumCount: number): GenreFrequency[] {
	const counts = new Map<string, number>();
	for (const year of years) {
		for (const album of year.rankedAlbums) {
			for (const genre of new Set(album.primaryGenres)) {
				counts.set(genre, (counts.get(genre) ?? 0) + 1);
			}
		}
	}
	return [...counts.entries()]
		.map(([genre, albums]) => ({ genre, albums, share: albums / Math.max(rankedAlbumCount, 1) }))
		.sort((a, b) => b.albums - a.albums || a.genre.localeCompare(b.genre));
}

export function getAcrossYearsStatistics(
	published: readonly YearData[]
): AcrossYearsStatistics | undefined {
	const years = [...published].sort((a, b) => a.year - b.year);
	if (years.length === 0) return undefined;

	const perYear = years.map(toYearPoint);
	const totalAlbumsRated = perYear.reduce((sum, y) => sum + y.totalAlbumsRated, 0);
	const amazingCount = perYear.reduce((sum, y) => sum + y.amazing, 0);
	const greatCount = perYear.reduce((sum, y) => sum + y.greatOrBetter.count, 0);
	const rankedAlbumCount = years.reduce((sum, y) => sum + y.rankedAlbums.length, 0);

	// Ties resolve to the earlier year, matching the chronological reading of the charts.
	const mostListenedYear = perYear.reduce((best, y) =>
		y.totalAlbumsRated > best.totalAlbumsRated ? y : best
	);
	const highestGreatOrBetterShareYear = perYear.reduce((best, y) =>
		y.greatOrBetter.share > best.greatOrBetter.share ? y : best
	);

	return {
		firstYear: years[0].year,
		latestYear: years[years.length - 1].year,
		yearCount: years.length,
		totalAlbumsRated,
		amazing: share(amazingCount, totalAlbumsRated),
		greatOrBetter: share(greatCount, totalAlbumsRated),
		perYear,
		mostListenedYear,
		highestGreatOrBetterShareYear,
		cumulativeDistribution: cumulativeDistribution(years),
		rankedAlbumCount,
		recurringArtists: recurringArtists(years),
		genres: genreFrequencies(years, rankedAlbumCount),
		winners: years
			.filter((y) => y.rankedAlbums.length > 0)
			.map((y) => ({ year: y.year, accent: y.theme.accent, album: y.rankedAlbums[0] }))
	};
}
