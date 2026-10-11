/**
 * npm run generate:social [-- <year>]
 *
 * Renders the social-preview cards and records which exist in
 * src/lib/data/socialCards.json, so page metadata only ever points at a card that
 * was actually generated:
 *   static/social/{year}-square.jpg  1200×1200 og:image — WhatsApp previews it small in
 *                                    the composer but renders the sent message as a
 *                                    large square card, so it carries the full editorial
 *                                    content, recomposed for the square
 *   static/social/{year}.jpg         1200×630 twitter:image / large previews
 *   static/social/stats(-square).jpg the same pair for /stats
 *   static/special/{slug}.jpg        a special edition's square cover (its page artwork)
 *   static/social/{slug}(-square).jpg and its share cards
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
import type { SpecialEdition } from '../../src/lib/types/specialEdition.ts';
import { projectRoot } from '../lib/generated.ts';

const WIDTH = 1200;
const HEIGHT = 630;
const SQUARE = 1200;
/** Special-edition covers are page artwork, so they get more pixels than a share card. */
const COVER = 1600;
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
	specialEdition: string;
	songsKicker: string;
	oneSongPerArtist: string;
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
	editions: readonly SpecialEdition[];
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
		const special = (await runner.import(
			'/src/lib/data/specialEditions.ts'
		)) as typeof import('../../src/lib/data/specialEditions.ts');

		const stats = across.getAcrossYearsStatistics(years.years);
		if (!stats) throw new Error('No published years found.');
		const t = i18n.translations.en;
		return {
			years: years.years,
			editions: special.specialEditions,
			stats,
			copy: {
				siteName: t.siteName,
				heroTitle: t.heroTitle,
				acrossTitle: t.acrossTitle,
				yearsLabel: t.yearsLabel,
				albumsRated: t.albumsRated,
				topN: t.topN,
				author: site.SITE_AUTHOR,
				specialEdition: t.specialEditionKicker,
				songsKicker: t.songsKicker,
				oneSongPerArtist: t.oneSongPerArtist
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
	/** Font size of the display line; on the square card, the cap of its fitted size. */
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

/**
 * The square type scale. Larger than the landscape card's because WhatsApp shows the
 * sent card at roughly the width of the chat, so the supporting lines must read there.
 */
const SQUARE_TYPE = { kicker: 38, subtitle: 40, byline: 32, meta: 32 } as const;

/**
 * The square card recomposes the landscape design rather than cropping it: the kicker at
 * the top, the display line fitted to the content width (capped at `displaySize`) and
 * seated on a fixed line in the upper-middle, the subtitle and byline beneath it, and
 * the meta line as a footer. The display line is positioned by its measured ink box, so
 * its left edge sits exactly on the margin and its seat does not drift between a year
 * and a year range.
 */
async function squareOverlaySvg(card: CardText, sharp: SharpModule): Promise<Buffer> {
	const { bg, ink, inkMuted } = TOKENS;
	const probe = 200;
	const ref = await measureInk(card.display, probe, sharp);
	const size = Math.min(card.displaySize, (probe * (SQUARE - 2 * MARGIN)) / ref.width);
	const scale = size / probe;
	const displayX = MARGIN - ref.left * scale;
	const displaySeat = Math.round(SQUARE * 0.51);
	const displayY = displaySeat - (ref.top + ref.height) * scale;
	const subtitleBaseline = displaySeat + 116;
	const bylineBaseline = subtitleBaseline + 66;
	const metaBaseline = SQUARE - MARGIN - 24;
	return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${SQUARE}" height="${SQUARE}">
	<defs>
		<radialGradient id="glow" cx="0.3" cy="0.42" r="0.5">
			<stop offset="0" stop-color="${card.accent}" stop-opacity="0.3"/>
			<stop offset="1" stop-color="${card.accent}" stop-opacity="0"/>
		</radialGradient>
		<linearGradient id="x" x1="0" y1="0" x2="1" y2="0">
			<stop offset="0" stop-color="${bg}" stop-opacity="0.74"/>
			<stop offset="0.5" stop-color="${bg}" stop-opacity="0.54"/>
			<stop offset="1" stop-color="${bg}" stop-opacity="0.3"/>
		</linearGradient>
		<linearGradient id="y" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stop-color="${bg}" stop-opacity="0.3"/>
			<stop offset="0.3" stop-color="${bg}" stop-opacity="0"/>
			<stop offset="1" stop-color="${bg}" stop-opacity="0.92"/>
		</linearGradient>
	</defs>
	<rect width="100%" height="100%" fill="url(#glow)"/>
	<rect width="100%" height="100%" fill="url(#x)"/>
	<rect width="100%" height="100%" fill="url(#y)"/>
	${trackedLine(card.kicker, { x: MARGIN, y: MARGIN + 42, size: SQUARE_TYPE.kicker, weight: 500, fill: card.accent })}
	${displayText(card.display, Math.round(displayX), Math.round(displayY), Math.round(size), ink)}
	${trackedLine(card.subtitle, { x: MARGIN, y: subtitleBaseline, size: SQUARE_TYPE.subtitle, weight: 500, fill: ink })}
	${trackedLine(card.byline, { x: MARGIN, y: bylineBaseline, size: SQUARE_TYPE.byline, weight: 400, fill: inkMuted })}
	${trackedLine(card.meta, { x: MARGIN, y: metaBaseline, size: SQUARE_TYPE.meta, weight: 500, fill: inkMuted })}
</svg>`);
}

async function writeJpeg(pipeline: import('sharp').Sharp, file: string): Promise<number> {
	const info = await pipeline
		.jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: '4:4:4' })
		.toFile(file);
	return info.size;
}

/**
 * The copy shared by both yearly cards. Top N counts ranked albums only: bonus albums
 * never widen the ranking.
 */
function yearCardText(year: YearData, copy: SiteCopy, displaySize: number): CardText {
	return {
		accent: year.theme.accent,
		kicker: copy.siteName,
		display: String(year.year),
		displaySize,
		subtitle: copy.heroTitle,
		byline: copy.author,
		meta: `${copy.topN(year.rankedAlbums.length)} · ${year.totalAlbumsRated} ${copy.albumsRated}`
	};
}

function heroCollagePath(year: YearData): string {
	if (!year.heroCollage) {
		throw new Error(
			`${year.year}: no hero collage yet — run: npm run generate:hero -- ${year.year}`
		);
	}
	return path.join(projectRoot, 'static', year.heroCollage);
}

/** A yearly card: the hero collage pushed well past recognisability, then the year. */
async function renderYearCard(year: YearData, copy: SiteCopy, sharp: SharpModule): Promise<string> {
	const card = yearCardText(year, copy, 340);
	const outFile = path.join(OUTPUT_DIR, `${year.year}.jpg`);
	const pipeline = sharp(heroCollagePath(year))
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

/** The square yearly card: the same editorial content, recomposed for 1200×1200. */
async function renderYearSquare(
	year: YearData,
	copy: SiteCopy,
	sharp: SharpModule
): Promise<string> {
	const card = yearCardText(year, copy, 470);
	const outFile = path.join(OUTPUT_DIR, `${year.year}-square.jpg`);
	const pipeline = sharp(heroCollagePath(year))
		.resize(SQUARE, SQUARE, { fit: 'cover' })
		.blur(24)
		.modulate({ saturation: 0.6, brightness: 0.88 })
		.composite([{ input: await squareOverlaySvg(card, sharp) }]);
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

/** The copy shared by both cross-year cards. */
function statsCardText(
	stats: AcrossYearsStatistics,
	copy: SiteCopy,
	displaySize: number
): CardText {
	return {
		accent: TOKENS.accent,
		kicker: copy.siteName,
		display: `${stats.firstYear}–${stats.latestYear}`,
		displaySize,
		subtitle: copy.acrossTitle,
		byline: copy.author,
		meta: `${stats.totalAlbumsRated.toLocaleString('en-US')} ${copy.albumsRated} · ${stats.yearCount} ${copy.yearsLabel}`
	};
}

/** The cross-year landscape card. */
async function renderStatsCard(
	stats: AcrossYearsStatistics,
	copy: SiteCopy,
	sharp: SharpModule
): Promise<string> {
	const background = await winnersMosaic(stats, WIDTH, HEIGHT, sharp);
	const card = statsCardText(stats, copy, 184);
	const outFile = path.join(OUTPUT_DIR, 'stats.jpg');
	const size = await writeJpeg(sharp(background).composite([{ input: overlaySvg(card) }]), outFile);
	console.log(
		`stats: ${card.display} · ${card.meta} → ${path.relative(projectRoot, outFile)} (${Math.round(size / 1024)} KB)`
	);
	return outFile;
}

/** The square cross-year card: the year range fitted to the content width. */
async function renderStatsSquare(
	stats: AcrossYearsStatistics,
	copy: SiteCopy,
	sharp: SharpModule
): Promise<string> {
	const background = await winnersMosaic(stats, SQUARE, SQUARE, sharp);
	const card = statsCardText(stats, copy, 470);
	const outFile = path.join(OUTPUT_DIR, 'stats-square.jpg');
	const size = await writeJpeg(
		sharp(background).composite([{ input: await squareOverlaySvg(card, sharp) }]),
		outFile
	);
	console.log(
		`stats: square → ${path.relative(projectRoot, outFile)} (${Math.round(size / 1024)} KB)`
	);
	return outFile;
}

// ---------------------------------------------------------------------------
// Special editions

/**
 * The hero collages of the years an edition spans, tiled into one square and blurred
 * into atmosphere. An edition whose years have no collages yet gets the plain background.
 */
async function collageMosaic(
	collages: readonly string[],
	size: number,
	sharp: SharpModule
): Promise<Buffer> {
	const base = sharp({ create: { width: size, height: size, channels: 3, background: TOKENS.bg } });
	if (collages.length === 0) return base.png().toBuffer();
	const columns = Math.ceil(Math.sqrt(collages.length));
	const rows = Math.ceil(collages.length / columns);
	const tileW = Math.ceil(size / columns);
	const tileH = Math.ceil(size / rows);
	const layers: OverlayOptions[] = [];
	for (const [index, file] of collages.entries()) {
		layers.push({
			input: await sharp(file).resize(tileW, tileH, { fit: 'cover' }).png().toBuffer(),
			left: (index % columns) * tileW,
			top: Math.floor(index / columns) * tileH
		});
	}
	const tiled = await base.composite(layers).png().toBuffer();
	return sharp(tiled)
		.blur(size / 40)
		.modulate({ saturation: 0.55, brightness: 0.8 })
		.png()
		.toBuffer();
}

/** One centred display line: `width` is the ink width to fit, `cy` the ink centre. */
interface CentredLine {
	text: string;
	width: number;
	cy: number;
}

/**
 * The cover: the site name, the first year, "to", the last year, stacked and centred on
 * the edition's accent-lit mosaic. Each numeral is sized to a target ink width and
 * centred on its ink box, so the stack is optically even.
 */
async function coverOverlaySvg(
	edition: SpecialEdition,
	copy: SiteCopy,
	sharp: SharpModule
): Promise<Buffer> {
	const { bg, ink } = TOKENS;
	const accent = edition.theme.accent;
	const probe = 200;
	const numerals: CentredLine[] = [
		{ text: String(edition.years[0]), width: COVER * 0.56, cy: COVER * 0.4 },
		{ text: String(edition.years[1]), width: COVER * 0.56, cy: COVER * 0.7 }
	];
	const texts: string[] = [];
	for (const line of numerals) {
		const ref = await measureInk(line.text, probe, sharp);
		const size = (probe * line.width) / ref.width;
		const scale = size / probe;
		const x = COVER / 2 - (ref.left + ref.width / 2) * scale;
		const y = line.cy - (ref.top + ref.height / 2) * scale;
		texts.push(displayText(line.text, Math.round(x), Math.round(y), Math.round(size), ink));
	}
	const centred = (text: string, y: number, size: number, fill: string) =>
		`<text x="${COVER / 2}" y="${y}" text-anchor="middle" font-family="${TOKENS.body}" font-weight="500" font-size="${size}" letter-spacing="${Math.round(size * 0.3)}" fill="${fill}">${xmlEscape(text.toUpperCase())}</text>`;
	return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${COVER}" height="${COVER}">
	<defs>
		<radialGradient id="glow" cx="0.5" cy="0.55" r="0.55">
			<stop offset="0" stop-color="${accent}" stop-opacity="0.32"/>
			<stop offset="1" stop-color="${accent}" stop-opacity="0"/>
		</radialGradient>
		<radialGradient id="vignette" cx="0.5" cy="0.5" r="0.74">
			<stop offset="0" stop-color="${bg}" stop-opacity="0.45"/>
			<stop offset="1" stop-color="${bg}" stop-opacity="0.94"/>
		</radialGradient>
	</defs>
	<rect width="100%" height="100%" fill="url(#glow)"/>
	<rect width="100%" height="100%" fill="url(#vignette)"/>
	${centred(copy.siteName, COVER * 0.19, 50, accent)}
	${texts[0]}
	${centred('to', COVER * 0.555, 50, ink)}
	${texts[1]}
</svg>`);
}

/** The edition's cover plus its square and landscape share cards, all on the same mosaic. */
async function renderSpecialEdition(
	edition: SpecialEdition,
	years: readonly YearData[],
	copy: SiteCopy,
	sharp: SharpModule
): Promise<void> {
	const [first, last] = edition.years;
	const collages = years
		.filter((y) => y.year >= first && y.year <= last && y.heroCollage)
		.sort((a, b) => a.year - b.year)
		.map((y) => path.join(projectRoot, 'static', y.heroCollage!));
	const mosaic = await collageMosaic(collages, COVER, sharp);

	const coverFile = path.join(projectRoot, 'static', edition.artwork);
	await mkdir(path.dirname(coverFile), { recursive: true });
	const coverSize = await writeJpeg(
		sharp(mosaic).composite([{ input: await coverOverlaySvg(edition, copy, sharp) }]),
		coverFile
	);
	console.log(
		`${edition.slug}: cover → ${path.relative(projectRoot, coverFile)} (${Math.round(coverSize / 1024)} KB)`
	);

	const card: CardText = {
		accent: edition.theme.accent,
		kicker: copy.specialEdition,
		display: `${first}—${last}`,
		displaySize: 470,
		subtitle: edition.title.en,
		byline: copy.author,
		meta: `${copy.songsKicker} · ${copy.oneSongPerArtist.replace(/\.$/, '')}`
	};
	const squareFile = path.join(OUTPUT_DIR, `${edition.slug}-square.jpg`);
	const squareSize = await writeJpeg(
		sharp(mosaic)
			.resize(SQUARE, SQUARE)
			.composite([{ input: await squareOverlaySvg(card, sharp) }]),
		squareFile
	);
	console.log(
		`${edition.slug}: square → ${path.relative(projectRoot, squareFile)} (${Math.round(squareSize / 1024)} KB)`
	);

	const landscapeFile = path.join(OUTPUT_DIR, `${edition.slug}.jpg`);
	const landscapeSize = await writeJpeg(
		sharp(mosaic)
			.resize(WIDTH, HEIGHT, { fit: 'cover' })
			.composite([{ input: overlaySvg({ ...card, displaySize: 184 }) }]),
		landscapeFile
	);
	console.log(
		`${edition.slug}: ${card.meta} → ${path.relative(projectRoot, landscapeFile)} (${Math.round(landscapeSize / 1024)} KB)`
	);
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
async function writeManifest(
	years: readonly YearData[],
	editions: readonly SpecialEdition[]
): Promise<string> {
	const names = [
		...years.map((y) => String(y.year)).sort(),
		...editions.map((e) => e.slug),
		'stats'
	].flatMap((name) => [name, `${name}-square`]);
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
	const { years, editions, stats, copy } = await loadProductionData();
	await mkdir(OUTPUT_DIR, { recursive: true });

	const selected = target ? years.filter((y) => y.year === Number(target)) : years;
	if (target && selected.length === 0) throw new Error(`${target} is not a published year.`);

	for (const year of [...selected].sort((a, b) => a.year - b.year)) {
		await renderYearSquare(year, copy, sharp);
		await renderYearCard(year, copy, sharp);
	}
	if (!target) {
		for (const edition of editions) await renderSpecialEdition(edition, years, copy, sharp);
	}
	await renderStatsSquare(stats, copy, sharp);
	await renderStatsCard(stats, copy, sharp);
	console.log(`manifest → ${await writeManifest(years, editions)}`);
}

main().catch((error: unknown) => {
	console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}`);
	process.exit(1);
});
