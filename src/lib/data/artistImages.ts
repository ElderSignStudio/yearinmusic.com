/**
 * Profile images for the artists in "Repeat appearances" on /stats.
 *
 * Keyed by `artistSlug()` of the artist credit as written in the rankings, so the same
 * artist resolves here however the credit is cased or spaced. Artists without an entry
 * simply render without an image.
 *
 * To add an artist: save their official profile image (Spotify artist page preferred,
 * Apple Music otherwise) with `npm run add:artist-image -- <slug> <file-or-url>`, which
 * writes static/artists/<slug>.webp at 512×512, then add the slug here.
 */
import { artistSlug } from '#lib/utils/slug.js';

const artistImages: Record<string, string> = {
	'a-c-t': '/artists/a-c-t.webp',
	'adrianne-lenker': '/artists/adrianne-lenker.webp',
	amorphis: '/artists/amorphis.webp',
	'arch-echo': '/artists/arch-echo.webp',
	'bon-iver': '/artists/bon-iver.webp',
	'carly-rae-jepsen': '/artists/carly-rae-jepsen.webp',
	'devin-townsend': '/artists/devin-townsend.webp',
	ghost: '/artists/ghost.webp',
	haken: '/artists/haken.webp',
	leprous: '/artists/leprous.webp',
	'seventh-wonder': '/artists/seventh-wonder.webp',
	'steven-wilson': '/artists/steven-wilson.webp'
};

/** Intrinsic size of every file in static/artists. */
export const ARTIST_IMAGE_SIZE = 512;

/** Site-relative path of the artist's profile image, or undefined when there is none. */
export function artistImage(artist: string): string | undefined {
	return artistImages[artistSlug(artist)];
}
