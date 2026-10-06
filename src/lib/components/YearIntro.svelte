<script lang="ts">
	import type { YearData } from '#lib/types/year.js';
	import { locale } from '#lib/i18n/locale.svelte.js';
	import Section from './Section.svelte';

	let { data }: { data: YearData } = $props();
	const t = $derived(locale.t);
	const paragraphs = $derived(locale.pick(data.intro));
</script>

<Section id="intro" kicker={t.introKicker} srTitle={t.introKicker}>
	<div class="max-w-content space-y-5">
		{#each paragraphs as paragraph, i (i)}
			<p
				class="font-display leading-[1.4] text-pretty {i === 0
					? 'text-2xl text-ink md:text-[1.75rem]'
					: 'text-lg text-ink/85 md:text-xl'}"
			>
				{paragraph}
			</p>
		{/each}
	</div>
</Section>
