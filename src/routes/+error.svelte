<script lang="ts">
	import { page } from '$app/state';
	import { locale } from '#lib/i18n/locale.svelte.js';

	const t = $derived(locale.t);
</script>

<svelte:head>
	<title>{page.status} · {t.siteName}</title>
</svelte:head>

<section class="mx-auto max-w-wide px-5 py-24 sm:px-8 md:py-40">
	<p class="kicker text-year">{page.status}</p>
	<h1 class="mt-5 font-display text-5xl leading-[0.95] font-medium tracking-tight md:text-7xl">
		{page.status === 404 ? t.notFoundTitle : page.error?.message}
	</h1>
	{#if page.status === 404}
		<p class="mt-6 max-w-content text-lg text-ink-muted">{t.notFoundBody}</p>
	{/if}
	<p class="mt-10">
		<a href={locale.href('/')} class="text-sm quiet-link underline underline-offset-4">
			{t.backToNewest}
		</a>
	</p>
</section>
