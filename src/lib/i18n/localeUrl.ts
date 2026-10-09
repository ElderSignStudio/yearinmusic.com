/**
 * Locale ↔ URL rules, shared by the reactive locale state and anything that builds links.
 * English is the default; Brazilian Portuguese is reachable through `?lang=pt-BR`.
 */
import type { Locale } from '#lib/types/year.js';

export const DEFAULT_LOCALE: Locale = 'en';
/** Query parameter that makes a URL open in a given language, e.g. `/2025?lang=pt-BR`. */
export const LOCALE_PARAM = 'lang';

/** Parses a `?lang=` value: only the BCP-47 tags `en` and `pt-BR` (any casing) are accepted. */
export function parseLocaleParam(value: string | null | undefined): Locale | undefined {
	const tag = value?.trim().toLowerCase();
	if (tag === 'en') return 'en';
	if (tag === 'pt-br') return 'pt-BR';
	return undefined;
}

/**
 * The same path in a given language: Portuguese links carry `?lang=pt-BR` so the
 * displayed URL stays shareable; English links are clean. Other query parameters
 * and the hash are preserved.
 */
export function localizedHref(path: string, locale: Locale): string {
	const url = new URL(path, 'http://localhost');
	if (locale === DEFAULT_LOCALE) url.searchParams.delete(LOCALE_PARAM);
	else url.searchParams.set(LOCALE_PARAM, locale);
	return `${url.pathname}${url.search}${url.hash}`;
}
