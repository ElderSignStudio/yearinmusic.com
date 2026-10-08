/**
 * Site-wide configuration.
 *
 * TODO: set `SITE_URL` to the production origin once the domain is chosen,
 * e.g. 'https://example.com' (no trailing slash). Until then, canonical and
 * Open Graph URLs/images are emitted as paths, which link previews (WhatsApp,
 * Twitter/X) cannot resolve — absolute URLs require the real domain.
 */
export const SITE_URL = '';

/** Who writes the lists. Shown as the hero byline and in the footer; available for metadata. */
export const SITE_AUTHOR = 'Dan Eisenberg';

/** Builds an absolute URL when the production origin is known, otherwise returns the path. */
export function absoluteUrl(path: string): string {
	return SITE_URL ? new URL(path, SITE_URL).href : path;
}
