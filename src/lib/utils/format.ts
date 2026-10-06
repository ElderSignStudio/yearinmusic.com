import type { Locale } from '#lib/types/year.js';

/** `1` → `01`, `20` → `20`. Leading-zero ranks are part of the visual identity. */
export function formatRank(rank: number): string {
	return String(rank).padStart(2, '0');
}

/** `+64`, `−12`, `±0` */
export function formatDelta(delta: number, locale: Locale): string {
	if (delta === 0) return '±0';
	return new Intl.NumberFormat(locale, {
		signDisplay: 'always'
	}).format(delta);
}

export function formatPercent(value: number, locale: Locale): string {
	return new Intl.NumberFormat(locale, {
		style: 'percent',
		minimumFractionDigits: 1,
		maximumFractionDigits: 1
	}).format(value);
}

/** Extracts the playlist ID from any open.spotify.com playlist URL. */
export function spotifyPlaylistId(url: string): string | undefined {
	return /playlist\/([A-Za-z0-9]+)/.exec(url)?.[1];
}
