/**
 * Finds the best available source image for an album, in order of preference:
 *   1. a hand-supplied file in imports/artwork/{year}/ named after the album slug
 *      (`moron-police-pachinko.jpg`) or, when unambiguous within the year, after the
 *      album title or the artist in any casing (`Pachinko.jpeg`, `Moron Police.jpeg`).
 *      Names are compared Unicode-aware, so non-Latin titles work, and a title's
 *      bracketed suffixes (`Dreamkiller [neon violet vinyl]`, `αριθμός τέσσερα [Number
 *      Four]`) are optional in the file name. A title that contains a dot may be saved
 *      without an extension (`ID.Entity`); such files are accepted when their bytes are
 *      a JPEG, PNG or WebP image. A file left over after exact matching may still be
 *      paired with an album by a near-identical name (see `approximateMatches`).
 *   2. the CDN reference captured from the saved page (fetched as-is)
 *   3. the thumbnail the browser saved into the page's *_files folder
 *
 * The Sonemic CDN path is /i/{size}/w/{hash}/{id}; the hash is specific to that
 * rendition, so other sizes cannot be derived from a 150px reference.
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { importsDir } from '../lib/generated.ts';

export type SourceKind = 'manual' | 'cdn' | 'local-saved';

export interface SourceImage {
	kind: SourceKind;
	/** Human-readable origin for the report (relative path or URL). */
	label: string;
	data: Buffer;
	/** Modification time of file sources, used to detect changed overrides. */
	mtimeMs?: number;
	/** True when a manual file was matched by a near-identical name; reported for review. */
	approximate?: boolean;
}

const USER_AGENT = 'YearInMusic-artwork-enricher/1.0 (personal static site importer)';
const MANUAL_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

/** Names the file could be matched under: its stem, or the whole name when the "extension" is not an image one. */
function manualNameCandidates(name: string): string[] {
	const m = /^(.+)\.([a-z0-9]+)$/i.exec(name);
	if (m && MANUAL_EXTENSIONS.includes(m[2].toLowerCase())) return [m[1]];
	return [name];
}

/** Magic-byte check so an extension-less match is only used when it really is an image. */
function looksLikeImage(data: Buffer): boolean {
	const jpeg = data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
	const png = data
		.subarray(0, 8)
		.equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
	const webp =
		data.subarray(0, 4).toString('ascii') === 'RIFF' &&
		data.subarray(8, 12).toString('ascii') === 'WEBP';
	return jpeg || png || webp;
}

/** Resolves `relative` inside `base`, rejecting anything that escapes it. */
function resolveInside(base: string, relative: string): string | undefined {
	const resolved = path.resolve(base, relative);
	return resolved === base || resolved.startsWith(base + path.sep) ? resolved : undefined;
}

/**
 * Unicode-aware comparison key for file stems and titles: case, accents and
 * punctuation are ignored, letters of any script are kept (`αριθμός τέσσερα` → `αριθμος-τεσσερα`).
 */
export function nameKey(text: string): string {
	return text
		.normalize('NFKD')
		.replace(/\p{M}+/gu, '')
		.toLowerCase()
		.replace(/&/g, ' and ')
		.replace(/[^\p{L}\p{N}]+/gu, '-')
		.replace(/^-+|-+$/g, '');
}

/**
 * Names a cover file may carry for a title: the title itself, the title without its
 * bracketed suffixes, and each bracketed part on its own (RYM's Latin transliterations).
 */
export function titleVariants(title: string): string[] {
	const variants = [title];
	const stripped = title.replace(/\s*[[(][^\]()]*[\])]\s*$/g, '').trim();
	if (stripped && stripped !== title) variants.push(stripped);
	for (const m of title.matchAll(/[[(]([^\]()]+)[\])]/g)) variants.push(m[1].trim());
	return variants;
}

/**
 * Names a cover file may carry for an artist: the credit as imported and RYM's URL name
 * for the release's artist, which spells out collaborations the import shortens to their
 * first name (`fabiano-do-nascimento-and-vittor-santos-orchestra`).
 */
export function artistVariants(artist: string, rymUrl: string | undefined): string[] {
	const variants = [artist];
	const segment = rymUrl ? /\/release\/[^/]+\/([^/]+)\//.exec(rymUrl)?.[1] : undefined;
	if (segment) variants.push(segment);
	return variants;
}

export interface OverrideLookup {
	year: number;
	slug: string;
	/** `nameKey`s a file may be named by: the slug plus title and artist variants unique within the year. */
	keys: readonly string[];
	/** A file name accepted by `approximateMatches` although no key matches it exactly. */
	approximateFile?: string;
}

