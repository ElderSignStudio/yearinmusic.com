import { defineParams } from '@sveltejs/kit/params';

/**
 * Route parameter matchers (SvelteKit 3 single-file `src/params` model).
 *
 * This module is deliberately plain JavaScript. During `vite build`, SvelteKit
 * imports it with a bare Node `import()` (outside Vite's TypeScript pipeline)
 * to validate matchers before prerendering. A `.ts` file here only loads on
 * Node versions with built-in type stripping (22.18+), which the deployment
 * target's Node 22.17 does not have. `defineParams` still provides full type
 * inference for `params` and the generated route `$types`.
 */
export const params = defineParams({
	/** Four-digit year segment, e.g. `/2024`. */
	year: (param) => (/^\d{4}$/.test(param) ? param : undefined),
	/** Special-edition year range, e.g. `/2022-2026`. Unknown ranges 404 in the page load. */
	edition: (param) => (/^\d{4}-\d{4}$/.test(param) ? param : undefined)
});
