import { browser } from '$app/env';
import type { Locale, Localized } from '#lib/types/year.js';
import { translations, type Dictionary } from './translations.js';

export const DEFAULT_LOCALE: Locale = 'pt';
export const LOCALES: readonly Locale[] = ['pt', 'en'];
const STORAGE_KEY = 'yim.locale';
const HTML_LANG: Record<Locale, string> = { pt: 'pt-BR', en: 'en' };

function isLocale(value: unknown): value is Locale {
	return value === 'pt' || value === 'en';
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

	/** Restores the persisted preference. Call once on the client. */
	restore() {
		if (!browser) return;
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (isLocale(stored)) this.current = stored;
		} catch {
			/* storage unavailable — keep default */
		}
		this.applyLang();
	}

	set(next: Locale) {
		this.current = next;
		if (!browser) return;
		try {
			localStorage.setItem(STORAGE_KEY, next);
		} catch {
			/* ignore */
		}
		this.applyLang();
	}

	private applyLang() {
		if (browser) document.documentElement.lang = HTML_LANG[this.current];
	}
}

export const locale = new LocaleState();
