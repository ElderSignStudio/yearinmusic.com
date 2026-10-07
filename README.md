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
- `src/routes/layout.css` — design tokens, fonts (Newsreader + Inter, self-hosted via Fontsource), Tailwind/daisyUI setup, shared utilities.
- `src/lib/site.ts` — `SITE_URL` for absolute canonical/Open Graph URLs; set it once the domain is chosen.

## Importing a year from RateYourMusic

The source of truth for each year is a RateYourMusic list page saved from the browser. Nothing is fetched live from RYM.

1. Open the yearly list on RYM and save the page as "Webpage, complete". Keep both the `.html` file and its `*_files/` companion folder together.
2. Put them under `imports/rym/`.
3. Import the list:

   ```sh
   npm run import:rym -- "imports/rym/Top 20 Best Albums of 2025 - Rate Your Music.html"
   npm run import:rym -- imports/rym
   ```

4. Read the import report. Warnings (for example, rating buckets that don't add up to the stated total) still produce output; structural errors (no albums, no year) do not.
5. Resolve the album artwork:

   ```sh
   npm run enrich:artwork -- 2025          # one year
   npm run enrich:artwork -- all           # every generated year
   npm run enrich:artwork -- 2025 --force  # re-encode even if files already exist
   ```

6. Read the artwork report, then inspect `src/lib/data/years/generated/<year>.json` and `static/artwork/<year>/`. Both are tracked in Git.

**Import.** The importer reads only the fields the site needs: list title and URL, the introduction paragraphs, the stated statistics, the yearly playlist URL and each ranked album's artist, title, release year, RYM URL, genres, descriptors and artwork reference. Percentages are never copied from the page; the site derives them from each bucket count and the stated total, which stays authoritative even when the buckets disagree. Spotify and Apple Music links are search fallbacks (`streamingLinksAreSearchFallbacks: true`) until exact album links are added. Re-running on the same file produces identical output and never touches hand-authored files such as `src/lib/data/years/<year>.ts`.

**Artwork.** The enricher copies or downloads each cover, checks its real dimensions, and stores one normalized WebP per album at `static/artwork/<year>/<artist-album>.webp` (stable album-based names, so ranks can change without renaming files). It records the public path in the album's `artwork` field; the site never depends on RYM image URLs. Sources are tried in order: a hand-supplied file at `imports/artwork/<year>/<artist-album>.(jpg|png|webp)`, the CDN reference captured from the saved page, then the thumbnail the browser saved. RYM's CDN only serves each rendition under its own hash, so a saved page yields 150px covers at best; drop a larger cover into `imports/artwork/<year>/` to replace one (the report names the slug to use). Images are never enlarged, cropped, filtered or recolored; non-square covers are kept as-is and flagged. Re-running reuses valid existing files.

**Saved RYM pages can contain your logged-in session (tokens, account details, inline scripts).** The whole `imports/` folder is git-ignored for that reason. Do not commit those files or share them unnecessarily.

## Notes

- SvelteKit 3: `#lib/...` imports of TS modules need a file extension; param matchers live in `src/params.ts` via `defineParams`; `browser` comes from `$app/env`.
- Current 2024 and 2023 data are sample placeholders (artists, albums, links, artwork, playlist IDs).
