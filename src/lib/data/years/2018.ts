/**
 * 2018 — built from real imported data (a Top 20).
 * Album data, statistics and artwork come from generated/2018.json;
 * exact streaming links from manual/2018.ts; everything editorial lives here.
 * Artwork is still the 150px RYM thumbnail: drop full-size covers into
 * imports/artwork/2018/ and re-run enrich:artwork --force.
 */
import type { ImportedYearData } from '#lib/types/imported.js';
import generated from './generated/2018.json';
import { overrides2018 } from './manual/2018.ts';
import { createYear } from './compose.js';

export const year2018 = createYear(generated as ImportedYearData, overrides2018, {
	// The magenta nebula behind the planet on Seventh Wonder's "Tiara" cover.
	accent: '#d46aa8',
	intro: {
		'pt-BR': [
			'Bem-vindo ao meu Top 20 dos melhores álbuns lançados em 2018!',
			'Em 2018, avaliei 229 álbuns, 96 (42%) deles lançados em 2018.',
			'No ano anterior, avaliei 170 álbuns, 111 (65%) deles lançados naquele ano.'
		]
	},
	previousYearAlbumsRated: 111
});
