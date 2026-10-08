<script lang="ts">
	import { FIRST_YEAR, newestYear } from '#lib/data/years/index.js';
	import { locale } from '#lib/i18n/locale.svelte.js';
	import { SITE_AUTHOR } from '#lib/site.js';

	const t = $derived(locale.t);
</script>

<footer class="border-t border-line">
	<div
		class="mx-auto flex max-w-wide flex-col gap-3 px-5 py-10 text-sm text-ink-muted sm:flex-row sm:items-baseline sm:justify-between sm:px-8"
	>
		<p class="kicker text-ink">
			{t.siteName}<span aria-hidden="true" class="mx-2 text-ink-faint">—</span><span
				class="text-ink-muted">{SITE_AUTHOR}</span
			>
		</p>
		<p>{t.footerNote}</p>
		<p class="tabular-nums">{FIRST_YEAR}–{newestYear.year}</p>
	</div>
</footer>
