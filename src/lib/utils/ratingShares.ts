/**
 * The single rule for every rating percentage on the site:
 *
 *   share = bucket count / stated total albums rated
 *
 * The stated total from the yearly source is authoritative, and the bucket counts are
 * authoritative as written. When the buckets do not add up to the stated total, both are
 * kept: buckets are never normalized, the total is never replaced by their sum, and the
 * shares are not forced to add up to 100%.
 *
 * Dependency-free on purpose, so `npm test` can run it directly.
 */

/** Fraction (0–1) of the stated total; 0 when the total is unknown. */
export function shareOfTotal(count: number, statedTotal: number): number {
	return statedTotal > 0 ? count / statedTotal : 0;
}

/** Sum of the bucket counts: a cross-check against the stated total, never a denominator. */
export function bucketSum(buckets: readonly { count: number }[]): number {
	return buckets.reduce((sum, bucket) => sum + bucket.count, 0);
}
