import type { ManualYearOverrides } from './types.ts';

/**
 * Hand-authored streaming links for 2020. Paste the exact album URL for each service;
 * leave a value empty to keep the generated search link. Keys are the stable album slugs
 * (same as the artwork file names), so entries survive ranking changes.
 *
 * This file is yours: import:rym and enrich:artwork never write here.
 */
export const overrides2020: ManualYearOverrides = {
	// 01 — Pendragon — Love Over Fear
	'pendragon-love-over-fear': {
		spotifyUrl: null,
		appleMusicUrl: null,
		bandcampUrl: 'https://pendragon3.bandcamp.com/album/love-over-fear'
	},

	// 02 — Droid Bishop — Music
	'droid-bishop-music': {
		spotifyUrl: 'https://open.spotify.com/album/5IdWH09lPLMZiWRyaSoEek',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/music/1527522899'
	},

	// 03 — Arch Echo — Story I
	'arch-echo-story-i': {
		spotifyUrl: 'https://open.spotify.com/album/3a0BquAREUzoKbXH51pl3x',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/story-i-ep/1528307147'
	},

	// 04 — Jessie Ware — What's Your Pleasure?
	'jessie-ware-what-s-your-pleasure': {
		spotifyUrl: 'https://open.spotify.com/album/1CTm3ARqDETSm7GfvNYNJp',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/whats-your-pleasure/1498945382'
	},

	// 05 — Adrianne Lenker — Songs
	'adrianne-lenker-songs': {
		spotifyUrl: 'https://open.spotify.com/album/2WKfCjW3EDmgHswj5eVXuG',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/songs/1526437437'
	},

	// 06 — Protest the Hero — Palimpsest
	'protest-the-hero-palimpsest': {
		spotifyUrl: 'https://open.spotify.com/album/3heoigEWJd3HfnFiAdDCbV',
		appleMusicUrl: 'https://geo.music.apple.com/be/album/palimpsest/1513612398'
	},

	// 07 — 青葉市子 [Ichiko Aoba] — アダンの風 [Windswept Adan]
	'ichiko-aoba-windswept-adan': {
		spotifyUrl: 'https://open.spotify.com/album/0clp0SFljD12UGPDOP0kN4',
		appleMusicUrl: 'https://geo.music.apple.com/no/album/windswept-adan/1714304663'
	},

	// 08 — Haken — Virus
	'haken-virus': {
		spotifyUrl: 'https://open.spotify.com/album/16dthDo2uTNNhCxhmPAB3b',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/virus/1503719465'
	},

	// 09 — Laura Marling — Song for Our Daughter
	'laura-marling-song-for-our-daughter': {
		spotifyUrl: 'https://open.spotify.com/album/0ubXthGSkZfe30Nuj91lcu',
		appleMusicUrl: 'https://geo.music.apple.com/gb/album/song-for-our-daughter/1504725670'
	},

	// 10 — Fish — Weltschmerz
	'fish-weltschmerz': {
		spotifyUrl: 'https://open.spotify.com/album/0jKmtAHbwwBmn0e0USRE7C',
		appleMusicUrl: 'https://geo.music.apple.com/us/album/weltschmerz/1525024531'
	}
};
