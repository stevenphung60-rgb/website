import type { Locale } from "src/lib/i18n/config";
import { getDictionary } from "src/lib/i18n/dictionaries";
import { getProjectCategoryById } from "src/server/projectcategories";
import { getActiveProjectCategoryIds } from "src/server/projectcategories/get-projectcategory-ids.query";
import { ActiveFilterButton, InactiveFilterButton } from "./project-filter-button";

interface ProjectFilterButtonsProps {
	locale: Locale;
}

export async function ProjectFilterButtons({
	locale,
}: ProjectFilterButtonsProps) {
	const categoryIds = await getActiveProjectCategoryIds();

	const categoriesData = await Promise.all(
		categoryIds.map((categoryId) => getProjectCategoryById(categoryId)),
	);

	const categories = categoriesData
		.filter(
			(
				category,
			): category is NonNullable<(typeof categoriesData)[number]> =>
				category !== null,
		)
		.map((category) => ({
			id: category.id,
			name: category.name,
		}))
		.filter((category) => category.name.en || category.name.vi);

	const dictionary = getDictionary(locale);

	const activeButtonClassName =
		"flex min-h-[48px] w-full items-center justify-center rounded-none border border-[#342312] bg-[#342312] px-4 py-3 text-center text-[16px] font-bold uppercase leading-snug tracking-[0.01em] text-[#E7D0AF] transition-colors duration-300 hover:border-[#342312] hover:bg-[#342312] hover:text-[#E7D0AF] lg:w-auto lg:px-5";

	const inactiveButtonClassName =
		"flex min-h-[48px] w-full items-center justify-center rounded-none border border-[#E7D0AF] bg-[#FAF7F0] px-4 py-3 text-center text-[16px] font-bold uppercase leading-snug tracking-[0.01em] text-[#342312] transition-colors duration-300 hover:border-[#A87E3C] hover:bg-[#F7F1E6] hover:text-[#A87E3C] lg:w-auto lg:px-5";

	return (
		<div className="relative z-20">
			<div className="mx-auto w-full max-w-full border border-[#E7D0AF] bg-[#F7F1E6] p-2 lg:w-fit lg:max-w-[980px]">
				<div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:w-auto lg:flex-wrap lg:items-center lg:justify-center">
					<div className="min-w-0">
						<ActiveFilterButton id={null}>
							<button type="button" className={activeButtonClassName}>
								<span className="block max-w-full whitespace-normal break-words">
									{dictionary.projects.filter.all}
								</span>
							</button>
						</ActiveFilterButton>

						<InactiveFilterButton id={null}>
							<button type="button" className={inactiveButtonClassName}>
								<span className="block max-w-full whitespace-normal break-words">
									{dictionary.projects.filter.all}
								</span>
							</button>
						</InactiveFilterButton>
					</div>

					{categories.map((category) => (
						<div key={category.id} className="min-w-0">
							<ActiveFilterButton id={category.id}>
								<button type="button" className={activeButtonClassName}>
									<span className="block max-w-full whitespace-normal break-words">
										{category.name[locale]}
									</span>
								</button>
							</ActiveFilterButton>

							<InactiveFilterButton id={category.id}>
								<button type="button" className={inactiveButtonClassName}>
									<span className="block max-w-full whitespace-normal break-words">
										{category.name[locale]}
									</span>
								</button>
							</InactiveFilterButton>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}