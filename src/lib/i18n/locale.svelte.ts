import { browser } from '$app/env';
import type { Locale, Localized } from '#lib/types/year.js';
import { translations, type Dictionary } from './translations.js';

export const DEFAULT_LOCALE: Locale = 'pt-BR';
export const LOCALES: readonly Locale[] = ['pt-BR', 'en'];
/** Short labels for the language switch. */
export const LOCALE_LABELS: Record<Locale, string> = { 'pt-BR': 'BR', en: 'EN' };
/** Full names, in their own language, for assistive technology. */
export const LOCALE_NAMES: Record<Locale, string> = {
	'pt-BR': 'Português (Brasil)',
	en: 'English'
};
const STORAGE_KEY = 'yim.locale';

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

	/** Restores the persisted preference. Call once on the client. */
	restore() {
		if (!browser) return;
		try {
			const stored = fromStored(localStorage.getItem(STORAGE_KEY));
			if (stored) this.current = stored;
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
		if (browser) document.documentElement.lang = this.current;
	}
}

export const locale = new LocaleState();
