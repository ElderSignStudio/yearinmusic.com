<script lang="ts">
	import type { Snippet } from 'svelte';

	/**
	 * An editorial annotation: a small kicker and one short Newsreader paragraph,
	 * set off by a thin rule. Spans years, so it stays in neutral type.
	 */
	let { kicker, children }: { kicker: string; children: Snippet } = $props();
</script>

<aside class="mt-12 max-w-[36rem] border-t border-line pt-6 md:mt-14 md:pt-7">
	<p class="kicker text-ink-muted">{kicker}</p>
	<p class="mt-3 font-display text-xl leading-[1.35] text-pretty text-ink/90 md:text-2xl">
		{@render children()}
	</p>
</aside>
