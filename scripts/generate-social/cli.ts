/**
 * npm run generate:social [-- <year>]
 *
 * Renders the social-preview cards and records which exist in
 * src/lib/data/socialCards.json, so page metadata only ever points at a card that
 * was actually generated:
 *   static/social/{year}-square.jpg  1200×1200 og:image — WhatsApp shows it as a ~95px
 *                                    thumbnail, so it carries nothing but the year
 *   static/social/{year}.jpg         1200×630 twitter:image / large previews
 *   static/social/stats(-square).jpg the same pair for /stats
 *
 * Every value on a card (year, Top N, albums rated, accent, year range, totals, copy)
 * comes from the same production data the site renders, loaded through Vite so the
 * data modules need no Node-specific import style. Nothing on a yearly card reveals
 * the ranking: the background is the year's shuffled hero collage, blurred and
 * darkened further so no cover is identifiable.
 *
 * Text is set in the site's typefaces. Sharp renders SVG text through Pango, which
 * on macOS defaults to CoreText and ignores fontconfig, so the variable TTFs in
 * ./fonts are registered through a generated fontconfig file and Pango is switched
 * to its fontconfig backend before Sharp loads. Output is deterministic.
 */
import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { OverlayOptions } from 'sharp';
import prettier from 'prettier';
import type { YearData } from '../../src/lib/types/year.ts';
import type { AcrossYearsStatistics } from '../../src/lib/data/years/acrossYears.ts';
import { projectRoot } from '../lib/generated.ts';

const WIDTH = 1200;
const HEIGHT = 630;
const SQUARE = 1200;
/** Keeps every line clear of the edges that social clients crop or round off. */
const MARGIN = 80;
const OUTPUT_DIR = path.join(projectRoot, 'static', 'social');
const MANIFEST = path.join(projectRoot, 'src', 'lib', 'data', 'socialCards.json');
const FONTS_DIR = path.join(projectRoot, 'scripts', 'generate-social', 'fonts');
const CACHE_DIR = path.join(projectRoot, 'node_modules', '.cache', 'generate-social');

/** Mirrors the design tokens in src/routes/layout.css. */
const TOKENS = {
	bg: '#131316',
	ink: '#ebe8e1',
	inkMuted: '#8f8d87',
	/** The neutral site accent, used where no year accent applies (the stats card). */
	accent: '#c9c3b6',
	display: 'Newsreader',
	body: 'Inter'
};

interface SiteCopy {
	siteName: string;
	heroTitle: string;
	acrossTitle: string;
	yearsLabel: string;
	albumsRated: string;
	topN: (n: number) => string;
	author: string;
}

// ---------------------------------------------------------------------------
// Fonts

