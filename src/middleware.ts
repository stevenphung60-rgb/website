/**
 * Next.js middleware for internationalization
 * Handles language detection and routing
 */

import { type NextRequest, NextResponse } from "next/server";
import { defaultLocale, type Locale, languageDetection, locales } from "./lib/i18n/config";

/**
 * Type guard to check if a string is a valid locale
 */
function isLocale(value: string): value is Locale {
	return locales.includes(value as Locale);
}

/**
 * Get locale from request
 * Priority: URL pathname > Cookie > Accept-Language header > Default
 */
function getLocale(request: NextRequest): Locale {
	// 1. URL
	const pathname = request.nextUrl.pathname;
	const pathnameLocale = pathname.split("/")[1];

	if (pathnameLocale && isLocale(pathnameLocale)) {
		return pathnameLocale;
	}

	// 2. Cookie
	const cookieLocale = request.cookies.get(languageDetection.cookieName)?.value;
	if (cookieLocale && isLocale(cookieLocale)) {
		return cookieLocale;
	}

	// 3. Accept-Language (chỉ ưu tiên vi)
	const acceptLanguage = request.headers.get("accept-language");

	if (acceptLanguage) {
		if (acceptLanguage.toLowerCase().includes("vi")) {
			return "vi";
		}
	}

	// 4. Default
	return "vi";
}

export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	const pathnameLocale = pathname.split("/")[1];

		if (
			pathnameLocale &&
			isLocale(pathnameLocale) &&
			pathname.startsWith(`/${pathnameLocale}/admin`)
		) {
			const url = request.nextUrl.clone();
			url.pathname = pathname.replace(`/${pathnameLocale}`, "");
			return NextResponse.redirect(url);
		}
	// Skip processing for static assets and specific files
	const staticExtensions = [
		".png",
		".jpg",
		".jpeg",
		".gif",
		".svg",
		".ico",
		".webp",
		".avif",
		".css",
		".js",
		".map",
	];
	const isStaticAsset = staticExtensions.some((ext) => pathname.endsWith(ext));

	// Skip specific static files and patterns
	if (
		pathname === "/favicon.ico" ||
		isStaticAsset ||
		pathname.startsWith("/_next/") ||
		pathname.startsWith("/api/") ||
		pathname.startsWith("/admin") ||
		pathname.startsWith("/login") ||
		pathname.startsWith("/unauthorized")
	) {
		return NextResponse.next();
	}

	// Check if there is any supported locale in the pathname
	const pathnameHasLocale = locales.some(
		(locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
	);

	if (pathnameHasLocale) {
		// Extract the locale from the pathname to validate it
		const pathnameLocale = pathname.split("/")[1];
		if (pathnameLocale && isLocale(pathnameLocale)) {
			return NextResponse.next();
		}
		// If pathname has a locale-like segment but it's not valid, redirect to /vi
		request.nextUrl.pathname = `/vi${pathname}`;
		return NextResponse.redirect(request.nextUrl);
	}

	// Redirect if there is no locale
	const locale = getLocale(request);
	request.nextUrl.pathname = `/${locale}${pathname}`;
	// e.g. incoming request is /products
	// The new URL is now /en/products
	return NextResponse.redirect(request.nextUrl);
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - admin (admin routes)
		 * - login (login routes)
		 * - unauthorized (unauthorized routes)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|admin|login|unauthorized).*)",
	],
};
