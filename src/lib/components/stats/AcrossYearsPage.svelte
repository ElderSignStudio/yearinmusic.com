<script lang="ts">
	import type { AcrossYearsStatistics } from '#lib/data/years/acrossYears.js';
	import { SITE_AUTHOR } from '#lib/site.js';
	import { locale } from '#lib/i18n/locale.svelte.js';
	import { formatPercent } from '#lib/utils/format.js';
	import Section from '../Section.svelte';
	import RatingDistribution from '../RatingDistribution.svelte';
	import BigPicture from './BigPicture.svelte';
	import YearColumns from './YearColumns.svelte';
	import ShareLine from './ShareLine.svelte';
	import RecurringArtists from './RecurringArtists.svelte';
	import GenreBars from './GenreBars.svelte';
	import Winners from './Winners.svelte';
	import Callout from './Callout.svelte';

	let { stats }: { stats: AcrossYearsStatistics } = $props();
	const t = $derived(locale.t);

	const listened = $derived(
		stats.perYear.map((y) => ({
			year: y.year,
			value: y.totalAlbumsRated,
			accent: y.accent,
			label: String(y.totalAlbumsRated),
			description: t.albumsRatedIn(y.year, y.totalAlbumsRated)
		}))
	);
	const greatShare = $derived(
		stats.perYear.map((y) => ({
			year: y.year,
			share: y.greatOrBetter.share,
			accent: y.accent,
			label: formatPercent(y.greatOrBetter.share, locale.current),
			description: t.greatShareIn(y.year, formatPercent(y.greatOrBetter.share, locale.current))
		}))
	);
	const amazing = $derived(
		stats.perYear.map((y) => ({
			year: y.year,
			value: y.amazing,
			accent: y.accent,
			label: String(y.amazing),
			description: t.amazingIn(y.year, y.amazing)
		}))
	);
	// Enough to show real repetition without listing every pair.
	const recurring = $derived(stats.recurringArtists.slice(0, 12));
	const genres = $derived(stats.genres.slice(0, 12));

	// Callout copy: facts from the helper, sentences from the locale templates.
	const h = $derived(stats.highlights);
	const yearList = (items: { year: number }[]) => t.joinList(items.map((i) => String(i.year)));
	const pct = (share: number) => formatPercent(share, locale.current);
	const mostActiveCopy = $derived(
		h.mostActive.tied
			? t.mostActiveTieCopy(yearList(h.mostActive.items), h.mostActive.total)
			: t.mostActiveCopy(String(h.mostActive.items[0].year), h.mostActive.total)
	);
	const strongestCopy = $derived(
		h.strongest.tied
			? t.strongestTieCopy(yearList(h.strongest.items), pct(h.strongest.share))
			: t.strongestCopy(String(h.strongest.items[0].year), pct(h.strongest.share))
	);
	const toughestCopy = $derived(
		h.toughest.tied
			? t.toughestTieCopy(yearList(h.toughest.items), pct(h.toughest.share))
			: t.toughestCopy(String(h.toughest.items[0].year), pct(h.toughest.share))
	);
	// Every year sharing one rate would make "high and low" meaningless; skip it then.
	const showHighLow = $derived(h.strongest.share !== h.toughest.share);
	const topGenreCopy = $derived(
		h.topGenre &&
			(h.topGenre.tied
				? t.topGenreTieCopy(t.joinList(h.topGenre.items.map((g) => g.genre)), h.topGenre.albums)
				: t.topGenreCopy(h.topGenre.items[0].genre, h.topGenre.albums))
	);
</script>

