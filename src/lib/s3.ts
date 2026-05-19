import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

export interface S3UploadResult {
	key: string;
	url: string;
}

function normalizeKey(key: string): string {
	return key.replace(/^\/+/, "").replace(/\\/g, "/");
}

function getUploadRoot(): string {
	return path.join(process.cwd(), "public", "uploads");
}

function getAbsoluteFilePath(key: string): string {
	const normalizedKey = normalizeKey(key);
	return path.join(getUploadRoot(), normalizedKey);
}

/**
 * Local upload implementation
 * Keeps the same function name/interface so the rest of the app does not need changes.
 */
export async function uploadToS3(file: File, key: string): Promise<S3UploadResult> {
	const normalizedKey = normalizeKey(key);
	const absoluteFilePath = getAbsoluteFilePath(normalizedKey);

	await mkdir(path.dirname(absoluteFilePath), { recursive: true });

	const buffer = Buffer.from(await file.arrayBuffer());
	await writeFile(absoluteFilePath, buffer);

	return {
		key: normalizedKey,
		url: `/uploads/${normalizedKey}`,
	};
}

/**
 * Local delete implementation
 */
export async function deleteFromS3(key: string): Promise<void> {
	const normalizedKey = normalizeKey(key);
	const absoluteFilePath = getAbsoluteFilePath(normalizedKey);

	try {
		await unlink(absoluteFilePath);
	} catch (error) {
		// Ignore "file not found" so delete flows do not break
		if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
			throw error;
		}
	}
}

/**
 * Local public URL generator
 */
export function getS3Url(key: string): string {
	const normalizedKey = normalizeKey(key);
	return `/uploads/${normalizedKey}`;
}