/** Collects validation findings for one import run. */
export class Diagnostics {
	readonly warnings: string[] = [];
	readonly errors: string[] = [];

	warn(message: string) {
		this.warnings.push(message);
	}

	/** A structural problem that prevents trustworthy output. */
	fail(message: string) {
		this.errors.push(message);
	}

	get fatal(): boolean {
		return this.errors.length > 0;
	}
}
