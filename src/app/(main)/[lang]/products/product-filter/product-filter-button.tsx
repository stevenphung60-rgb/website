"use client";

import { Slot } from "@radix-ui/react-slot";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import {
	useProductFilterActions,
	useProductFilterState,
} from "./product-filter.state";

interface ProductFilterButtonProps {
	id: string | null;
	children: ReactNode;
}

function useUpdateProductFilterUrl() {
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

function useHandleClick(id: string | null) {
	const { selectedCategory } = useProductFilterState();
	const { selectAll, selectCategory } = useProductFilterActions();
	const updateProductFilterUrl = useUpdateProductFilterUrl();

	return () => {
		if (selectedCategory === id) return;

		if (id === null) {
			selectAll();
			updateProductFilterUrl(null);
			return;
		}

		selectCategory(id);
		updateProductFilterUrl(id);
	};
}

export function ActiveFilterButton({ id, children }: ProductFilterButtonProps) {
	const { selectedCategory } = useProductFilterState();
	const handleClick = useHandleClick(id);

	if (selectedCategory !== id) return null;

	return (
		<Slot onClick={handleClick} aria-current="true">
			{children}
		</Slot>
	);
}

export function InactiveFilterButton({
	id,
	children,
}: ProductFilterButtonProps) {
	const { selectedCategory } = useProductFilterState();
	const handleClick = useHandleClick(id);

	if (selectedCategory === id) return null;

	return <Slot onClick={handleClick}>{children}</Slot>;
}