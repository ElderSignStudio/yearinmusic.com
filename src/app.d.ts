import type { YearData } from '#lib/types/year.js';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			/** Present on year pages; drives the per-year accent in the root layout. */
			year?: YearData;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
