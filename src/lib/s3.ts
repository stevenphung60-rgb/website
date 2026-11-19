import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";

/**
 * Image storage helpers.
 *
 * - On Vercel (a Blob store is connected, so BLOB_READ_WRITE_TOKEN or BLOB_STORE_ID is set):
 *   files go to Vercel Blob and `key` is the full public blob URL.
 * - Locally without Blob credentials: files are written to public/uploads and served
 *   from /uploads/<key>, as before.
 *
 * Function names are kept (uploadToS3, ...) so existing callers do not change.
 */

export interface S3UploadResult {
	key: string;
	url: string;
}

function isBlobEnabled(): boolean {
	return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

function isRemoteUrl(value: string): boolean {
	return /^https?:\/\//i.test(value);
}

function normalizeKey(key: string): string {
	return key.replace(/^\/+/, "").replace(/\\/g, "/");
}

function getAbsoluteFilePath(key: string): string {
	return path.join(process.cwd(), "public", "uploads", normalizeKey(key));
}

/**
 * Upload a file and return its storage key and public URL
 */
export async function uploadToS3(file: File, key: string): Promise<S3UploadResult> {
	const normalizedKey = normalizeKey(key);

	if (isBlobEnabled()) {
		const blob = await put(normalizedKey, file, {
			access: "public",
			addRandomSuffix: true,
			contentType: file.type || undefined,
		});
		return { key: blob.url, url: blob.url };
	}

	const absoluteFilePath = getAbsoluteFilePath(normalizedKey);
	await mkdir(path.dirname(absoluteFilePath), { recursive: true });
	await writeFile(absoluteFilePath, Buffer.from(await file.arrayBuffer()));

	return {
		key: normalizedKey,
		url: `/uploads/${normalizedKey}`,
	};
}

/**
 * Upload an image into a folder with a timestamped file name.
 * Returns the public URL to store in the database.
 */
export async function uploadImageFile(file: File, folder: string, prefix: string): Promise<string> {
	const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
	const { url } = await uploadToS3(file, `${folder}/${prefix}-${Date.now()}.${ext}`);
	return url;
}

/**
 * Delete a stored file. Never throws for files that are missing or cannot be removed
 * (e.g. images bundled in public/uploads on Vercel's read-only filesystem).
 */
export async function deleteFromS3(key: string): Promise<void> {
	if (!key) return;

	if (isRemoteUrl(key)) {
		if (!isBlobEnabled()) return;
		try {
			await del(key);
		} catch (error) {
			console.error("Blob delete error:", error);
		}
		return;
	}

	try {
		await unlink(getAbsoluteFilePath(key));
	} catch (error) {
		const code = (error as NodeJS.ErrnoException).code;
		if (code !== "ENOENT" && code !== "EROFS" && code !== "EACCES" && code !== "EPERM") {
			throw error;
		}
	}
}

/**
 * Public URL for a stored key (Blob keys are already full URLs)
 */
export function getS3Url(key: string): string {
	if (isRemoteUrl(key)) return key;
	return `/uploads/${normalizeKey(key)}`;
}
