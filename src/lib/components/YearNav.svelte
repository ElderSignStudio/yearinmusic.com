<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import { adjacentYears } from '#lib/data/years/index.js';
	import { locale } from '#lib/i18n/locale.svelte.js';

	let { year, class: className = '' }: { year: number; class?: string } = $props();
	const t = $derived(locale.t);
	const adjacent = $derived(adjacentYears(year));
</script>

<nav aria-label={t.archiveTitle} class="flex items-center gap-4 text-sm tabular-nums {className}">
	{#if adjacent.previous}
		<a
			href={locale.href(`/${adjacent.previous.year}`)}
			class="inline-flex items-center gap-1.5 quiet-link"
			aria-label="{t.previousYear}: {adjacent.previous.year}"
		>
			<ArrowLeft class="size-4" aria-hidden="true" />
			{adjacent.previous.year}
		</a>
		<span aria-hidden="true" class="text-ink-faint">·</span>
	{/if}
	<a href="#archive" class="quiet-link">{t.archiveLink}</a>
	{#if adjacent.next}
		<span aria-hidden="true" class="text-ink-faint">·</span>
		<a
			href={locale.href(`/${adjacent.next.year}`)}
			class="inline-flex items-center gap-1.5 quiet-link"
			aria-label="{t.nextYear}: {adjacent.next.year}"
		>
			{adjacent.next.year}
			<ArrowRight class="size-4" aria-hidden="true" />
		</a>
	{/if}
</nav>
