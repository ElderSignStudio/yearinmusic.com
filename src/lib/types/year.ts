export type Locale = 'pt' | 'en';

/** A piece of editorial text that exists in both languages. */
export type Localized<T = string> = Record<Locale, T>;

/** Visual identity that a single year contributes to the shared design system. */
export interface YearTheme {
	/** Any CSS color. Used for rank numerals, kickers, bars and focus rings on that year's page. */
	accent: string;
}

export interface Album {
	rank: number;
	artist: string;
	album: string;
	/** Local path under `static/`, e.g. `/artwork/2024/01.webp`. */
	artwork: string;
	/** RateYourMusic primary genres, untranslated. */
	primaryGenres: string[];
	spotifyUrl?: string;
	appleMusicUrl?: string;
	rymUrl: string;
}

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
	spotifyPlaylistUrl: string;
	/** Must be sorted by rank ascending. */
	albums: Album[];
}