const manualDir = (year: number) => path.join(importsDir, 'artwork', String(year));

export async function findManualOverride(lookup: OverrideLookup): Promise<SourceImage | undefined> {
	const dir = manualDir(lookup.year);
	const entries = await readdir(dir).catch(() => [] as string[]);
	const accepted = new Set([lookup.slug, ...lookup.keys].filter(Boolean));
	for (const name of entries.sort()) {
		const approximate = name === lookup.approximateFile;
		if (!approximate && !manualNameCandidates(name).some((stem) => accepted.has(nameKey(stem))))
			continue;
		const file = path.join(dir, name);
		const info = await stat(file);
		if (!info.isFile()) continue;
		const data = await readFile(file);
		if (!looksLikeImage(data)) continue;
		const label = path.relative(importsDir, file);
		return { kind: 'manual', label, data, mtimeMs: info.mtimeMs, approximate };
	}
	return undefined;
}

/** Levenshtein distance between two short strings. */
function editDistance(a: string, b: string): number {
	let previous = Array.from({ length: b.length + 1 }, (_, j) => j);
	for (let i = 1; i <= a.length; i++) {
		const current = [i];
		for (let j = 1; j <= b.length; j++) {
			const substitution = previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1);
			current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, substitution);
		}
		previous = current;
	}
	return previous[b.length];
}

/** Typos a file name may contain and still be paired with an album. */
const MAX_TYPOS = 2;
/** Names shorter than this are too generic to match approximately. */
const MIN_APPROXIMATE_LENGTH = 6;

/**
 * Pairs cover files that match no album exactly with albums that found no file, when
 * the file name is within a couple of typos of one of the album's names
 * (`doid bishop.jpg` → Droid Bishop). A pair is only made when the file is close to
 * exactly one such album and that album to exactly one such file. Keyed by slug.
 */
export async function approximateMatches(
	year: number,
	lookups: readonly OverrideLookup[]
): Promise<Map<string, string>> {
	const entries = await readdir(manualDir(year)).catch(() => [] as string[]);
	const files = entries
		.filter((name) => !name.startsWith('.'))
		.map((name) => ({ name, keys: manualNameCandidates(name).map(nameKey) }));
	const namesOf = (lookup: OverrideLookup) => [lookup.slug, ...lookup.keys];
	const exact = (lookup: OverrideLookup, file: (typeof files)[number]) =>
		file.keys.some((key) => namesOf(lookup).includes(key));
	const close = (lookup: OverrideLookup, file: (typeof files)[number]) =>
		file.keys.some((fileKey) =>
			namesOf(lookup).some(
				(key) => key.length >= MIN_APPROXIMATE_LENGTH && editDistance(fileKey, key) <= MAX_TYPOS
			)
		);

	const leftoverFiles = files.filter((file) => !lookups.some((lookup) => exact(lookup, file)));
	const unmatched = lookups.filter((lookup) => !files.some((file) => exact(lookup, file)));
	const matches = new Map<string, string>();
	for (const lookup of unmatched) {
		const candidates = leftoverFiles.filter((file) => close(lookup, file));
		if (candidates.length !== 1) continue;
		if (unmatched.filter((other) => close(other, candidates[0])).length !== 1) continue;
		matches.set(lookup.slug, candidates[0].name);
	}
	return matches;
}

export function isCdnReference(source: string): boolean {
	return /^(https?:)?\/\//.test(source);
}

export function isLocalSavedReference(source: string): boolean {
	return source.startsWith('./') || source.startsWith('../') || !source.includes('://');
}

export async function readLocalSaved(source: string): Promise<SourceImage | undefined> {
	const file = resolveInside(path.join(importsDir, 'rym'), source);
	if (!file) return undefined;
	const info = await stat(file).catch(() => undefined);
	if (!info?.isFile()) return undefined;
	return { kind: 'local-saved', label: source, data: await readFile(file), mtimeMs: info.mtimeMs };
}

export async function fetchCdn(source: string): Promise<SourceImage | undefined> {
	const url = source.startsWith('//') ? `https:${source}` : source;
	const response = await fetch(url, {
		headers: { 'User-Agent': USER_AGENT, Accept: 'image/*' },
		redirect: 'follow',
		signal: AbortSignal.timeout(20_000)
	});
	if (!response.ok) return undefined;
	if (!(response.headers.get('content-type') ?? '').startsWith('image/')) return undefined;
	return { kind: 'cdn', label: url, data: Buffer.from(await response.arrayBuffer()) };
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
