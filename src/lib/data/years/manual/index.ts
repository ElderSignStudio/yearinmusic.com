/**
 * Registry of hand-authored override files, keyed by year. Add a line per new year.
 * Imports use explicit `.ts` extensions because the check script runs this file under
 * Node directly; Vite and svelte-check accept them too.
 */
import type { ManualYearOverrides } from './types.ts';
import { overrides2016 } from './2016.ts';
import { overrides2017 } from './2017.ts';
import { overrides2018 } from './2018.ts';
import { overrides2019 } from './2019.ts';
import { overrides2020 } from './2020.ts';
import { overrides2021 } from './2021.ts';
import { overrides2022 } from './2022.ts';
import { overrides2023 } from './2023.ts';
import { overrides2024 } from './2024.ts';
import { overrides2025 } from './2025.ts';

export const manualOverrides: Record<number, ManualYearOverrides> = {
	2016: overrides2016,
	2017: overrides2017,
	2018: overrides2018,
	2019: overrides2019,
	2020: overrides2020,
	2021: overrides2021,
	2022: overrides2022,
	2023: overrides2023,
	2024: overrides2024,
	2025: overrides2025
};

export function manualOverridesFor(year: number): ManualYearOverrides | undefined {
	return manualOverrides[year];
}
