<script lang="ts">
	import type { Album } from '#lib/types/year.js';
	import { formatRank } from '#lib/utils/format.js';
	import AlbumArtwork from './AlbumArtwork.svelte';
	import AlbumLinks from './AlbumLinks.svelte';
	import Genres from './Genres.svelte';

	let { album }: { album: Album } = $props();
</script>

<!--
	Mobile: a compact artwork-led tile that sits in a 1–2 column grid.
	Desktop (lg+): a single ranked row — rank · cover · text · links.
-->
<article
	class="lg:grid lg:grid-cols-[3.25rem_8rem_minmax(0,1fr)_auto] lg:items-center lg:gap-x-7 lg:border-b lg:border-line lg:py-5"
>
	<p
		class="mb-2 rank-numeral text-[2.25rem] lg:mb-0 lg:self-start lg:pt-1 lg:text-[1.75rem]"
		aria-hidden="true"
	>
		{formatRank(album.rank)}
	</p>
	<AlbumArtwork {album} sizes="(min-width: 1024px) 128px, (min-width: 768px) 33vw, 50vw" />
	<div class="mt-3 min-w-0 lg:mt-0">
		<p class="kicker text-ink-muted">
			<span class="sr-only">#{album.rank} · </span>{album.artist}
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
