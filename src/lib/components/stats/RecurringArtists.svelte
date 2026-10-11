<script lang="ts">
	import type { RecurringArtist } from '#lib/data/years/acrossYears.js';
	import { ARTIST_IMAGE_SIZE, artistImage } from '#lib/data/artistImages.js';
	import { locale } from '#lib/i18n/locale.svelte.js';

	let { artists }: { artists: RecurringArtist[] } = $props();
	const t = $derived(locale.t);
</script>

<!--
	Typographic list: profile image, name, count, the years as links, Top 5 tally when any.
	The image is decorative (the heading beside it is the name), so it has an empty alt.
-->
<ol class="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:gap-y-10">
	{#each artists as artist (artist.artist)}
		{@const image = artistImage(artist.artist)}
		<li class="flex gap-4 border-t border-line pt-4 md:gap-5">
			{#if image}
				<img
					src={image}
					alt=""
					width={ARTIST_IMAGE_SIZE}
					height={ARTIST_IMAGE_SIZE}
					loading="lazy"
					decoding="async"
					class="size-12 shrink-0 rounded-sm object-cover md:size-14 lg:size-16"
				/>
			{/if}
			<div class="min-w-0 flex-1">
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
			</div>
		</li>
	{/each}
</ol>
