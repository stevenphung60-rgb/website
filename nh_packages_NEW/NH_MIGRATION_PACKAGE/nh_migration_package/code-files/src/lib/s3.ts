import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export interface S3UploadResult {
	key: string;
	url: string;
}

function getBucketName(): string {
	const bucketName = process.env.AWS_S3_BUCKET_NAME;

	if (!bucketName) {
		throw new Error("AWS_S3_BUCKET_NAME environment variable is required");
	}

	return bucketName;
}

function normalizeKey(key: string): string {
	return key.replace(/^\/+/, "").replace(/\\/g, "/");
}

function getPublicS3Url(key: string): string {
	const bucketName = getBucketName();
	const region = process.env.AWS_REGION || "us-east-1";
	const normalizedKey = normalizeKey(key);
	const baseUrl = `https://${bucketName}.s3.${region}.amazonaws.com/`;

	return new URL(normalizedKey, baseUrl).toString();
}

const s3Client = new S3Client({
	region: process.env.AWS_REGION || "us-east-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
	},
});

/**
 * Upload a file to AWS S3.
 * Keep this interface compatible with the rest of the app.
 */
export async function uploadToS3(file: File, key: string): Promise<S3UploadResult> {
	const normalizedKey = normalizeKey(key);
	const buffer = Buffer.from(await file.arrayBuffer());

	await s3Client.send(
		new PutObjectCommand({
			Bucket: getBucketName(),
			Key: normalizedKey,
			Body: buffer,
			ContentType: file.type,
			ACL: "public-read",
		}),
	);

	return {
		key: normalizedKey,
		url: getPublicS3Url(normalizedKey),
	};
}

/**
 * Delete a file from AWS S3.
 */
export async function deleteFromS3(key: string): Promise<void> {
	const normalizedKey = normalizeKey(key);

	await s3Client.send(
		new DeleteObjectCommand({
			Bucket: getBucketName(),
			Key: normalizedKey,
		}),
	);
}

/**
 * Generate public S3 URL from object key.
 */
export function getS3Url(key: string): string {
	return getPublicS3Url(key);
}
