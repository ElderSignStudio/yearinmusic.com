<script lang="ts">
	import { years } from '#lib/data/years/index.js';
	import { getAcrossYearsStatistics } from '#lib/data/years/acrossYears.js';
	import { statsMeta } from '#lib/seo.js';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import AcrossYearsPage from '#lib/components/stats/AcrossYearsPage.svelte';

	// Static data: derived once at build time from every registered year.
	const stats = getAcrossYearsStatistics(years);
	const meta = statsMeta(stats, stats?.winners.at(-1)?.album.artwork);
</script>

<PageMeta {meta} />

{#if stats}
	<AcrossYearsPage {stats} />
{/if}