function xmlEscape(text: string): string {
	return text
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

/** Points Sharp's text stack at ./fonts. Must run before Sharp is imported. */
async function configureFonts(): Promise<void> {
	await mkdir(CACHE_DIR, { recursive: true });
	const config = path.join(CACHE_DIR, 'fonts.conf');
	await writeFile(
		config,
		[
			'<?xml version="1.0"?>',
			'<!DOCTYPE fontconfig SYSTEM "fonts.dtd">',
			'<fontconfig>',
			`\t<dir>${xmlEscape(FONTS_DIR)}</dir>`,
			`\t<cachedir>${xmlEscape(path.join(CACHE_DIR, 'fontconfig'))}</cachedir>`,
			'</fontconfig>',
			''
		].join('\n'),
		'utf8'
	);
	process.env.FONTCONFIG_FILE = config;
	process.env.PANGOCAIRO_BACKEND = 'fontconfig';
}

// ---------------------------------------------------------------------------
// Production data

interface ProductionData {
	years: readonly YearData[];
	stats: AcrossYearsStatistics;
	copy: SiteCopy;
}

/** Loads the published years and site copy exactly as the site sees them. */
async function loadProductionData(): Promise<ProductionData> {
	const { createServer, createServerModuleRunner } = await import('vite');
	const server = await createServer({
		root: projectRoot,
		configFile: false,
		logLevel: 'error',
		server: { middlewareMode: true, hmr: false, watch: null },
		optimizeDeps: { noDiscovery: true, include: [] }
	});
	try {
		const runner = createServerModuleRunner(server.environments.ssr, { hmr: false });
		const years = (await runner.import(
			'/src/lib/data/years/index.ts'
		)) as typeof import('../../src/lib/data/years/index.ts');
		const across = (await runner.import(
			'/src/lib/data/years/acrossYears.ts'
		)) as typeof import('../../src/lib/data/years/acrossYears.ts');
		const i18n = (await runner.import(
			'/src/lib/i18n/translations.ts'
		)) as typeof import('../../src/lib/i18n/translations.ts');
		const site = (await runner.import(
			'/src/lib/site.ts'
		)) as typeof import('../../src/lib/site.ts');

		const stats = across.getAcrossYearsStatistics(years.years);
		if (!stats) throw new Error('No published years found.');
		const t = i18n.translations.en;
		return {
			years: years.years,
			stats,
			copy: {
				siteName: t.siteName,
				heroTitle: t.heroTitle,
				acrossTitle: t.acrossTitle,
				yearsLabel: t.yearsLabel,
				albumsRated: t.albumsRated,
				topN: t.topN,
				author: site.SITE_AUTHOR
			}
		};
	} finally {
		await server.close();
	}
}

// ---------------------------------------------------------------------------
// Composition

interface CardText {
	accent: string;
	kicker: string;
	/** The large Newsreader line: a year or a year range. */
	display: string;
	displaySize: number;
	subtitle: string;
	byline: string;
	meta: string;
}

/** Tracked uppercase line in the body face, like the site's kickers. */
function trackedLine(
	text: string,
	opts: {
		x: number;
		y: number;
		size: number;
		weight: number;
		fill: string;
		anchor?: 'start' | 'end';
	}
): string {
	const spacing = Math.round(opts.size * 0.24);
	return `<text x="${opts.x}" y="${opts.y}" font-family="${TOKENS.body}" font-weight="${opts.weight}" font-size="${opts.size}" letter-spacing="${spacing}" fill="${opts.fill}"${opts.anchor === 'end' ? ' text-anchor="end"' : ''}>${xmlEscape(text.toUpperCase())}</text>`;
}

/**
 * Everything above the background in one SVG: the year-accent glow, the directional
 * charcoal overlay from the site's hero (heaviest behind the type, solid at the base),
 * then the typography.
 */
function overlaySvg(card: CardText): Buffer {
	const { bg, ink, inkMuted } = TOKENS;
	const bottomBaseline = HEIGHT - MARGIN - 28;
	return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
	<defs>
		<radialGradient id="glow" cx="0.24" cy="0.48" r="0.55">
			<stop offset="0" stop-color="${card.accent}" stop-opacity="0.3"/>
			<stop offset="1" stop-color="${card.accent}" stop-opacity="0"/>
		</radialGradient>
		<linearGradient id="x" x1="0" y1="0" x2="1" y2="0">
			<stop offset="0" stop-color="${bg}" stop-opacity="0.74"/>
			<stop offset="0.5" stop-color="${bg}" stop-opacity="0.54"/>
			<stop offset="1" stop-color="${bg}" stop-opacity="0.3"/>
		</linearGradient>
		<linearGradient id="y" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stop-color="${bg}" stop-opacity="0.25"/>
			<stop offset="0.35" stop-color="${bg}" stop-opacity="0"/>
			<stop offset="1" stop-color="${bg}" stop-opacity="0.92"/>
		</linearGradient>
	</defs>
	<rect width="100%" height="100%" fill="url(#glow)"/>
	<rect width="100%" height="100%" fill="url(#x)"/>
	<rect width="100%" height="100%" fill="url(#y)"/>
	${trackedLine(card.kicker, { x: MARGIN, y: MARGIN + 34, size: 30, weight: 500, fill: card.accent })}
	<text x="${MARGIN - 10}" y="${HEIGHT - 234}" font-family="${TOKENS.display}" font-weight="400" font-size="${card.displaySize}" letter-spacing="${Math.round(card.displaySize * -0.02)}" fill="${ink}">${xmlEscape(card.display)}</text>
	${trackedLine(card.subtitle, { x: MARGIN, y: bottomBaseline - 44, size: 30, weight: 500, fill: ink })}
	${trackedLine(card.byline, { x: MARGIN, y: bottomBaseline, size: 24, weight: 400, fill: inkMuted })}
	${trackedLine(card.meta, { x: WIDTH - MARGIN, y: bottomBaseline, size: 24, weight: 500, fill: inkMuted, anchor: 'end' })}
</svg>`);
}

type SharpModule = typeof import('sharp').default;

/** Ink bounds of a Newsreader line, relative to its text origin, measured by rendering it. */
interface InkBox {
	left: number;
	top: number;
	width: number;
	height: number;
}

function displayText(text: string, x: number, y: number, size: number, fill: string): string {
	return `<text x="${x}" y="${y}" font-family="${TOKENS.display}" font-weight="400" font-size="${size}" letter-spacing="${Math.round(size * -0.02)}" fill="${fill}">${xmlEscape(text)}</text>`;
}

async function measureInk(text: string, size: number, sharp: SharpModule): Promise<InkBox> {
	const canvas = Math.ceil(size * (text.length + 2));
	const baseline = Math.round(size * 1.5);
	const svg = Buffer.from(
		`<svg xmlns="http://www.w3.org/2000/svg" width="${canvas}" height="${canvas}">${displayText(text, 0, baseline, size, '#fff')}</svg>`
	);
	const { info } = await sharp(svg).trim().png().toBuffer({ resolveWithObject: true });
	return {
		left: -(info.trimOffsetLeft ?? 0),
		top: -(info.trimOffsetTop ?? 0) - baseline,
		width: info.width,
		height: info.height
	};
}

/** One centred display line: `width` is the ink width to fit, `cy` the ink centre. */
interface CentredLine {
	text: string;
	width: number;
	cy: number;
	fill?: string;
}

/**
 * The square card is thumbnail-first: a vignetted, faintly accent-lit background and
 * nothing but huge numerals, each line sized to its target ink width and centred on its
 * ink box (not its em box) so the margins are real on every side.
 */
async function squareOverlaySvg(
	accent: string,
	lines: CentredLine[],
	sharp: SharpModule
): Promise<Buffer> {
	const { bg, ink } = TOKENS;
	const probe = 200;
	const texts: string[] = [];
	for (const line of lines) {
		const ref = await measureInk(line.text, probe, sharp);
		const size = (probe * line.width) / ref.width;
		const scale = size / probe;
		const x = SQUARE / 2 - (ref.left + ref.width / 2) * scale;
		const y = line.cy - (ref.top + ref.height / 2) * scale;
		texts.push(
			displayText(line.text, Math.round(x), Math.round(y), Math.round(size), line.fill ?? ink)
		);
	}
	return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${SQUARE}" height="${SQUARE}">
	<defs>
		<radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
			<stop offset="0" stop-color="${accent}" stop-opacity="0.34"/>
			<stop offset="1" stop-color="${accent}" stop-opacity="0"/>
		</radialGradient>
		<radialGradient id="vignette" cx="0.5" cy="0.5" r="0.72">
			<stop offset="0" stop-color="${bg}" stop-opacity="0.5"/>
			<stop offset="1" stop-color="${bg}" stop-opacity="0.92"/>
		</radialGradient>
	</defs>
	<rect width="100%" height="100%" fill="url(#glow)"/>
	<rect width="100%" height="100%" fill="url(#vignette)"/>
	${texts.join('\n\t')}
</svg>`);
}

