<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import { untrack } from 'svelte';
	import { page } from '$app/state';
	import type { LayoutProps } from './$types';
	import { locale } from '#lib/i18n/locale.svelte.js';
	import SiteHeader from '#lib/components/SiteHeader.svelte';
	import SiteFooter from '#lib/components/SiteFooter.svelte';

	let { children }: LayoutProps = $props();
	const t = $derived(locale.t);

	// The current year's (or special edition's) accent flows into the whole document via one CSS variable.
	const accent = $derived(
		page.data.year?.theme.accent ?? page.data.edition?.theme.accent ?? 'var(--accent)'
	);

	// Resolve the language before anything renders on the client: ?lang › saved › English.
	locale.initialize(page.url);
	// A later client-side navigation can still carry an explicit ?lang (e.g. a pasted link).
	// Track only the URL: the switcher changes the locale first and the address bar after,
	// so reacting to the locale here would snap it back to the stale parameter.
	$effect(() => {
		const url = page.url;
		untrack(() => locale.syncFromUrl(url));
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-dvh flex-col" style="--year-accent: {accent}">
	<a
		href="#main"
		class="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-bg focus:px-3 focus:py-2 focus:text-sm"
	>
		{t.skipToContent}
	</a>
	<SiteHeader />
	<main id="main" class="flex-1">
		{@render children()}
	</main>
	<SiteFooter />
</div>
