import { defineParams } from '@sveltejs/kit/params';

export const params = defineParams({
	/** Four-digit year segment, e.g. `/2024`. */
	year: (param) => (/^\d{4}$/.test(param) ? param : undefined)
});
