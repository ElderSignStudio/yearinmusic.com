/**
 * 2017 — built from real imported data (a Top 20).
 * Album data, statistics and artwork come from generated/2017.json;
 * exact streaming links from manual/2017.ts; everything editorial lives here.
 */
import type { ImportedYearData } from '#lib/types/imported.js';
import generated from './generated/2017.json';
import { overrides2017 } from './manual/2017.ts';
import { createYear } from './compose.js';

export const year2017 = createYear(generated as ImportedYearData, overrides2017, {
	// The orange title lettering, the one colour in the grey snowscape of "Return to Ommadawn".
	accent: '#e5912f',
	intro: {
		'pt-BR': [
			'Bem-vindo ao meu Top 20 dos melhores álbuns lançados em 2017!',
			'Em 2017, avaliei 170 álbuns, 111 (65%) deles lançados em 2017.'
		]
	}
});
