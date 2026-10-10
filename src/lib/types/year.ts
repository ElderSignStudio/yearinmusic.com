/** Brazilian Portuguese (default) and English. */
export type Locale = 'pt-BR' | 'en';

/** A piece of editorial text that exists in both languages. */
export type Localized<T = string> = Record<Locale, T>;

/** Visual identity that a single year contributes to the shared design system. */
export interface YearTheme {
	/** Any CSS color. Used for rank numerals, kickers, bars and focus rings on that year's page. */
	accent: string;
}

/** Everything an album entry shows regardless of whether it carries a rank. */
export interface AlbumEntry {
	artist: string;
	album: string;
	/** Local path under `static/`, e.g. `/artwork/2024/01.webp`. */
	artwork: string;
	/** RateYourMusic primary genres, untranslated. */
	primaryGenres: string[];
	spotifyUrl?: string;
	appleMusicUrl?: string;
	/** Only present when an exact Bandcamp page was supplied by hand. */
	bandcampUrl?: string;
	rymUrl: string;
}

/** A ranked list entry: `rank` is 1-based and contiguous within a year. */
export interface Album extends AlbumEntry {
	rank: number;
}

/** An unranked extra selection shown after the Top N. Never displays a number. */
export type BonusAlbum = AlbumEntry;

export interface RatingBucket {
	/** RateYourMusic star rating, 0–5 in half steps. */
	rating: number;
	label: Localized;
	count: number;
}

export interface YearData {
	year: number;
	theme: YearTheme;
	/** Paragraphs, per language. */
	intro: Localized<string[]>;
	totalAlbumsRated: number;
	/**
	 * Fallback for the year-over-year comparison when the previous year has not
	 * been imported yet. When it has, its own `totalAlbumsRated` takes precedence.
	 */
	previousYearAlbumsRated?: number;
	ratingDistribution: RatingBucket[];
	rymListUrl: string;
	/** Absent when the year has no playlist yet; the playlist section is then not rendered. */
	spotifyPlaylistUrl?: string;
	/**
	 * Optional 1200×630 social preview image (local path under `static/`).
	 * Falls back to the #1 artwork when omitted.
	 */
	shareImage?: string;
	/**
	 * Optional pre-rendered collage of the year's artwork for the hero background
	 * (`npm run generate:hero`). Without it the hero uses a wash of the #1 artwork.
	 */
	heroCollage?: string;
	/** The Top N, sorted by rank ascending (1..N, no gaps). */
	rankedAlbums: Album[];
	/** Unranked bonus selections rendered after the ranking. Empty for most years. */
	bonusAlbums: BonusAlbum[];
}
