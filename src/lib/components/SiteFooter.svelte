<script lang="ts">
	import { FIRST_YEAR, newestYear } from '#lib/data/years/index.js';
	import { locale } from '#lib/i18n/locale.svelte.js';

	const t = $derived(locale.t);
</script>

<footer class="border-t border-line">
	<div
		class="mx-auto flex max-w-wide flex-col gap-3 px-5 py-10 text-sm text-ink-muted sm:flex-row sm:items-baseline sm:justify-between sm:px-8"
	>
		<p class="kicker text-ink">{t.siteName}</p>
		<p>{t.footerNote}</p>
		<p class="tabular-nums">{FIRST_YEAR}–{newestYear.year}</p>
	</div>
</footer>
