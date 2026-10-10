/**
 * npm run check:overrides -- <year>
 *
 * Reports how many streaming links for a year are exact (hand-supplied) versus
 * search fallbacks, and validates the hand-authored file against the generated data.
 * Read-only: never writes to src/lib/data/years/manual/.
 */
import { manualOverridesFor } from '../../src/lib/data/years/manual/index.ts';
import { invalidManualUrls, resolveServiceLinks } from '../../src/lib/utils/serviceLinks.ts';
import { generatedPath, readGenerated } from '../lib/generated.ts';

const OK = '✓';
const WARN = '⚠';
const FAIL = '✗';

async function main() {
	const arg = process.argv.slice(2).find((a) => !a.startsWith('--'));
	if (!arg || !/^\d{4}$/.test(arg)) {
		console.error('Usage: npm run check:overrides -- <year>');
		process.exit(2);
	}
	const year = Number(arg);
	const data = await readGenerated(generatedPath(year));
	const manual = manualOverridesFor(year);
	const albums = [...data.albums].sort((a, b) => a.rank - b.rank);
	const label = (a: { rank: number; artist: string; album: string }) =>
		`#${String(a.rank).padStart(2, '0')} ${a.artist} — ${a.album}`;

	const counts = {
		spotifyExact: 0,
		spotifyFallback: 0,
		spotifyHidden: 0,
		appleExact: 0,
		appleFallback: 0,
		appleHidden: 0,
		bandcamp: 0
	};
	const problems: string[] = [];
	const missing: string[] = [];
	const generatedSlugs = new Set(albums.map((a) => a.slug));

	for (const album of albums) {
		const override = manual?.[album.slug];
		if (!override) missing.push(`${label(album)} → add key '${album.slug}'`);
		for (const p of override ? invalidManualUrls(override) : [])
			problems.push(`${label(album)}: ${p}`);
		const links = resolveServiceLinks(album, override);
		if (links.spotify?.status === 'exact') counts.spotifyExact++;
		else if (links.spotify) counts.spotifyFallback++;
		else counts.spotifyHidden++;
		if (links.appleMusic?.status === 'exact') counts.appleExact++;
		else if (links.appleMusic) counts.appleFallback++;
		else counts.appleHidden++;
		if (links.bandcamp) counts.bandcamp++;
	}
	const unknown = Object.keys(manual ?? {}).filter((slug) => !generatedSlugs.has(slug));

	const lines = [
		'',
		'YEAR IN MUSIC — MANUAL OVERRIDES',
		'',
		`Year: ${year}`,
		`Albums: ${albums.length}`,
		manual
			? `Manual file: src/lib/data/years/manual/${year}.ts`
			: `Manual file: none registered in manual/index.ts ${WARN}`,
		'',
		'Spotify:',
		`Exact: ${counts.spotifyExact}`,
		`Search fallback: ${counts.spotifyFallback}`,
		`Not on service (hidden): ${counts.spotifyHidden}`,
		'',
		'Apple Music:',
		`Exact: ${counts.appleExact}`,
		`Search fallback: ${counts.appleFallback}`,
		`Not on service (hidden): ${counts.appleHidden}`,
		'',
		'Bandcamp (optional, exact only):',
		`Linked: ${counts.bandcamp}`,
		'',
		`Invalid manual URLs: ${problems.length} ${problems.length ? FAIL : OK}`,
		`Unknown override slugs: ${unknown.length} ${unknown.length ? FAIL : OK}`,
		`Missing album override entries: ${missing.length} ${missing.length ? WARN : OK}`
	];
	if (problems.length)
		lines.push(
			'',
			'Invalid manual URLs (treated as fallback until fixed):',
			...problems.map((p) => `${FAIL} ${p}`)
		);
	if (unknown.length)
		lines.push(
			'',
			'Override keys that match no album in the generated data:',
			...unknown.map((s) => `${FAIL} '${s}'`)
		);
	if (missing.length)
		lines.push(
			'',
			'Albums without an override entry (fallback links are used):',
			...missing.map((m) => `${WARN} ${m}`)
		);
	lines.push('');
	console.log(lines.join('\n'));
	process.exit(problems.length || unknown.length ? 1 : 0);
}

main().catch((error: unknown) => {
	console.error(`\n${FAIL} ${error instanceof Error ? error.message : String(error)}`);
	process.exit(1);
});
