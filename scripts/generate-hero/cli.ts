/**
 * npm run generate:hero -- <year | all>
 *
 * Renders one atmospheric collage per year from every album's local artwork
 * (static/artwork/{year}/hero-collage.webp). Tiles are placed in a seeded,
 * non-ranking order with varied sizes and slight rotations, then blurred,
 * desaturated and darkened, and finished with a directional charcoal overlay
 * so the hero typography stays fully readable. Output is deterministic.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp, { type OverlayOptions } from 'sharp';
import { generatedDir, generatedPath, projectRoot, readGenerated } from '../lib/generated.ts';

const WIDTH = 1800;
const HEIGHT = 1000;
const BACKGROUND = '#131316';
const OUTPUT_NAME = 'hero-collage.webp';

/** Small deterministic PRNG (mulberry32) so the same year always yields the same collage. */
function seededRandom(seed: number): () => number {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function shuffle<T>(items: readonly T[], random: () => number): T[] {
	const out = [...items];
	for (let i = out.length - 1; i > 0; i--) {
		const j = Math.floor(random() * (i + 1));
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}

async function renderCollage(year: number, artworkPaths: string[]): Promise<string> {
	const random = seededRandom(year * 7919 + 17);
	const order = shuffle(artworkPaths, random);

	// Jittered grid that deliberately spills past every edge, so no clean rows survive.
	const columns = 6;
	const rows = Math.max(3, Math.ceil(order.length / columns));
	const cellW = WIDTH / (columns - 1);
	const cellH = HEIGHT / (rows - 1);

	const layers: OverlayOptions[] = [];
	for (const [index, artworkPath] of order.entries()) {
		const col = index % columns;
		const row = Math.floor(index / columns);
		const size = Math.round(360 + random() * 300);
		const angle = Math.round((random() - 0.5) * 28);
		const jitterX = (random() - 0.5) * cellW * 0.9;
		const jitterY = (random() - 0.5) * cellH * 0.9;
		const centerX = col * cellW + jitterX;
		const centerY = row * cellH + jitterY;

		const tile = await sharp(path.join(projectRoot, 'static', artworkPath))
			.resize(size, size, { fit: 'cover' })
			.rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
			.png()
			.toBuffer({ resolveWithObject: true });
		layers.push({
			input: tile.data,
			left: Math.round(centerX - tile.info.width / 2),
			top: Math.round(centerY - tile.info.height / 2)
		});
	}

	// Composite onto a double-size canvas so tiles may spill past every edge, then crop.
	// (Two passes: Sharp applies composite after extract within a single pipeline.)
	const oversized = await sharp({
		create: { width: WIDTH * 2, height: HEIGHT * 2, channels: 4, background: BACKGROUND }
	})
		.composite(layers.map((l) => ({ ...l, left: l.left! + WIDTH / 2, top: l.top! + HEIGHT / 2 })))
		.png()
		.toBuffer();
	const collage = await sharp(oversized)
		.extract({ left: WIDTH / 2, top: HEIGHT / 2, width: WIDTH, height: HEIGHT })
		.png()
		.toBuffer();

	// Directional charcoal overlay: heavy on the left where the year sits, fading right,
	// plus a bottom fade into the page background.
	const overlay = Buffer.from(`
		<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
			<defs>
				<linearGradient id="x" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stop-color="${BACKGROUND}" stop-opacity="0.62"/>
					<stop offset="0.5" stop-color="${BACKGROUND}" stop-opacity="0.4"/>
					<stop offset="1" stop-color="${BACKGROUND}" stop-opacity="0.2"/>
				</linearGradient>
				<linearGradient id="y" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stop-color="${BACKGROUND}" stop-opacity="0.15"/>
					<stop offset="0.6" stop-color="${BACKGROUND}" stop-opacity="0.1"/>
					<stop offset="1" stop-color="${BACKGROUND}" stop-opacity="0.95"/>
				</linearGradient>
			</defs>
			<rect width="100%" height="100%" fill="url(#x)"/>
			<rect width="100%" height="100%" fill="url(#y)"/>
		</svg>`);

	const outFile = path.join(projectRoot, 'static', 'artwork', String(year), OUTPUT_NAME);
	await sharp(collage)
		.blur(14)
		.modulate({ saturation: 0.6, brightness: 0.85 })
		.composite([{ input: overlay }])
		.webp({ quality: 68, effort: 5 })
		.toFile(outFile);
	return path.relative(projectRoot, outFile);
}

async function generateYear(file: string) {
	const data = await readGenerated(file);
	const artwork = data.albums.map((a) => a.artwork).filter((p): p is string => !!p);
	if (artwork.length === 0)
		throw new Error(`${data.year}: no local artwork yet — run enrich:artwork first.`);
	const out = await renderCollage(data.year, artwork);
	const size = (await readFile(path.join(projectRoot, out))).length;
	console.log(`${data.year}: ${artwork.length} covers → ${out} (${Math.round(size / 1024)} KB)`);
}

async function main() {
	const target = process.argv.slice(2).find((a) => !a.startsWith('--'));
	if (!target) throw new Error('Usage: npm run generate:hero -- <year | all>');
	const files =
		target === 'all'
			? (await readdir(generatedDir))
					.filter((f) => /^\d{4}\.json$/.test(f))
					.sort()
					.map((f) => path.join(generatedDir, f))
			: [generatedPath(Number(target))];
	for (const file of files) await generateYear(file);
}

main().catch((error: unknown) => {
	console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}`);
	process.exit(1);
});
