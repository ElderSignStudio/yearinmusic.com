/** Image inspection and normalization (square check, downscale, WebP encode). */
import sharp from 'sharp';

/** Longest edge of the stored production file. Smaller sources are never enlarged. */
export const MAX_EDGE = 1200;
/** Sources at least this large count as high-resolution in the report. */
export const HIGH_RES_EDGE = 600;
/** Anything smaller than this is treated as unusable (icons, placeholders). */
export const MIN_EDGE = 64;
const WEBP_QUALITY = 88;

export interface ImageInfo {
	width: number;
	height: number;
	format: string;
}

export async function inspect(data: Buffer): Promise<ImageInfo | undefined> {
	try {
		const meta = await sharp(data).metadata();
		if (!meta.width || !meta.height || !meta.format) return undefined;
		return { width: meta.width, height: meta.height, format: meta.format };
	} catch {
		return undefined;
	}
}

export function isSquare(info: ImageInfo, tolerance = 0.02): boolean {
	return Math.abs(info.width - info.height) / Math.max(info.width, info.height) <= tolerance;
}

/** Keeps the aspect ratio, never enlarges, applies no filters, and writes WebP. */
export async function normalizeToWebp(data: Buffer, outFile: string): Promise<ImageInfo> {
	const out = await sharp(data)
		.resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
		.webp({ quality: WEBP_QUALITY, smartSubsample: true, effort: 5 })
		.toFile(outFile);
	return { width: out.width, height: out.height, format: out.format };
}
