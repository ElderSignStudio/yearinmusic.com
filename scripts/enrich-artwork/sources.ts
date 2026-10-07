/**
 * Finds the best available source image for an album, in order of preference:
 *   1. a hand-supplied file in imports/artwork/{year}/{slug}.(jpg|jpeg|png|webp)
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
}

const USER_AGENT = 'YearInMusic-artwork-enricher/1.0 (personal static site importer)';
const MANUAL_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

/** Resolves `relative` inside `base`, rejecting anything that escapes it. */
function resolveInside(base: string, relative: string): string | undefined {
	const resolved = path.resolve(base, relative);
	return resolved === base || resolved.startsWith(base + path.sep) ? resolved : undefined;
}

export async function findManualOverride(
	year: number,
	slug: string
): Promise<SourceImage | undefined> {
	const dir = path.join(importsDir, 'artwork', String(year));
	const entries = await readdir(dir).catch(() => [] as string[]);
	for (const ext of MANUAL_EXTENSIONS) {
		const name = `${slug}.${ext}`;
		if (!entries.includes(name)) continue;
		const file = path.join(dir, name);
		const info = await stat(file);
		return {
			kind: 'manual',
			label: path.relative(importsDir, file),
			data: await readFile(file),
			mtimeMs: info.mtimeMs
		};
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
