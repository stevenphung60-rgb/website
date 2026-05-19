"use client";

import { createContext, useContext } from "react";

interface ProductVisibilityContextValue {
	registerProduct: (id: string, categoryId: string | null) => void;
	isVisible: (id: string) => boolean;
	hasMore: boolean;
	isReady: boolean;
	animationKey: number;
	getAnimationDelay: (id: string) => number;
	currentPage: number;
	totalPages: number;
	goToPage: (page: number) => void;
}

const ProductVisibilityContext =
	createContext<ProductVisibilityContextValue | null>(null);

export function useProductVisibility() {
	const context = useContext(ProductVisibilityContext);

	if (!context) {
		throw new Error("useProductVisibility must be used within ProductGridController");
	}

	return context;
}

export { ProductVisibilityContext };