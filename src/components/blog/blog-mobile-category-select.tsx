"use client";

import { useRouter } from "next/navigation";
import { MobileFilterSelect } from "src/components/mobile-filter-select";
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

function createBlogPath(
	locale: Locale,
	input: { categoryId?: string | null; tag?: string | null },
) {
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
		<MobileFilterSelect
			allLabel={allLabel}
			className="lg:hidden"
			label={label}
			value={selectedCategoryId}
			options={categories.map(({ category, count }) => ({
				value: category.id,
				label: `${getLocalizedText(category.name, lang)} (${count})`,
			}))}
			onValueChange={(categoryId) => {
				router.push(
					createBlogPath(locale, {
						categoryId,
						tag: selectedTag,
					}),
				);
			}}
		/>
	);
}
