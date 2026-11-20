"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProjectVisibility } from "./project-visibility.state";

/**
 * Pagination component for projects
 * Shows only when there are multiple pages
 */
export function ViewAllButton() {
	const { totalPages, currentPage, goToPage } = useProjectVisibility();

	if (totalPages <= 1) return null;

	const getHeaderOffset = () => {
		if (window.innerWidth < 640) return 76;
		if (window.innerWidth < 1024) return 88;
		return 96;
	};

	const getTopGap = () => {
		if (window.innerWidth < 640) return 80;
		if (window.innerWidth < 1024) return 64;
		return 72;
	};

	const scrollToProjectsList = () => {
		window.requestAnimationFrame(() => {
			const listStartElement = document.getElementById("projects-list-start");
			const filterElement = document.getElementById("projects-filter");
			const projectsElement = document.getElementById("projects");

			const targetElement =
				listStartElement || filterElement || projectsElement;

			if (!targetElement) return;

			const elementTop =
				targetElement.getBoundingClientRect().top + window.scrollY;

			const scrollOffset =
				getHeaderOffset() + (listStartElement ? 16 : getTopGap());

			window.scrollTo({
				top: Math.max(elementTop - scrollOffset, 0),
				behavior: "smooth",
			});
		});
	};

	const handlePageChange = (page: number) => {
		goToPage(page);
		scrollToProjectsList();
	};

	const buttonClassName =
		"flex h-11 w-11 items-center justify-center rounded-full border border-[#E7D0AF] bg-white text-sm font-semibold text-[#342312] transition-all duration-300 hover:border-[#342312] hover:bg-[#342312] hover:text-[#E7D0AF] disabled:pointer-events-none disabled:opacity-40 sm:h-12 sm:w-12";

	return (
		<div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:mt-12 sm:gap-3 lg:mt-14">
			<button
				type="button"
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={currentPage === 1}
				aria-label="Previous page"
				className={buttonClassName}
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
						className={`
							flex h-11 w-11 items-center justify-center
							rounded-full border
							text-sm font-semibold transition-all duration-300
							sm:h-12 sm:w-12
							${
								isActive
									? "border-[#342312] bg-[#342312] text-[#E7D0AF]"
									: "border-[#E7D0AF] bg-white text-[#342312] hover:border-[#342312] hover:bg-[#342312] hover:text-[#E7D0AF]"
							}
						`}
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
				className={buttonClassName}
			>
				<ChevronRight className="size-4" />
			</button>
		</div>
	);
}
