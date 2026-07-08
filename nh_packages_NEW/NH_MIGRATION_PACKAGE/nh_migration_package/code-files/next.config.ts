import type { NextConfig } from "next";

const s3BucketName = process.env.AWS_S3_BUCKET_NAME;
const s3Region = process.env.AWS_REGION || "us-east-1";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
	{
		protocol: "https",
		hostname: "*.googleusercontent.com",
		port: "",
		pathname: "/**",
	},
];

if (s3BucketName) {
	remotePatterns.push({
		protocol: "https",
		hostname: `${s3BucketName}.s3.${s3Region}.amazonaws.com`,
		port: "",
		pathname: "/**",
	});
}

const nextConfig: NextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		unoptimized: true,
		domains: [
			"lh3.googleusercontent.com",
			"lh4.googleusercontent.com",
			"lh5.googleusercontent.com",
			"lh6.googleusercontent.com",
		],
		remotePatterns,
	},
	experimental: {
		serverActions: {
			bodySizeLimit: "100mb",
		},
		useCache: true,
		cacheLife: {
			default: {
				stale: 300,
				revalidate: process.env.CACHE_LIFE_REVALIDATE
					? Number.parseInt(process.env.CACHE_LIFE_REVALIDATE, 10)
					: 60 * 60 * 24,
				expire: process.env.CACHE_LIFE_EXPIRE
					? Number.parseInt(process.env.CACHE_LIFE_EXPIRE, 10)
					: 60 * 60 * 24 * 7,
			},
		},
	},
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "Referrer-Policy",
						value: "no-referrer-when-downgrade",
					},
				],
			},
		];
	},
};

export default nextConfig;
