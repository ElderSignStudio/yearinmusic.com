# Annual Music Top Website

## Project purpose

This is a personal annual music website for Dan.

Every year since 2016, Dan has created a ranked list of his favorite albums released that year and a Spotify playlist containing his favorite songs of the year.

The website replaces the collection of RateYourMusic and Spotify links that was previously shared manually with friends over WhatsApp.

This is a personal project intended primarily for friends. It should feel polished, distinctive and carefully designed, but not commercial or corporate.

The site should feel like a personal annual music magazine / record collection / year-end editorial publication.

---

# Product principles

## The music is the design

Album artwork, ranking, typography and whitespace should dominate the visual experience.

The interface itself should remain restrained.

Avoid making the site look like:

- a SaaS product
- an admin dashboard
- a generic component-library demo
- a music database
- a RateYourMusic clone

Avoid unnecessary:

- cards
- boxes
- badges
- pills
- shadows
- gradients
- oversized buttons
- glassmorphism
- decorative UI chrome

The album artwork itself should generally function as the visual card.

---

# Primary user experience

The most important user journey is:

WhatsApp → tap link → view current year's list on a phone.

Therefore:

**Mobile quality is a first-class requirement, not an afterthought.**

The site must also look excellent on desktop and should become more editorial and expansive as screen space increases.

Always consider at least:

- ~375px mobile
- ~430px mobile
- tablet
- desktop
- wide desktop

Do not simply shrink desktop layouts onto mobile.

---

# Technology

Use:

- SvelteKit
- Svelte 5
- TypeScript
- Tailwind CSS 4
- daisyUI 5
- @lucide/svelte for normal interface icons
- Simple Icons or appropriate SVGs for branded icons
- @sveltejs/adapter-static

Use the existing package manager configured in the project.

Do not introduce another front-end framework or component library.

---

# daisyUI

daisyUI is available as infrastructure and for useful primitives.

It must NOT determine the visual identity of the website.

Do not construct the site primarily from generic daisyUI:

- cards
- badges
- buttons
- panels
- shadows

Custom editorial compositions using semantic HTML, Tailwind and targeted CSS are preferred.

It should not be visually obvious that the website uses daisyUI.

---

# Dependencies

Keep dependencies minimal.

Do not add libraries simply because they make something marginally easier.

Unless there is a strong technical reason, do not add:

- Chart.js
- D3
- GSAP
- animation frameworks
- another UI/component library
- global state-management libraries
- a full i18n framework
- databases
- CMS systems
- backend frameworks

Prefer native Svelte, CSS and browser functionality.

If you believe a new dependency is genuinely justified, explain why before adding it.

---

# Architecture

This is fundamentally a static, data-driven publication.

Do not introduce server infrastructure without a concrete need.

Year pages should be prerenderable and compatible with `@sveltejs/adapter-static`.

There must be ONE reusable year-page implementation.

Do not create manually duplicated pages for every year.

Adding a new year should primarily mean adding new yearly data and assets.

Conceptually, yearly data should resemble:

- year
- yearly accent/theme
- Portuguese introduction
- English introduction
- number of albums rated
- rating distribution
- RateYourMusic yearly-list URL
- Spotify playlist URL
- ranked albums

Each album contains approximately:

- rank
- artist
- album
- artwork
- primary genres
- Spotify URL
- Apple Music URL
- RateYourMusic URL

Keep TypeScript types explicit and reusable.

---

# URLs

The intended URL model is:

`/` → newest available year

`/2026`
`/2025`
`/2024`
etc.

The archive goes back to 2016, the first edition.

Do not hardcode routing around any single year.

---

# Languages

The website is bilingual:

- English (`en`) — the DEFAULT locale
- Brazilian Portuguese (`pt-BR`) — the secondary locale

Users can switch between BR and EN.

Portuguese is shareable through the URL: `?lang=pt-BR` (for example `/2025?lang=pt-BR`).
`?lang=en` is accepted but English URLs are normally clean.

Locale precedence: URL `?lang` › saved preference › English default.

Language preference persists locally. Internal links keep `?lang=pt-BR` while the
visitor is in Portuguese so the displayed URL stays shareable.

Social/Open Graph metadata is deliberately English-first, even for `?lang=pt-BR`
share links, and `?lang` never appears in canonical URLs.

Do not duplicate entire page components for each language.

Store translated editorial/UI text cleanly in data or translation structures.

Do NOT translate:

- artist names
- album titles
- RateYourMusic genre names

unless explicitly instructed otherwise.

---

# Year identity

The website uses one consistent design system across all years.

However, each year can have its own accent color and subtle visual identity.

The yearly data should be able to define this without modifying components.

Keep central design tokens for concepts such as:

- page background
- surface/background variation
- primary text
- muted text
- subtle borders
- accent
- year accent
- display typography
- body typography
- content widths

Do not scatter arbitrary theme colors throughout components.

---

# Typography

Typography is an important part of the site's identity.

Use a restrained editorial typography system.

Keep font configuration centralized.

Do not use many different fonts.

Font choices should remain easy to replace during design iteration.

