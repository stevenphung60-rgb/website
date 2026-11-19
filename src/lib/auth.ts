import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getDatabase } from "src/lib/database";

/**
 * Resolve the public base URL used for OAuth redirects.
 * On Vercel, a missing or localhost BETTER_AUTH_URL (a common copy-paste from
 * .env.local) would send Google back to http://localhost:3000, so fall back to
 * the deployment's own domain instead.
 */
function resolveBaseURL(): string | undefined {
	const configured = process.env.BETTER_AUTH_URL?.trim().replace(/\/+$/, "");
	const isLocalhost = !!configured && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(configured);

	if (configured && !(process.env.VERCEL && isLocalhost)) {
		return configured;
	}

	const vercelHost =
		process.env.VERCEL_ENV === "production"
			? process.env.VERCEL_PROJECT_PRODUCTION_URL
			: process.env.VERCEL_URL;
	if (vercelHost) {
		return `https://${vercelHost}`;
	}

	return configured;
}

/**
 * Validate required environment variables
 */
function validateEnvVars(): {
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	BETTER_AUTH_URL: string;
} {
	const required = {
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
		BETTER_AUTH_URL: resolveBaseURL(),
	};

	for (const [key, value] of Object.entries(required)) {
		if (!value) {
			throw new Error(`Missing required environment variable: ${key}`);
		}
	}

	return required as {
		GOOGLE_CLIENT_ID: string;
		GOOGLE_CLIENT_SECRET: string;
		BETTER_AUTH_URL: string;
	};
}

// Validate environment variables once
const envVars = validateEnvVars();

// Construct redirect URI
const redirectURI = new URL("/api/auth/callback/google", envVars.BETTER_AUTH_URL).toString();

// Configure trusted origins
const trustedOrigins = [envVars.BETTER_AUTH_URL];

// Add Vercel-specific domains to trusted origins
if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
	trustedOrigins.push(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
}
if (process.env.VERCEL_URL) {
	trustedOrigins.push(`https://${process.env.VERCEL_URL}`);
}
// Add any manually specified trusted origins
if (process.env.TRUSTED_ORIGINS) {
	trustedOrigins.push(...process.env.TRUSTED_ORIGINS.split(",").map((o) => o.trim()));
}

/**
 * Better Auth configuration for the application
 * Configures Google OAuth-only authentication for admin access
 */
export const auth = betterAuth({
	baseURL: envVars.BETTER_AUTH_URL,
	database: mongodbAdapter(await getDatabase()),
	socialProviders: {
		google: {
			clientId: envVars.GOOGLE_CLIENT_ID,
			clientSecret: envVars.GOOGLE_CLIENT_SECRET,
			redirectURI,
		},
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 1 week
		updateAge: 60 * 60 * 24, // 1 day
	},
	trustedOrigins,
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
