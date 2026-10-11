<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import type { SpecialEdition } from '#lib/types/specialEdition.js';
	import { formatYearRange } from '#lib/data/specialEditions.js';
	import { locale } from '#lib/i18n/locale.svelte.js';

	/** Announces an edition on the yearly page that closes its range. */
	let { edition }: { edition: SpecialEdition } = $props();
	const t = $derived(locale.t);
	const range = $derived(formatYearRange(edition));
	const title = $derived(locale.pick(edition.title));
	const href = $derived(locale.href(`/${edition.slug}`));
</script>

<section
	aria-labelledby="special-{edition.slug}"
	class="border-t border-line"
	style="--year-accent: {edition.theme.accent}"
>
	<div
		class="mx-auto max-w-wide px-5 py-12 sm:px-8 md:py-16 lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-x-12"
	>
		<p class="mb-6 kicker text-year lg:mb-0 lg:pt-2">
			{t.specialEditionKicker}
			<span aria-hidden="true" class="mx-1 text-ink-faint">·</span>
			<span class="tabular-nums">{range}</span>
		</p>
		<div class="flex min-w-0 items-start gap-5 sm:gap-8">
			<a {href} class="artwork-link w-20 shrink-0 sm:w-28" aria-label="{range} · {title}">
				<img
					src={edition.artwork}
					alt=""
					width="1600"
					height="1600"
					loading="lazy"
					decoding="async"
				/>
			</a>
			<div class="min-w-0">
				<h2
					id="special-{edition.slug}"
					class="font-display text-2xl leading-[1.05] font-medium tracking-tight md:text-4xl"
				>
					{title}
				</h2>
				<p class="mt-2.5 text-ink-muted md:text-lg">{locale.pick(edition.callout)}</p>
				<a {href} class="mt-5 inline-flex items-center gap-2 text-sm text-year hover:text-ink">
					{t.exploreCollection}
					<ArrowRight class="size-4" aria-hidden="true" />
				</a>
			</div>
		</div>
	</div>
</section>
