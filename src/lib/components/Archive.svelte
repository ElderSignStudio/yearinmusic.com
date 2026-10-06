<script lang="ts">
	import { archiveEntries } from '#lib/data/years/index.js';
	import { locale } from '#lib/i18n/locale.svelte.js';
	import Section from './Section.svelte';

	let { currentYear }: { currentYear: number } = $props();
	const t = $derived(locale.t);

	const entries = archiveEntries();
	const published = entries.filter((e) => e.data !== undefined);
	const upcoming = entries.filter((e) => e.data === undefined);
</script>

<Section id="archive" kicker={t.archiveKicker} title={t.archiveTitle}>
	<ol class="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
		{#each published as entry (entry.year)}
			{@const data = entry.data!}
			{@const winner = data.albums[0]}
			{@const isCurrent = entry.year === currentYear}
			<li style="--year-accent: {data.theme.accent}">
				<a
					href="/{entry.year}"
					class="group block"
					aria-current={isCurrent ? 'page' : undefined}
					aria-label="{entry.year} · {t.topN(data.albums.length)}{isCurrent
						? ` (${t.currentYear})`
						: ''}"
				>
					{#if winner}
						<span class="artwork-link">
							<img
								src={winner.artwork}
								alt=""
								width="1000"
								height="1000"
								loading="lazy"
								decoding="async"
								sizes="(min-width: 1280px) 200px, (min-width: 640px) 30vw, 50vw"
								class="opacity-85 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
							/>
						</span>
					{/if}
					<span class="mt-3 flex items-baseline justify-between gap-3">
						<span
							class="font-display text-3xl leading-none font-medium tracking-tight tabular-nums transition-colors duration-200 group-hover:text-year {isCurrent
								? 'text-year'
								: 'text-ink'}"
						>
							{entry.year}
						</span>
						<span class="kicker text-ink-muted">{t.topN(data.albums.length)}</span>
					</span>
				</a>
			</li>
		{/each}
	</ol>

	{#if upcoming.length}
		<div class="mt-12 flex flex-wrap items-baseline gap-x-3 gap-y-2 text-sm text-ink-muted">
			<span class="mr-1 kicker text-ink-muted">{t.comingSoon}</span>
			{#each upcoming as entry (entry.year)}
				<span class="tabular-nums">{entry.year}</span>
			{/each}
		</div>
	{/if}
</Section>
