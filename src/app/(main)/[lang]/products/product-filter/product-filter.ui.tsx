import { ChevronsRight } from "lucide-react";
import type { Locale } from "src/lib/i18n/config";
import { getDictionary } from "src/lib/i18n/dictionaries";
import { ActiveFilterButton, InactiveFilterButton } from "./product-filter-button";
import { ProductMobileCategorySelect } from "./product-filter-select";
import { ProductMobilePageHeading } from "./product-mobile-page-heading";

interface ProductFilterCategory {
	id: string;
	name: {
		en: string;
		vi: string;
	};
}

interface ProductFilterButtonsProps {
	locale: Locale;
	categories: ProductFilterCategory[];
}

export async function ProductFilterButtons({
	locale,
	categories,
}: ProductFilterButtonsProps) {
	const dictionary = getDictionary(locale);
	const allLabel = locale === "vi" ? "Tất cả" : "All";
	const mobileFilterLabel =
		locale === "vi" ? "Danh mục sản phẩm" : "Product category";
	const mobileCategories = categories.map((category) => ({
		id: category.id,
		label:
			category.name[locale] ||
			category.name.vi ||
			category.name.en ||
			allLabel,
	}));

	const activeButtonClassName =
		"group flex w-full min-w-0 items-center justify-between gap-2 border-b border-[#A87E3C] bg-[#F7F1E6] px-3 py-3 text-left text-[13px] font-black uppercase leading-[1.45] tracking-[0.08em] text-[#A87E3C] transition-colors duration-300 sm:px-4 sm:py-4 sm:text-[14px] sm:tracking-[0.1em] lg:px-6 lg:py-4 lg:text-[16px] lg:tracking-[0.12em]";

	const inactiveButtonClassName =
		"group flex w-full min-w-0 items-center justify-between gap-2 border-b border-[#E7D0AF] bg-transparent px-3 py-3 text-left text-[13px] font-black uppercase leading-[1.45] tracking-[0.08em] text-[#342312] transition-colors duration-300 hover:bg-[#F7F1E6] hover:text-[#A87E3C] sm:px-4 sm:py-4 sm:text-[14px] sm:tracking-[0.1em] lg:px-6 lg:py-4 lg:text-[16px] lg:tracking-[0.12em]";

	return (
		<>
			<ProductMobilePageHeading title={dictionary.nav.products} />

			<ProductMobileCategorySelect
				allLabel={allLabel}
				categories={mobileCategories}
				label={mobileFilterLabel}
			/>

			<aside className="hidden w-full lg:block lg:w-[300px] lg:shrink-0 xl:w-[320px]">
				<div className="w-full bg-[#FAF7F0]">
					<div className="mb-4 sm:mb-5 lg:mb-6">
						<h3 className="break-words text-[18px] font-black uppercase leading-tight tracking-[0.04em] text-[#342312] sm:text-[20px]">
							{dictionary.products.title}
						</h3>

						<div className="mt-3 h-[2px] w-[90px] bg-[#A87E3C] sm:mt-4 sm:w-[120px] lg:w-[135px]" />
					</div>

					<div className="w-full">
						<div className="min-w-0">
							<ActiveFilterButton id={null}>
								<button type="button" className={activeButtonClassName}>
									<span className="min-w-0 break-words">{allLabel}</span>

									<ChevronsRight className="size-4 shrink-0 text-[#A87E3C] lg:size-5" />
								</button>
							</ActiveFilterButton>

							<InactiveFilterButton id={null}>
								<button type="button" className={inactiveButtonClassName}>
									<span className="min-w-0 break-words">{allLabel}</span>

									<ChevronsRight className="size-4 shrink-0 text-[#A87E3C] opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:size-5" />
								</button>
							</InactiveFilterButton>
						</div>

						{categories.map((category) => (
							<div key={category.id} className="min-w-0">
								<ActiveFilterButton id={category.id}>
									<button type="button" className={activeButtonClassName}>
										<span className="min-w-0 break-words">
											{category.name[locale]}
										</span>

										<ChevronsRight className="size-4 shrink-0 text-[#A87E3C] lg:size-5" />
									</button>
								</ActiveFilterButton>

								<InactiveFilterButton id={category.id}>
									<button type="button" className={inactiveButtonClassName}>
										<span className="min-w-0 break-words">
											{category.name[locale]}
										</span>

										<ChevronsRight className="size-4 shrink-0 text-[#A87E3C] opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:size-5" />
									</button>
								</InactiveFilterButton>
							</div>
						))}
					</div>
				</div>
			</aside>
		</>
	);
}
