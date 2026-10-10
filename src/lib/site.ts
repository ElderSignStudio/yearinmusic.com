/**
 * Site-wide configuration.
 *
 * `SITE_URL` is the production origin (no trailing slash). It makes canonical
 * and Open Graph URLs/images absolute, which link previews (WhatsApp,
 * Twitter/X) require.
 */
export const SITE_URL: string = 'https://yearinmusic.com';

/** Who writes the lists. Shown as the hero byline and in the footer; available for metadata. */
export const SITE_AUTHOR = 'Dan Eisenberg';

/** Builds an absolute URL when the production origin is known, otherwise returns the path. */
export function absoluteUrl(path: string): string {
	return SITE_URL ? new URL(path, SITE_URL).href : path;
}
