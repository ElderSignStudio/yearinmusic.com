<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import type { YearData } from '#lib/types/year.js';
	import { locale } from '#lib/i18n/locale.svelte.js';
	import { spotifyPlaylistId } from '#lib/utils/format.js';
	import Section from './Section.svelte';
	import SpotifyIcon from './icons/SpotifyIcon.svelte';

	/** Rendered only when the year has a playlist URL. */
	let { data, url }: { data: YearData; url: string } = $props();
	const t = $derived(locale.t);
	const playlistId = $derived(spotifyPlaylistId(url));
</script>

<Section id="songs" kicker={t.songsKicker} title={t.bestSongs(data.year)}>
	<p class="mt-4 text-lg text-ink-muted">{t.oneSongPerArtist}</p>

	<div class="mt-10 max-w-content">
		{#if playlistId}
			<iframe
				title={t.playlistEmbedTitle(data.year)}
				src="https://open.spotify.com/embed/playlist/{playlistId}?utm_source=generator&theme=0"
				width="100%"
				height="352"
				loading="lazy"
				allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
				class="block w-full rounded-xl bg-surface"
			></iframe>
		{/if}

		<a
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			class="mt-6 inline-flex items-center gap-2 text-sm quiet-link"
		>
			<SpotifyIcon class="size-4" />
			{t.openInSpotify}
			<ArrowUpRight class="size-4" aria-hidden="true" />
			<span class="sr-only">({t.opensInNewTab})</span>
		</a>
	</div>
</Section>
