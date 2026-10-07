/**
 * Hand-authored per-year data. Files in this folder are edited by Dan and are
 * never written by `import:rym` or `enrich:artwork`.
 */

export interface ManualAlbumOverride {
	/** Exact album page, e.g. https://open.spotify.com/album/… Empty = use the search fallback. */
	spotifyUrl?: string;
	/** Exact album page, e.g. https://music.apple.com/br/album/…/123. Empty = use the search fallback. */
	appleMusicUrl?: string;
}

/** Keyed by the album's stable slug (`artist-album`), the same id used for artwork files. */
export type ManualYearOverrides = Record<string, ManualAlbumOverride>;
