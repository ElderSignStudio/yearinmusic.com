<script lang="ts">
	import type { AlbumEntry } from '#lib/types/year.js';
	import { formatRank } from '#lib/utils/format.js';
	import AlbumArtwork from './AlbumArtwork.svelte';
	import AlbumLinks from './AlbumLinks.svelte';
	import Genres from './Genres.svelte';

	interface Props {
		album: AlbumEntry;
		/** Position in the Top N. Omitted for unranked bonus entries. */
		rank?: number;
		/** Small accent label that takes the numeral's place when there is no rank. */
		label?: string;
	}

	let { album, rank, label }: Props = $props();
</script>

<!--
	Mobile: a compact artwork-led tile that sits in a 1–2 column grid.
	Desktop (lg+): a single ranked row — rank · cover · text · links.
	Without a rank the numeral slot carries a small kicker instead (bonus selections).
-->
<article
	class="lg:grid lg:grid-cols-[3.25rem_8rem_minmax(0,1fr)_auto] lg:items-center lg:gap-x-7 lg:border-b lg:border-line lg:py-5"
>
	{#if rank !== undefined}
		<p
			class="mb-2 rank-numeral text-[2.25rem] lg:mb-0 lg:self-start lg:pt-1 lg:text-[1.75rem]"
			aria-hidden="true"
		>
			{formatRank(rank)}
		</p>
	{:else}
		<p class="mb-4 kicker whitespace-nowrap text-year lg:mb-0 lg:self-start lg:pt-2.5">
			{label}
		</p>
	{/if}
	<AlbumArtwork {album} sizes="(min-width: 1024px) 128px, (min-width: 768px) 33vw, 50vw" />
	<div class="mt-3 min-w-0 lg:mt-0">
		<p class="kicker text-ink-muted">
			{#if rank !== undefined}<span class="sr-only">#{rank} · </span>{/if}{album.artist}
		</p>
		<h3
			class="mt-1.5 font-display text-lg leading-[1.15] font-medium tracking-tight text-balance lg:text-[1.375rem]"
		>
			{album.album}
		</h3>
		<Genres genres={album.primaryGenres} class="mt-1.5 text-xs lg:text-sm" />
	</div>
	<AlbumLinks {album} class="mt-3 lg:mt-0 lg:justify-self-end" />
</article>
