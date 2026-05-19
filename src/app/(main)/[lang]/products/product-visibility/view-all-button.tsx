"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProductVisibility } from "./product-visibility.state";

/**
 * Pagination component for products
 * Shows only when there are multiple pages
 */
export function ViewAllButton() {
	const { totalPages, currentPage, goToPage } = useProductVisibility();

	if (totalPages <= 1) return null;

	const getHeaderOffset = () => {
		if (window.innerWidth < 640) return 76;
		if (window.innerWidth < 1024) return 88;
		return 96;
	};

	const getTopGap = () => {
		if (window.innerWidth < 640) return 96;
		if (window.innerWidth < 1024) return 84;
		return 72;
	};

	const scrollToProductsFilter = () => {
		window.requestAnimationFrame(() => {
			const productsFilterElement = document.getElementById("products-filter");
			const productsSectionElement = document.getElementById("products");
			const targetElement = productsFilterElement || productsSectionElement;

			if (!targetElement) return;

			const elementTop =
				targetElement.getBoundingClientRect().top + window.scrollY;

			const scrollOffset = getHeaderOffset() + getTopGap();

			window.scrollTo({
				top: Math.max(elementTop - scrollOffset, 0),
				behavior: "smooth",
			});
		});
	};

	const handlePageChange = (page: number) => {
		goToPage(page);
		scrollToProductsFilter();
	};

	return (
		<div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:mt-12 sm:gap-3 lg:mt-14">
			<button
				type="button"
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={currentPage === 1}
				aria-label="Previous page"
				className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DCCABA] bg-[#F7F1E6] text-[#342312] transition-all duration-300 hover:border-[#342312] hover:bg-[#342312] hover:text-[#E7D0AF] disabled:pointer-events-none disabled:opacity-40 sm:h-12 sm:w-12"
			>
				<ChevronLeft className="size-4" />
			</button>

			{Array.from({ length: totalPages }).map((_, index) => {
				const page = index + 1;
				const isActive = currentPage === page;

				return (
					<button
						key={page}
						type="button"
						onClick={() => handlePageChange(page)}
						className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300 sm:h-12 sm:w-12 ${
							isActive
								? "border-[#342312] bg-[#342312] text-[#E7D0AF]"
								: "border-[#DCCABA] bg-[#F7F1E6] text-[#342312] hover:border-[#342312] hover:bg-[#342312] hover:text-[#E7D0AF]"
						}`}
					>
						{page}
					</button>
				);
			})}

			<button
				type="button"
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				aria-label="Next page"
				className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DCCABA] bg-[#F7F1E6] text-[#342312] transition-all duration-300 hover:border-[#342312] hover:bg-[#342312] hover:text-[#E7D0AF] disabled:pointer-events-none disabled:opacity-40 sm:h-12 sm:w-12"
			>
				<ChevronRight className="size-4" />
			</button>
		</div>
	);
}