---

# Album ranking visual hierarchy

The ranking must visually communicate importance.

Do NOT render every album as an identical card.

The intended hierarchy is:

## Rank 01

The winner receives major editorial treatment.

- very large artwork
- enormous `01`
- strong typography
- artist
- album
- genres
- restrained service links

## Ranks 02–05

These remain visually prominent.

On desktop they generally use a two-column presentation.

## Rank 06 onward

Desktop uses a more compact ranked-list treatment.

Mobile can switch back to a more artwork-oriented grid where appropriate.

Always use leading-zero ranks:

`01`
`02`
`03`
...
`20`

Ranking numbers are part of the site's visual identity.

---

# Genres

Genres should appear as understated metadata.

Example:

`Art Rock · Experimental Rock · Post-Rock`

Do not use colorful genre badges/pills unless the design direction is explicitly changed later.

---

# Album links

Albums can contain links to:

- Spotify
- Apple Music
- RateYourMusic

Keep service links visually restrained.

Do not turn them into large CTA buttons.

Album artwork should normally link to its RateYourMusic album page.

External links should be accessible and behave appropriately.

---

# Artwork

Production album artwork should be stored locally whenever practical rather than relying permanently on hotlinked third-party artwork.

Use an organized structure similar to:

`static/artwork/{year}/...`

Use stable square aspect ratios.

Avoid layout shift.

Lazy-load artwork below the initial viewport where appropriate.

Do not unnecessarily lazy-load the primary artwork visible immediately near the top of the page.

---

# Statistics

Every year can include:

- total albums rated
- comparison with previous year
- distribution of ratings

The rating distribution should use lightweight horizontal bars created with HTML/CSS/Tailwind.

Do not introduce a charting library for this.

The statistics should look like editorial information, not business analytics.

---

# Playlist

Each year includes a Spotify playlist of favorite songs.

The playlist should be embeddable in the yearly page and also provide an external Spotify link.

The playlist section is part of the publication, not an afterthought.

---

# Social sharing

Every year page and `/stats` has two share cards in `static/social/`, rendered by
`npm run generate:social` from the production data (year, Top N, albums rated, accent,
cross-year totals) and the hero collages: a 1200×1200 square for `og:image` that shows
only the year, because WhatsApp renders it as a ~95px thumbnail, and a 1200×630
landscape for `twitter:image` and large previews. Cards never reveal the ranking or the
winner.

Open Graph and Twitter metadata is English-first and uses these cards. A `?lang=pt-BR`
share link gets the same preview, and `?lang` never appears in canonical or `og:url`.

Publishing a new year includes running the generator and committing its output
(`static/social/{year}.jpg`, `static/social/{year}-square.jpg`, the two `stats` cards and
`src/lib/data/socialCards.json`).

---

# Motion

Motion should be subtle.

Appropriate examples:

- slight artwork scale on hover
- restrained opacity/color changes
- ~150–250ms transitions

Avoid:

- dramatic page animation
- flip cards
- unnecessary parallax
- excessive entrance animations

Respect `prefers-reduced-motion`.

---

# Accessibility

Maintain:

- semantic HTML
- useful alt text
- keyboard accessibility
- visible focus states
- sufficient contrast
- accessible external links
- reduced-motion support

Accessibility should be integrated into the implementation rather than added as a final patch.

---

# Code quality

Prefer:

- small focused components
- clear names
- explicit TypeScript types
- reusable data structures
- simple solutions
- readable code

Avoid:

- premature abstractions
- enormous components
- duplicate markup
- magic values scattered throughout files
- cleverness for its own sake

Keep visual/layout components separate from yearly content data.

---

# Working style

Before making a substantial architectural change, inspect the existing project and understand the current structure.

Preserve existing working functionality unless the requested task requires changing it.

Do not redesign established product decisions on your own.

When a prompt specifies a visual/product decision, implement that decision rather than substituting your own concept.

Small implementation improvements are welcome when they preserve the product intent.

If something is ambiguous, prefer the simplest implementation consistent with this file and the current request.

Do not add unrelated features.

---

# Verification

After meaningful code changes, run the relevant available project checks.

Typically this includes the appropriate equivalents of:

- formatting
- linting
- type/Svelte checking
- build

Fix errors introduced by your changes before considering the task complete.

Do not claim something works without running the relevant available check when it is practical to do so.

---

# Important

This file contains persistent project rules.

Individual prompts will provide the current task and may contain more specific requirements.

When a task-specific instruction and this file differ, follow the more specific current task unless doing so would fundamentally contradict the architecture of the project.

---

# Git workflow

The project is under Git version control (branch `main`).

- Inspect `git status` before starting substantial work.
- Never discard or overwrite unrelated user changes.
- Never use destructive Git commands such as `git reset --hard`, `git checkout -- <file>` on user changes, or force pushes unless explicitly instructed.
- After completing a discrete requested feature or design iteration, run the project checks (format, lint, svelte-check, build). Once they pass, create a concise Git commit for that milestone unless Dan explicitly says not to.
- Do not amend or rewrite previous commits unless explicitly asked.
