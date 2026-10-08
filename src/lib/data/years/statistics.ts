/**
 * Derived yearly statistics, kept out of the visual components so the same
 * numbers can later feed a cross-year view.
 *
 * Data rules: the stated total albums rated is always the denominator, even when
 * the rating buckets do not sum to it exactly; percentages are never copied from
 * the source text. Shares are fractions (0–1) for `formatPercent`.
 */
import type { YearData } from '#lib/types/year.js';
import { previousYearTotal } from './index.js';

export interface CountShare {
	count: number;
	/** Fraction of the stated total albums rated (0–1). */
	share: number;
}

export interface YearStatistics {
	year: number;
	totalAlbumsRated: number;
	/** Previous year's total when known (real data preferred, stored fallback otherwise). */
	previousYearAlbumsRated?: number;
	/** `total − previous`, only when the previous total is known. */
	delta?: number;
	/** Albums rated exactly 5.0. */
	masterpieces: CountShare;
	/** Albums rated 4.0, 4.5 or 5.0. */
	fourPlus: CountShare;
}

function countWhere(data: YearData, predicate: (rating: number) => boolean): number {
	return data.ratingDistribution
		.filter((bucket) => predicate(bucket.rating))
		.reduce((sum, bucket) => sum + bucket.count, 0);
}

function countShare(count: number, total: number): CountShare {
	return { count, share: total > 0 ? count / total : 0 };
}

/** Pure derivation from a year's data and an optional previous-year total. */
export function deriveYearStatistics(data: YearData, previous?: number): YearStatistics {
	const total = data.totalAlbumsRated;
	return {
		year: data.year,
		totalAlbumsRated: total,
		previousYearAlbumsRated: previous,
		delta: previous === undefined ? undefined : total - previous,
		masterpieces: countShare(
			countWhere(data, (r) => r === 5),
			total
		),
		fourPlus: countShare(
			countWhere(data, (r) => r >= 4),
			total
		)
	};
}

/** Statistics for a published year, resolving the previous-year total from the archive. */
export function getYearStatistics(data: YearData): YearStatistics {
	return deriveYearStatistics(data, previousYearTotal(data));
}
