<script lang="ts">
	import { locale } from '#lib/i18n/locale.svelte.js';
	/**
	 * One column per year: a direct value label, a bar and the year, each column a link to
	 * that year's page. Pure HTML/CSS so labels stay real text at every width.
	 */
	interface Point {
		year: number;
		value: number;
		accent: string;
		/** Value as displayed above the bar. */
		label: string;
		/** Full accessible description, e.g. "2024: 168 albums rated". */
		description: string;
	}

	interface Props {
		points: Point[];
		/** Bar track height classes, e.g. `h-44 md:h-56`. */
		trackClass?: string;
		/** Accessible name for the whole chart. */
		title: string;
	}

	let { points, trackClass = 'h-44 md:h-56', title }: Props = $props();
	const max = $derived(Math.max(1, ...points.map((p) => p.value)));
</script>

<ul
	class="grid gap-x-1.5 sm:gap-x-3 md:gap-x-4"
	style="grid-template-columns: repeat({points.length}, minmax(0, 1fr))"
	aria-label={title}
>
	{#each points as point (point.year)}
		<li style="--year-accent: {point.accent}">
			<a
				href={locale.href(`/${point.year}`)}
				class="group block rounded-xs text-center outline-none"
				aria-label={point.description}
			>
				<span class="flex {trackClass} flex-col justify-end" aria-hidden="true">
					<span
						class="mb-1.5 block text-[0.625rem] leading-none text-ink-muted tabular-nums transition-colors duration-200 group-hover:text-ink group-focus-visible:text-ink sm:text-xs"
					>
						{point.label}
					</span>
					<span
						class="mx-auto block w-full max-w-7 bg-year opacity-80 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:max-w-9"
						style="height: {(point.value / max) * 100}%"
					></span>
				</span>
				<span
					class="mt-2.5 block border-t border-line pt-2.5 text-[0.625rem] font-medium tracking-[0.08em] text-ink-muted tabular-nums transition-colors duration-200 group-hover:text-ink group-focus-visible:text-ink sm:text-xs sm:tracking-[0.12em]"
					aria-hidden="true"
				>
					<span class="sm:hidden">’{String(point.year).slice(-2)}</span>
					<span class="hidden sm:inline">{point.year}</span>
				</span>
			</a>
		</li>
	{/each}
</ul>
