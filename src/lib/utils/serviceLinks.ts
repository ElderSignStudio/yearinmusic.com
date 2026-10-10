/**
 * Resolves an album's streaming links: an exact, hand-supplied URL wins; otherwise
 * the generated search-fallback URL is used. Spotify and Apple Music resolve
 * independently; a manual `null` hides a service the album is not on. Bandcamp has
 * no fallback and is only present when supplied by hand. Manual data never mutates
 * the imported data.
 */
import type { ManualAlbumOverride } from '#lib/data/years/manual/types.js';

export type LinkStatus = 'exact' | 'search-fallback';

export interface ResolvedLink {
	url: string;
	status: LinkStatus;
}

export interface ResolvedServiceLinks {
	spotify?: ResolvedLink;
	appleMusic?: ResolvedLink;
	bandcamp?: ResolvedLink;
}

export interface ServiceLinkSources {
	spotifyUrl?: string;
	appleMusicUrl?: string;
}

function parseHttpsUrl(value: string): URL | undefined {
	try {
		const url = new URL(value);
		return url.protocol === 'https:' ? url : undefined;
	} catch {
		return undefined;
	}
}

/** `https://open.spotify.com/album/<id>` (query strings such as `?si=` are tolerated). */
export function isValidSpotifyAlbumUrl(value: string): boolean {
	const url = parseHttpsUrl(value);
	return (
		!!url && url.hostname === 'open.spotify.com' && /^\/album\/[A-Za-z0-9]+\/?$/.test(url.pathname)
	);
}

/**
 * `https://music.apple.com/<region>/album/<name>/<id>`; the region segment is optional.
 * The `geo.music.apple.com` redirector is rejected on purpose: it is a legacy iTunes Store
 * service that, for albums without a store listing, bounces to an iTunes artist search
 * instead of opening the album in Apple Music. Plain `music.apple.com` links open the
 * album in the Music app regardless of the storefront in the URL.
 */
export function isValidAppleMusicAlbumUrl(value: string): boolean {
	const url = parseHttpsUrl(value);
	return (
		!!url &&
		url.hostname === 'music.apple.com' &&
		/^(\/[a-z]{2})?\/album\/[^/]+(\/\d+)?\/?$/i.test(url.pathname)
	);
}

/** `https://<artist>.bandcamp.com/album/<slug>`. */
export function isValidBandcampAlbumUrl(value: string): boolean {
	const url = parseHttpsUrl(value);
	return (
		!!url &&
		/^[a-z0-9-]+\.bandcamp\.com$/i.test(url.hostname) &&
		/^\/album\/[^/]+\/?$/.test(url.pathname)
	);
}

function resolveOne(
	manual: string | null | undefined,
	fallback: string | undefined,
	isValid: (url: string) => boolean
): ResolvedLink | undefined {
	if (manual === null) return undefined;
	const exact = manual?.trim();
	if (exact && isValid(exact)) return { url: exact, status: 'exact' };
	return fallback ? { url: fallback, status: 'search-fallback' } : undefined;
}

export function resolveServiceLinks(
	generated: ServiceLinkSources,
	manual?: ManualAlbumOverride
): ResolvedServiceLinks {
	return {
		spotify: resolveOne(manual?.spotifyUrl, generated.spotifyUrl, isValidSpotifyAlbumUrl),
		appleMusic: resolveOne(
			manual?.appleMusicUrl,
			generated.appleMusicUrl,
			isValidAppleMusicAlbumUrl
		),
		bandcamp: resolveOne(manual?.bandcampUrl, undefined, isValidBandcampAlbumUrl)
	};
}

/** Non-empty manual URLs that are not recognizable album links. Empty values are fine. */
export function invalidManualUrls(manual: ManualAlbumOverride): string[] {
	const problems: string[] = [];
	const spotify = manual.spotifyUrl?.trim();
	const apple = manual.appleMusicUrl?.trim();
	if (spotify && !isValidSpotifyAlbumUrl(spotify))
		problems.push(`spotifyUrl is not an open.spotify.com/album link: ${spotify}`);
	if (apple && !isValidAppleMusicAlbumUrl(apple))
		problems.push(`appleMusicUrl is not a music.apple.com album link: ${apple}`);
	const bandcamp = manual.bandcampUrl?.trim();
	if (bandcamp && !isValidBandcampAlbumUrl(bandcamp))
		problems.push(`bandcampUrl is not a bandcamp.com album link: ${bandcamp}`);
	const rym = manual.rymUrl?.trim();
	if (rym && !/^https:\/\/rateyourmusic\.com\/release\/[^/]+\/[^/]+\/[^/]+\/?$/.test(rym))
		problems.push(`rymUrl is not a rateyourmusic.com release link: ${rym}`);
	return problems;
}
