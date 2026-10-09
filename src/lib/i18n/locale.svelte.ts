import { browser } from '$app/env';
import { replaceState } from '$app/navigation';
import type { Locale, Localized } from '#lib/types/year.js';
import { translations, type Dictionary } from './translations.js';
import { DEFAULT_LOCALE, LOCALE_PARAM, localizedHref, parseLocaleParam } from './localeUrl.js';

/**
 * Locale model: English is the default; Brazilian Portuguese is the secondary locale.
 * Precedence on the client: explicit `?lang=` in the URL › saved preference › English.
 * Social metadata stays English regardless (see `src/lib/seo.ts`).
 */
export { DEFAULT_LOCALE, LOCALE_PARAM, localizedHref, parseLocaleParam };
export const LOCALES: readonly Locale[] = ['pt-BR', 'en'];
/** Short labels for the language switch. */
export const LOCALE_LABELS: Record<Locale, string> = { 'pt-BR': 'BR', en: 'EN' };
/** Full names, in their own language, for assistive technology. */
export const LOCALE_NAMES: Record<Locale, string> = {
	'pt-BR': 'Português (Brasil)',
	en: 'English'
};
const STORAGE_KEY = 'yim.locale';

/** What the locale code needs from a URL; SvelteKit's `page.url` (read-only params) qualifies. */
export type UrlLike = Pick<URL, 'pathname' | 'search' | 'hash'> & {
	searchParams: { get(name: string): string | null };
};

function isLocale(value: unknown): value is Locale {
	return value === 'pt-BR' || value === 'en';
}

/** Accepts the legacy `pt` value persisted by the first prototype. */
function fromStored(value: string | null): Locale | undefined {
	if (value === 'pt') return 'pt-BR';
	return isLocale(value) ? value : undefined;
}

class LocaleState {
	current = $state<Locale>(DEFAULT_LOCALE);

	/** Active UI dictionary. Read it inside `$derived` or templates for reactivity. */
	get t(): Dictionary {
		return translations[this.current];
	}

	/** Picks the active language from a bilingual value. */
	pick<T>(value: Localized<T>): T {
		return value[this.current];
	}

	/** Internal link in the current language (see `localizedHref`). */
	href(path: string): string {
		return localizedHref(path, this.current);
	}

	/**
	 * Resolves the locale for this visit: URL parameter, then the saved preference,
	 * then English. Call once on the client before the page renders.
	 */
	initialize(url: UrlLike) {
		if (!browser) return;
		this.current =
			parseLocaleParam(url.searchParams.get(LOCALE_PARAM)) ?? this.stored() ?? DEFAULT_LOCALE;
		this.applyLang();
	}

	/** Honours an explicit `?lang=` on later client-side navigations (a pasted link, for example). */
	syncFromUrl(url: UrlLike) {
		const explicit = parseLocaleParam(url.searchParams.get(LOCALE_PARAM));
		if (explicit && explicit !== this.current) {
			this.current = explicit;
			this.applyLang();
		}
	}

	/**
	 * The visitor's choice: persisted, and reflected in the address bar without a
	 * reload or a new history entry (`?lang=pt-BR` for Portuguese, nothing for English).
	 */
	set(next: Locale, url?: UrlLike) {
		this.current = next;
		if (!browser) return;
		try {
			localStorage.setItem(STORAGE_KEY, next);
		} catch {
			/* storage unavailable — the choice still applies to this visit */
		}
		this.applyLang();
		if (url) replaceState(localizedHref(`${url.pathname}${url.search}${url.hash}`, next), {});
	}

	private stored(): Locale | undefined {
		try {
			return fromStored(localStorage.getItem(STORAGE_KEY));
		} catch {
			return undefined;
		}
	}

	private applyLang() {
		if (browser) document.documentElement.lang = this.current;
	}
}

export const locale = new LocaleState();
