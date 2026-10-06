/**
 * SAMPLE DATA — 2024
 * Artists, albums, genres, URLs and artwork are placeholders used to evaluate the
 * design. Replace with the real RateYourMusic export and local artwork files.
 */
import type { YearData } from '#lib/types/year.js';

const art = (rank: number) => `/artwork/2024/${String(rank).padStart(2, '0')}.svg`;
const placeholderLinks = (slug: string) => ({
	spotifyUrl: `https://open.spotify.com/album/PLACEHOLDER-${slug}`,
	appleMusicUrl: `https://music.apple.com/album/PLACEHOLDER-${slug}`,
	rymUrl: `https://rateyourmusic.com/release/album/PLACEHOLDER/${slug}/`
});

export const year2024: YearData = {
	year: 2024,
	theme: { accent: '#e2b45f' },
	intro: {
		'pt-BR': [
			'Bem-vindo ao meu top 20 dos melhores álbuns lançados em 2024!',
			'Avaliei 168 álbuns lançados em 2024, bem mais do que em 2023 (avaliei 104 álbuns lançados naquele ano).'
		],
		en: [
			'Welcome to my top 20 best albums released in 2024!',
			'I rated 168 albums released in 2024, a lot more than in 2023 (I rated 104 albums released that year).'
		]
	},
	totalAlbumsRated: 168,
	previousYearAlbumsRated: 104,
	ratingDistribution: [
		{ rating: 5, label: { 'pt-BR': 'Obras-primas', en: 'Masterpieces' }, count: 3 },
		{ rating: 4.5, label: { 'pt-BR': 'Incríveis', en: 'Amazing' }, count: 15 },
		{ rating: 4, label: { 'pt-BR': 'Ótimos', en: 'Great' }, count: 26 },
		{ rating: 3.5, label: { 'pt-BR': 'Bons', en: 'Good' }, count: 72 },
		{ rating: 3, label: { 'pt-BR': 'Acima da média', en: 'Above Average' }, count: 30 },
		{ rating: 2.5, label: { 'pt-BR': 'Nada de especial', en: 'Nothing Special' }, count: 20 },
		{ rating: 2, label: { 'pt-BR': 'Ruins', en: 'Bad' }, count: 2 },
		{ rating: 1, label: { 'pt-BR': 'Horríveis', en: 'Horrible' }, count: 0 },
		{ rating: 0, label: { 'pt-BR': 'Lixo', en: 'Filth' }, count: 0 }
	],
	// TODO: replace with the real RYM yearly list URL.
	rymListUrl: 'https://rateyourmusic.com/list/PLACEHOLDER/2024/',
	// TODO: replace with the real yearly playlist. The ID below is a public Spotify
	// playlist so the embed renders during design review.
	spotifyPlaylistUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
	albums: [
		{
			rank: 1,
			artist: 'Vera Lumen',
			album: 'Cathedrals of Static',
			artwork: art(1),
			primaryGenres: ['Art Rock', 'Experimental Rock', 'Post-Rock'],
			...placeholderLinks('cathedrals-of-static')
		},
		{
			rank: 2,
			artist: 'The Hollow Orchard',
			album: 'Salt',
			artwork: art(2),
			primaryGenres: ['Indie Folk', 'Chamber Folk'],
			...placeholderLinks('salt')
		},
		{
			rank: 3,
			artist: 'Mirabel Quartet',
			album: 'Études for a Vanishing City',
			artwork: art(3),
			primaryGenres: ['Modern Classical', 'Minimalism', 'Ambient'],
			...placeholderLinks('etudes-for-a-vanishing-city')
		},
		{
			rank: 4,
			artist: 'DJ Kaleidoscópio',
			album: 'Baile Infinito',
			artwork: art(4),
			primaryGenres: ['Baile Funk', 'Deconstructed Club', 'UK Bass'],
			...placeholderLinks('baile-infinito')
		},
		{
			rank: 5,
			artist: 'Nour & The Lanterns',
			album: 'A Thousand Small Weathers',
			artwork: art(5),
			primaryGenres: ['Dream Pop', 'Shoegaze'],
			...placeholderLinks('a-thousand-small-weathers')
		},
		{
			rank: 6,
			artist: 'Oskar Brandt',
			album: 'Slow Light',
			artwork: art(6),
			primaryGenres: ['Singer-Songwriter', 'Slowcore'],
			...placeholderLinks('slow-light')
		},
		{
			rank: 7,
			artist: 'KÖNIGSBERG',
			album: 'Iron Hymns for the Lower Deck',
			artwork: art(7),
			primaryGenres: ['Progressive Metal', 'Post-Metal', 'Sludge Metal'],
			...placeholderLinks('iron-hymns-for-the-lower-deck')
		},
		{
			rank: 8,
			artist: 'Pearl Ashby',
			album: 'Honeycomb',
			artwork: art(8),
			primaryGenres: ['Neo-Soul', 'Alternative R&B'],
			...placeholderLinks('honeycomb')
		},
		{
			rank: 9,
			artist: 'Tetrahedron Sound System',
			album: 'Transmission 09',
			artwork: art(9),
			primaryGenres: ['Dub Techno', 'Ambient Dub'],
			...placeholderLinks('transmission-09')
		},
		{
			rank: 10,
			artist: 'Ilse Marrow',
			album: 'The Quiet Arithmetic of Leaving',
			artwork: art(10),
			primaryGenres: ['Chamber Pop', 'Art Pop', 'Baroque Pop'],
			...placeholderLinks('the-quiet-arithmetic-of-leaving')
		},
		{
			rank: 11,
			artist: 'Bairro Alto',
			album: 'Madrugada',
			artwork: art(11),
			primaryGenres: ['MPB', 'Samba', 'Bossa Nova'],
			...placeholderLinks('madrugada')
		},
		{
			rank: 12,
			artist: 'Crane Season',
			album: 'Low Tide Correspondence',
			artwork: art(12),
			primaryGenres: ['Midwest Emo', 'Math Rock'],
			...placeholderLinks('low-tide-correspondence')
		},
		{
			rank: 13,
			artist: 'Yusuf Adeyemi',
			album: 'Lagos / Lisboa',
			artwork: art(13),
			primaryGenres: ['Afrobeat', 'Jazz-Funk', 'Highlife'],
			...placeholderLinks('lagos-lisboa')
		},
		{
			rank: 14,
			artist: 'Wren',
			album: 'II',
			artwork: art(14),
			primaryGenres: ['Post-Punk', 'Coldwave'],
			...placeholderLinks('ii')
		},
		{
			rank: 15,
			artist: 'Hollis Kincaid Trio',
			album: 'Standards in Reverse',
			artwork: art(15),
			primaryGenres: ['Post-Bop', 'Avant-Garde Jazz'],
			...placeholderLinks('standards-in-reverse')
		},
		{
			rank: 16,
			artist: 'Saudade Electric',
			album: 'Lusophone Night Drive',
			artwork: art(16),
			primaryGenres: ['Synthwave', 'Synthpop'],
			...placeholderLinks('lusophone-night-drive')
		},
		{
			rank: 17,
			artist: 'Margaux',
			album: 'Pressed Flowers, Pressed Flowers',
			artwork: art(17),
			primaryGenres: ['Bedroom Pop', 'Indie Pop'],
			...placeholderLinks('pressed-flowers-pressed-flowers')
		},
		{
			rank: 18,
			artist: 'Abyssal Choir',
			album: 'Vespers',
			artwork: art(18),
			primaryGenres: ['Drone', 'Dark Ambient', 'Ritual Ambient'],
			...placeholderLinks('vespers')
		},
		{
			rank: 19,
			artist: 'Big Pelican',
			album: 'Everybody Gets a Trophy',
			artwork: art(19),
			primaryGenres: ['Indie Rock', 'Power Pop'],
			...placeholderLinks('everybody-gets-a-trophy')
		},
		{
			rank: 20,
			artist: 'Ananda Rao',
			album: 'Monsoon Tapes',
			artwork: art(20),
			primaryGenres: ['Hip Hop', 'Abstract Hip Hop', 'Jazz Rap'],
			...placeholderLinks('monsoon-tapes')
		}
	]
};
