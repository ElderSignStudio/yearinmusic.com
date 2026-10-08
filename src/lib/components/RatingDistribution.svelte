<script lang="ts">
	import type { RatingBucket } from '#lib/types/year.js';
	import { locale } from '#lib/i18n/locale.svelte.js';
	import { formatPercent } from '#lib/utils/format.js';

	interface Props {
		buckets: RatingBucket[];
		total: number;
		/** Extra classes for the heading, e.g. to hide it where a toggle carries the title instead. */
		titleClass?: string;
	}

	let { buckets, total, titleClass = '' }: Props = $props();
	const t = $derived(locale.t);
	const maxCount = $derived(Math.max(1, ...buckets.map((b) => b.count)));
</script>

<div>
	<h3 class="kicker text-ink-muted {titleClass}">{t.distributionTitle}</h3>

	<!--
		Mobile: rating · label · count · % on one line, bar beneath.
		sm+:    rating · label · bar · count · % on a single line.
	-->
	<ol class="mt-5">
		{#each buckets as bucket (bucket.rating)}
			{@const share = total ? bucket.count / total : 0}
			<li
				class="grid grid-cols-[2.75rem_minmax(0,1fr)_auto_3.5rem] items-baseline gap-x-3 gap-y-2 py-2.5 sm:grid-cols-[2.75rem_10rem_minmax(0,1fr)_2.5rem_3.75rem] sm:items-center sm:gap-x-4 sm:py-2 md:grid-cols-[2.75rem_11rem_minmax(0,1fr)_2.5rem_3.75rem]"
			>
				<span class="text-sm font-medium tabular-nums">
					{bucket.rating.toFixed(1)}
				</span>
				<span class="min-w-0 text-sm leading-snug text-ink">{locale.pick(bucket.label)}</span>
				<span class="text-right text-sm text-ink tabular-nums sm:order-4">{bucket.count}</span>
				<span class="text-right text-sm text-ink-muted tabular-nums sm:order-5">
					{formatPercent(share, locale.current)}
				</span>
				<span
					class="col-span-4 block h-1.5 w-full bg-surface-strong sm:order-3 sm:col-span-1"
					aria-hidden="true"
				>
					<span
						class="block h-full bg-year transition-[width] duration-300 ease-out"
						style="width: {(bucket.count / maxCount) * 100}%"
					></span>
				</span>
			</li>
		{/each}
	</ol>
</div>
