/**
 * The denominator rule: every rating percentage is bucket count / stated total albums
 * rated, even when the buckets sum to something else.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { bucketSum, shareOfTotal } from '../src/lib/utils/ratingShares.ts';

// Historical-style case: the text states 157 albums rated, the buckets sum to 159.
const STATED_TOTAL = 157;
const BUCKETS = [
	{ rating: 5, count: 4 },
	{ rating: 4.5, count: 10 },
	{ rating: 4, count: 28 },
	{ rating: 3.5, count: 60 },
	{ rating: 3, count: 40 },
	{ rating: 2.5, count: 17 }
];

test('the buckets really disagree with the stated total in this fixture', () => {
	assert.equal(bucketSum(BUCKETS), 159);
});

test('shares use the stated total, not the bucket sum', () => {
	assert.equal(shareOfTotal(4, STATED_TOTAL), 4 / 157);
	assert.notEqual(shareOfTotal(4, STATED_TOTAL), 4 / 159);
	const greatOrBetter = BUCKETS.filter((b) => b.rating >= 4).reduce((s, b) => s + b.count, 0);
	assert.equal(shareOfTotal(greatOrBetter, STATED_TOTAL), 42 / 157);
});

test('shares are not forced to add up to 100%', () => {
	const total = BUCKETS.reduce((sum, b) => sum + shareOfTotal(b.count, STATED_TOTAL), 0);
	assert.ok(Math.abs(total - 159 / 157) < 1e-12);
});

test('an unknown total yields 0 rather than a division by zero', () => {
	assert.equal(shareOfTotal(3, 0), 0);
});
