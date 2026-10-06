<script lang="ts">
	import type { YearData } from '#lib/types/year.js';
	import { locale } from '#lib/i18n/locale.svelte.js';
	import YearHero from './YearHero.svelte';
	import YearIntro from './YearIntro.svelte';
	import YearStats from './YearStats.svelte';
	import AlbumRanking from './AlbumRanking.svelte';
	import Playlist from './Playlist.svelte';
	import Archive from './Archive.svelte';

	let { data }: { data: YearData } = $props();
	const t = $derived(locale.t);
</script>

<svelte:head>
	<title>{data.year} · {t.siteName}</title>
	<meta name="description" content={t.pageDescription(data.year)} />
	<link rel="canonical" href="/{data.year}" />
</svelte:head>

<YearHero {data} />
<YearIntro {data} />
<YearStats {data} />
<AlbumRanking {data} />
<Playlist {data} />
<Archive currentYear={data.year} />
