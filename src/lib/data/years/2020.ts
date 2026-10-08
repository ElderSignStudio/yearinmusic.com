/**
 * 2020 — built from real imported data (a Top 10).
 * Album data, statistics and artwork come from generated/2020.json;
 * exact streaming links from manual/2020.ts; everything editorial lives here.
 */
import type { ImportedYearData } from '#lib/types/imported.js';
import generated from './generated/2020.json';
import { overrides2020 } from './manual/2020.ts';
import { createYear } from './compose.js';

export const year2020 = createYear(generated as ImportedYearData, overrides2020, {
	// The turquoise of the great wave on Pendragon's "Love Over Fear" cover.
	accent: '#63b8dc',
	intro: {
		'pt-BR': [
			'Bem-vindo ao meu Top 10 dos melhores álbuns lançados em 2020!',
			'Avaliei 56 álbuns lançados em 2020 (em 2019, avaliei 68 álbuns).'
		]
	},
	previousYearAlbumsRated: 68
	// The RYM description for 2020 has no playlist link. Add it here when available:
	// spotifyPlaylistUrl: 'https://open.spotify.com/playlist/...'
});
