/**
 * 2021 — built from real imported data (a Top 10 plus one bonus album).
 * Album data, statistics and artwork come from generated/2021.json;
 * exact streaming links from manual/2021.ts; everything editorial lives here.
 */
import type { ImportedYearData } from '#lib/types/imported.js';
import generated from './generated/2021.json';
import { overrides2021 } from './manual/2021.ts';
import { createYear } from './compose.js';

export const year2021 = createYear(generated as ImportedYearData, overrides2021, {
	// The cover of SPELLLING's "The Turning Wheel" is pure black and white: a cool pearl silver.
	accent: '#c3bfc8',
	intro: {
		'pt-BR': [
			'Bem-vindo ao meu Top 10 dos melhores álbuns lançados em 2021!',
			'Avaliei 130 álbuns lançados em 2021, quase três vezes mais do que em 2020 (quando avaliei 56 álbuns).'
		]
	},
	previousYearAlbumsRated: 56,
	// The list is a Top 10 plus one unranked extra; RYM shows it as #11.
	bonusSlugs: ['magdalena-bay-mercurial-world']
	// The RYM description for 2021 has no playlist link. Add it here when available:
	// spotifyPlaylistUrl: 'https://open.spotify.com/playlist/...'
});
