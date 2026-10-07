/**
 * npm run import:rym -- <file-or-directory>
 *
 * Reads saved RateYourMusic list pages (.html) and writes clean, deterministic
 * JSON to src/lib/data/years/generated/{year}.json. Hand-authored files are
 * never touched. Exit code 1 if any file fails.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { writeGenerated } from '../lib/generated.ts';
import { parseRymListHtml } from './parse.ts';
import { formatReport } from './report.ts';

async function collectHtmlFiles(target: string): Promise<string[]> {
	const info = await stat(target).catch(() => undefined);
	if (!info) throw new Error(`Path not found: ${target}`);
	if (info.isFile()) {
		if (!/\.html?$/i.test(target)) throw new Error(`Unsupported file (expected .html): ${target}`);
		return [target];
	}
	const entries = await readdir(target, { withFileTypes: true });
	return entries
		.filter((e) => e.isFile() && /\.html?$/i.test(e.name))
		.map((e) => path.join(target, e.name))
		.sort();
}

async function importFile(file: string): Promise<boolean> {
	const sourceFile = path.basename(file);
	const html = await readFile(file, 'utf8');
	const result = parseRymListHtml(html, sourceFile);
	let outputPath: string | undefined;
	if (result.data) outputPath = await writeGenerated(result.data);
	console.log(formatReport(sourceFile, result, outputPath));
	return !result.diagnostics.fatal;
}

async function main() {
	const target = process.argv[2];
	if (!target) {
		console.error('Usage: npm run import:rym -- <file.html | directory>');
		process.exit(2);
	}
	const files = await collectHtmlFiles(path.resolve(target));
	if (files.length === 0) {
		console.error(`No .html files found in ${target}`);
		process.exit(2);
	}
	let ok = true;
	for (const file of files) ok = (await importFile(file)) && ok;
	if (files.length > 1) console.log(`\n${files.length} files processed.`);
	process.exit(ok ? 0 : 1);
}

main().catch((error: unknown) => {
	console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}`);
	process.exit(1);
});
