import type { ManualYearOverrides } from './types.ts';

/**
 * Hand-authored streaming links for 2026. Paste the exact album URL for each service;
 * leave a value empty to keep the generated search link. Keys are the stable album slugs
 * (same as the artwork file names), so entries survive ranking changes.
 *
 * This file is yours: import:rym and enrich:artwork never write here.
 */
export const overrides2026: ManualYearOverrides = {
	// 01 — Cell — Live in Poland
	'cell-live-in-poland': {
		// RYM lists no genres for this release.
		primaryGenres: ['Psybient', 'Downtempo'],
		spotifyUrl: 'https://open.spotify.com/album/3Tnt9cGlR1VX948T8uIMOT',
		appleMusicUrl: 'https://music.apple.com/gb/album/live-in-poland/6820053217'
	},

	// 02 — Boards of Canada — Inferno
	'boards-of-canada-inferno': {
		spotifyUrl: 'https://open.spotify.com/album/0mu3EvWYfNwBfISSg0q03p',
		appleMusicUrl: 'https://music.apple.com/gb/album/inferno/1890015523'
	},

	// 03 — Droid Bishop — Frontiers
	'droid-bishop-frontiers': {
		spotifyUrl: 'https://open.spotify.com/album/0YB2ikCJrJUiCotPmRJA9e',
		appleMusicUrl: 'https://music.apple.com/gb/album/frontiers/1894284661'
	},

	// 04 — Iapetus — The Mother Void
	'iapetus-the-mother-void': {
		spotifyUrl: 'https://open.spotify.com/album/6ipNjJ6lW6m3NnaZ3SAIEJ',
		appleMusicUrl: 'https://music.apple.com/gb/album/the-mother-void/6790585327'
	},

	// 05 — Steven Wilson — Requiem for a Village
	'steven-wilson-requiem-for-a-village': {
		spotifyUrl: 'https://open.spotify.com/album/6SRNqCA1HogMn38sM1nd8Q',
		appleMusicUrl: 'https://music.apple.com/gb/album/requiem-for-a-village/6779529412'
	},

	// 06 — Einar Solberg — Vox occulta
	'einar-solberg-vox-occulta': {
		spotifyUrl: 'https://open.spotify.com/album/4ISmFYRQoPhbzdbFv8179R',
		appleMusicUrl: 'https://music.apple.com/gb/album/vox-occulta/1859985673'
	},

	// 07 — Fabiano do Nascimento & Vittor Santos Orchestra — Vila
	'fabiano-do-nascimento-vila': {
		// The import keeps only the first credited artist of the collaboration.
		artist: 'Fabiano do Nascimento & Vittor Santos Orchestra',
		spotifyUrl: 'https://open.spotify.com/album/6irs8cDzSNLsy8UL0ZeAes',
		appleMusicUrl: 'https://music.apple.com/gb/album/vila/1855948512'
	},

	// 08 — My New Band Believe — My New Band Believe
	'my-new-band-believe-my-new-band-believe': {
		spotifyUrl: 'https://open.spotify.com/album/0FypCc1StF9mNiLemcuJ3J',
		appleMusicUrl: 'https://music.apple.com/gb/album/my-new-band-believe/1866890640'
	},

	// 09 — Gladenfold — Soulbound
	'gladenfold-soulbound': {
		spotifyUrl: 'https://open.spotify.com/album/5sxBSdrWYHSJUKiGUoD8FW',
		appleMusicUrl: 'https://music.apple.com/gb/album/soulbound/1854973210'
	},

	// 10 — Gloryhammer — Space 1993: Wrath of Kor-Virliath
	'gloryhammer-space-1993-wrath-of-kor-virliath': {
		spotifyUrl: 'https://open.spotify.com/album/6omfB3FEnCZjXjsH1AMoCI',
		appleMusicUrl: 'https://music.apple.com/gb/album/space-1993-wrath-of-kor-virliath/6782098667'
	},

	// 11 — Insomnium — Netherworlds
	'insomnium-netherworlds': {
		spotifyUrl: 'https://open.spotify.com/album/4951xpcIwMAPnhBzCY47dn',
		appleMusicUrl: 'https://music.apple.com/gb/album/netherworlds/6789116125'
	},

	// 12 — Triosphere — Oceans Above, Stars Below
	'triosphere-oceans-above-stars-below': {
		spotifyUrl: 'https://open.spotify.com/album/6mgHyrEwwUUaXQ9Fk5vdWQ',
		appleMusicUrl: 'https://music.apple.com/gb/album/oceans-above-stars-below/1895034965'
	},

	// 13 — Devin Townsend — The Moth
	'devin-townsend-the-moth': {
		spotifyUrl: 'https://open.spotify.com/album/3VyHoK8vgzbFEGdLPDIUWW',
		appleMusicUrl: 'https://music.apple.com/gb/album/the-moth-deluxe-edition/1879554321'
	},

	// 14 — Ozric Tentacles — Harmonic Mind
	'ozric-tentacles-harmonic-mind': {
		spotifyUrl: 'https://open.spotify.com/album/1VeSXm0JuCYfKGpBj3kNDV',
		appleMusicUrl: 'https://music.apple.com/gb/album/harmonic-mind/6788680535'
	},

	// 15 — The Lemon Twigs — Look for Your Mind!
	'the-lemon-twigs-look-for-your-mind': {
		spotifyUrl: 'https://open.spotify.com/album/4TSzbco3bzQfnqj3KL196w',
		appleMusicUrl: 'https://music.apple.com/gb/album/look-for-your-mind/6789935518'
	},

	// 16 — Chelsea Wolfe — The Dark
	'chelsea-wolfe-the-dark': {
		spotifyUrl: 'https://open.spotify.com/album/4gpQHITIKf01iFm9gtcmLA',
		appleMusicUrl: 'https://music.apple.com/gb/album/the-dark/6781765812'
	},

	// 17 — Marina Herlop — Dja Dja
	'marina-herlop-dja-dja': {
		spotifyUrl: 'https://open.spotify.com/album/2EzFFqkhvaXUaTzcWwWUDZ',
		appleMusicUrl: 'https://music.apple.com/gb/album/dja-dja/6793133608'
	},

	// 18 — Phoebe Bridgers — Lost Weekend
	'phoebe-bridgers-lost-weekend': {
		spotifyUrl: 'https://open.spotify.com/album/2NSzwyYvQvdOQAoEjrlw9c',
		appleMusicUrl: 'https://music.apple.com/gb/album/lost-weekend/6781051268'
	},

	// 19 — Parius — Alchestronomy
	'parius-alchestronomy': {
		spotifyUrl: 'https://open.spotify.com/album/2NP9AHsaOvi4c1MwjPx38k',
		appleMusicUrl: 'https://music.apple.com/gb/album/alchestronomy/6805555953'
	},

	// 20 — Hana Stretton — Tiarn
	'hana-stretton-tiarn': {
		spotifyUrl: 'https://open.spotify.com/album/2Kt7Izz50rQVGCxalT4NQT',
		appleMusicUrl: 'https://music.apple.com/gb/album/tiarn/6781275336'
	}
};
