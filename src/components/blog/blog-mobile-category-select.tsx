"use client";

import { useRouter } from "next/navigation";
import type { Locale } from "src/lib/i18n/config";
import type { BlogCategorySummary } from "src/server/blogs";

interface BlogMobileCategorySelectProps {
	categories: BlogCategorySummary[];
	locale: Locale;
	selectedCategoryId: string | null;
	selectedTag: string | null;
	allLabel: string;
	label: string;
}

function getLocalizedText(value: { vi: string; en: string }, locale: "vi" | "en") {
	return value[locale] || value.vi || value.en || "";
}

function createBlogPath(locale: Locale, input: { categoryId?: string | null; tag?: string | null }) {
	const params = new URLSearchParams();

	if (input.categoryId) {
		params.set("category", input.categoryId);
	}

	if (input.tag) {
		params.set("tag", input.tag);
	}

	const queryString = params.toString();
	return `/${locale}/blog${queryString ? `?${queryString}` : ""}`;
}

/**
 * Mobile category selector for the public blog page.
 * Desktop category filtering is handled in the sidebar.
 */
export function BlogMobileCategorySelect({
	allLabel,
	categories,
	label,
	locale,
	selectedCategoryId,
	selectedTag,
}: BlogMobileCategorySelectProps) {
	const router = useRouter();
	const lang = locale === "en" ? "en" : "vi";

	return (
		<label className="block rounded-none border border-[#E7D0AF] bg-white px-4 py-4 shadow-sm lg:hidden">
			<span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#A87E3C]">
				{label}
			</span>

			<select
				value={selectedCategoryId || ""}
				onChange={(event) => {
					router.push(
						createBlogPath(locale, {
							categoryId: event.target.value || null,
							tag: selectedTag,
						}),
					);
				}}
				className="h-11 w-full rounded-none border border-[#E7D0AF] bg-[#FAF7F1] px-3 text-sm font-semibold text-[#342312] outline-none transition focus:border-[#A87E3C]"
			>
				<option value="">{allLabel}</option>
				{categories.map(({ category, count }) => (
					<option key={category.id} value={category.id}>
						{getLocalizedText(category.name, lang)} ({count})
					</option>
				))}
			</select>
		</label>
	);
}
