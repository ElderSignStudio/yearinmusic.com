/**
 * Deterministic, ASCII-only slugs for file names (`moron-police-pachinko`).
 * Accents are stripped; characters outside a–z/0–9 become hyphens.
 */
export function slugify(...parts: string[]): string {
	return parts
		.join(' ')
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[ßẞ]/g, 'ss')
		.replace(/[æÆ]/g, 'ae')
		.replace(/[øØ]/g, 'o')
		.replace(/[đĐ]/g, 'd')
		.replace(/[łŁ]/g, 'l')
		.toLowerCase()
		.replace(/&/g, ' and ')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/** The stable id for an album used by artwork files and manual overrides. */
export function albumSlug(artist: string, album: string): string {
	return slugify(artist, album);
}

/**
 * Canonical slug assignment for a year's albums: by rank, collisions resolved in rank order.
 * Importer, artwork enricher and manual overrides must all go through this function.
 */
export function assignAlbumSlugs<T extends { rank: number; artist: string; album: string }>(
	albums: readonly T[]
): Map<T, string> {
	const sorted = [...albums].sort((a, b) => a.rank - b.rank);
	const slugs = uniqueSlugs(sorted, (a) => albumSlug(a.artist, a.album) || `release-${a.rank}`);
	return new Map(sorted.map((album, i) => [album, slugs[i]]));
}

/**
 * Assigns a unique slug to every item in order. Colliding slugs get `-2`, `-3`, …
 * appended in input order, so the result is stable for a stable input order.
 */
export function uniqueSlugs<T>(items: readonly T[], toSlug: (item: T) => string): string[] {
	const used = new Map<string, number>();
	return items.map((item) => {
		const base = toSlug(item) || 'untitled';
		const count = used.get(base) ?? 0;
		used.set(base, count + 1);
		return count === 0 ? base : `${base}-${count + 1}`;
	});
}
