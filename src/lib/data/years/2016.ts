/**
 * 2016 — built from real imported data (a Top 20).
 * Album data, statistics and artwork come from generated/2016.json;
 * exact streaming links from manual/2016.ts; everything editorial lives here.
 * Artwork is still the 150px RYM thumbnail: drop full-size covers into
 * imports/artwork/2016/ and re-run enrich:artwork --force.
 */
import type { ImportedYearData } from '#lib/types/imported.js';
import generated from './generated/2016.json';
import { overrides2016 } from './manual/2016.ts';
import { createYear } from './compose.js';

export const year2016 = createYear(generated as ImportedYearData, overrides2016, {
	// The muted teal sky behind the falling bird on Katatonia's "The Fall of Hearts" cover.
	accent: '#7fb3a6',
	intro: {
		'pt-BR': [
			'Bem-vindo ao meu Top 20 dos melhores álbuns lançados em 2016!',
			'Avaliei 141 álbuns lançados em 2016.'
		]
	}
});
