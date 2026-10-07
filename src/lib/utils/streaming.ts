/**
 * Streaming-service search links. These are fallbacks used until an exact
 * album URL is known; keep all search-URL construction here.
 */

/** Uses the bracketed Latin/alternate name when RYM shows one, e.g. "青葉市子 [Ichiko Aoba]". */
export function artistForSearch(artist: string): string {
	return /\[([^\]]+)\]/.exec(artist)?.[1]?.trim() || artist.trim();
}

export function streamingSearchQuery(artist: string, album: string): string {
	return `${artistForSearch(artist)} ${album}`.replace(/\s+/g, ' ').trim();
}

export function spotifySearchUrl(artist: string, album: string): string {
	return `https://open.spotify.com/search/${encodeURIComponent(streamingSearchQuery(artist, album))}`;
}

export function appleMusicSearchUrl(artist: string, album: string): string {
	return `https://music.apple.com/search?term=${encodeURIComponent(streamingSearchQuery(artist, album))}`;
}