<section class="relative isolate overflow-hidden">
	<div aria-hidden="true" class="hero-atmosphere pointer-events-none absolute inset-0 -z-10"></div>
	<div class="mx-auto max-w-wide px-5 pt-14 pb-12 sm:px-8 md:pt-24 md:pb-16 lg:pt-28">
		<p class="kicker text-year tabular-nums">{stats.firstYear}—{stats.latestYear}</p>
		<h1
			class="mt-6 -ml-[0.02em] font-display text-[clamp(3rem,11vw,7.5rem)] leading-[0.95] font-medium tracking-tight text-balance"
		>
			{t.acrossTitle}
		</h1>
		<p class="mt-6 kicker text-ink-muted md:mt-8">{SITE_AUTHOR}</p>
		<p
			class="mt-8 max-w-content font-display text-xl leading-[1.35] text-pretty text-ink/85 md:text-2xl"
		>
			{t.acrossTagline(stats.yearCount)}
		</p>
	</div>
</section>

<Section id="big-picture" kicker={t.bigPictureKicker} srTitle={t.bigPictureKicker}>
	<BigPicture {stats} />
</Section>

<Section id="listened" kicker={t.byYearKicker} title={t.listenedTitle}>
	<p class="mt-4 text-lg text-ink-muted">{t.listenedLede}</p>
	<div class="mt-10 max-w-[52rem]">
		<YearColumns points={listened} title={t.listenedTitle} />
	</div>
	<Callout kicker={t.mostActiveKicker}>{mostActiveCopy}</Callout>
</Section>

<Section id="great-or-better" kicker={t.byYearKicker} title={t.greatShareTitle}>
	<p class="mt-4 text-lg text-ink-muted">{t.greatShareLede}</p>
	<div class="mt-12 max-w-[52rem]">
		<ShareLine points={greatShare} title={t.greatShareTitle} />
	</div>
	{#if showHighLow}
		<Callout kicker={t.highLowKicker}>{strongestCopy} {toughestCopy}</Callout>
	{/if}
</Section>

<Section id="amazing" kicker={t.rarestKicker} title={t.amazingTitle}>
	<p class="mt-4 text-lg text-ink-muted">{t.amazingLede}</p>
	<div class="mt-10 max-w-[52rem]">
		<YearColumns points={amazing} title={t.amazingTitle} trackClass="h-24 md:h-32" />
	</div>
</Section>

<Section id="profile" kicker={t.allYearsKicker} title={t.profileTitle}>
	<p class="mt-4 text-lg text-ink-muted">
		{t.profileLede(stats.totalAlbumsRated.toLocaleString(locale.current))}
	</p>
	<div class="mt-8 max-w-[52rem]">
		<RatingDistribution
			buckets={stats.cumulativeDistribution}
			total={stats.totalAlbumsRated}
			titleClass="sr-only"
		/>
	</div>
</Section>

{#if recurring.length}
	<Section id="artists" kicker={t.artistsKicker} title={t.recurringTitle}>
		<p class="mt-4 text-lg text-ink-muted">{t.recurringLede}</p>
		<div class="mt-10 max-w-[60rem]">
			<RecurringArtists artists={recurring} />
		</div>
	</Section>
{/if}

<Section id="genres" kicker={t.genresKicker} title={t.soundTitle}>
	<p class="mt-4 text-lg text-ink-muted">{t.soundLede(stats.rankedAlbumCount)}</p>
	<div class="mt-8 max-w-[52rem]">
		<GenreBars {genres} />
	</div>
	{#if topGenreCopy}
		<Callout kicker={t.recurringSoundKicker}>{topGenreCopy}</Callout>
	{/if}
</Section>

<Section id="winners" kicker={t.winnersKicker} title={t.winnersTitle}>
	<div class="mt-10">
		<Winners winners={stats.winners} />
	</div>
</Section>

<style>
	/* A faint wash of the global accent, nothing year-specific: this page spans them all. */
	.hero-atmosphere {
		background:
			radial-gradient(
				60% 80% at 18% 40%,
				color-mix(in oklab, var(--accent) 10%, transparent) 0%,
				transparent 70%
			),
			radial-gradient(
				45% 60% at 85% 15%,
				color-mix(in oklab, var(--accent) 5%, transparent) 0%,
				transparent 70%
			);
	}
</style>
