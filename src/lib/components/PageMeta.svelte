<script lang="ts">
	import type { PageMeta } from '#lib/seo.js';
	import { hasSiteUrl } from '#lib/seo.js';

	let { meta }: { meta: PageMeta } = $props();
</script>

<svelte:head>
	<title>{meta.title}</title>
	<meta name="description" content={meta.description} />
	<meta name="author" content={meta.author} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={meta.siteName} />
	<meta property="og:title" content={meta.title} />
	<meta property="og:description" content={meta.description} />
	<meta property="og:image" content={meta.image} />
	{#if meta.imageWidth && meta.imageHeight}
		<meta property="og:image:width" content={String(meta.imageWidth)} />
		<meta property="og:image:height" content={String(meta.imageHeight)} />
	{/if}
	<meta property="og:locale" content={meta.ogLocale} />
	{#each meta.ogLocaleAlternate as alt (alt)}
		<meta property="og:locale:alternate" content={alt} />
	{/each}
	{#if hasSiteUrl}
		<meta property="og:url" content={meta.url} />
		<link rel="canonical" href={meta.url} />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={meta.title} />
	<meta name="twitter:description" content={meta.description} />
	<meta name="twitter:image" content={meta.twitterImage} />
</svelte:head>
