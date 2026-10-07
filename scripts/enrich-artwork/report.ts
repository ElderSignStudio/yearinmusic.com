import type { ImageInfo } from './image.ts';

export interface AlbumResult {
	rank: number;
	artist: string;
	album: string;
	slug: string;
	status: 'written' | 'cached' | 'failed';
	sourceKind?: 'manual' | 'cdn' | 'local-saved';
	sourceLabel?: string;
	source?: ImageInfo;
	output?: ImageInfo;
	warnings: string[];
	error?: string;
}

const OK = '✓';
const WARN = '⚠';
const FAIL = '✗';

export function formatReport(
	year: number,
	results: AlbumResult[],
	outputDir: string,
	jsonPath: string,
	highResEdge: number
): string {
	const count = (fn: (r: AlbumResult) => boolean) => results.filter(fn).length;
	const resolved = count((r) => r.status !== 'failed');
	const failed = count((r) => r.status === 'failed');
	const warned = results.filter((r) => r.warnings.length > 0);
	const highRes = count(
		(r) => (r.source?.width ?? 0) >= highResEdge && (r.source?.height ?? 0) >= highResEdge
	);

	const lines = [
		'',
		'YEAR IN MUSIC — ARTWORK ENRICHMENT',
		'',
		`Year: ${year}`,
		`Albums: ${results.length}`,
		'',
		`Manual overrides: ${count((r) => r.sourceKind === 'manual')}`,
		`Local saved sources: ${count((r) => r.sourceKind === 'local-saved')}`,
		`CDN sources: ${count((r) => r.sourceKind === 'cdn')}`,
		'',
		`Artwork resolved: ${resolved}/${results.length} ${resolved === results.length ? OK : WARN}`,
		`Reused existing files: ${count((r) => r.status === 'cached')}`,
		`High-resolution sources (≥${highResEdge}px): ${highRes}`,
		`Low-resolution warnings: ${count((r) => r.warnings.some((w) => w.startsWith('source only')))}`,
		`Failed: ${failed} ${failed === 0 ? OK : FAIL}`
	];

	if (warned.length) {
		lines.push('', 'Warnings:');
		for (const r of warned) {
			for (const w of r.warnings)
				lines.push(`${WARN} #${String(r.rank).padStart(2, '0')} ${r.artist} — ${r.album}: ${w}`);
		}
	}
	const failures = results.filter((r) => r.status === 'failed');
	if (failures.length) {
		lines.push('', 'Failed:');
		for (const r of failures)
			lines.push(
				`${FAIL} #${String(r.rank).padStart(2, '0')} ${r.artist} — ${r.album}: ${r.error}`
			);
	}

	const questionable = results.filter((r) => r.warnings.length || r.status === 'failed');
	if (questionable.length) {
		lines.push('', 'Dimensions (source → output):');
		for (const r of questionable) {
			const src = r.source ? `${r.source.width}×${r.source.height} ${r.source.format}` : 'n/a';
			const out = r.output ? `${r.output.width}×${r.output.height} webp` : 'not written';
			lines.push(`  #${String(r.rank).padStart(2, '0')} ${r.slug}: ${src} → ${out}`);
		}
	}

	lines.push('', 'Output:', outputDir, '', 'Generated data updated:', jsonPath, '');
	lines.push(
		failed === 0
			? warned.length
				? `Enrichment completed with ${warned.length} album${warned.length === 1 ? '' : 's'} flagged.`
				: 'Enrichment completed successfully.'
			: `Enrichment completed with ${failed} failure${failed === 1 ? '' : 's'}.`
	);
	return lines.join('\n');
}