async function writeJpeg(pipeline: import('sharp').Sharp, file: string): Promise<number> {
	const info = await pipeline
		.jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: '4:4:4' })
		.toFile(file);
	return info.size;
}

/** A yearly card: the hero collage pushed well past recognisability, then the year. */
async function renderYearCard(
	year: YearData,
	copy: SiteCopy,
	sharp: typeof import('sharp').default
): Promise<string> {
	if (!year.heroCollage) {
		throw new Error(
			`${year.year}: no hero collage yet — run: npm run generate:hero -- ${year.year}`
		);
	}
	const card: CardText = {
		accent: year.theme.accent,
		kicker: copy.siteName,
		display: String(year.year),
		displaySize: 340,
		subtitle: copy.heroTitle,
		byline: copy.author,
		meta: `${copy.topN(year.rankedAlbums.length)} · ${year.totalAlbumsRated} ${copy.albumsRated}`
	};
	const outFile = path.join(OUTPUT_DIR, `${year.year}.jpg`);
	const pipeline = sharp(path.join(projectRoot, 'static', year.heroCollage))
		.resize(WIDTH, HEIGHT, { fit: 'cover' })
		.blur(22)
		.modulate({ saturation: 0.6, brightness: 0.88 })
		.composite([{ input: overlaySvg(card) }]);
	const size = await writeJpeg(pipeline, outFile);
	console.log(
		`${year.year}: ${card.meta} → ${path.relative(projectRoot, outFile)} (${Math.round(size / 1024)} KB)`
	);
	return outFile;
}

