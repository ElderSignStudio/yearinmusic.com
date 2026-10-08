<script lang="ts">
	import type { GenreFrequency } from '#lib/data/years/acrossYears.js';
	import { locale } from '#lib/i18n/locale.svelte.js';
	import { formatPercent } from '#lib/utils/format.js';

	let { genres }: { genres: GenreFrequency[] } = $props();
	const t = $derived(locale.t);
	const max = $derived(Math.max(1, ...genres.map((g) => g.albums)));
</script>

<!-- Same language as the rating distribution: name · bar · count · share. -->
<ol>
	{#each genres as genre (genre.genre)}
		<li
			class="grid grid-cols-[minmax(0,1fr)_auto_3.5rem] items-baseline gap-x-3 gap-y-2 py-2.5 sm:grid-cols-[11rem_minmax(0,1fr)_2.5rem_3.75rem] sm:items-center sm:gap-x-4 sm:py-2 md:grid-cols-[13rem_minmax(0,1fr)_2.5rem_3.75rem]"
		>
			<span class="min-w-0 text-sm leading-snug text-ink">{genre.genre}</span>
			<span class="text-right text-sm text-ink tabular-nums sm:order-3">
				<span class="sm:hidden">{t.albumsCount(genre.albums)}</span>
				<span class="hidden sm:inline">{genre.albums}</span>
			</span>
			<span class="text-right text-sm text-ink-muted tabular-nums sm:order-4">
				{formatPercent(genre.share, locale.current)}
			</span>
			<span
				class="col-span-3 block h-1.5 w-full bg-surface-strong sm:order-2 sm:col-span-1"
				aria-hidden="true"
			>
				<span class="block h-full bg-year" style="width: {(genre.albums / max) * 100}%"></span>
			</span>
		</li>
	{/each}
</ol>
