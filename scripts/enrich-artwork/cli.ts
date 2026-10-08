/**
 * npm run enrich:artwork -- <year | path/to/generated.json | all> [--force]
 *
 * Resolves each imported album's artwork to a local, normalized WebP under
 * static/artwork/{year}/{artist-album}.webp and records the public path in the
 * generated JSON. Re-running reuses valid existing files unless --force is given
 * or a newer manual override appears in imports/artwork/{year}/.
 */
import { mkdir, readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import type { ImportedAlbum, ImportedYearData } from '../../src/lib/types/imported.ts';
import { assignAlbumSlugs } from '../../src/lib/utils/slug.ts';
import {
	generatedDir,
	generatedPath,
	projectRoot,
	readGenerated,
	writeGenerated
} from '../lib/generated.ts';
import {
	HIGH_RES_EDGE,
	MIN_EDGE,
	inspect,
	isSquare,
	normalizeToWebp,
	type ImageInfo
} from './image.ts';
import { formatReport, type AlbumResult } from './report.ts';
import {
	fetchCdn,
	findManualOverride,
	isCdnReference,
	nameKey,
	type OverrideLookup,
	readLocalSaved,
	sleep,
	type SourceImage,
	titleVariants
} from './sources.ts';

const REQUEST_PAUSE_MS = 400;

function parseArgs(argv: string[]) {
	const force = argv.includes('--force');
	const target = argv.find((a) => !a.startsWith('--'));
	return { force, target };
}

async function resolveTargets(target: string | undefined): Promise<string[]> {
	if (!target)
		throw new Error('Usage: npm run enrich:artwork -- <year | generated.json | all> [--force]');
	if (target === 'all') {
		const entries = await readdir(generatedDir).catch(() => [] as string[]);
		return entries
			.filter((f) => /^\d{4}\.json$/.test(f))
			.sort()
			.map((f) => path.join(generatedDir, f));
	}
	if (/^\d{4}$/.test(target)) return [generatedPath(Number(target))];
	const file = path.resolve(target);
	if (!/\.json$/i.test(file))
		throw new Error(`Unsupported target (expected a year, a .json file or "all"): ${target}`);
	return [file];
}

async function existingOutputIsValid(file: string): Promise<ImageInfo | undefined> {
	const info = await stat(file).catch(() => undefined);
	if (!info?.isFile()) return undefined;
	const image = await inspect(await readFile(file));
	return image && image.format === 'webp' && image.width >= MIN_EDGE ? image : undefined;
}

async function pickSource(
	album: ImportedAlbum,
	lookup: OverrideLookup
): Promise<SourceImage | undefined> {
	const manual = await findManualOverride(lookup);
	if (manual) return manual;
	const ref = album.artworkSource;
	if (!ref) return undefined;
	if (isCdnReference(ref)) {
		await sleep(REQUEST_PAUSE_MS);
		const cdn = await fetchCdn(ref).catch(() => undefined);
		if (cdn) return cdn;
		return undefined;
	}
	return readLocalSaved(ref);
}

async function enrichYear(file: string, force: boolean): Promise<boolean> {
	const data: ImportedYearData = await readGenerated(file);
	const year = data.year;
	const outputDir = path.join(projectRoot, 'static', 'artwork', String(year));
	await mkdir(outputDir, { recursive: true });

	const albums = [...data.albums].sort((a, b) => a.rank - b.rank);
	// Older generated files may predate the slug field; derive it the canonical way then.
	const canonical = assignAlbumSlugs(albums);
	const slugs = albums.map((a) => a.slug || canonical.get(a) || `release-${a.rank}`);
	const results: AlbumResult[] = [];

	// A title variant may only name a file when no other album in the year could claim it.
	const keyCounts = new Map<string, number>();
	for (const a of albums) {
		for (const key of new Set(titleVariants(a.album).map(nameKey))) {
			keyCounts.set(key, (keyCounts.get(key) ?? 0) + 1);
		}
	}

	for (const [index, album] of albums.entries()) {
		const slug = slugs[index];
		const lookup: OverrideLookup = {
			year,
			slug,
			keys: [...new Set(titleVariants(album.album).map(nameKey))].filter(
				(key) => key && keyCounts.get(key) === 1
			)
		};
		const outFile = path.join(outputDir, `${slug}.webp`);
		const publicPath = `/artwork/${year}/${slug}.webp`;
		const result: AlbumResult = {
			rank: album.rank,
			artist: album.artist,
			album: album.album,
			slug,
			status: 'failed',
			warnings: []
		};
		results.push(result);

		try {
			// Reuse a valid existing file unless forced or a newer manual override exists.
			const existing = force ? undefined : await existingOutputIsValid(outFile);
			const manual = await findManualOverride(lookup);
			const existingStat = existing ? await stat(outFile) : undefined;
			const overrideIsNewer = !!(
				manual &&
				existingStat &&
				(manual.mtimeMs ?? 0) > existingStat.mtimeMs
			);
			if (existing && album.artwork === publicPath && !overrideIsNewer) {
				result.status = 'cached';
				result.output = existing;
				result.sourceKind = manual
					? 'manual'
					: album.artworkSource && isCdnReference(album.artworkSource)
						? 'cdn'
						: 'local-saved';
				result.source = existing;
				if (existing.width < HIGH_RES_EDGE)
					result.warnings.push(
						`source only ${existing.width}×${existing.height} (existing file reused)`
					);
				continue;
			}

			const source = await pickSource(album, lookup);
			if (!source)
				throw new Error(
					album.artworkSource
						? `could not read artwork source (${album.artworkSource})`
						: 'no artwork reference in import'
				);
			const info = await inspect(source.data);
			if (!info) throw new Error(`source is not a recognizable image (${source.label})`);
			if (Math.max(info.width, info.height) < MIN_EDGE)
				throw new Error(
					`source is suspiciously tiny: ${info.width}×${info.height} (${source.label})`
				);

			result.sourceKind = source.kind;
			result.sourceLabel = source.label;
			result.source = info;
			if (!isSquare(info))
				result.warnings.push(
					`source image not square (${info.width}×${info.height}); stored without cropping`
				);
			if (Math.min(info.width, info.height) < HIGH_RES_EDGE)
				result.warnings.push(`source only ${info.width}×${info.height}`);

			result.output = await normalizeToWebp(source.data, outFile);
			const check = await existingOutputIsValid(outFile);
			if (!check) throw new Error('output WebP could not be verified after writing');
			album.artwork = publicPath;
			result.status = 'written';
		} catch (error) {
			result.error = error instanceof Error ? error.message : String(error);
			delete album.artwork;
		}
	}

	// Keep the generated file deterministic: albums sorted by rank, property order preserved.
	data.albums = albums;
	const jsonPath = await writeGenerated(data);
	console.log(
		formatReport(
			year,
			results,
			path.relative(projectRoot, outputDir) + '/',
			jsonPath,
			HIGH_RES_EDGE
		)
	);
	return results.every((r) => r.status !== 'failed');
}

async function main() {
	const { force, target } = parseArgs(process.argv.slice(2));
	const files = await resolveTargets(target);
	if (files.length === 0) throw new Error('No generated year files found.');
	let ok = true;
	for (const file of files) ok = (await enrichYear(file, force)) && ok;
	process.exit(ok ? 0 : 1);
}

main().catch((error: unknown) => {
	console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}`);
	process.exit(1);
});
