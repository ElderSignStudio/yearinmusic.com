<script lang="ts">
	import type { AlbumEntry } from '#lib/types/year.js';
	import { locale } from '#lib/i18n/locale.svelte.js';

	interface Props {
		album: AlbumEntry;
		/** Eager-load with high priority (for artwork visible near the top of the page). */
		priority?: boolean;
		sizes?: string;
		class?: string;
	}

	let { album, priority = false, sizes, class: className = '' }: Props = $props();
	const t = $derived(locale.t);
</script>

<a
	href={album.rymUrl}
	target="_blank"
	rel="noopener noreferrer"
	class="artwork-link {className}"
	aria-label="{t.albumOnRym(album.album)} ({t.opensInNewTab})"
>
	<img
		src={album.artwork}
		alt={t.artworkAlt(album.album, album.artist)}
		width="1000"
		height="1000"
		{sizes}
		loading={priority ? 'eager' : 'lazy'}
		decoding={priority ? 'sync' : 'async'}
		fetchpriority={priority ? 'high' : 'auto'}
	/>
</a>
