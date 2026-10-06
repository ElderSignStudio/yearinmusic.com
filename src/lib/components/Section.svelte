<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id?: string;
		kicker: string;
		/** Visible display heading. */
		title?: string;
		/** Screen-reader-only heading when the content carries its own visual headline. */
		srTitle?: string;
		children: Snippet;
		class?: string;
	}

	let { id, kicker, title, srTitle, children, class: className = '' }: Props = $props();
</script>

<section {id} class="scroll-mt-16 border-t border-line {className}">
	<div
		class="mx-auto max-w-wide px-5 py-14 sm:px-8 md:py-20 lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-x-12"
	>
		<p class="mb-6 kicker text-year lg:mb-0 lg:pt-2">{kicker}</p>
		<div class="min-w-0">
			{#if title}
				<h2 class="font-display text-3xl leading-[1.05] font-medium tracking-tight md:text-5xl">
					{title}
				</h2>
			{:else if srTitle}
				<h2 class="sr-only">{srTitle}</h2>
			{/if}
			{@render children()}
		</div>
	</div>
</section>
