<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import ArrowDownRight from '@lucide/svelte/icons/arrow-down-right';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import type { YearData } from '#lib/types/year.js';
	import { getYearStatistics } from '#lib/data/years/statistics.js';
	import { locale } from '#lib/i18n/locale.svelte.js';
	import { formatDelta, formatPercent } from '#lib/utils/format.js';
	import Section from './Section.svelte';
	import RatingDistribution from './RatingDistribution.svelte';

	let { data }: { data: YearData } = $props();
	const t = $derived(locale.t);
	const stats = $derived(getYearStatistics(data));

	/** Phones only: the distribution starts collapsed so the ranking is reached sooner. */
	let expanded = $state(false);
	const distributionId = $derived(`rating-distribution-${data.year}`);

	const figureClass =
		'-ml-[0.03em] numeral-display text-[clamp(2.75rem,12.5vw,3.5rem)] leading-[0.9] md:text-[3.75rem] xl:text-[4.25rem]';
	const supportClass = 'mt-auto pt-2 text-sm text-ink-muted tabular-nums';
</script>

<Section id="stats" kicker={t.statsKicker} srTitle={t.statsKicker}>
	<!--
		Below xl: the three figures in one row, then the distribution (collapsible on phones).
		xl+: figures on the left (~42%), the distribution beside them (~58%).
	-->
	<div
		class="xl:grid xl:max-w-[66rem] xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:items-start xl:gap-x-14"
	>
		<ul class="grid grid-cols-3 md:max-w-[36rem] xl:max-w-none">
			<li class="flex flex-col pr-3">
				<p class={figureClass}>{stats.totalAlbumsRated}</p>
				<p class="mt-3 kicker text-balance">{t.albumsRated}</p>
				{#if stats.delta !== undefined}
					<p class="{supportClass} inline-flex flex-wrap items-center gap-x-1.5">
						<span class="font-medium text-year">{formatDelta(stats.delta, locale.current)}</span>
						{#if stats.delta > 0}
							<ArrowUpRight class="size-3.5 text-year" aria-hidden="true" />
						{:else if stats.delta < 0}
							<ArrowDownRight class="size-3.5 text-year" aria-hidden="true" />
						{/if}
						<span>{t.vsYear(stats.year - 1)}</span>
					</p>
				{/if}
			</li>

			<li class="flex flex-col border-l border-line pr-3 pl-3 sm:pl-5">
				<p class={figureClass}>{stats.amazing.count}</p>
				<p class="mt-3 kicker text-balance">{t.amazing}</p>
				<p class={supportClass}>{formatPercent(stats.amazing.share, locale.current)}</p>
			</li>

			<li class="flex flex-col border-l border-line pl-3 sm:pl-5">
				<p class={figureClass}>{stats.greatOrBetter.count}</p>
				<p class="mt-3 kicker text-balance">{t.greatOrBetter}</p>
				<p class={supportClass}>{formatPercent(stats.greatOrBetter.share, locale.current)}</p>
			</li>
		</ul>

		<div
			class="mt-8 border-t border-line pt-5 md:mt-10 md:max-w-[44rem] md:pt-6 xl:mt-0 xl:max-w-none xl:border-t-0 xl:pt-1"
		>
			<!-- Phones: a toggle carries the title; from md the heading inside the list is shown instead. -->
			<button
				type="button"
				class="flex w-full items-center justify-between gap-4 py-1 text-left kicker text-ink-muted transition-colors duration-150 hover:text-ink focus-visible:text-ink md:hidden"
				aria-expanded={expanded}
				aria-controls={distributionId}
				onclick={() => (expanded = !expanded)}
			>
				{t.distributionTitle}
				<ChevronDown
					class="size-4 shrink-0 text-year transition-transform duration-200 motion-reduce:transition-none {expanded
						? 'rotate-180'
						: ''}"
					aria-hidden="true"
				/>
			</button>

			<div
				id={distributionId}
				class="grid transition-[grid-template-rows,visibility] duration-250 ease-out motion-reduce:transition-none md:visible md:grid-rows-[1fr] {expanded
					? 'visible grid-rows-[1fr]'
					: 'invisible grid-rows-[0fr]'}"
			>
				<div class="min-h-0 overflow-hidden">
					<div class="pt-4 md:pt-0">
						<RatingDistribution
							buckets={data.ratingDistribution}
							total={data.totalAlbumsRated}
							titleClass="hidden md:block"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</Section>
