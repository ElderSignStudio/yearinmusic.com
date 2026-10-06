import { newestYear } from '#lib/data/years/index.js';
import type { PageLoad } from './$types';

/** `/` renders the newest published year. */
export const load: PageLoad = () => ({ year: newestYear });
