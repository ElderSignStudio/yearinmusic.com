<script lang="ts">
	/**
	 * TEMPORARY DEVELOPMENT SPECIMEN — not linked from the site.
	 * Compares serif candidates for the editorial/numeric roles. Delete this route
	 * (and the dev-only Fontsource packages) once a decision is made.
	 */
	import { dev } from '$app/env';
	import '@fontsource-variable/newsreader/opsz.css';
	import '@fontsource-variable/bodoni-moda/opsz.css';
	import '@fontsource/instrument-serif';

	interface Specimen {
		id: string;
		name: string;
		family: string;
		note: string;
		/** Weight for headings / titles. */
		headingWeight: number;
		/** Weight for large numerals. */
		numeralWeight: number;
	}

	const serifs: Specimen[] = [
		{
			id: 'newsreader',
			name: 'Newsreader',
			family: "'Newsreader Variable', Georgia, serif",
			note: 'Variable · wght 200–800 · opsz 6–72',
			headingWeight: 500,
			numeralWeight: 400
		},
		{
			id: 'bodoni',
			name: 'Bodoni Moda',
			family: "'Bodoni Moda Variable', 'Didot', Georgia, serif",
			note: 'Variable · wght 400–900 · opsz 6–96',
			headingWeight: 500,
			numeralWeight: 400
		},
		{
			id: 'instrument',
			name: 'Instrument Serif',
			family: "'Instrument Serif', Georgia, serif",
			note: 'Static · 400 only',
			headingWeight: 400,
			numeralWeight: 400
		},
		{
			id: 'source',
			name: 'Source Serif 4 (current)',
			family: "'Source Serif 4 Variable', Georgia, serif",
			note: 'Variable · wght 200–900 · opsz 8–60 · currently used for editorial text',
			headingWeight: 500,
			numeralWeight: 400
		}
	];

	const inter: Specimen = {
		id: 'inter',
		name: 'Inter (sans reference — current numerals)',
		family: "'Inter Variable', system-ui, sans-serif",
		note: 'Variable · how the site renders numerals today: 200 for the year/stats, 300 for ranks',
		headingWeight: 500,
		numeralWeight: 200
	};

	const samples = {
		year: '2024',
		total: '168',
		ranks: ['01', '02', '03', '04'],
		ranking: 'Os 20 melhores álbuns',
		album: 'Cathedrals of Static',
		songs: 'Melhores músicas de 2024',
		archive: 'O arquivo'
	};
</script>

