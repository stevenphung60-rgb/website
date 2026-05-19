"use client";

import { Slot } from "@radix-ui/react-slot";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
	useProjectFilterActions,
	useProjectFilterState,
} from "./project-filter.state";

interface FilterButtonSlotProps {
	id: string | null; // null = "All"
	children: React.ReactNode;
}

function useUpdateProjectFilterUrl() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	return (categoryId: string | null) => {
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
	};
}

function useProjectFilter(id: string | null) {
	const { selectedCategory } = useProjectFilterState();
	const { selectCategory, selectAll } = useProjectFilterActions();
	const updateProjectFilterUrl = useUpdateProjectFilterUrl();

	const handleClick = () => {
		if (selectedCategory === id) return;

		if (id === null) {
			selectAll();
			updateProjectFilterUrl(null);
			return;
		}

		selectCategory(id);
		updateProjectFilterUrl(id);
	};

	return {
		selectedCategory,
		handleClick,
	};
}

export function ActiveFilterButton({ id, children }: FilterButtonSlotProps) {
	const { selectedCategory, handleClick } = useProjectFilter(id);

	if (selectedCategory !== id) return null;

	return <Slot onClick={handleClick}>{children}</Slot>;
}

export function InactiveFilterButton({ id, children }: FilterButtonSlotProps) {
	const { selectedCategory, handleClick } = useProjectFilter(id);

	if (selectedCategory === id) return null;

	return <Slot onClick={handleClick}>{children}</Slot>;
}