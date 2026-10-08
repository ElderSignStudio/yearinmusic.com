/**
 * Finds the best available source image for an album, in order of preference:
 *   1. a hand-supplied file in imports/artwork/{year}/ named after the album slug
 *      (`moron-police-pachinko.jpg`) or, when unambiguous within the year, after the
 *      album title in any casing (`Pachinko.jpeg`). A title that contains a dot may be
 *      saved without an extension (`ID.Entity`); such files are accepted when their
 *      bytes are a JPEG, PNG or WebP image.
 *   2. the CDN reference captured from the saved page (fetched as-is)
 *   3. the thumbnail the browser saved into the page's *_files folder
 *
 * The Sonemic CDN path is /i/{size}/w/{hash}/{id}; the hash is specific to that
 * rendition, so other sizes cannot be derived from a 150px reference.
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { slugify } from '../../src/lib/utils/slug.ts';
import { importsDir } from '../lib/generated.ts';

export type SourceKind = 'manual' | 'cdn' | 'local-saved';

export interface SourceImage {
	kind: SourceKind;
	/** Human-readable origin for the report (relative path or URL). */
	label: string;
	data: Buffer;
	/** Modification time of file sources, used to detect changed overrides. */
	mtimeMs?: number;
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

export interface OverrideLookup {
	year: number;
	slug: string;
	/** Album title, accepted as a filename when no other album in the year shares it. */
	title: string;
	titleIsUnique: boolean;
}

export async function findManualOverride(lookup: OverrideLookup): Promise<SourceImage | undefined> {
	const dir = path.join(importsDir, 'artwork', String(lookup.year));
	const entries = await readdir(dir).catch(() => [] as string[]);
	const accepted = new Set([lookup.slug]);
	if (lookup.titleIsUnique) accepted.add(slugify(lookup.title));
	for (const name of entries.sort()) {
		if (!manualNameCandidates(name).some((stem) => accepted.has(slugify(stem)))) continue;
		const file = path.join(dir, name);
		const info = await stat(file);
		if (!info.isFile()) continue;
		const data = await readFile(file);
		if (!looksLikeImage(data)) continue;
		return { kind: 'manual', label: path.relative(importsDir, file), data, mtimeMs: info.mtimeMs };
	}
	return undefined;
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
