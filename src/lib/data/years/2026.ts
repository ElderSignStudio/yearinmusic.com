/**
 * 2026 — built from real imported data.
 * Album data, statistics, playlist and artwork come from generated/2026.json;
 * exact streaming links from manual/2026.ts; everything editorial lives here.
 */
import type { ImportedYearData } from '#lib/types/imported.js';
import generated from './generated/2026.json';
import { overrides2026 } from './manual/2026.ts';
import { createYear } from './compose.js';

export const year2026 = createYear(generated as ImportedYearData, overrides2026, {
	// The blue-green berries scattered through the golden foliage of Cell's "Live in Poland".
	// The gold itself already belongs to 2025, so the teal keeps 2026 distinct.
	accent: '#6db3b3',
	intro: {
		'pt-BR': [
			'Bem-vindo ao meu Top 20 dos melhores álbuns lançados em 2026!',
			'Avaliei 131 álbuns lançados em 2026, menos do que em 2025 (quando avaliei 157 álbuns).'
		]
	},
	// As written in the 2026 text; the published 2025 page states 159 and takes precedence.
	previousYearAlbumsRated: 157
});
