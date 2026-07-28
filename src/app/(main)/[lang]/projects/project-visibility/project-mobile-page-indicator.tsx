"use client";

import { MobilePageIndicator } from "src/components/mobile-page-indicator";
import type { Locale } from "src/lib/i18n/config";
import { useProjectVisibility } from "./project-visibility.state";

export function ProjectMobilePageIndicator({ locale }: { locale: Locale }) {
	const { currentPage, totalPages } = useProjectVisibility();

	return (
		<MobilePageIndicator
			className="mt-6 md:hidden"
			currentPage={currentPage}
			locale={locale}
			totalPages={totalPages}
		/>
	);
}
