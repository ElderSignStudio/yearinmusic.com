<script lang="ts">
	import type { YearData } from '#lib/types/year.js';
	import { locale } from '#lib/i18n/locale.svelte.js';
	import { yearMeta } from '#lib/seo.js';
	import PageMeta from './PageMeta.svelte';
	import YearHero from './YearHero.svelte';
	import YearIntro from './YearIntro.svelte';
	import YearStats from './YearStats.svelte';
	import AlbumRanking from './AlbumRanking.svelte';
	import Playlist from './Playlist.svelte';
	import Archive from './Archive.svelte';

	let { data }: { data: YearData } = $props();
	const meta = $derived(yearMeta(data, locale.current));
</script>

<PageMeta {meta} />

<YearHero {data} />
<YearIntro {data} />
<YearStats {data} />
<AlbumRanking {data} />
<Playlist {data} />
<Archive currentYear={data.year} />
