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
