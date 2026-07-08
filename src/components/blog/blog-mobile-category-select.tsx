"use client";

import { useRouter } from "next/navigation";
import type { Locale } from "src/lib/i18n/config";
import type { BlogCategoryFilterItem } from "src/server/blogs";

function getCategoryName(category: BlogCategoryFilterItem, locale: "vi" | "en") {
	return category.name?.[locale] || category.name?.vi || category.name?.en || "";
}

interface BlogMobileCategorySelectProps {
	locale: Locale;
	categories: BlogCategoryFilterItem[];
	selectedCategoryId: string;
	allLabel: string;
	label: string;
}

/**
 * Mobile category filter for the public blog page.
 * @param props - Mobile category select props
 * @returns Mobile select that navigates to the selected category
 */
export function BlogMobileCategorySelect({
	locale,
	categories,
	selectedCategoryId,
	allLabel,
	label,
}: BlogMobileCategorySelectProps) {
	const router = useRouter();
	const lang = locale === "en" ? "en" : "vi";

	return (
		<div className="mb-8 border border-[#E7D0AF] bg-white px-4 py-4 shadow-sm lg:hidden">
			<label htmlFor="mobileBlogCategory" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[#A87E3C]">
				{label}
			</label>

			<select
				id="mobileBlogCategory"
				value={selectedCategoryId}
				onChange={(event) => {
					const categoryId = event.target.value;
					router.push(categoryId ? `/${locale}/blog?category=${encodeURIComponent(categoryId)}` : `/${locale}/blog`);
					window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
				}}
				className="h-11 w-full border border-[#E7D0AF] bg-[#FAF7F1] px-3 text-sm font-semibold text-[#342312] outline-none transition focus:border-[#A87E3C] focus:ring-2 focus:ring-[#A87E3C]/12"
			>
				<option value="">{allLabel}</option>
				{categories.map((category) => (
					<option key={category.id} value={category.id}>
						{getCategoryName(category, lang)} ({category.count})
					</option>
				))}
			</select>
		</div>
	);
}
