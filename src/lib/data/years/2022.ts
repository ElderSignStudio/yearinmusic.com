/**
 * 2022 — built from real imported data (a Top 25).
 * Album data, statistics and artwork come from generated/2022.json;
 * exact streaming links from manual/2022.ts; everything editorial lives here.
 */
import type { ImportedYearData } from '#lib/types/imported.js';
import generated from './generated/2022.json';
import { overrides2022 } from './manual/2022.ts';
import { createYear } from './compose.js';

export const year2022 = createYear(generated as ImportedYearData, overrides2022, {
	// The steel-blue stained glass of the cathedral lattice on Ghost's "Impera" cover.
	accent: '#8aa9c6',
	intro: {
		'pt-BR': [
			'Bem-vindo ao meu Top 25 dos melhores álbuns lançados em 2022!',
			'Avaliei 107 álbuns lançados em 2022, menos do que em 2021 (quando avaliei 130 álbuns).'
		]
	},
	previousYearAlbumsRated: 130
	// The RYM description for 2022 has no playlist link. Add it here when available:
	// spotifyPlaylistUrl: 'https://open.spotify.com/playlist/...'
});
