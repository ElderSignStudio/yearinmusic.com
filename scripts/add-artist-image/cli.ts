/**
 * npm run add:artist-image -- <slug> <image file or URL> [--position=<gravity>]
 *
 * Normalises an official artist profile image into static/artists/<slug>.webp, the
 * 512×512 WebP that src/lib/data/artistImages.ts points at. `<slug>` is `artistSlug()`
 * of the credit as written in the rankings (`bon-iver`, `a-c-t`). A non-square source is
 * cropped to a square from its centre; pass `--position=top` (or any Sharp gravity) when a
 * group's faces sit away from the centre. Remember to add the slug to artistImages.ts.
 */
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { projectRoot } from '../lib/generated.ts';
import { artistSlug } from '../../src/lib/utils/slug.ts';

const OUTPUT_DIR = path.join(projectRoot, 'static', 'artists');
/** Must match ARTIST_IMAGE_SIZE in src/lib/data/artistImages.ts. */
const SIZE = 512;

async function loadSource(source: string): Promise<Buffer> {
	if (/^https?:\/\//.test(source)) {
		const response = await fetch(source);
		if (!response.ok) throw new Error(`${source}: HTTP ${response.status}`);
		return Buffer.from(await response.arrayBuffer());
	}
	return readFile(path.resolve(source));
}

async function main() {
	const args = process.argv.slice(2);
	const position = args.find((a) => a.startsWith('--position='))?.slice('--position='.length);
	const [slug, source] = args.filter((a) => !a.startsWith('--'));
	if (!slug || !source || slug !== artistSlug(slug)) {
		throw new Error(
			'Usage: npm run add:artist-image -- <slug> <image file or URL> [--position=<gravity>]'
		);
	}

	await mkdir(OUTPUT_DIR, { recursive: true });
	const outFile = path.join(OUTPUT_DIR, `${slug}.webp`);
	const info = await sharp(await loadSource(source))
		.rotate()
		.resize(SIZE, SIZE, { fit: 'cover', position: position ?? 'centre' })
		.webp({ quality: 84, effort: 6 })
		.toFile(outFile);
	console.log(
		`${slug} → ${path.relative(projectRoot, outFile)} (${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB)`
	);
}

main().catch((error: unknown) => {
	console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}`);
	process.exit(1);
});
