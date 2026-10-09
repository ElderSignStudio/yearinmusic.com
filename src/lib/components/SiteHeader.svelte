<script lang="ts">
	import { page } from '$app/state';
	import { locale } from '#lib/i18n/locale.svelte.js';
	import LanguageSwitch from './LanguageSwitch.svelte';

	const t = $derived(locale.t);
	// Year pages have their own archive section; elsewhere fall back to the newest year's.
	const archiveHref = $derived(
		locale.href(page.data.year ? `${page.url.pathname}#archive` : '/#archive')
	);
	const homeHref = $derived(locale.href('/'));
	const statsHref = $derived(locale.href('/stats'));
	const onStats = $derived(page.url.pathname.replace(/\/$/, '') === '/stats');
	const linkClass =
		'text-xs font-medium tracking-[0.16em] quiet-link uppercase aria-[current=page]:text-ink';
</script>

<header>
	<div class="mx-auto flex h-14 max-w-wide items-center justify-between px-5 sm:px-8 md:h-16">
		<!-- Temporary wordmark; replace once the site has a name. -->
		<a href={homeHref} class="kicker text-ink transition-colors duration-200 hover:text-year">
			{t.siteName}
		</a>
		<nav class="flex items-center gap-5 sm:gap-6" aria-label={t.siteName}>
			<a href={archiveHref} class="hidden {linkClass} sm:inline">{t.archiveLink}</a>
			<!-- Phones get the short label so the bar stays uncrowded; the page uses the full term. -->
			<a href={statsHref} class={linkClass} aria-current={onStats ? 'page' : undefined}>
				<span class="sm:hidden">{t.statsLinkShort}</span>
				<span class="hidden sm:inline">{t.statsLink}</span>
			</a>
			<LanguageSwitch />
		</nav>
	</div>
</header>
