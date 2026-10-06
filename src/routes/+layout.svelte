<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import { page } from '$app/state';
	import type { LayoutProps } from './$types';
	import { locale } from '#lib/i18n/locale.svelte.js';
	import SiteHeader from '#lib/components/SiteHeader.svelte';
	import SiteFooter from '#lib/components/SiteFooter.svelte';

	let { children }: LayoutProps = $props();
	const t = $derived(locale.t);

	// The current year's accent flows into the whole document via one CSS variable.
	const year = $derived(page.data.year);
	const accent = $derived(year?.theme.accent ?? 'var(--accent)');

	$effect(() => {
		locale.restore();
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
