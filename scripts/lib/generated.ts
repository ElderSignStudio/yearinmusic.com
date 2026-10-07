/** Shared helpers for reading and writing `src/lib/data/years/generated/{year}.json`. */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';
import type { ImportedYearData } from '../../src/lib/types/imported.ts';

export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const generatedDir = path.join(projectRoot, 'src', 'lib', 'data', 'years', 'generated');
export const importsDir = path.join(projectRoot, 'imports');

export function generatedPath(year: number): string {
	return path.join(generatedDir, `${year}.json`);
}

export async function readGenerated(file: string): Promise<ImportedYearData> {
	return JSON.parse(await readFile(file, 'utf8')) as ImportedYearData;
}

/** Writes deterministic, Prettier-formatted JSON and returns the project-relative path. */
export async function writeGenerated(data: ImportedYearData): Promise<string> {
	const file = generatedPath(data.year);
	await mkdir(generatedDir, { recursive: true });
	const json = JSON.stringify(data, null, '\t') + '\n';
	const config = (await prettier.resolveConfig(file)) ?? {};
	await writeFile(file, await prettier.format(json, { ...config, filepath: file }), 'utf8');
	return path.relative(projectRoot, file);
}
