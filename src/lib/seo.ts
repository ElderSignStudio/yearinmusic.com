import type { Locale, YearData } from '#lib/types/year.js';
import { translations } from '#lib/i18n/translations.js';
import { absoluteUrl, SITE_AUTHOR, SITE_URL } from './site.js';

const OG_LOCALE: Record<Locale, string> = { 'pt-BR': 'pt_BR', en: 'en_US' };

export interface PageMeta {
	title: string;
	description: string;
	/** Canonical/OG URL, absolute only when `SITE_URL` is configured. */
	url: string;
	image: string;
	/** Dimensions are only known for a dedicated share image. */
	imageWidth?: number;
	imageHeight?: number;
	ogLocale: string;
	ogLocaleAlternate: string[];
	siteName: string;
	author: string;
}

export function yearMeta(data: YearData, locale: Locale): PageMeta {
	const t = translations[locale];
	const shareImage = data.shareImage;
	return {
		title: `${t.siteName} — ${data.year}`,
		description: t.pageDescription(data.year),
		url: absoluteUrl(`/${data.year}`),
		image: absoluteUrl(shareImage ?? data.rankedAlbums[0]?.artwork ?? ''),
		imageWidth: shareImage ? 1200 : undefined,
		imageHeight: shareImage ? 630 : undefined,
		ogLocale: OG_LOCALE[locale],
		ogLocaleAlternate: (Object.keys(OG_LOCALE) as Locale[])
			.filter((l) => l !== locale)
			.map((l) => OG_LOCALE[l]),
		siteName: t.siteName,
		author: SITE_AUTHOR
	};
}

/** Metadata for the cross-year statistics page. */
export function statsMeta(
	locale: Locale,
	range: { first: number; latest: number },
	image: string | undefined
): PageMeta {
	const t = translations[locale];
	return {
		title: `${t.siteName} — ${t.acrossTitle}`,
		description: t.acrossDescription(range.first, range.latest),
		url: absoluteUrl('/stats'),
		image: absoluteUrl(image ?? ''),
		ogLocale: OG_LOCALE[locale],
		ogLocaleAlternate: (Object.keys(OG_LOCALE) as Locale[])
			.filter((l) => l !== locale)
			.map((l) => OG_LOCALE[l]),
		siteName: t.siteName,
		author: SITE_AUTHOR
	};
}

/** Whether absolute URLs are available (needed for valid canonical/og:url tags). */
export const hasSiteUrl = SITE_URL !== '';
