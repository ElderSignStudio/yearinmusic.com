/**
 * Special editions: standalone publications outside the yearly rankings.
 *
 * Adding one = add an entry here, then run `npm run generate:social`, which renders its
 * square cover (`artwork`) and its share cards. The page, the archive entry, the metadata
 * and the callout on its final year's page all derive from this list.
 */
import type { SpecialEdition } from '#lib/types/specialEdition.js';

export const specialEditions: readonly SpecialEdition[] = [
	{
		slug: '2022-2026',
		years: [2022, 2026],
		theme: { accent: '#cdb892' },
		title: { en: 'Five Years of Songs', 'pt-BR': 'Cinco Anos de Músicas' },
		lede: {
			en: ['The best songs of the last five years.', 'One song per artist.'],
			'pt-BR': ['As melhores músicas dos últimos cinco anos.', 'Uma música por artista.']
		},
		summary: {
			en: 'The best songs of 2022–2026, collected from five years of Year in Music playlists.',
			'pt-BR':
				'As melhores músicas de 2022–2026, reunidas de cinco anos de playlists do Year in Music.'
		},
		callout: {
			en: 'The five annual playlists, brought together.',
			'pt-BR': 'As cinco playlists anuais, reunidas.'
		},
		note: {
			en: 'Collected from the annual Best Songs playlists, 2022 to 2026.',
			'pt-BR': 'Reunidas das playlists anuais de melhores músicas, de 2022 a 2026.'
		},
		artwork: '/special/2022-2026.jpg',
		spotifyPlaylistUrl: 'https://open.spotify.com/playlist/02mPOKv5f3zZa3wT1XAtyX'
	}
];

export function getSpecialEdition(slug: string): SpecialEdition | undefined {
	return specialEditions.find((e) => e.slug === slug);
}

/** Editions whose range closes with `year`: they are announced on that year's page. */
export function specialEditionsEndingIn(year: number): SpecialEdition[] {
	return specialEditions.filter((e) => e.years[1] === year);
}

/** `2022—2026`: the range as the site writes it, with an em dash. */
export function formatYearRange(edition: SpecialEdition): string {
	return `${edition.years[0]}—${edition.years[1]}`;
}
