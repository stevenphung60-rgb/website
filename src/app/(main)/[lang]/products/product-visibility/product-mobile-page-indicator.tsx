"use client";

import { MobilePageIndicator } from "src/components/mobile-page-indicator";
import type { Locale } from "src/lib/i18n/config";
import { useProductVisibility } from "./product-visibility.state";

export function ProductMobilePageIndicator({ locale }: { locale: Locale }) {
	const { currentPage, totalPages } = useProductVisibility();

	return (
		<MobilePageIndicator
			className="mb-4 lg:hidden"
			currentPage={currentPage}
			locale={locale}
			totalPages={totalPages}
		/>
	);
}
