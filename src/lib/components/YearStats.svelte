<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import ArrowDownRight from '@lucide/svelte/icons/arrow-down-right';
	import type { YearData } from '#lib/types/year.js';
	import { getYearStatistics } from '#lib/data/years/statistics.js';
	import { locale } from '#lib/i18n/locale.svelte.js';
	import { formatDelta, formatPercent } from '#lib/utils/format.js';
	import Section from './Section.svelte';
	import RatingDistribution from './RatingDistribution.svelte';

	let { data }: { data: YearData } = $props();
	const t = $derived(locale.t);
	const stats = $derived(getYearStatistics(data));
</script>

<Section id="stats" kicker={t.statsKicker} srTitle={t.statsKicker}>
	<!--
		Three headline figures as one typographic row: the figure, its label, one
		supporting value. Hairlines separate them from sm up; on phones the total
		spans the full width and the two derived figures share a second row.
	-->
	<ul class="grid max-w-[52rem] grid-cols-2 gap-y-10 sm:grid-cols-3 sm:gap-x-8">
		<li class="col-span-2 flex flex-col sm:col-span-1">
			<p class="-ml-[0.04em] numeral-display text-[5rem] leading-[0.9] md:text-[6rem]">
				{stats.totalAlbumsRated}
			</p>
			<p class="mt-4 kicker">{t.albumsRated}</p>
			{#if stats.delta !== undefined}
				<p
					class="mt-auto inline-flex items-center gap-1.5 pt-2.5 text-sm text-ink-muted tabular-nums"
				>
					<span class="font-medium text-year">{formatDelta(stats.delta, locale.current)}</span>
					{#if stats.delta > 0}
						<ArrowUpRight class="size-3.5 text-year" aria-hidden="true" />
					{:else if stats.delta < 0}
						<ArrowDownRight class="size-3.5 text-year" aria-hidden="true" />
					{/if}
					{t.vsYear(stats.year - 1)}
				</p>
			{/if}
		</li>

		<li class="flex flex-col border-l border-line pl-5 sm:pl-8">
			<p class="-ml-[0.04em] numeral-display text-[5rem] leading-[0.9] md:text-[6rem]">
				{stats.amazing.count}
			</p>
			<p class="mt-4 kicker">{t.amazing}</p>
			<p class="mt-auto pt-2.5 text-sm text-ink-muted tabular-nums">
				{formatPercent(stats.amazing.share, locale.current)}
			</p>
		</li>

		<li class="flex flex-col border-l border-line pl-5 sm:pl-8">
			<p class="-ml-[0.04em] numeral-display text-[5rem] leading-[0.9] md:text-[6rem]">
				{stats.greatOrBetter.count}
			</p>
			<p class="mt-4 kicker">{t.greatOrBetter}</p>
			<p class="mt-auto pt-2.5 text-sm text-ink-muted tabular-nums">
				{formatPercent(stats.greatOrBetter.share, locale.current)}
			</p>
		</li>
	</ul>

	<div class="mt-14 max-w-[52rem] border-t border-line pt-10 md:mt-16">
		<RatingDistribution buckets={data.ratingDistribution} total={data.totalAlbumsRated} />
	</div>
</Section>
