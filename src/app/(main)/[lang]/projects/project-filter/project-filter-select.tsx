"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MobileFilterSelect } from "src/components/mobile-filter-select";
import { useProjectFilterActions, useProjectFilterState } from "./project-filter.state";

interface ProjectFilterOption {
	id: string;
	label: string;
}

interface ProjectMobileCategorySelectProps {
	allLabel: string;
	categories: ProjectFilterOption[];
	label: string;
}

/**
 * Compact project category selector for mobile screens.
 * The existing button filter remains available from the md breakpoint upward.
 */
export function ProjectMobileCategorySelect({
	allLabel,
	categories,
	label,
}: ProjectMobileCategorySelectProps) {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const { selectedCategory } = useProjectFilterState();
	const { selectAll, selectCategory } = useProjectFilterActions();

	return (
		<MobileFilterSelect
			allLabel={allLabel}
			className="md:hidden"
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