<svelte:head>
	<title>Type test · Year in Music</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{#if dev}
	<div class="type-test mx-auto max-w-wide px-5 py-10 sm:px-8">
		<header class="border-b border-line pb-6">
			<p class="kicker text-year">Development only</p>
			<h1 class="mt-3 text-2xl font-medium tracking-tight">Serif specimen comparison</h1>
			<p class="mt-2 max-w-content text-sm text-ink-muted">
				Lining, proportional numerals everywhere. Sizes match the desktop site: hero year 18rem,
				winner rank 13rem, statistics 7.5rem, featured ranks 5.5rem, section heading 3rem, winner
				title 3.75rem.
			</p>
			<nav class="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Specimens">
				{#each [...serifs, inter] as s (s.id)}
					<a href="#{s.id}" class="quiet-link">{s.name}</a>
				{/each}
			</nav>
		</header>

		<!-- Side-by-side overview: one row per family -->
		<section class="border-b border-line py-10" aria-label="Overview">
			<p class="kicker text-ink-muted">Overview</p>
			<div class="mt-6 grid gap-y-8">
				{#each [...serifs, inter] as s (s.id)}
					<div
						class="grid items-baseline gap-x-8 gap-y-2 border-t border-line pt-6 lg:grid-cols-[11rem_minmax(0,1fr)_minmax(0,1.6fr)]"
					>
						<div class="text-xs text-ink-muted">
							<span class="block font-medium text-ink">{s.name}</span>
						</div>
						<div
							class="specimen text-[6rem] leading-[0.85] text-year"
							style="font-family: {s.family}; font-weight: {s.numeralWeight}; letter-spacing: -0.03em"
						>
							{samples.year}
							<span class="ml-6 text-[3.5rem]">{samples.ranks[0]}</span>
						</div>
						<div
							class="specimen text-[2.5rem] leading-[1.05] tracking-tight"
							style="font-family: {s.family}; font-weight: {s.headingWeight}"
						>
							{samples.album}
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- Full-size specimens -->
		{#each [...serifs, inter] as s (s.id)}
			<section id={s.id} class="scroll-mt-10 border-b border-line py-14" aria-label={s.name}>
				<div class="flex flex-wrap items-baseline justify-between gap-4">
					<h2 class="text-lg font-medium tracking-tight">{s.name}</h2>
					<p class="text-xs text-ink-muted">{s.note}</p>
				</div>

				<div class="mt-10 grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
					<!-- Numerals -->
					<div class="min-w-0" style="font-family: {s.family}">
						<p class="kicker text-ink-muted">Hero year · 18rem</p>
						<p
							class="specimen mt-8 -ml-[0.05em] text-[clamp(6.5rem,13vw,18rem)] leading-[0.8]"
							style="font-weight: {s.numeralWeight}; letter-spacing: -0.05em"
						>
							{samples.year}
						</p>

						<div class="mt-12 grid grid-cols-2 gap-8">
							<div>
								<p class="kicker text-ink-muted">Statistics · 7.5rem</p>
								<p
									class="specimen mt-8 text-[7.5rem] leading-[0.8]"
									style="font-weight: {s.numeralWeight}; letter-spacing: -0.04em"
								>
									{samples.total}
								</p>
							</div>
							<div>
								<p class="kicker text-ink-muted">Winner rank · 13rem</p>
								<p
									class="specimen mt-8 text-[13rem] leading-[0.8] text-year"
									style="font-weight: {s.id === 'inter'
										? 300
										: s.numeralWeight}; letter-spacing: -0.04em"
								>
									{samples.ranks[0]}
								</p>
							</div>
						</div>

						<p class="mt-12 kicker text-ink-muted">Featured ranks · 5.5rem</p>
						<p
							class="specimen mt-3 flex flex-wrap gap-x-10 text-[5.5rem] leading-[0.85] text-year"
							style="font-weight: {s.id === 'inter'
								? 300
								: s.numeralWeight}; letter-spacing: -0.04em"
						>
							{#each samples.ranks as rank (rank)}<span>{rank}</span>{/each}
						</p>
					</div>

					<!-- Editorial -->
					<div class="min-w-0" style="font-family: {s.family}; font-weight: {s.headingWeight}">
						<p class="kicker text-ink-muted" style="font-family: var(--type-body)">
							Section headings · 3rem
						</p>
						<p class="specimen mt-3 text-5xl leading-[1.05] tracking-tight">{samples.ranking}</p>
						<p class="specimen mt-4 text-5xl leading-[1.05] tracking-tight">{samples.songs}</p>
						<p class="specimen mt-4 text-5xl leading-[1.05] tracking-tight">{samples.archive}</p>

						<p class="mt-12 kicker text-ink-muted" style="font-family: var(--type-body)">
							Winner title · 3.75rem
						</p>
						<p class="specimen mt-3 text-6xl leading-[1.02] tracking-tight text-balance">
							{samples.album}
						</p>

						<p class="mt-12 kicker text-ink-muted" style="font-family: var(--type-body)">
							Featured title · 2rem / list title · 1.375rem
						</p>
						<p class="specimen mt-3 text-[2rem] leading-[1.08] tracking-tight">{samples.album}</p>
						<p class="specimen mt-2 text-[1.375rem] leading-[1.15] tracking-tight">
							Études for a Vanishing City
						</p>

						<!-- Inter pairing -->
						<div
							class="mt-10 border-t border-line pt-6"
							style="font-family: var(--type-body); font-weight: 400"
						>
							<p class="kicker text-ink-muted">Vera Lumen</p>
							<p class="mt-2 text-sm leading-snug text-ink-muted">
								Art Rock <span class="mx-1.5 text-ink-faint">·</span> Experimental Rock
								<span class="mx-1.5 text-ink-faint">·</span> Post-Rock
							</p>
							<p class="mt-3 text-xs font-medium tracking-[0.08em] text-ink-muted uppercase">
								Spotify &nbsp; Apple Music &nbsp; RYM ↗
							</p>
							<p class="mt-4 max-w-content text-sm text-ink-muted">
								Avaliei 168 álbuns lançados em 2024, bem mais do que em 2023 (avaliei 104 álbuns
								lançados naquele ano).
							</p>
						</div>
					</div>
				</div>
			</section>
		{/each}
	</div>
{:else}
	<p class="mx-auto max-w-wide px-5 py-20 text-sm text-ink-muted sm:px-8">
		This specimen page is available in development only.
	</p>
{/if}

<style>
	.specimen {
		font-variant-numeric: lining-nums proportional-nums;
		font-optical-sizing: auto;
	}
</style>
