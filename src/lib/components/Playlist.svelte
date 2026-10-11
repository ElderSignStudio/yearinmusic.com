<script lang="ts">
	import type { YearData } from '#lib/types/year.js';
	import { locale } from '#lib/i18n/locale.svelte.js';
	import Section from './Section.svelte';
	import SpotifyPlaylistEmbed from './SpotifyPlaylistEmbed.svelte';

	/** Rendered only when the year has a playlist URL. */
	let { data, url }: { data: YearData; url: string } = $props();
	const t = $derived(locale.t);
</script>

<Section id="songs" kicker={t.songsKicker} title={t.bestSongs(data.year)}>
	<p class="mt-4 text-lg text-ink-muted">{t.oneSongPerArtist}</p>

	<div class="mt-10 max-w-content">
		<SpotifyPlaylistEmbed {url} title={t.playlistEmbedTitle(data.year)} />
	</div>
</Section>