/** The square yearly card: only the year, on the collage pushed to pure atmosphere. */
async function renderYearSquare(year: YearData, sharp: SharpModule): Promise<string> {
	if (!year.heroCollage) throw new Error(`${year.year}: no hero collage.`);
	const overlay = await squareOverlaySvg(
		year.theme.accent,
		[{ text: String(year.year), width: SQUARE * 0.78, cy: SQUARE / 2 }],
		sharp
	);
	const outFile = path.join(OUTPUT_DIR, `${year.year}-square.jpg`);
	const pipeline = sharp(path.join(projectRoot, 'static', year.heroCollage))
		.resize(SQUARE, SQUARE, { fit: 'cover' })
		.blur(26)
		.modulate({ saturation: 0.6, brightness: 0.85 })
		.composite([{ input: overlay }]);
	const size = await writeJpeg(pipeline, outFile);
	console.log(
		`${year.year}: square → ${path.relative(projectRoot, outFile)} (${Math.round(size / 1024)} KB)`
	);
	return outFile;
}

/**
 * Every year's winner artwork as a chronological, staggered mosaic that spills past the
 * edges, then blurred and drained of colour until it reads as texture, not covers.
 */
async function winnersMosaic(
	stats: AcrossYearsStatistics,
	width: number,
	height: number,
	sharp: SharpModule
): Promise<Buffer> {
	const winners = stats.winners;
	const tile = 340;
	const rows = Math.max(1, Math.round(height / 420));
	const columns = Math.max(1, Math.ceil(winners.length / rows));
	const stepX = (width + tile * 0.4) / columns;
	const layers: OverlayOptions[] = [];
	for (const [index, winner] of winners.entries()) {
		const row = index % rows;
		const col = Math.floor(index / rows);
		const left = Math.round(col * stepX - tile * 0.2 + (row % 2 ? stepX / 2 : 0));
		const top = Math.round(
			rows === 1 ? (height - tile) / 2 : -tile * 0.22 + (row * (height - tile * 0.56)) / (rows - 1)
		);
		layers.push({
			input: await sharp(path.join(projectRoot, 'static', winner.album.artwork))
				.resize(tile, tile, { fit: 'cover' })
				.png()
				.toBuffer(),
			left,
			top
		});
	}
	const mosaic = await sharp({
		create: { width: width * 2, height: height * 2, channels: 4, background: TOKENS.bg }
	})
		.composite(layers.map((l) => ({ ...l, left: l.left! + width / 2, top: l.top! + height / 2 })))
		.png()
		.toBuffer();
	return sharp(mosaic)
		.extract({ left: width / 2, top: height / 2, width, height })
		.blur(34)
		.modulate({ saturation: 0.4, brightness: 0.8 })
		.png()
		.toBuffer();
}

