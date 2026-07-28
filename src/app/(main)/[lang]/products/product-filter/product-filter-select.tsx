"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MobileFilterSelect } from "src/components/mobile-filter-select";
import { useProductFilterActions, useProductFilterState } from "./product-filter.state";

interface ProductFilterOption {
	id: string;
	label: string;
}

interface ProductMobileCategorySelectProps {
	allLabel: string;
	categories: ProductFilterOption[];
	label: string;
}

export function ProductMobileCategorySelect({
	allLabel,
	categories,
	label,
}: ProductMobileCategorySelectProps) {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const { selectedCategory } = useProductFilterState();
	const { selectAll, selectCategory } = useProductFilterActions();

	return (
		<MobileFilterSelect
			allLabel={allLabel}
			className="lg:hidden"
			label={label}
			value={selectedCategory}
			options={categories.map((category) => ({
				value: category.id,
				label: category.label,
			}))}
			onValueChange={(categoryId) => {
				if (categoryId) {
					selectCategory(categoryId);
				} else {
					selectAll();
				}

				const params = new URLSearchParams(searchParams.toString());

				if (categoryId) {
					params.set("category", categoryId);
				} else {
					params.delete("category");
				}

				const queryString = params.toString();

				router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
					scroll: false,
				});
			}}
		/>
	);
}
