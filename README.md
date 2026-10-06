# Year in Music

Personal annual music archive: one ranked album list and one Spotify playlist per year, bilingual (Brazilian Portuguese default, English), built as a static SvelteKit site.

## Commands

```sh
npm run dev      # dev server
npm run build    # static build to ./build (adapter-static, fully prerendered)
npm run preview  # serve ./build (restart after rebuilding)
npm run check    # svelte-check
npm run lint     # prettier + eslint
npm run format
```

## Adding a year

1. Create `src/lib/data/years/<year>.ts` exporting a `YearData` object (see `src/lib/types/year.ts`).
2. Put artwork in `static/artwork/<year>/01.webp … 20.webp` and reference it from the data.
3. Register the year in `src/lib/data/years/index.ts`. The newest year becomes `/`, and `/<year>` is prerendered automatically.

Each year chooses its own accent via `theme.accent`; everything else comes from the shared design system in `src/routes/layout.css`.

## Structure

- `src/routes/` — `/` (newest year) and `/[year=year]`, both rendering `YearPage`.
- `src/lib/components/` — hero, intro, stats, ranking (winner / featured / list), playlist, archive, chrome.
- `src/lib/i18n/` — `locale.svelte.ts` (pt-BR/en state + localStorage) and `translations.ts` (UI strings).
- `src/lib/data/years/` — one file per year plus the registry.
- `src/routes/layout.css` — design tokens, fonts (Source Serif 4 + Inter, self-hosted via Fontsource), Tailwind/daisyUI setup, shared utilities.
- `src/lib/site.ts` — `SITE_URL` for absolute canonical/Open Graph URLs; set it once the domain is chosen.

## Notes

- SvelteKit 3: `#lib/...` imports of TS modules need a file extension; param matchers live in `src/params.ts` via `defineParams`; `browser` comes from `$app/env`.
- Current 2024 and 2023 data are sample placeholders (artists, albums, links, artwork, playlist IDs).
