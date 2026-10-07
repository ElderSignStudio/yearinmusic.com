<script lang="ts">
	import type { Album } from '#lib/types/year.js';
	import { formatRank } from '#lib/utils/format.js';
	import AlbumArtwork from './AlbumArtwork.svelte';
	import AlbumLinks from './AlbumLinks.svelte';
	import Genres from './Genres.svelte';

	let { album }: { album: Album } = $props();
	const rank = $derived(formatRank(album.rank));
</script>

<article
	class="grid gap-7 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-end lg:gap-12 xl:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] xl:gap-16"
>
	<p class="-ml-[0.04em] rank-numeral text-[7rem] xs:text-[8rem] lg:hidden" aria-hidden="true">
		{rank}
	</p>

	<AlbumArtwork
		{album}
		priority
		sizes="(min-width: 1280px) 480px, (min-width: 1024px) 384px, calc(100vw - 2.5rem)"
		class="w-full"
	/>

	<div class="min-w-0">
		<p
			class="-ml-[0.05em] hidden rank-numeral lg:block lg:text-[11rem] xl:text-[16rem]"
			aria-hidden="true"
		>
			{rank}
		</p>
		<p class="mt-2 kicker text-ink-muted lg:mt-6">
			<span class="sr-only">#{album.rank} · </span>{album.artist}
		</p>
		<h3
			class="mt-3 font-display text-4xl leading-[1.02] font-medium tracking-tight text-balance sm:text-5xl xl:text-6xl"
		>
			{album.album}
		</h3>
		<Genres genres={album.primaryGenres} class="mt-4" />
		<AlbumLinks {album} labels class="mt-7" />
	</div>
</article>
