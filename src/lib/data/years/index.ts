import type { YearData } from '#lib/types/year.js';
import { year2016 } from './2016.js';
import { year2017 } from './2017.js';
import { year2018 } from './2018.js';
import { year2019 } from './2019.js';
import { year2020 } from './2020.js';
import { year2021 } from './2021.js';
import { year2022 } from './2022.js';
import { year2023 } from './2023.js';
import { year2024 } from './2024.js';
import { year2025 } from './2025.js';

/** Every published year, newest first. Adding a year = import it and add it here. */
export const years: readonly YearData[] = [
	year2025,
	year2024,
	year2023,
	year2022,
	year2021,
	year2020,
	year2019,
	year2018,
	year2017,
	year2016
].sort((a, b) => b.year - a.year);

export const newestYear: YearData = years[0];
/** The first Year in Music edition: derived from the registered years, never hardcoded. */
export const earliestYear: YearData = years[years.length - 1];

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

/** Full archive range, newest first, including any gap years not yet imported. */
export function archiveEntries(): ArchiveEntry[] {
	const entries: ArchiveEntry[] = [];
	for (let y = newestYear.year; y >= earliestYear.year; y--) {
		entries.push({ year: y, data: getYear(y) });
	}
	return entries;
}
