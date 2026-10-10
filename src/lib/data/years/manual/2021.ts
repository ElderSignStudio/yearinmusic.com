import type { ManualYearOverrides } from './types.ts';

/**
 * Hand-authored streaming links for 2021. Paste the exact album URL for each service;
 * leave a value empty to keep the generated search link. Keys are the stable album slugs
 * (same as the artwork file names), so entries survive ranking changes.
 *
 * This file is yours: import:rym and enrich:artwork never write here.
 */
export const overrides2021: ManualYearOverrides = {
	// 01 — SPELLLING — The Turning Wheel
	'spellling-the-turning-wheel': {
		spotifyUrl: 'https://open.spotify.com/album/0vzzI81Sz2JAr4dVo8rrIj',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/the-turning-wheel/1560029728'
	},

	// 02 — Leprous — Aphelion
	'leprous-aphelion': {
		spotifyUrl: 'https://open.spotify.com/album/1FqPZscG7gDH6utCpoWnkG',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/aphelion/1570655864'
	},

	// 03 — The Weather Station — Ignorance
	'the-weather-station-ignorance': {
		spotifyUrl: 'https://open.spotify.com/album/3KeR5BDM2giFr8zoSXBrgE',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/ignorance/1524055739'
	},

	// 04 — James Blake — Friends That Break Your Heart
	'james-blake-friends-that-break-your-heart': {
		spotifyUrl: 'https://open.spotify.com/album/1zNtJFMCNIyT0X19jpcI3j',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/friends-that-break-your-heart/1576618878'
	},

	// 05 — Dalriada — Őszelő
	'dalriada-oszelo': {
		spotifyUrl: 'https://open.spotify.com/album/4cCPjkpakIJlyawxNWDcHe',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/%C5%91szel%C5%91/1556108191'
	},

	// 06 — Steven Wilson — The Future Bites
	'steven-wilson-the-future-bites': {
		spotifyUrl: 'https://open.spotify.com/album/3pKcnjRoxCR1XMIHqBxn3L',
		// Not in the US store, where only the deluxe edition 1582188266 exists.
		appleMusicUrl: 'https://geo.music.apple.com/gb/album/the-future-bites/1530202084'
	},

	// 07 — Raven Sad — The Leaf and the Wing
	'raven-sad-the-leaf-and-the-wing': {
		spotifyUrl: 'https://open.spotify.com/album/3KT8VSP42eiS8t5M2szqrR',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/the-leaf-and-the-wing/1547627033'
	},

	// 08 — Wheel — Resident Human
	'wheel-resident-human': {
		spotifyUrl: 'https://open.spotify.com/album/0FsuN8gXaI9DgcRHgwICxA',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/resident-human/1646530774'
	},

	// 09 — Liquid Tension Experiment — Liquid Tension Experiment 3
	'liquid-tension-experiment-liquid-tension-experiment-3': {
		spotifyUrl: 'https://open.spotify.com/album/6GDFV4kWsQDYuah6tSqmu2',
		appleMusicUrl: 'https://geo.music.apple.com/gb/album/lte3-deluxe-edition/1547849672'
	},

	// 10 — Anneke van Giersbergen — The Darkest Skies Are the Brightest
	'anneke-van-giersbergen-the-darkest-skies-are-the-brightest': {
		spotifyUrl: 'https://open.spotify.com/album/6MEBn5n2uktdaned7Zc91o',
		appleMusicUrl:
			'https://geo.music.apple.com/us/album/the-darkest-skies-are-the-brightest/1541054468'
	},

	// 11 — Magdalena Bay — Mercurial World
	'magdalena-bay-mercurial-world': {
		spotifyUrl: 'https://open.spotify.com/album/1ERrUvG31thFCxdwWUoJrY',
		appleMusicUrl: 'https://geo.music.apple.com/br/album/mercurial-world/1570541671'
	}
};
