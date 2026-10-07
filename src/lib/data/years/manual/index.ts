/**
 * Registry of hand-authored override files, keyed by year. Add a line per new year.
 * Imports use explicit `.ts` extensions because the check script runs this file under
 * Node directly; Vite and svelte-check accept them too.
 */
import type { ManualYearOverrides } from './types.ts';
import { overrides2025 } from './2025.ts';

export const manualOverrides: Record<number, ManualYearOverrides> = {
	2025: overrides2025
};

export function manualOverridesFor(year: number): ManualYearOverrides | undefined {
	return manualOverrides[year];
}
