/**
 * The denominator rule on the real published data, loaded exactly as the site sees it
 * (through Vite, like scripts/generate-social). 2025 and 2022 state a total that differs
 * from their bucket sums; 2026 agrees.
 */
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer, createServerModuleRunner, type ViteDevServer } from 'vite';
import type { YearData } from '../src/lib/types/year.ts';

type YearsModule = typeof import('../src/lib/data/years/index.ts');
type StatisticsModule = typeof import('../src/lib/data/years/statistics.ts');
type AcrossYearsModule = typeof import('../src/lib/data/years/acrossYears.ts');

let server: ViteDevServer;
let years: YearsModule;
let statistics: StatisticsModule;
let acrossYears: AcrossYearsModule;

before(async () => {
	server = await createServer({
		root: new URL('..', import.meta.url).pathname,
		configFile: false,
		logLevel: 'error',
		server: { middlewareMode: true, hmr: false, watch: null },
		optimizeDeps: { noDiscovery: true, include: [] }
	});
	const runner = createServerModuleRunner(server.environments.ssr, { hmr: false });
	years = (await runner.import('/src/lib/data/years/index.ts')) as YearsModule;
	statistics = (await runner.import('/src/lib/data/years/statistics.ts')) as StatisticsModule;
	acrossYears = (await runner.import('/src/lib/data/years/acrossYears.ts')) as AcrossYearsModule;
});

after(() => server?.close());

const bucketTotal = (data: YearData) => data.ratingDistribution.reduce((s, b) => s + b.count, 0);
const countAtLeast = (data: YearData, rating: number) =>
	data.ratingDistribution.filter((b) => b.rating >= rating).reduce((s, b) => s + b.count, 0);

test('2025 keeps its stated 157 and its buckets summing to 159', () => {
	const data = years.getYear(2025)!;
	assert.equal(data.totalAlbumsRated, 157);
	assert.equal(bucketTotal(data), 159);
	const stats = statistics.getYearStatistics(data);
	assert.equal(stats.greatOrBetter.share, countAtLeast(data, 4) / 157);
	assert.equal(stats.amazing.share, countAtLeast(data, 5) / 157);
});

test('2022 keeps its stated 107 and its buckets summing to 108', () => {
	const data = years.getYear(2022)!;
	assert.equal(data.totalAlbumsRated, 107);
	assert.equal(bucketTotal(data), 108);
});

test('2026 is unchanged: stated total and bucket sum are both 131', () => {
	const data = years.getYear(2026)!;
	assert.equal(data.totalAlbumsRated, 131);
	assert.equal(bucketTotal(data), 131);
	const stats = statistics.getYearStatistics(data);
	assert.deepEqual(stats.greatOrBetter, { count: 40, share: 40 / 131 });
	assert.deepEqual(stats.amazing, { count: 2, share: 2 / 131 });
	assert.equal(stats.delta, 131 - 157);
});

test('cross-year shares use the sum of the stated totals', () => {
	const stats = acrossYears.getAcrossYearsStatistics(years.years)!;
	const statedTotal = years.years.reduce((sum, y) => sum + y.totalAlbumsRated, 0);
	assert.equal(stats.totalAlbumsRated, statedTotal);
	assert.equal(stats.greatOrBetter.share, stats.greatOrBetter.count / statedTotal);
	assert.equal(stats.amazing.share, stats.amazing.count / statedTotal);
	const point2025 = stats.perYear.find((p) => p.year === 2025)!;
	assert.equal(point2025.totalAlbumsRated, 157);
	assert.equal(point2025.greatOrBetter.share, point2025.greatOrBetter.count / 157);
});
