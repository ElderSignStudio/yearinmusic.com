import type { Localized } from '#lib/types/year.js';

/** Editorial names for RateYourMusic's rating buckets. English falls back to the imported label. */
export const RATING_LABELS: Record<number, Localized> = {
	5: { 'pt-BR': 'Obras-primas', en: 'Masterpieces' },
	4.5: { 'pt-BR': 'Incríveis', en: 'Amazing' },
	4: { 'pt-BR': 'Ótimos', en: 'Great' },
	3.5: { 'pt-BR': 'Bons', en: 'Good' },
	3: { 'pt-BR': 'Acima da média', en: 'Above Average' },
	2.5: { 'pt-BR': 'Nada de especial', en: 'Nothing Special' },
	2: { 'pt-BR': 'Ruins', en: 'Bad' },
	1.5: { 'pt-BR': 'Muito ruins', en: 'Very Bad' },
	1: { 'pt-BR': 'Horríveis', en: 'Horrible' },
	0.5: { 'pt-BR': 'Péssimos', en: 'Awful' },
	0: { 'pt-BR': 'Lixo', en: 'Filth' }
};

export function ratingLabel(rating: number, importedEnglish?: string): Localized {
	const known = RATING_LABELS[rating];
	return {
		'pt-BR': known?.['pt-BR'] ?? importedEnglish ?? String(rating),
		en: importedEnglish ?? known?.en ?? String(rating)
	};
}
