import type { Locale } from "src/lib/i18n/config";
import { getDictionary } from "src/lib/i18n/dictionaries";
import { getProjectCategoryById } from "src/server/projectcategories";
import { getActiveProjectCategoryIds } from "src/server/projectcategories/get-projectcategory-ids.query";
import { ActiveFilterButton, InactiveFilterButton } from "./project-filter-button";
import { ProjectMobileCategorySelect } from "./project-filter-select";

interface ProjectFilterButtonsProps {
	locale: Locale;
}

const TAB_BASE_CLASS =
	"inline-flex min-h-10 max-w-full items-center justify-center rounded px-4 py-2 text-center text-[13px] font-bold uppercase leading-tight tracking-[0.08em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#A87E3C] sm:min-h-11 sm:px-5 sm:text-[14px]";

const ACTIVE_TAB_CLASS = `${TAB_BASE_CLASS} bg-[#342312] text-[#FFF8EC] shadow-sm`;
const INACTIVE_TAB_CLASS = `${TAB_BASE_CLASS} text-[#342312] hover:bg-[#F7F1E6] hover:text-[#7A5426]`;

/**
 * Project category filter.
 * - Below md: the existing mobile category drawer (ProjectMobileCategorySelect).
 * - From md up: a white floating tab bar that overlaps the hero; tabs wrap if they run out of room.
 */
export async function ProjectFilterButtons({ locale }: ProjectFilterButtonsProps) {
	const categoryIds = await getActiveProjectCategoryIds();

	const categoriesData = await Promise.all(
		categoryIds.map((categoryId) => getProjectCategoryById(categoryId)),
	);

	const categories = categoriesData
		.filter(
			(category): category is NonNullable<(typeof categoriesData)[number]> => category !== null,
		)
		.map((category) => ({
			id: category.id,
			label: category.name[locale] || category.name.vi || category.name.en,
		}))
		.filter((category) => category.label);

	const dictionary = getDictionary(locale);
	const tabs = [{ id: null, label: dictionary.projects.filter.all }, ...categories];

	return (
		<div className="relative z-20">
			<ProjectMobileCategorySelect
				allLabel={dictionary.projects.filter.all}
				categories={categories}
				label={locale === "vi" ? "Danh mục dự án" : "Project category"}
			/>

			<div className="hidden justify-center md:flex">
				<div
					role="toolbar"
					aria-label={locale === "vi" ? "Lọc dự án theo danh mục" : "Filter projects by category"}
					className="flex w-fit max-w-full flex-wrap justify-center gap-1 rounded-md border border-[#E7D0AF]/60 bg-white p-1.5 shadow-[0_14px_36px_rgba(52,35,18,0.12)]"
				>
					{tabs.map((tab) => (
						<div key={tab.id ?? "all"} className="max-w-full">
							<ActiveFilterButton id={tab.id}>
								<button type="button" aria-pressed="true" className={ACTIVE_TAB_CLASS}>
									{tab.label}
								</button>
							</ActiveFilterButton>

							<InactiveFilterButton id={tab.id}>
								<button type="button" aria-pressed="false" className={INACTIVE_TAB_CLASS}>
									{tab.label}
								</button>
							</InactiveFilterButton>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
