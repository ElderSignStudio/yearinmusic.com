/**
 * 2024 — built from real imported data.
 * Album data, statistics, playlist and artwork come from generated/2024.json;
 * exact streaming links from manual/2024.ts; everything editorial lives here.
 */
import type { ImportedYearData } from '#lib/types/imported.js';
import generated from './generated/2024.json';
import { overrides2024 } from './manual/2024.ts';
import { createYear } from './compose.js';

export const year2024 = createYear(generated as ImportedYearData, overrides2024, {
	// The burnt-orange field and sun glow of Alcest's "Les chants de l'aurore" cover.
	accent: '#d98f63',
	intro: {
		'pt-BR': [
			'Bem-vindo ao meu Top 20 dos melhores álbuns lançados em 2024!',
			'Avaliei 168 álbuns lançados em 2024, bem mais do que em 2023 (quando avaliei 104 álbuns).'
		]
	},
	previousYearAlbumsRated: 104
});
