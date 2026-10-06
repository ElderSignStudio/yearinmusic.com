import type { YearData } from '#lib/types/year.js';
import { year2023 } from './2023.js';
import { year2024 } from './2024.js';

/** First year the archive will eventually reach back to. */
export const FIRST_YEAR = 2015;

/** Every published year, newest first. Adding a year = import it and add it here. */
export const years: readonly YearData[] = [year2024, year2023].sort((a, b) => b.year - a.year);

export const newestYear: YearData = years[0];

export function getYear(year: number): YearData | undefined {
	return years.find((y) => y.year === year);
}

/** Adjacent published years for prev/next navigation (skips gaps). */
export function adjacentYears(year: number): { previous?: YearData; next?: YearData } {
	const previous = years.find((y) => y.year < year);
	const next = [...years].reverse().find((y) => y.year > year);
	return { previous, next };
}

/** Albums rated in the previous year, preferring real data over the stored fallback. */
export function previousYearTotal(data: YearData): number | undefined {
	return getYear(data.year - 1)?.totalAlbumsRated ?? data.previousYearAlbumsRated;
}

export interface ArchiveEntry {
	year: number;
	data?: YearData;
}

/** Full archive range, newest first, including years not yet imported. */
export function archiveEntries(): ArchiveEntry[] {
	const entries: ArchiveEntry[] = [];
	for (let y = newestYear.year; y >= FIRST_YEAR; y--) entries.push({ year: y, data: getYear(y) });
	return entries;
}
