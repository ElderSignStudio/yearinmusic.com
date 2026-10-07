/**
 * 2025 — the first edition built from real imported data.
 * Album data, statistics, playlist and artwork come from generated/2025.json;
 * exact streaming links from manual/2025.ts; everything editorial lives here.
 */
import type { ImportedYearData } from '#lib/types/imported.js';
import generated from './generated/2025.json';
import { overrides2025 } from './manual/2025.ts';
import { createYear } from './compose.js';

export const year2025 = createYear(generated as ImportedYearData, overrides2025, {
	// Pulled from the gold of the Moron Police logotype and the sunset light on the Pachinko cover.
	accent: '#d9a441',
	intro: {
		'pt-BR': [
			'Bem-vindo ao meu Top 20 dos melhores álbuns lançados em 2025!',
			'Avaliei 157 álbuns lançados em 2025, um pouco menos do que em 2024 (quando avaliei 168 álbuns).'
		]
	},
	previousYearAlbumsRated: 168
});
