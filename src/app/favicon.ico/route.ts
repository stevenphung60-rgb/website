import { NextResponse } from "next/server";
import { getHeroBrandInfo } from "src/server/herobrand";

const FALLBACK_FAVICON_PATH = "/nghiep_hung_logo_no_bg.svg";

/**
 * Resolve the favicon from the same database-backed logo used by the website
 * header. The static logo remains available when the database cannot be reached.
 */
export async function GET(request: Request) {
	let faviconPath = FALLBACK_FAVICON_PATH;

	try {
		const heroBrandInfo = await getHeroBrandInfo();
		const configuredLogo = heroBrandInfo.logo?.url?.trim();

		if (configuredLogo) {
			faviconPath = configuredLogo;
		}
	} catch {
		// A favicon request must not fail the page when the database is unavailable.
	}

	let faviconUrl: URL;

	try {
		faviconUrl = new URL(faviconPath, request.url);

		if (!["http:", "https:"].includes(faviconUrl.protocol)) {
			throw new Error("Unsupported favicon URL protocol");
		}
	} catch {
		faviconUrl = new URL(FALLBACK_FAVICON_PATH, request.url);
	}

	const response = NextResponse.redirect(faviconUrl, 307);
	response.headers.set("Cache-Control", "no-store, max-age=0");

	return response;
}
