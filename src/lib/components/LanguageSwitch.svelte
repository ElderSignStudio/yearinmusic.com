<script lang="ts">
	import { LOCALES, LOCALE_LABELS, LOCALE_NAMES, locale } from '#lib/i18n/locale.svelte.js';

	const t = $derived(locale.t);
</script>

<div
	role="group"
	aria-label={t.languageLabel}
	class="flex items-center gap-2 text-xs font-medium tracking-[0.16em] uppercase"
>
	{#each LOCALES as code, i (code)}
		{#if i > 0}<span aria-hidden="true" class="text-ink-faint">|</span>{/if}
		<button
			type="button"
			lang={code}
			aria-pressed={locale.current === code}
			aria-label={LOCALE_NAMES[code]}
			onclick={() => locale.set(code)}
			class="cursor-pointer px-1 py-1.5 quiet-link underline-offset-[6px] aria-pressed:text-ink aria-pressed:underline aria-pressed:decoration-year aria-pressed:decoration-2"
		>
			{LOCALE_LABELS[code]}
		</button>
	{/each}
</div>
