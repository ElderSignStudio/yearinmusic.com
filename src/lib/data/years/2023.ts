/**
 * 2023 — built from real imported data (a Top 15).
 * Album data, statistics, playlist and artwork come from generated/2023.json;
 * exact streaming links from manual/2023.ts; everything editorial lives here.
 */
import type { ImportedYearData } from '#lib/types/imported.js';
import generated from './generated/2023.json';
import { overrides2023 } from './manual/2023.ts';
import { createYear } from './compose.js';

export const year2023 = createYear(generated as ImportedYearData, overrides2023, {
	// The coral-pink western shirt that fills the foreground of Hayden Pedigo's cover.
	accent: '#e36f78',
	intro: {
		'pt-BR': [
			'Bem-vindo ao meu Top 15 dos melhores álbuns lançados em 2023!',
			'Avaliei 104 álbuns lançados em 2023, um pouco menos do que em 2022 (quando avaliei 107 álbuns).'
		]
	},
	previousYearAlbumsRated: 107
});
