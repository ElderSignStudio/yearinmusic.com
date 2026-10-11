<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import type { SpecialEdition } from '#lib/types/specialEdition.js';
	import { formatYearRange } from '#lib/data/specialEditions.js';
	import { newestYear } from '#lib/data/years/index.js';
	import { locale } from '#lib/i18n/locale.svelte.js';
	import { specialEditionMeta } from '#lib/seo.js';
	import { SITE_AUTHOR } from '#lib/site.js';
	import PageMeta from '../PageMeta.svelte';
	import Section from '../Section.svelte';
	import SpotifyPlaylistEmbed from '../SpotifyPlaylistEmbed.svelte';

	let { edition }: { edition: SpecialEdition } = $props();
	const t = $derived(locale.t);
	const meta = $derived(specialEditionMeta(edition));
	const range = $derived(formatYearRange(edition));
	const title = $derived(locale.pick(edition.title));
</script>

<PageMeta {meta} />

<!-- A magazine insert: the range and title on the left, the cover beside them on wide screens. -->
<section class="relative isolate overflow-hidden" style="--year-accent: {edition.theme.accent}">
	<div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
		<img
			src={edition.artwork}
			alt=""
			width="1600"
			height="1600"
			loading="eager"
			decoding="async"
			class="hero-wash h-full w-full scale-125 object-cover"
		/>
	</div>

	<div
		class="mx-auto max-w-wide px-5 pt-14 pb-14 sm:px-8 md:pt-24 md:pb-20 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(16rem,24rem)] lg:items-end lg:gap-x-16 lg:pt-28"
	>
		<div class="min-w-0">
			<p class="kicker text-year">{t.specialEditionKicker}</p>

			<h1 class="mt-6">
				<span
					class="-ml-[0.04em] block numeral-display text-[clamp(3.5rem,9vw,8.5rem)] leading-[0.95] whitespace-nowrap"
				>
					{range}
				</span>
				<span
					class="mt-5 block font-display text-3xl leading-[1.05] font-medium tracking-tight md:mt-7 md:text-5xl"
				>
					{title}
				</span>
			</h1>

			<p class="mt-6 max-w-content text-lg text-ink-muted md:text-xl">
				{#each locale.pick(edition.lede) as line, i (line)}
					{#if i > 0}<br />{/if}{line}
				{/each}
			</p>
			<p class="mt-4 kicker text-ink-muted">{SITE_AUTHOR}</p>

			<nav
				aria-label={t.archiveTitle}
				class="mt-10 flex items-center gap-4 text-sm tabular-nums md:mt-14"
			>
				<a href={locale.href('/#archive')} class="inline-flex items-center gap-1.5 quiet-link">
					<ArrowLeft class="size-4" aria-hidden="true" />
					{t.archiveLink}
				</a>
				<span aria-hidden="true" class="text-ink-faint">·</span>
				<a
					href={locale.href(`/${newestYear.year}`)}
					class="inline-flex items-center gap-1.5 quiet-link"
					aria-label="{t.latestYear}: {newestYear.year}"
				>
					{newestYear.year}
					<ArrowRight class="size-4" aria-hidden="true" />
				</a>
			</nav>
		</div>

		<figure class="mt-12 lg:mt-0">
			<img
				src={edition.artwork}
				alt={t.specialCoverAlt(range, title)}
				width="1600"
				height="1600"
				loading="eager"
				decoding="async"
				fetchpriority="high"
				sizes="(min-width: 1024px) 24rem, 100vw"
				class="aspect-square w-full bg-surface object-cover"
			/>
		</figure>
	</div>
</section>

<div style="--year-accent: {edition.theme.accent}">
	<Section id="songs" kicker={t.songsKicker} {title}>
		{#if edition.note}
			<p class="mt-4 text-lg text-ink-muted">{locale.pick(edition.note)}</p>
		{/if}
		<div class="mt-10 max-w-content">
			<SpotifyPlaylistEmbed
				url={edition.spotifyPlaylistUrl}
				title={t.playlistEmbedTitleNamed(title)}
			/>
		</div>
	</Section>
</div>

<style>
	.hero-wash {
		opacity: 0.2;
		filter: blur(90px) saturate(1.2);
		mask-image: linear-gradient(to bottom, black 10%, transparent 95%);
	}
</style>
