<script lang="ts">
	import type { AcrossYearsStatistics } from '#lib/data/years/acrossYears.js';
	import { locale } from '#lib/i18n/locale.svelte.js';
	import { formatPercent } from '#lib/utils/format.js';

	let { stats }: { stats: AcrossYearsStatistics } = $props();
	const t = $derived(locale.t);

	const figureClass =
		'-ml-[0.03em] numeral-display text-[clamp(2.75rem,12vw,3.5rem)] leading-[0.9] md:text-[4rem] xl:text-[4.5rem]';
	const supportClass = 'mt-auto pt-2 text-sm text-ink-muted tabular-nums';
</script>

<!-- Four cumulative figures as one typographic row (two per row on phones). -->
<ul class="grid max-w-[60rem] grid-cols-2 gap-y-10 sm:grid-cols-4">
	<li class="flex flex-col pr-3">
		<p class={figureClass}>{stats.totalAlbumsRated.toLocaleString(locale.current)}</p>
		<p class="mt-3 kicker text-balance">{t.albumsRated}</p>
	</li>
	<li class="flex flex-col border-l border-line pr-3 pl-4 sm:pl-6">
		<p class={figureClass}>{stats.amazing.count}</p>
		<p class="mt-3 kicker text-balance">{t.amazing}</p>
		<p class={supportClass}>{formatPercent(stats.amazing.share, locale.current)}</p>
	</li>
	<li class="flex flex-col pr-3 sm:border-l sm:border-line sm:pl-6">
		<p class={figureClass}>{stats.greatOrBetter.count}</p>
		<p class="mt-3 kicker text-balance">{t.greatOrBetter}</p>
		<p class={supportClass}>{formatPercent(stats.greatOrBetter.share, locale.current)}</p>
	</li>
	<li class="flex flex-col border-l border-line pl-4 sm:pl-6">
		<p class={figureClass}>{stats.yearCount}</p>
		<p class="mt-3 kicker text-balance">{t.yearsLabel}</p>
		<p class={supportClass}>{stats.firstYear}–{stats.latestYear}</p>
	</li>
</ul>
