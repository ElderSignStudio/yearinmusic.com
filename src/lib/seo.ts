import type { Locale, YearData } from '#lib/types/year.js';
import { translations } from '#lib/i18n/translations.js';
import { DEFAULT_LOCALE } from '#lib/i18n/localeUrl.js';
import socialCards from '#lib/data/socialCards.json';
import { absoluteUrl, SITE_AUTHOR, SITE_URL } from './site.js';

/**
 * Social and document metadata is deliberately English-first: previews for a
 * `?lang=pt-BR` share link still read in English, and `?lang` never reaches canonical URLs.
 */
const META_LOCALE: Locale = DEFAULT_LOCALE;

const OG_LOCALE: Record<Locale, string> = { 'pt-BR': 'pt_BR', en: 'en_US' };

/**
 * Sizes of the generated share cards (`npm run generate:social`). The square card is the
 * Open Graph image (WhatsApp renders a sent link as a large square card), the landscape
 * card serves Twitter and other large-preview contexts.
 */
export const SOCIAL_CARD = {
	square: { width: 1200, height: 1200 },
	landscape: { width: 1200, height: 630 }
} as const;

export interface PageMeta {
	title: string;
	description: string;
	/** Canonical/OG URL, absolute only when `SITE_URL` is configured. */
	url: string;
	/** Open Graph image. */
	image: string;
	/** Dimensions are only known for a dedicated share image. */
	imageWidth?: number;
	imageHeight?: number;
	/** Twitter image: the landscape card when there is one, otherwise the OG image. */
	twitterImage: string;
	ogLocale: string;
	ogLocaleAlternate: string[];
	siteName: string;
	author: string;
}

/**
 * Path of a generated 1200×630 card, or undefined when it has not been generated.
 * `socialCards.json` is written by the generator, so metadata never points at a missing file.
 */
export function socialCardPath(name: string): string | undefined {
	return socialCards.includes(name) ? `/social/${name}.jpg` : undefined;
}

type SocialImage = Pick<PageMeta, 'image' | 'imageWidth' | 'imageHeight' | 'twitterImage'>;

/**
 * Square card for OG and landscape card for Twitter when generated; a hand-supplied
 * landscape image replaces the generated one; the fallback artwork carries no dimensions.
 */
function socialImage(
	name: string,
	landscapeOverride: string | undefined,
	fallback: string | undefined
): SocialImage {
	const square = socialCardPath(`${name}-square`);
	const landscape = landscapeOverride ?? socialCardPath(name);
	const og = square
		? { image: absoluteUrl(square), ...SOCIAL_CARD.square }
		: landscape
			? { image: absoluteUrl(landscape), ...SOCIAL_CARD.landscape }
			: { image: absoluteUrl(fallback ?? '') };
	return {
		image: og.image,
		imageWidth: 'width' in og ? og.width : undefined,
		imageHeight: 'height' in og ? og.height : undefined,
		twitterImage: landscape ? absoluteUrl(landscape) : og.image
	};
}

function localeMeta(locale: Locale): Pick<PageMeta, 'ogLocale' | 'ogLocaleAlternate'> {
	return {
		ogLocale: OG_LOCALE[locale],
		ogLocaleAlternate: (Object.keys(OG_LOCALE) as Locale[])
			.filter((l) => l !== locale)
			.map((l) => OG_LOCALE[l])
	};
}

export function yearMeta(data: YearData): PageMeta {
	const locale = META_LOCALE;
	const t = translations[locale];
	return {
		title: `${t.siteName} — ${data.year}`,
		description: t.pageDescription(data.year, data.rankedAlbums.length),
		url: absoluteUrl(`/${data.year}`),
		...socialImage(String(data.year), data.shareImage, data.rankedAlbums[0]?.artwork),
		...localeMeta(locale),
		siteName: t.siteName,
		author: SITE_AUTHOR
	};
}

/** Metadata for the cross-year statistics page. */
export function statsMeta(
	stats: { yearCount: number } | undefined,
	fallbackImage: string | undefined
): PageMeta {
	const locale = META_LOCALE;
	const t = translations[locale];
	return {
		title: `${t.siteName} — ${t.acrossMetaTitle}`,
		description: t.acrossDescription(stats?.yearCount ?? 0),
		url: absoluteUrl('/stats'),
		...socialImage('stats', undefined, fallbackImage),
		...localeMeta(locale),
		siteName: t.siteName,
		author: SITE_AUTHOR
	};
}

/** Whether absolute URLs are available (needed for valid canonical/og:url tags). */
export const hasSiteUrl = SITE_URL !== '';
