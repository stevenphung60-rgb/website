"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll blog detail pages to top when navigating between blog slugs.
 * @returns Nothing
 */
export function BlogDetailScrollToTop() {
	const pathname = usePathname();

	useEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: "auto" });
	}, [pathname]);

	return null;
}
