/**
 * npm run generate:social [-- <year>]
 *
 * Renders the 1200×630 social-preview cards used for Open Graph / Twitter / WhatsApp:
 *   static/social/{year}.jpg   one per published year that has a hero collage
 *   static/social/stats.jpg    the cross-year card for /stats
 * and records which cards exist in src/lib/data/socialCards.json, so page metadata
 * only ever points at a card that was actually generated.
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

/**
 * The cross-year card: every year's winner artwork as a chronological, staggered
 * mosaic, then blurred and drained of colour until it reads as texture, not covers.
 */
async function renderStatsCard(
	stats: AcrossYearsStatistics,
	copy: SiteCopy,
	sharp: typeof import('sharp').default
): Promise<string> {
	const winners = stats.winners;
	const columns = Math.max(1, Math.ceil(winners.length / 2));
	const tile = 340;
	const stepX = (WIDTH + tile * 0.4) / columns;
	const layers: OverlayOptions[] = [];
	for (const [index, winner] of winners.entries()) {
		const row = index % 2;
		const col = Math.floor(index / 2);
		const left = Math.round(col * stepX - tile * 0.2 + (row ? stepX / 2 : 0));
		const top = Math.round(row ? HEIGHT - tile * 0.78 : -tile * 0.22);
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
		create: { width: WIDTH * 2, height: HEIGHT * 2, channels: 4, background: TOKENS.bg }
	})
		.composite(layers.map((l) => ({ ...l, left: l.left! + WIDTH / 2, top: l.top! + HEIGHT / 2 })))
		.png()
		.toBuffer();
	const background = await sharp(mosaic)
		.extract({ left: WIDTH / 2, top: HEIGHT / 2, width: WIDTH, height: HEIGHT })
		.blur(34)
		.modulate({ saturation: 0.4, brightness: 0.8 })
		.png()
		.toBuffer();

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
	const names = [...years.map((y) => String(y.year)).sort(), 'stats'];
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
		await renderYearCard(year, copy, sharp);
	}
	await renderStatsCard(stats, copy, sharp);
	console.log(`manifest → ${await writeManifest(years)}`);
}

main().catch((error: unknown) => {
	console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}`);
	process.exit(1);
});
