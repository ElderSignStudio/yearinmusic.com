import type { ManualYearOverrides } from './types.ts';

/**
 * Hand-authored streaming links for 2019. Paste the exact album URL for each service;
 * leave a value empty to keep the generated search link. Keys are the stable album slugs
 * (same as the artwork file names), so entries survive ranking changes.
 *
 * This file is yours: import:rym and enrich:artwork never write here.
 */
export const overrides2019: ManualYearOverrides = {
	// 01 — Devin Townsend — Empath
	'devin-townsend-empath': {
		spotifyUrl: 'https://open.spotify.com/album/390ICqbKApwBzd0u8mpuCx',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/empath/1449835973'
	},

	// 02 — Insomnium — Heart Like a Grave
	'insomnium-heart-like-a-grave': {
		spotifyUrl: 'https://open.spotify.com/album/6Z7jp3MKzJhzwHCvEauLPl',
		appleMusicUrl:
			'https://geo.music.apple.com/us/album/heart-like-a-grave-bonus-tracks-version/1472537522'
	},

	// 03 — Cheeto's Magazine — Amazingous
	'cheeto-s-magazine-amazingous': {
		spotifyUrl: 'https://open.spotify.com/album/2MTRjt1xIbYSnTYecbHQsO',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/amazingous/1450515107'
	},

	// 04 — Clément Belio — Patience
	'clement-belio-patience': {
		spotifyUrl: 'https://open.spotify.com/album/5gzfks5VfbAymeivdCxOOK',
		appleMusicUrl: 'https://music.apple.com/gb/album/patience/1462079599'
	},

	// 05 — Arch Echo — You Won't Believe What Happens Next!
	'arch-echo-you-won-t-believe-what-happens-next': {
		spotifyUrl: 'https://open.spotify.com/album/45MaDCNUdNe2usYMK2PqgB',
		appleMusicUrl:
			'https://geo.music.apple.com/us/album/you-wont-believe-what-happens-next/1460528492'
	},

	// 06 — Wilderun — Veil of Imagination
	'wilderun-veil-of-imagination': {
		spotifyUrl: 'https://open.spotify.com/album/0KO9NudzozMdGwssikEcHz',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/veil-of-imagination/1510817489'
	},

	// 07 — Richard Henshall — The Cocoon
	'richard-henshall-the-cocoon': {
		spotifyUrl: 'https://open.spotify.com/album/1cPMQitAEN3jBBrVrKjOmJ',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/the-cocoon/1474136370'
	},

	// 08 — Nick Cave and The Bad Seeds — Ghosteen
	'nick-cave-and-the-bad-seeds-ghosteen': {
		spotifyUrl: 'https://open.spotify.com/album/5TkXgoeyGznBNOjrw17eA7',
		appleMusicUrl: 'https://geo.music.apple.com/au/album/ghosteen/1479214340'
	},

	// 09 — Carly Rae Jepsen — Dedicated
	'carly-rae-jepsen-dedicated': {
		spotifyUrl: 'https://open.spotify.com/album/25it7uSpNFuRoD6uNc0Tfu',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/dedicated/1459935069'
	},

	// 10 — Bon Iver — i,i
	'bon-iver-i-i': {
		spotifyUrl: 'https://open.spotify.com/album/0aldG5AoqOUDkEbsGtI9TW',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/i-i/1470962625'
	}
};
