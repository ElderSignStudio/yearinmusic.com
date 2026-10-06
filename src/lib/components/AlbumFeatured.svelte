<script lang="ts">
	import type { Album } from '#lib/types/year.js';
	import { formatRank } from '#lib/utils/format.js';
	import AlbumArtwork from './AlbumArtwork.svelte';
	import AlbumLinks from './AlbumLinks.svelte';
	import Genres from './Genres.svelte';

	let { album }: { album: Album } = $props();
</script>

<article>
	<p
		class="-mb-[0.06em] -ml-[0.04em] rank-numeral text-[4.5rem] md:text-[5.5rem]"
		aria-hidden="true"
	>
		{formatRank(album.rank)}
	</p>
	<AlbumArtwork {album} sizes="(min-width: 768px) 45vw, calc(100vw - 2.5rem)" />
	<div class="mt-5">
		<p class="kicker text-ink-muted">
			<span class="sr-only">#{album.rank} · </span>{album.artist}
		</p>
		<h3
			class="mt-2 font-display text-2xl leading-[1.08] font-medium tracking-tight text-balance md:text-[2rem]"
		>
			{album.album}
		</h3>
		<Genres genres={album.primaryGenres} class="mt-2.5" />
		<AlbumLinks {album} class="mt-4" />
	</div>
</article>
