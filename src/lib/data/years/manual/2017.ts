import type { ManualYearOverrides } from './types.ts';

/**
 * Hand-authored streaming links for 2017. Paste the exact album URL for each service;
 * leave a value empty to keep the generated search link. Keys are the stable album slugs
 * (same as the artwork file names), so entries survive ranking changes.
 *
 * This file is yours: import:rym and enrich:artwork never write here.
 */
export const overrides2017: ManualYearOverrides = {
	// 01 — Mike Oldfield — Return to Ommadawn
	'mike-oldfield-return-to-ommadawn': {
		spotifyUrl: 'https://open.spotify.com/album/3V3hCBFtp1PMcWPx2bqPyv',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/return-to-ommadawn/1440893253'
	},

	// 02 — Fleet Foxes — Crack-Up
	'fleet-foxes-crack-up': {
		spotifyUrl: 'https://open.spotify.com/album/0xtTojp4zfartyGtbFKN3v',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/crack-up/1209098746'
	},

	// 03 — Alex Cameron — Forced Witness
	'alex-cameron-forced-witness': {
		spotifyUrl: 'https://open.spotify.com/album/3fjXYgK9vNOQaWCP01SLGt',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/forced-witness/1250563294'
	},

	// 04 — Roger Waters — Is This the Life We Really Want?
	'roger-waters-is-this-the-life-we-really-want': {
		spotifyUrl: 'https://open.spotify.com/album/2XhQwji1ixgjca0XzkiTek',
		appleMusicUrl: 'https://geo.music.apple.com/hu/album/is-this-the-life-we-really-want/1227077689'
	},

	// 05 — Steven Wilson — To the Bone
	'steven-wilson-to-the-bone': {
		spotifyUrl: 'https://open.spotify.com/album/1ahl6UmqCDuNy6rJVfRKeC',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/to-the-bone/1234343787'
	},

	// 06 — Foxygen — Hang
	'foxygen-hang': {
		spotifyUrl: 'https://open.spotify.com/album/2gLCtAv2b62c5pvgxQhjjM',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/hang/1166210707'
	},

	// 07 — Paramore — After Laughter
	'paramore-after-laughter': {
		spotifyUrl: 'https://open.spotify.com/album/1c9Sx7XdXuMptGyfCB6hHs',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/after-laughter/1227049864'
	},

	// 08 — Kirin J Callinan — Bravado
	'kirin-j-callinan-bravado': {
		spotifyUrl: 'https://open.spotify.com/album/0aRd8lUy4CsbAUEB2lPa5z',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/bravado/1647931732'
	},

	// 09 — Richard Dawson — Peasant
	'richard-dawson-peasant': {
		spotifyUrl: 'https://open.spotify.com/album/1Yg57d0GXf7ko3fiEmUBvb',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/peasant/1221702805'
	},

	// 10 — Susanne Sundfør — Music for People in Trouble
	'susanne-sundfor-music-for-people-in-trouble': {
		spotifyUrl: 'https://open.spotify.com/album/2ZAJbXL1xXF5JpmmjikGHa',
		appleMusicUrl: 'https://geo.music.apple.com/au/album/music-for-people-in-trouble/1235818894'
	},

	// 11 — Iglooghost — Neō Wax Bloom
	'iglooghost-neo-wax-bloom': {
		spotifyUrl: 'https://open.spotify.com/album/4GtJxsVNIZIm5setTuWQxk',
		appleMusicUrl: 'https://geo.music.apple.com/ca/album/ne%C5%8D-wax-bloom/1266657791'
	},

	// 12 — Brand New — Science Fiction
	'brand-new-science-fiction': {
		spotifyUrl: 'https://open.spotify.com/album/0AgXN1CDiJ4XJQy4Sl6pyH',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/science-fiction/1553595811'
	},

	// 13 — Pain of Salvation — In the Passing Light of Day
	'pain-of-salvation-in-the-passing-light-of-day': {
		spotifyUrl: 'https://open.spotify.com/album/3p3jOZI2RjHPVpu7kfgjOB',
		appleMusicUrl: 'https://geo.music.apple.com/ru/album/in-the-passing-light-of-day/1175466340'
	},

	// 14 — Caligula's Horse — Songs for No One
	'caligula-s-horse-songs-for-no-one': {
		// The list entry links to the single "Songs for No One"; the album is "In Contact".
		album: 'In Contact',
		rymUrl: 'https://rateyourmusic.com/release/album/caligulas-horse/in-contact/',
		spotifyUrl: 'https://open.spotify.com/album/76ffWagOEq3L48KPzK1zIj',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/in-contact/1264031539'
	},

	// 15 — Carpenter Brut — CARPENTERBRUTLIVE
	'carpenter-brut-carpenterbrutlive': {
		spotifyUrl: 'https://open.spotify.com/album/6kJuATIGbPYxHmRoWCC5IB',
		appleMusicUrl: 'https://geo.music.apple.com/it/album/carpenterbrutlive/1443206326'
	},

	// 16 — Forest Swords — Compassion
	'forest-swords-compassion': {
		spotifyUrl: 'https://open.spotify.com/album/3Mp0TZs7hlVdjUO0LVTlqh',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/compassion/1212863275'
	},

	// 17 — Threshold — Legends of the Shires
	'threshold-legends-of-the-shires': {
		spotifyUrl: 'https://open.spotify.com/album/00ne0iFQv1qFKcP6Th1EkD',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/legends-of-the-shires/1458761311'
	},

	// 18 — The War on Drugs — A Deeper Understanding
	'the-war-on-drugs-a-deeper-understanding': {
		spotifyUrl: 'https://open.spotify.com/album/4TkmrrpjlPoCPpGyDN3rkF',
		appleMusicUrl: 'https://geo.music.apple.com/au/album/a-deeper-understanding/1242366660'
	},

	// 19 — Leprous — Malina
	'leprous-malina': {
		spotifyUrl: 'https://open.spotify.com/album/0DvboP39IwpnJU9QrKIpDW',
		appleMusicUrl: 'https://geo.music.apple.com/ru/album/malina/1247616982'
	},

	// 20 — Bjørn Riis — Forever Comes to an End
	'bjorn-riis-forever-comes-to-an-end': {
		spotifyUrl: 'https://open.spotify.com/album/5H6GJkjV9KsnCn4g0nWzSF',
		// Not in the US store; the US-only edition is 1624636379.
		appleMusicUrl: 'https://geo.music.apple.com/br/album/forever-comes-to-an-end/1228378631'
	}
};
