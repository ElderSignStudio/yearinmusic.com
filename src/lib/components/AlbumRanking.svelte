<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import type { YearData } from '#lib/types/year.js';
	import { locale } from '#lib/i18n/locale.svelte.js';
	import Section from './Section.svelte';
	import AlbumWinner from './AlbumWinner.svelte';
	import AlbumFeatured from './AlbumFeatured.svelte';
	import AlbumListItem from './AlbumListItem.svelte';

	let { data }: { data: YearData } = $props();
	const t = $derived(locale.t);

	const winner = $derived(data.albums[0]);
	const featured = $derived(data.albums.slice(1, 5));
	const rest = $derived(data.albums.slice(5));
</script>

<Section id="ranking" kicker={t.rankingKicker} title={t.rankingTitle(data.albums.length)}>
	<div class="mt-12 md:mt-16">
		{#if winner}
			<ol aria-label="#01">
				<li><AlbumWinner album={winner} /></li>
			</ol>
		{/if}

		{#if featured.length}
			<ol start="2" class="mt-20 grid gap-x-10 gap-y-16 md:mt-28 md:grid-cols-2 lg:gap-x-14">
				{#each featured as album (album.rank)}
					<li><AlbumFeatured {album} /></li>
				{/each}
			</ol>
		{/if}

		{#if rest.length}
			<ol
				start="6"
				class="mt-20 grid grid-cols-1 gap-x-5 gap-y-12 xs:grid-cols-2 md:mt-28 md:grid-cols-3 md:gap-x-8 lg:block lg:border-t lg:border-line"
			>
				{#each rest as album (album.rank)}
					<li><AlbumListItem {album} /></li>
				{/each}
			</ol>
		{/if}

		<p class="mt-14">
			<a
				href={data.rymListUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-1.5 text-sm quiet-link"
			>
				{t.fullListOnRym}
				<ArrowUpRight class="size-4" aria-hidden="true" />
				<span class="sr-only">({t.opensInNewTab})</span>
			</a>
		</p>
	</div>
</Section>
