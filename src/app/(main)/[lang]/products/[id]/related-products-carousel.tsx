"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Children, isValidElement, type ReactNode, useRef } from "react";
import {
	RelatedContentMobilePageIndicator,
	RelatedContentMobilePaginationControls,
	useRelatedContentMobilePagination,
} from "src/components/related-content-mobile-pagination";
import type { Locale } from "src/lib/i18n/config";

interface RelatedProductsCarouselProps {
	children: ReactNode;
	contentKey: string;
	itemCount: number;
	locale: Locale;
}

export function RelatedProductsCarousel({
	children,
	contentKey,
	itemCount,
	locale,
}: RelatedProductsCarouselProps) {
	const carouselRef = useRef<HTMLDivElement>(null);
	const childItems = Children.toArray(children);
	const { currentPage, goToPage, isItemVisible, isMobile, isReady, totalPages } =
		useRelatedContentMobilePagination({
			contentKey,
			itemCount,
		});

	const scrollCarousel = (direction: "left" | "right") => {
		const carouselElement = carouselRef.current;

		if (!carouselElement) return;

		carouselElement.scrollBy({
			left: direction === "left" ? -carouselElement.clientWidth : carouselElement.clientWidth,
			behavior: "smooth",
		});
	};

	const desktopCarousel = (
		<div className="relative">
			<div
				ref={carouselRef}
				className="flex snap-x snap-mandatory flex-nowrap gap-3 overflow-x-auto scroll-smooth pb-4 sm:gap-5 lg:gap-6 lg:overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
			>
				{childItems.map((child) => (
					<div
						key={isValidElement(child) ? child.key : String(child)}
						className="shrink-0 basis-[calc((100%_-_12px)/2)] snap-start sm:basis-[calc((100%_-_20px)/2)] lg:basis-[calc((100%_-_72px)/4)]"
					>
						{child}
					</div>
				))}
			</div>

			{itemCount > 4 && (
				<>
					<button
						type="button"
						onClick={() => scrollCarousel("left")}
						className="absolute left-2 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#E7D0AF] bg-[#F7F1E6]/95 text-[#342312] shadow transition hover:border-[#342312] hover:bg-[#342312] hover:text-[#E7D0AF] lg:-left-5 lg:size-11"
						aria-label="Previous related products"
					>
						<ChevronLeft className="size-5" />
					</button>

					<button
						type="button"
						onClick={() => scrollCarousel("right")}
						className="absolute right-2 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#E7D0AF] bg-[#F7F1E6]/95 text-[#342312] shadow transition hover:border-[#342312] hover:bg-[#342312] hover:text-[#E7D0AF] lg:-right-5 lg:size-11"
						aria-label="Next related products"
					>
						<ChevronRight className="size-5" />
					</button>
				</>
			)}
		</div>
	);

	if (!isReady) {
		return (
			<div aria-hidden="true" className="invisible">
				{desktopCarousel}
			</div>
		);
	}

	if (isMobile) {
		return (
			// biome-ignore lint/correctness/useUniqueElementIds: The detail page contains one related-products list used as a stable pagination scroll target.
			<div id="related-products-list-start">
				<RelatedContentMobilePageIndicator
					currentPage={currentPage}
					locale={locale}
					totalPages={totalPages}
				/>

				<div className="grid grid-cols-2 gap-3">
					{childItems.map((child, index) =>
						isItemVisible(index) ? (
							<div
								key={isValidElement(child) ? child.key : String(child)}
								className="h-full min-w-0"
							>
								{child}
							</div>
						) : null,
					)}
				</div>

				<RelatedContentMobilePaginationControls
					currentPage={currentPage}
					locale={locale}
					onPageChange={goToPage}
					scrollTargetId="related-products-list-start"
					totalPages={totalPages}
				/>
			</div>
		);
	}

	return desktopCarousel;
}
