<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import type { AlbumEntry } from '#lib/types/year.js';
	import { locale } from '#lib/i18n/locale.svelte.js';
	import SpotifyIcon from './icons/SpotifyIcon.svelte';
	import AppleMusicIcon from './icons/AppleMusicIcon.svelte';
	import BandcampIcon from './icons/BandcampIcon.svelte';

	interface Props {
		album: AlbumEntry;
		/** Show text labels next to the brand icons (used for the most prominent entries). */
		labels?: boolean;
		class?: string;
	}

	let { album, labels = false, class: className = '' }: Props = $props();
	const t = $derived(locale.t);

	const linkClass =
		'quiet-link inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.08em] uppercase';
</script>

<ul class="flex flex-wrap items-center gap-x-5 gap-y-2 {className}">
	{#if album.spotifyUrl}
		<li>
			<a
				href={album.spotifyUrl}
				target="_blank"
				rel="noopener noreferrer"
				class={linkClass}
				title={t.listenOnSpotify}
				aria-label="{t.listenOnSpotify} ({t.opensInNewTab})"
			>
				<SpotifyIcon class="size-4" />
				{#if labels}<span>Spotify</span>{/if}
			</a>
		</li>
	{/if}
	{#if album.appleMusicUrl}
		<li>
			<a
				href={album.appleMusicUrl}
				target="_blank"
				rel="noopener noreferrer"
				class={linkClass}
				title={t.openInAppleMusic}
				aria-label="{t.openInAppleMusic} ({t.opensInNewTab})"
			>
				<AppleMusicIcon class="size-4" />
				{#if labels}<span>Apple Music</span>{/if}
			</a>
		</li>
	{/if}
	{#if album.bandcampUrl}
		<li>
			<a
				href={album.bandcampUrl}
				target="_blank"
				rel="noopener noreferrer"
				class={linkClass}
				title={t.openOnBandcamp}
				aria-label="{t.openOnBandcamp} ({t.opensInNewTab})"
			>
				<BandcampIcon class="size-4" />
				{#if labels}<span>Bandcamp</span>{/if}
			</a>
		</li>
	{/if}
	<li>
		<a
			href={album.rymUrl}
			target="_blank"
			rel="noopener noreferrer"
			class={linkClass}
			title={t.viewOnRym}
			aria-label="{t.viewOnRym} ({t.opensInNewTab})"
		>
			<span>RYM</span>
			<ArrowUpRight class="size-3.5" aria-hidden="true" />
		</a>
	</li>
</ul>
