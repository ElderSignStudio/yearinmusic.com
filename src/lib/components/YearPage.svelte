<script lang="ts">
	import type { YearData } from '#lib/types/year.js';
	import { yearMeta } from '#lib/seo.js';
	import PageMeta from './PageMeta.svelte';
	import YearHero from './YearHero.svelte';
	import YearStats from './YearStats.svelte';
	import AlbumRanking from './AlbumRanking.svelte';
	import Playlist from './Playlist.svelte';
	import SpecialEditionCallout from './special/SpecialEditionCallout.svelte';
	import Archive from './Archive.svelte';
	import { specialEditionsEndingIn } from '#lib/data/specialEditions.js';

	let { data }: { data: YearData } = $props();
	const meta = $derived(yearMeta(data));
</script>

<PageMeta {meta} />

<YearHero {data} />
<YearStats {data} />
<AlbumRanking {data} />
{#if data.spotifyPlaylistUrl}
	<Playlist {data} url={data.spotifyPlaylistUrl} />
{/if}
{#each specialEditionsEndingIn(data.year) as edition (edition.slug)}
	<SpecialEditionCallout {edition} />
{/each}
<Archive currentYear={data.year} />
