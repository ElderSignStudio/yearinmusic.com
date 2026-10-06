/**
 * SAMPLE DATA — 2023
 * A deliberately small stub so year navigation, the archive and per-year accent
 * switching can be evaluated. Replace with the real list.
 */
import type { YearData } from '#lib/types/year.js';

const art = (rank: number) => `/artwork/2023/${String(rank).padStart(2, '0')}.svg`;
const placeholderLinks = (slug: string) => ({
	spotifyUrl: `https://open.spotify.com/album/PLACEHOLDER-${slug}`,
	appleMusicUrl: `https://music.apple.com/album/PLACEHOLDER-${slug}`,
	rymUrl: `https://rateyourmusic.com/release/album/PLACEHOLDER/${slug}/`
});

export const year2023: YearData = {
	year: 2023,
	theme: { accent: '#7fb7a4' },
	intro: {
		'pt-BR': [
			'Bem-vindo ao meu top dos melhores álbuns lançados em 2023!',
			'Avaliei 104 álbuns lançados em 2023.'
		],
		en: ['Welcome to my top best albums released in 2023!', 'I rated 104 albums released in 2023.']
	},
	totalAlbumsRated: 104,
	previousYearAlbumsRated: 97,
	ratingDistribution: [
		{ rating: 5, label: { 'pt-BR': 'Obras-primas', en: 'Masterpieces' }, count: 2 },
		{ rating: 4.5, label: { 'pt-BR': 'Incríveis', en: 'Amazing' }, count: 9 },
		{ rating: 4, label: { 'pt-BR': 'Ótimos', en: 'Great' }, count: 18 },
		{ rating: 3.5, label: { 'pt-BR': 'Bons', en: 'Good' }, count: 41 },
		{ rating: 3, label: { 'pt-BR': 'Acima da média', en: 'Above Average' }, count: 22 },
		{ rating: 2.5, label: { 'pt-BR': 'Nada de especial', en: 'Nothing Special' }, count: 10 },
		{ rating: 2, label: { 'pt-BR': 'Ruins', en: 'Bad' }, count: 2 },
		{ rating: 1, label: { 'pt-BR': 'Horríveis', en: 'Horrible' }, count: 0 },
		{ rating: 0, label: { 'pt-BR': 'Lixo', en: 'Filth' }, count: 0 }
	],
	rymListUrl: 'https://rateyourmusic.com/list/PLACEHOLDER/2023/',
	spotifyPlaylistUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4JAvHpjipBk',
	albums: [
		{
			rank: 1,
			artist: 'Linnea Vasquez',
			album: 'Orchard Light',
			artwork: art(1),
			primaryGenres: ['Indie Folk', 'Americana'],
			...placeholderLinks('orchard-light')
		},
		{
			rank: 2,
			artist: 'Cold Harbour Collective',
			album: 'Dispatches',
			artwork: art(2),
			primaryGenres: ['Post-Punk', 'Art Punk'],
			...placeholderLinks('dispatches')
		},
		{
			rank: 3,
			artist: 'Mãe d’Água',
			album: 'Correnteza',
			artwork: art(3),
			primaryGenres: ['MPB', 'Psychedelic Folk'],
			...placeholderLinks('correnteza')
		},
		{
			rank: 4,
			artist: 'Pell & Morrow',
			album: 'Two Rooms',
			artwork: art(4),
			primaryGenres: ['Contemporary Folk', 'Chamber Folk'],
			...placeholderLinks('two-rooms')
		},
		{
			rank: 5,
			artist: 'ØRBIT',
			album: 'Satellite Hymns',
			artwork: art(5),
			primaryGenres: ['Progressive Electronic', 'Ambient Techno'],
			...placeholderLinks('satellite-hymns')
		},
		{
			rank: 6,
			artist: 'Juno Reyes',
			album: 'Paper Birds',
			artwork: art(6),
			primaryGenres: ['Alternative R&B', 'Neo-Soul'],
			...placeholderLinks('paper-birds')
		},
		{
			rank: 7,
			artist: 'Greyfield',
			album: 'Hinterland',
			artwork: art(7),
			primaryGenres: ['Post-Rock', 'Ambient'],
			...placeholderLinks('hinterland')
		},
		{
			rank: 8,
			artist: 'Tomás Avelar',
			album: 'Fado Elétrico',
			artwork: art(8),
			primaryGenres: ['Fado', 'Art Pop'],
			...placeholderLinks('fado-eletrico')
		}
	]
};
