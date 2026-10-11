import { error } from '@sveltejs/kit';
import { getSpecialEdition, specialEditions } from '#lib/data/specialEditions.js';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => specialEditions.map((e) => ({ edition: e.slug }));

export const load: PageLoad = ({ params }) => {
	const edition = getSpecialEdition(params.edition);
	if (!edition) error(404, 'Edition not found');
	return { edition };
};