/** The cross-year landscape card. */
async function renderStatsCard(
	stats: AcrossYearsStatistics,
	copy: SiteCopy,
	sharp: SharpModule
): Promise<string> {
	const background = await winnersMosaic(stats, WIDTH, HEIGHT, sharp);

	const card: CardText = {
		accent: TOKENS.accent,
		kicker: copy.siteName,
		display: `${stats.firstYear}–${stats.latestYear}`,
		displaySize: 184,
		subtitle: copy.acrossTitle,
		byline: copy.author,
		meta: `${stats.totalAlbumsRated.toLocaleString('en-US')} ${copy.albumsRated} · ${stats.yearCount} ${copy.yearsLabel}`
	};
	const outFile = path.join(OUTPUT_DIR, 'stats.jpg');
	const size = await writeJpeg(sharp(background).composite([{ input: overlaySvg(card) }]), outFile);
	console.log(
		`stats: ${card.display} · ${card.meta} → ${path.relative(projectRoot, outFile)} (${Math.round(size / 1024)} KB)`
	);
	return outFile;
}

/** The square cross-year card: first year, a dash, last year. */
async function renderStatsSquare(
	stats: AcrossYearsStatistics,
	sharp: SharpModule
): Promise<string> {
	const background = await winnersMosaic(stats, SQUARE, SQUARE, sharp);
	const yearWidth = SQUARE * 0.54;
	const overlay = await squareOverlaySvg(
		TOKENS.accent,
		[
			{ text: String(stats.firstYear), width: yearWidth, cy: SQUARE * 0.27 },
			{ text: '—', width: SQUARE * 0.2, cy: SQUARE / 2 },
			{ text: String(stats.latestYear), width: yearWidth, cy: SQUARE * 0.73 }
		],
		sharp
	);
	const outFile = path.join(OUTPUT_DIR, 'stats-square.jpg');
	const size = await writeJpeg(sharp(background).composite([{ input: overlay }]), outFile);
	console.log(
		`stats: square → ${path.relative(projectRoot, outFile)} (${Math.round(size / 1024)} KB)`
	);
	return outFile;
}

// ---------------------------------------------------------------------------
// Manifest

async function exists(file: string): Promise<boolean> {
	return access(file).then(
		() => true,
		() => false
	);
}

/** Records every card present on disk, so metadata never points at a missing image. */
async function writeManifest(years: readonly YearData[]): Promise<string> {
	const names = [...years.map((y) => String(y.year)).sort(), 'stats'].flatMap((name) => [
		name,
		`${name}-square`
	]);
	const present: string[] = [];
	for (const name of names) {
		if (await exists(path.join(OUTPUT_DIR, `${name}.jpg`))) present.push(name);
	}
	const json = JSON.stringify(present, null, '\t') + '\n';
	const config = (await prettier.resolveConfig(MANIFEST)) ?? {};
	await writeFile(MANIFEST, await prettier.format(json, { ...config, filepath: MANIFEST }), 'utf8');
	return path.relative(projectRoot, MANIFEST);
}

// ---------------------------------------------------------------------------

async function main() {
	const target = process.argv.slice(2).find((a) => !a.startsWith('--'));
	if (target && !/^\d{4}$/.test(target))
		throw new Error('Usage: npm run generate:social [-- <year>]');

	await configureFonts();
	const sharp = (await import('sharp')).default;
	const { years, stats, copy } = await loadProductionData();
	await mkdir(OUTPUT_DIR, { recursive: true });

	const selected = target ? years.filter((y) => y.year === Number(target)) : years;
	if (target && selected.length === 0) throw new Error(`${target} is not a published year.`);

	for (const year of [...selected].sort((a, b) => a.year - b.year)) {
		await renderYearSquare(year, sharp);
		await renderYearCard(year, copy, sharp);
	}
	await renderStatsSquare(stats, sharp);
	await renderStatsCard(stats, copy, sharp);
	console.log(`manifest → ${await writeManifest(years)}`);
}

main().catch((error: unknown) => {
	console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}`);
	process.exit(1);
});
