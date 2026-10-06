import { error } from '@sveltejs/kit';
import { getYear, years } from '#lib/data/years/index.js';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => years.map((y) => ({ year: String(y.year) }));

export const load: PageLoad = ({ params }) => {
	const year = getYear(Number(params.year));
	if (!year) error(404, 'Year not found');
	return { year };
};
