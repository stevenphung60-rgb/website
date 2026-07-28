"use client";

import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useState,
} from "react";
import { useProductFilterState } from "../product-filter/product-filter.state";
import { PRODUCT_OTHER_ID } from "../product-filter/product-filter.type";
import { ProductVisibilityContext } from "./product-visibility.state";

const DESKTOP_PAGE_SIZE = 12;
const MOBILE_PAGE_SIZE = 12;
const PRODUCT_STAGGER_DELAY = 110;
const PRODUCT_MAX_DELAY = 770;

function getPageSize(width: number): number {
	if (width < 768) return MOBILE_PAGE_SIZE;
	return DESKTOP_PAGE_SIZE;
}

interface ProductGridControllerProps {
	productIds: string[];
	limitRows?: boolean;
	children: React.ReactNode;
}

export function ProductGridController({
	productIds,
	limitRows = true,
	children,
}: ProductGridControllerProps) {
	const { selectedCategory } = useProductFilterState();
	const [pageSize, setPageSize] = useState(DESKTOP_PAGE_SIZE);
	const [isReady, setIsReady] = useState(false);
	const [animationKey, setAnimationKey] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [loadedProducts, setLoadedProducts] = useState<
		Map<string, string | null>
	>(new Map());

	useLayoutEffect(() => {
		const updateLayoutState = () => {
			setPageSize(getPageSize(window.innerWidth));
			setIsReady(true);
		};

		updateLayoutState();
		window.addEventListener("resize", updateLayoutState);

		return () => window.removeEventListener("resize", updateLayoutState);
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: A category or breakpoint change must reset pagination even though their values are not read inside the effect.
	useEffect(() => {
		setCurrentPage(1);
		setAnimationKey((prev) => prev + 1);
	}, [selectedCategory, pageSize]);

	const registerProduct = useCallback((id: string, categoryId: string | null) => {
		setLoadedProducts((prev) => {
			if (prev.get(id) === categoryId) return prev;

			const next = new Map(prev);
			next.set(id, categoryId);
			return next;
		});
	}, []);

	const { visibleIds, hasMore, totalPages } = useMemo(() => {
		const filtered = productIds.filter((id) => {
			if (!loadedProducts.has(id)) return false;

			const categoryId = loadedProducts.get(id) ?? null;

			if (selectedCategory === null) return true;
			if (selectedCategory === PRODUCT_OTHER_ID) return categoryId === null;

			return categoryId === selectedCategory;
		});

		if (!limitRows) {
			return {
				visibleIds: new Set(filtered),
				hasMore: false,
				totalPages: 1,
			};
		}

		const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
		const safePage = Math.min(currentPage, pageCount);
		const startIndex = (safePage - 1) * pageSize;
		const visible = new Set(filtered.slice(startIndex, startIndex + pageSize));

		return {
			visibleIds: visible,
			hasMore: pageCount > 1,
			totalPages: pageCount,
		};
	}, [
		productIds,
		loadedProducts,
		selectedCategory,
		limitRows,
		currentPage,
		pageSize,
	]);

	useEffect(() => {
		setCurrentPage((prev) => Math.min(Math.max(prev, 1), totalPages));
	}, [totalPages]);

	const goToPage = useCallback(
		(page: number) => {
			setCurrentPage(Math.min(Math.max(page, 1), totalPages));
			setAnimationKey((prev) => prev + 1);
		},
		[totalPages],
	);

	const visibleOrder = useMemo(() => {
		return productIds.filter((id) => visibleIds.has(id));
	}, [productIds, visibleIds]);

	const getAnimationDelay = useCallback(
		(id: string) => {
			const index = visibleOrder.indexOf(id);

			if (index === -1) return 0;

			return Math.min(index * PRODUCT_STAGGER_DELAY, PRODUCT_MAX_DELAY);
		},
		[visibleOrder],
	);

	const isVisible = useCallback((id: string) => visibleIds.has(id), [visibleIds]);

	const contextValue = useMemo(
		() => ({
			registerProduct,
			isVisible,
			hasMore,
			isReady,
			animationKey,
			getAnimationDelay,
			currentPage,
			totalPages,
			goToPage,
		}),
		[
			registerProduct,
			isVisible,
			hasMore,
			isReady,
			animationKey,
			getAnimationDelay,
			currentPage,
			totalPages,
			goToPage,
		],
	);

	return (
		<ProductVisibilityContext.Provider value={contextValue}>
			<div style={{ visibility: isReady ? "visible" : "hidden" }}>{children}</div>
		</ProductVisibilityContext.Provider>
	);
}
