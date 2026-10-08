import type { ParseResult } from './parse.ts';

const OK = '✓';
const WARN = '⚠';
const FAIL = '✗';

export function formatReport(sourceFile: string, result: ParseResult, outputPath?: string): string {
	const { data, diagnostics, stats } = result;
	const lines: string[] = ['', 'YEAR IN MUSIC — RYM IMPORT', '', `File: ${sourceFile}`];

	if (data) {
		lines.push(`Year: ${data.year}`, `List: ${data.listTitle}`, '');
		const expected = stats.expectedAlbumCount;
		const countOk = expected === undefined || expected === stats.albumsFound;
		lines.push(
			`Albums found: ${stats.albumsFound}${expected !== undefined ? ` (title says ${expected})` : ''} ${countOk ? OK : WARN}`
		);
		const top = data.albums.length ? data.albums[data.albums.length - 1].rank : 0;
		const ranksComplete =
			data.albums.length === top &&
			!diagnostics.warnings.some((w) => w.startsWith('Missing ranks'));
		lines.push(`Ranks complete: 1–${top} ${ranksComplete ? OK : WARN}`);
		lines.push(
			`RYM release URLs: ${stats.withRymUrl}/${stats.albumsFound} ${stats.withRymUrl === stats.albumsFound ? OK : WARN}`
		);
		lines.push(
			`Primary genres: ${stats.withPrimaryGenres}/${stats.albumsFound} ${stats.withPrimaryGenres === stats.albumsFound ? OK : WARN}`
		);
		lines.push(
			`Artwork sources: ${stats.withArtwork}/${stats.albumsFound} ${stats.withArtwork === stats.albumsFound ? OK : WARN}`
		);
		lines.push(`Spotify playlist: ${data.spotifyPlaylistUrl ? `found ${OK}` : `missing ${WARN}`}`);
		lines.push(`Intro paragraphs: ${data.introEn.length} ${data.introEn.length ? OK : WARN}`, '');
		lines.push(
			`Albums rated (sum of rating buckets): ${data.totalAlbumsRated} ${data.ratingDistribution.length ? OK : WARN}`
		);
	}

	if (diagnostics.errors.length) {
		lines.push('', diagnostics.errors.length === 1 ? 'Error:' : 'Errors:');
		for (const e of diagnostics.errors) lines.push(`${FAIL} ${e}`);
	}
	if (diagnostics.warnings.length) {
		lines.push('', diagnostics.warnings.length === 1 ? 'Warning:' : 'Warnings:');
		for (const w of diagnostics.warnings) lines.push(`${WARN} ${w}`);
	}

	if (outputPath) lines.push('', 'Output:', outputPath);

	lines.push('');
	if (diagnostics.fatal) {
		lines.push(`Import FAILED — nothing was written.`);
	} else {
		const n = diagnostics.warnings.length;
		lines.push(
			n === 0
				? 'Import completed successfully.'
				: `Import completed with ${n} warning${n === 1 ? '' : 's'}.`
		);
	}
	return lines.join('\n');
}
