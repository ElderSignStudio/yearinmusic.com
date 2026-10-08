/**
 * 2019 — built from real imported data (a Top 10).
 * Album data, statistics and artwork come from generated/2019.json;
 * exact streaming links from manual/2019.ts; everything editorial lives here.
 * Artwork is still the 150px RYM thumbnail for most albums: drop full-size covers into
 * imports/artwork/2019/ and re-run enrich:artwork --force.
 */
import type { ImportedYearData } from '#lib/types/imported.js';
import generated from './generated/2019.json';
import { overrides2019 } from './manual/2019.ts';
import { createYear } from './compose.js';

export const year2019 = createYear(generated as ImportedYearData, overrides2019, {
	// The green band of the rainbow logotype on Devin Townsend's "Empath" cover.
	accent: '#7fbf7b',
	intro: {
		'pt-BR': [
			'Bem-vindo ao meu Top 10 dos melhores álbuns lançados em 2019!',
			'2019 foi um ano musical mais lento para mim (ter um filho faz isso com a gente). Por isso um Top 10 este ano, e não um Top 20 como sempre.',
			'Avaliei 68 álbuns lançados em 2019 (em 2018, avaliei 111 lançados naquele ano).'
		]
	},
	// As written in the 2019 text; the published 2018 page states 96 and takes precedence.
	previousYearAlbumsRated: 111
});
