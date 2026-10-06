<script lang="ts">
	import { locale } from '#lib/i18n/locale.svelte.js';
	import LanguageSwitch from './LanguageSwitch.svelte';

	const t = $derived(locale.t);
</script>

<header>
	<div class="mx-auto flex h-14 max-w-wide items-center justify-between px-5 sm:px-8 md:h-16">
		<!-- Temporary wordmark; replace once the site has a name. -->
		<a href="/" class="kicker text-ink transition-colors duration-200 hover:text-year">
			{t.siteName}
		</a>
		<div class="flex items-center gap-6">
			<a
				href="#archive"
				class="hidden text-xs font-medium tracking-[0.16em] quiet-link uppercase sm:inline"
			>
				{t.archiveLink}
			</a>
			<LanguageSwitch />
		</div>
	</div>
</header>
