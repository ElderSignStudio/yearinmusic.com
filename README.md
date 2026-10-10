# Year in Music

Personal annual music archive: one ranked album list and one Spotify playlist per year, bilingual (English default, Brazilian Portuguese via the BR/EN switch or `?lang=pt-BR`), built as a static SvelteKit site.

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
3. Register the year in `src/lib/data/years/index.ts`. The newest year becomes `/`, and `/<year>` is prerendered automatically. The cross-year page at `/stats` is derived from the registered years (`src/lib/data/years/acrossYears.ts`), so it updates on its own..

Each year chooses its own accent via `theme.accent`; everything else comes from the shared design system in `src/routes/layout.css`.

## Structure

- `src/routes/` — `/` (newest year) and `/[year=year]`, both rendering `YearPage`.
- `src/lib/components/` — hero, intro, stats, ranking (winner / featured / list), playlist, archive, chrome.
- `src/lib/i18n/` — `locale.svelte.ts` (locale state, `?lang` parsing, localized links, localStorage) and `translations.ts` (UI strings). Precedence: URL `?lang` › saved preference › English. Metadata/Open Graph stays English even for `?lang=pt-BR` links.
- `src/lib/data/years/` — one file per year plus the registry.
- `src/routes/layout.css` — design tokens, fonts (Newsreader + Inter, self-hosted via Fontsource), Tailwind/daisyUI setup, shared utilities.
- `src/lib/site.ts` — `SITE_URL` for absolute canonical/Open Graph URLs; set it once the domain is chosen.

## Importing a year from RateYourMusic

The source of truth for each year is a RateYourMusic list page saved from the browser. Nothing is fetched live from RYM, Spotify or Apple Music.

1. Open the yearly list on RYM and save the page as "Webpage, complete". Keep both the `.html` file and its `*_files/` companion folder together, under `imports/rym/`.
2. Import the list:

   ```sh
   npm run import:rym -- imports/rym
   ```

3. Read the import report. Warnings (for example, a total written in the text that differs from the sum of the rating buckets) still produce output; structural errors (no albums, no year) do not.
4. Optionally drop higher-resolution covers into `imports/artwork/<year>/<artist-album>.(jpg|png|webp)`. The artwork report lists each album's slug.
5. Resolve the artwork:

   ```sh
   npm run enrich:artwork -- 2025          # one year ("all" for every generated year)
   npm run enrich:artwork -- 2025 --force  # re-encode even if files already exist
   ```

6. Paste exact Spotify and Apple Music album URLs into `src/lib/data/years/manual/<year>.ts`. Every album is listed by stable slug with its rank, artist and title in a comment; leave a value empty to keep the generated search link. Exact links are optional: the search fallbacks work on their own, and each service is resolved independently. Set a value to `null` when the album is not on that service at all; the site then shows no link for it instead of a search. An optional `bandcampUrl: '…'` adds a Bandcamp link (for example for an album that is only sold there); it has no fallback and the icon only appears when it is set. The same entry can carry `album: '…'` when RYM lists the release under another name (for example a single's title); the site displays that title and the enricher also accepts cover files named after it; `rymUrl: '…'` likewise replaces the entry's RateYourMusic link when the list points at the wrong release.
7. Check progress and catch typos:

   ```sh
   npm run check:overrides -- 2025
   ```

8. Generate the hero background collage from the year's covers (deterministic, one WebP per year):

   ```sh
   npm run generate:hero -- 2025
   ```

9. Publish the year: create `src/lib/data/years/<year>.ts` that calls `createYear(generated, overrides, editorial)` with the accent, the Brazilian Portuguese intro and any other editorial values (see `2025.ts`), then add it to `src/lib/data/years/index.ts`. The newest registered year becomes `/`. If the list is a Top N plus unranked extras, name those extras in `bonusSlugs` (see `2024.ts`); they are rendered after the ranking without a number, and the remaining albums must form a contiguous 1..N list that matches the list title.

**Composition.** `src/lib/data/years/compose.ts` turns the three inputs (generated JSON, manual links, editorial config) into the `YearData` the page renders. Exact manual links win per service; empty ones fall back to the generated search links. Components never see import-specific fields.

**Generated vs hand-authored.** `src/lib/data/years/generated/<year>.json` and `static/artwork/<year>/` are written by the scripts and tracked in Git; re-running the scripts is safe and deterministic. `src/lib/data/years/manual/<year>.ts` is written by hand and never touched by any script; for a new year, copy the structure of an existing file and register it in `manual/index.ts`. Hand-authored presentation data such as `src/lib/data/years/<year>.ts` is likewise never regenerated.

**Import.** The importer reads only the fields the site needs: list title and URL, the introduction paragraphs, the stated statistics, the yearly playlist URL and each ranked album's stable slug, artist, title, release year, RYM URL, genres, descriptors and artwork reference. Percentages are never copied from the page; the site derives them from each bucket count and the year's total, which is the sum of the rating buckets. A total written in the text is only a cross-check and is reported when it disagrees. Re-importing a year keeps the artwork paths that enrichment already wrote. Spotify and Apple Music links are search fallbacks (`streamingLinksAreSearchFallbacks: true`) until exact links are supplied in the manual file.

**Artwork.** The enricher copies or downloads each cover, checks its real dimensions, and stores one normalized WebP per album at `static/artwork/<year>/<artist-album>.webp`, recording the public path in the album's `artwork` field; the site never depends on RYM image URLs. Sources are tried in order: a hand-supplied file, the CDN reference captured from the saved page, then the thumbnail the browser saved. RYM's CDN only serves each rendition under its own hash, so a saved page yields 150px covers at best. Images are never enlarged, cropped, filtered or recolored; non-square covers are kept as-is and flagged.

**Saved RYM pages can contain your logged-in session (tokens, account details, inline scripts).** The whole `imports/` folder is git-ignored for that reason. Do not commit those files or share them unnecessarily.

## Notes

- SvelteKit 3: `#lib/...` imports of TS modules need a file extension; param matchers live in `src/params.ts` via `defineParams`; `browser` comes from `$app/env`.
- 2023, 2024 and 2025 are published from real imported data. Earlier years are listed as coming soon until imported.
