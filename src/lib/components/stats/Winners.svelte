<script lang="ts">
	import type { Winner } from '#lib/data/years/acrossYears.js';
	import { locale } from '#lib/i18n/locale.svelte.js';

	let { winners }: { winners: Winner[] } = $props();
	const t = $derived(locale.t);
</script>

<!-- Every year's #1 as an artwork timeline; each item opens that year. -->
<ol
	class="grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 xl:grid-cols-5"
>
	{#each winners as winner (winner.year)}
		<li style="--year-accent: {winner.accent}">
			<a
				href={locale.href(`/${winner.year}`)}
				class="group block"
				aria-label="{winner.year}: {winner.album.artist} — {winner.album.album}. {t.openYear(
					winner.year
				)}"
			>
				<span class="artwork-link">
					<img
						src={winner.album.artwork}
						alt=""
						width="1000"
						height="1000"
						loading="lazy"
						decoding="async"
						sizes="(min-width: 1280px) 220px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
						class="opacity-90 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
					/>
				</span>
				<span
					class="mt-4 block font-display text-3xl leading-none font-normal tracking-[-0.02em] text-year tabular-nums md:text-4xl"
				>
					{winner.year}
				</span>
				<span class="mt-3 block kicker text-ink-muted">{winner.album.artist}</span>
				<span
					class="mt-1.5 block font-display text-lg leading-[1.15] font-medium tracking-tight text-balance md:text-xl"
				>
					{winner.album.album}
				</span>
			</a>
		</li>
	{/each}
</ol>
