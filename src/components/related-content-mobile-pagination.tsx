"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import type { Locale } from "src/lib/i18n/config";
import { cn } from "src/lib/utils";
import { MobilePageIndicator } from "./mobile-page-indicator";

export const RELATED_CONTENT_MOBILE_PAGE_SIZE = 12;

const RELATED_CONTENT_MOBILE_BREAKPOINT = 768;

interface UseRelatedContentMobilePaginationInput {
	contentKey?: string;
	itemCount: number;
}

interface RelatedContentMobilePaginationState {
	currentPage: number;
	goToPage: (page: number) => void;
	isItemVisible: (index: number) => boolean;
	isMobile: boolean;
	isReady: boolean;
	totalPages: number;
}

/**
 * Keeps related-content pagination mobile-only while leaving the desktop list intact.
 */
export function useRelatedContentMobilePagination({
	contentKey,
	itemCount,
}: UseRelatedContentMobilePaginationInput): RelatedContentMobilePaginationState {
	const [isMobile, setIsMobile] = useState(false);
	const [isReady, setIsReady] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	useLayoutEffect(() => {
		const updateViewport = () => {
			setIsMobile(window.innerWidth < RELATED_CONTENT_MOBILE_BREAKPOINT);
			setIsReady(true);
		};

		updateViewport();
		window.addEventListener("resize", updateViewport);

		return () => window.removeEventListener("resize", updateViewport);
	}, []);

	const totalPages = isMobile
		? Math.max(1, Math.ceil(itemCount / RELATED_CONTENT_MOBILE_PAGE_SIZE))
		: 1;

	// biome-ignore lint/correctness/useExhaustiveDependencies: A content or viewport change must intentionally reset pagination.
	useEffect(() => {
		setCurrentPage(1);
	}, [contentKey, isMobile, itemCount]);

	useEffect(() => {
		setCurrentPage((previousPage) => Math.min(Math.max(previousPage, 1), totalPages));
	}, [totalPages]);

	const goToPage = useCallback(
		(page: number) => {
			setCurrentPage(Math.min(Math.max(page, 1), totalPages));
		},
		[totalPages],
	);

	const visibleRange = useMemo(() => {
		const safePage = Math.min(Math.max(currentPage, 1), totalPages);
		const startIndex = (safePage - 1) * RELATED_CONTENT_MOBILE_PAGE_SIZE;

		return {
			endIndex: startIndex + RELATED_CONTENT_MOBILE_PAGE_SIZE,
			startIndex,
		};
	}, [currentPage, totalPages]);

	const isItemVisible = useCallback(
		(index: number) => {
			if (!isMobile) return true;

			return index >= visibleRange.startIndex && index < visibleRange.endIndex;
		},
		[isMobile, visibleRange],
	);

	return {
		currentPage,
		goToPage,
		isItemVisible,
		isMobile,
		isReady,
		totalPages,
	};
}

interface RelatedContentMobilePageIndicatorProps {
	className?: string;
	currentPage: number;
	locale: Locale;
	totalPages: number;
}

export function RelatedContentMobilePageIndicator({
	className,
	currentPage,
	locale,
	totalPages,
}: RelatedContentMobilePageIndicatorProps) {
	return (
		<MobilePageIndicator
			className={cn("mb-4 md:hidden", className)}
			currentPage={currentPage}
			locale={locale}
			totalPages={totalPages}
		/>
	);
}

interface RelatedContentMobilePaginationControlsProps {
	className?: string;
	currentPage: number;
	locale: Locale;
	onPageChange: (page: number) => void;
	scrollTargetId: string;
	totalPages: number;
}

export function RelatedContentMobilePaginationControls({
	className,
	currentPage,
	locale,
	onPageChange,
	scrollTargetId,
	totalPages,
}: RelatedContentMobilePaginationControlsProps) {
	if (totalPages <= 1) return null;

	const pageLabel = locale === "vi" ? "Trang" : "Page";
	const previousLabel = locale === "vi" ? "Trang trước" : "Previous page";
	const nextLabel = locale === "vi" ? "Trang sau" : "Next page";

	const scrollToListStart = () => {
		window.requestAnimationFrame(() => {
			const target = document.getElementById(scrollTargetId);

			if (!target) return;

			const targetTop = target.getBoundingClientRect().top + window.scrollY;
			const headerOffset = window.innerWidth < 640 ? 92 : 104;

			window.scrollTo({
				behavior: "smooth",
				top: Math.max(targetTop - headerOffset, 0),
			});
		});
	};

	const handlePageChange = (page: number) => {
		onPageChange(page);
		scrollToListStart();
	};

	const buttonClassName =
		"flex size-10 items-center justify-center rounded-full border border-[#E7D0AF] bg-[#F7F1E6] text-sm font-semibold text-[#342312] transition-colors hover:border-[#342312] hover:bg-[#342312] hover:text-[#E7D0AF] disabled:pointer-events-none disabled:opacity-40";

	return (
		<nav
			aria-label={locale === "vi" ? "Phân trang nội dung liên quan" : "Related content pagination"}
			className={cn("mt-8 flex flex-wrap items-center justify-center gap-2 md:hidden", className)}
		>
			<button
				type="button"
				aria-label={previousLabel}
				className={buttonClassName}
				disabled={currentPage === 1}
				onClick={() => handlePageChange(currentPage - 1)}
			>
				<ChevronLeft className="size-4" />
			</button>

			{Array.from({ length: totalPages }, (_, index) => {
				const page = index + 1;
				const isActive = page === currentPage;

				return (
					<button
						key={page}
						type="button"
						aria-current={isActive ? "page" : undefined}
						aria-label={`${pageLabel} ${page}`}
						className={
							isActive
								? `${buttonClassName} border-[#342312] bg-[#342312] text-[#E7D0AF]`
								: buttonClassName
						}
						onClick={() => handlePageChange(page)}
					>
						{page}
					</button>
				);
			})}

			<button
				type="button"
				aria-label={nextLabel}
				className={buttonClassName}
				disabled={currentPage === totalPages}
				onClick={() => handlePageChange(currentPage + 1)}
			>
				<ChevronRight className="size-4" />
			</button>
		</nav>
	);
}
