<script lang="ts">
	import type { YearData } from '#lib/types/year.js';
	import { locale } from '#lib/i18n/locale.svelte.js';
	import YearNav from './YearNav.svelte';

	let { data }: { data: YearData } = $props();
	const t = $derived(locale.t);
	const winner = $derived(data.albums[0]);
</script>

<section class="relative isolate overflow-hidden">
	<!-- Atmospheric wash derived from the #1 artwork. Kept faint so text stays dominant. -->
	{#if winner}
		<div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
			<img
				src={winner.artwork}
				alt=""
				width="1000"
				height="1000"
				loading="eager"
				decoding="async"
				class="hero-wash h-full w-full scale-125 object-cover"
			/>
		</div>
	{/if}

	<div class="mx-auto max-w-wide px-5 pt-14 pb-12 sm:px-8 md:pt-24 md:pb-16 lg:pt-28">
		<p class="kicker text-year">
			{t.topN(data.albums.length)}
			<span aria-hidden="true" class="mx-2 text-ink-faint">·</span>
			{data.totalAlbumsRated}
			{t.albumsRated}
		</p>

		<h1 class="mt-6 -ml-[0.04em] numeral-display text-[clamp(6.5rem,27vw,18rem)] leading-[0.9]">
			{data.year}
		</h1>

		<p class="mt-6 text-sm font-medium tracking-[0.24em] uppercase sm:text-base md:mt-8">
			{t.heroTitle}
		</p>

		<YearNav year={data.year} class="mt-12 md:mt-16" />
	</div>
</section>

<style>
	.hero-wash {
		opacity: 0.22;
		filter: blur(90px) saturate(1.3);
		mask-image: linear-gradient(to bottom, black 10%, transparent 95%);
	}
</style>
