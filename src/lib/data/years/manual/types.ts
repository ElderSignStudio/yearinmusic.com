/**
 * Hand-authored per-year data. Files in this folder are edited by Dan and are
 * never written by `import:rym` or `enrich:artwork`.
 */

export interface ManualAlbumOverride {
	/**
	 * Album title as it should be displayed, when RYM lists the entry under another
	 * name (e.g. a single's title). Cover files may also be named after it.
	 */
	album?: string;
	/** RateYourMusic album page, when the list entry links somewhere else (e.g. a single). */
	rymUrl?: string;
	/**
	 * Exact album page, e.g. https://open.spotify.com/album/… Empty = use the search fallback.
	 * `null` = the album is not on Spotify; no link is shown.
	 */
	spotifyUrl?: string | null;
	/**
	 * Exact album page, e.g. https://music.apple.com/br/album/…/123. Empty = use the search fallback.
	 * `null` = the album is not on Apple Music; no link is shown.
	 */
	appleMusicUrl?: string | null;
	/**
	 * Exact album page, e.g. https://artist.bandcamp.com/album/… There is no search fallback:
	 * the Bandcamp link is only shown when this is set.
	 */
	bandcampUrl?: string;
}

/** Keyed by the album's stable slug (`artist-album`), the same id used for artwork files. */
export type ManualYearOverrides = Record<string, ManualAlbumOverride>;
