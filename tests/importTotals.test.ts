/**
 * The importer keeps the stated total as `totalAlbumsRated` and the bucket counts as
 * written, and only warns when they disagree.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Diagnostics } from '../scripts/import-rym/diagnostics.ts';
import { parseDescription, resolveAlbumsRated } from '../scripts/import-rym/description.ts';

const LINES = [
	'Welcome to my top 20 best albums released in 2025!',
	'',
	'I rated 157 albums released in 2025, just a bit less than in 2024 (I rated 168 albums released that year).',
	'',
	'5 Stars (Masterpieces): 4 (2.5%)',
	'4.5 Stars (Amazing): 10 (6.3%)',
	'4 Stars (Great): 28 (17.6%)',
	'3.5 Stars (Good): 60 (37.7%)',
	'3 Stars (Above Average): 40 (25.2%)',
	'2.5 Stars (Nothing Special): 17 (10.7%)'
];

test('a stated total that differs from the bucket sum stays the total, with a warning', () => {
	const diagnostics = new Diagnostics();
	const description = parseDescription(LINES, diagnostics);
	assert.equal(description.statedTotal, 157);
	assert.deepEqual(
		description.ratingDistribution.map((b) => b.count),
		[4, 10, 28, 60, 40, 17],
		'bucket counts are kept exactly as written; the written percentages are ignored'
	);

	const total = resolveAlbumsRated(
		description.statedTotal,
		description.ratingDistribution,
		diagnostics
	);
	assert.equal(total, 157);
	assert.ok(diagnostics.warnings.some((w) => w.includes('157') && w.includes('159')));
	assert.equal(diagnostics.fatal, false);
});

test('a matching total produces no warning', () => {
	const diagnostics = new Diagnostics();
	const buckets = [
		{ rating: 4, count: 100 },
		{ rating: 3, count: 31 }
	];
	assert.equal(resolveAlbumsRated(131, buckets, diagnostics), 131);
	assert.deepEqual(diagnostics.warnings, []);
});

test('without a stated total the bucket sum is used, never silently', () => {
	const diagnostics = new Diagnostics();
	assert.equal(resolveAlbumsRated(undefined, [{ rating: 4, count: 12 }], diagnostics), 12);
	assert.equal(diagnostics.warnings.length, 1);
});
