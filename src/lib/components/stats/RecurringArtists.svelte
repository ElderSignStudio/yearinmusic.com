<script lang="ts">
	import type { RecurringArtist } from '#lib/data/years/acrossYears.js';
	import { locale } from '#lib/i18n/locale.svelte.js';

	let { artists }: { artists: RecurringArtist[] } = $props();
	const t = $derived(locale.t);
</script>

<!-- Typographic list: name, count, the years as links, Top 5 tally when any. -->
<ol class="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:gap-y-10">
	{#each artists as artist (artist.artist)}
		<li class="min-w-0 border-t border-line pt-4">
			<div class="flex items-baseline justify-between gap-4">
				<h3 class="font-display text-xl leading-tight font-medium tracking-tight md:text-2xl">
					{artist.artist}
				</h3>
				<span class="shrink-0 text-sm text-ink-muted tabular-nums">
					{t.appearances(artist.appearances)}
				</span>
			</div>
			<p class="mt-2 flex flex-wrap gap-x-1.5 text-sm tabular-nums">
				{#each artist.years as year, i (year)}
					{#if i > 0}<span aria-hidden="true" class="text-ink-faint">·</span>{/if}
					<a href={locale.href(`/${year}`)} class="quiet-link">{year}</a>
				{/each}
			</p>
			{#if artist.topFiveAppearances}
				<p class="mt-1.5 kicker text-year">{t.topFiveTimes(artist.topFiveAppearances)}</p>
			{/if}
		</li>
	{/each}
</ol>
