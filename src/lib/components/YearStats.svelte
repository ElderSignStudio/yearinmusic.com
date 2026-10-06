<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import ArrowDownRight from '@lucide/svelte/icons/arrow-down-right';
	import type { YearData } from '#lib/types/year.js';
	import { previousYearTotal } from '#lib/data/years/index.js';
	import { locale } from '#lib/i18n/locale.svelte.js';
	import { formatDelta } from '#lib/utils/format.js';
	import Section from './Section.svelte';
	import RatingDistribution from './RatingDistribution.svelte';

	let { data }: { data: YearData } = $props();
	const t = $derived(locale.t);
	const previous = $derived(previousYearTotal(data));
	const delta = $derived(previous === undefined ? undefined : data.totalAlbumsRated - previous);
</script>

<Section id="stats" kicker={t.statsKicker} srTitle={t.statsKicker}>
	<div class="grid gap-12 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-20">
		<div>
			<p class="-ml-[0.05em] numeral-display text-[6rem] leading-[0.8] md:text-[7.5rem]">
				{data.totalAlbumsRated}
			</p>
			<p class="mt-5 kicker">{t.albumsRated}</p>
			{#if delta !== undefined}
				<p class="mt-3 inline-flex items-center gap-1.5 text-sm text-ink-muted tabular-nums">
					<span class="font-medium text-year">{formatDelta(delta, locale.current)}</span>
					{#if delta > 0}
						<ArrowUpRight class="size-3.5 text-year" aria-hidden="true" />
					{:else if delta < 0}
						<ArrowDownRight class="size-3.5 text-year" aria-hidden="true" />
					{/if}
					{t.vsYear(data.year - 1)}
				</p>
			{/if}
		</div>

		<RatingDistribution buckets={data.ratingDistribution} total={data.totalAlbumsRated} />
	</div>
</Section>
