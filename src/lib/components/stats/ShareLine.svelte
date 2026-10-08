<script lang="ts">
	/**
	 * A time series of yearly shares: an SVG line underneath (stretched, non-scaling stroke)
	 * and one HTML column per year carrying the dot, the percentage and the year label.
	 */
	interface Point {
		year: number;
		/** Fraction 0–1. */
		share: number;
		accent: string;
		label: string;
		description: string;
	}

	interface Props {
		points: Point[];
		title: string;
	}

	let { points, title }: Props = $props();

	// Domain: 0 to the next 10% above the maximum, so the baseline is honest and labels fit.
	const domain = $derived(
		Math.max(0.1, Math.ceil(Math.max(...points.map((p) => p.share)) * 10) / 10)
	);
	const x = (i: number) => (points.length > 1 ? (i / (points.length - 1)) * 100 : 50);
	const y = (share: number) => 100 - (share / domain) * 100;
	const path = $derived(points.map((p, i) => `${x(i)},${y(p.share)}`).join(' '));

	// Phones cannot fit every label: always show the first, last, highest and lowest
	// points; the others appear on hover/focus (and every value is in the link's label).
	const alwaysLabelled = $derived.by(() => {
		const shares = points.map((p) => p.share);
		return new Set([
			0,
			points.length - 1,
			shares.indexOf(Math.max(...shares)),
			shares.indexOf(Math.min(...shares))
		]);
	});
</script>

<div class="relative">
	<!-- Columns reserve the left/right half-column so the line meets the dots exactly. -->
	<div class="relative h-40 md:h-48">
		<svg
			class="absolute inset-0 size-full overflow-visible"
			viewBox="0 0 100 100"
			preserveAspectRatio="none"
			aria-hidden="true"
			style="left: calc(100% / {points.length * 2}); width: calc(100% - 100% / {points.length})"
		>
			<polyline
				points={path}
				fill="none"
				stroke="var(--ink-faint)"
				stroke-width="1.5"
				stroke-linejoin="round"
				stroke-linecap="round"
				vector-effect="non-scaling-stroke"
			/>
		</svg>
		<ul
			class="relative grid h-full"
			style="grid-template-columns: repeat({points.length}, minmax(0, 1fr))"
			aria-label={title}
		>
			{#each points as point, i (point.year)}
				<li class="relative" style="--year-accent: {point.accent}">
					<a
						href="/{point.year}"
						class="group absolute inset-0 block rounded-xs outline-none"
						aria-label={point.description}
					>
						<span
							class="absolute left-1/2 block size-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-year ring-4 ring-bg transition-transform duration-200 group-hover:scale-125 group-focus-visible:scale-125 motion-reduce:transition-none"
							style="bottom: {(point.share / domain) * 100}%"
							aria-hidden="true"
						></span>
						<span
							class="absolute left-1/2 block -translate-x-1/2 text-[0.625rem] leading-none whitespace-nowrap text-ink-muted tabular-nums transition-[color,opacity] duration-200 group-hover:text-ink group-hover:opacity-100 group-focus-visible:text-ink group-focus-visible:opacity-100 sm:text-xs sm:opacity-100 {alwaysLabelled.has(
								i
							)
								? ''
								: 'opacity-0'}"
							style="bottom: calc({(point.share / domain) * 100}% + 1rem)"
							aria-hidden="true"
						>
							{point.label}
						</span>
					</a>
					{#if i === 0}<span class="sr-only">{title}</span>{/if}
				</li>
			{/each}
		</ul>
	</div>
	<ol
		class="mt-2.5 grid border-t border-line pt-2.5"
		style="grid-template-columns: repeat({points.length}, minmax(0, 1fr))"
		aria-hidden="true"
	>
		{#each points as point (point.year)}
			<li
				class="text-center text-[0.625rem] font-medium tracking-[0.08em] text-ink-muted tabular-nums sm:text-xs sm:tracking-[0.12em]"
			>
				<span class="sm:hidden">’{String(point.year).slice(-2)}</span>
				<span class="hidden sm:inline">{point.year}</span>
			</li>
		{/each}
	</ol>
</div>
