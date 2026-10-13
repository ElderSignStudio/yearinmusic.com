import type { Localized, YearTheme } from './year.js';

/**
 * A standalone editorial publication outside the annual rankings: a retrospective
 * playlist spanning several years, for example. It has no ranking or statistics.
 */
export interface SpecialEdition {
	/** URL segment and asset name, e.g. `2022-2026` → `/2022-2026`. */
	slug: string;
	/** First and last year covered, inclusive. */
	years: [first: number, last: number];
	theme: YearTheme;
	title: Localized;
	/** Short lead lines under the title, each its own sentence. */
	lede: Localized<string[]>;
	/** One sentence for search engines and social previews. */
	summary: Localized;
	/** One line for the callout on the final year's page. */
	callout: Localized;
	/** Optional note under the playlist. */
	note?: Localized;
	/** Square cover under `static/`, e.g. `/special/2022-2026.jpg`. */
	artwork: string;
	/** Clean playlist URL, without tracking parameters. */
	spotifyPlaylistUrl: string;
}
