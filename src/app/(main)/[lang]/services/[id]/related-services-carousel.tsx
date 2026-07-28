"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
	Children,
	isValidElement,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	RelatedContentMobilePageIndicator,
	RelatedContentMobilePaginationControls,
	useRelatedContentMobilePagination,
} from "src/components/related-content-mobile-pagination";
import type { Locale } from "src/lib/i18n/config";

interface RelatedServicesCarouselProps {
	children: ReactNode;
	contentKey: string;
	itemCount: number;
	locale: Locale;
}

function getVisibleCount() {
	if (window.innerWidth >= 1024) {
		return 3;
	}

	return 2;
}

function getScrollAmount(carouselElement: HTMLDivElement) {
	const firstItem = carouselElement.firstElementChild;
	const itemWidth =
		firstItem instanceof HTMLElement
			? firstItem.getBoundingClientRect().width
			: carouselElement.clientWidth;
	const gap = Number.parseFloat(window.getComputedStyle(carouselElement).columnGap) || 0;

	return itemWidth + gap;
}

export default function RelatedServicesCarousel({
	children,
	contentKey,
	itemCount,
	locale,
}: RelatedServicesCarouselProps) {
	const carouselRef = useRef<HTMLDivElement>(null);
	const childItems = Children.toArray(children);

	const [visibleCount, setVisibleCount] = useState(3);
	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(false);
	const { currentPage, goToPage, isItemVisible, isMobile, isReady, totalPages } =
		useRelatedContentMobilePagination({
			contentKey,
			itemCount,
		});

	const shouldShowControls = itemCount > visibleCount;

	const updateScrollState = useCallback(() => {
		const carouselElement = carouselRef.current;

		if (!carouselElement) return;

		const maxScrollLeft = carouselElement.scrollWidth - carouselElement.clientWidth;

		setCanScrollPrev(carouselElement.scrollLeft > 4);
		setCanScrollNext(carouselElement.scrollLeft < maxScrollLeft - 4);
	}, []);

	useEffect(() => {
		const updateVisibleCount = () => {
			setVisibleCount(getVisibleCount());
			window.requestAnimationFrame(updateScrollState);
		};

		updateVisibleCount();

		window.addEventListener("resize", updateVisibleCount);

		return () => {
			window.removeEventListener("resize", updateVisibleCount);
		};
	}, [updateScrollState]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Item and visible counts change the carousel bounds even though updateScrollState reads the resulting DOM dimensions.
	useEffect(() => {
		updateScrollState();
	}, [itemCount, visibleCount, updateScrollState]);

	const scrollCarousel = (direction: "prev" | "next") => {
		const carouselElement = carouselRef.current;

		if (!carouselElement) return;

		const scrollAmount =
			window.innerWidth < 640 ? getScrollAmount(carouselElement) : carouselElement.clientWidth;

		carouselElement.scrollBy({
			left: direction === "next" ? scrollAmount : -scrollAmount,
			behavior: "smooth",
		});
	};

	const buttonClassName =
		"inline-flex size-11 items-center justify-center rounded-full border border-[#342312]/20 bg-transparent text-[#342312] transition-colors duration-300 hover:border-[#342312] hover:bg-[#342312] hover:text-[#E7D0AF] disabled:pointer-events-none disabled:border-[#342312]/10 disabled:text-[#342312]/25";

	const desktopCarousel = (
		<div className="relative max-w-full overflow-hidden">
			{shouldShowControls && (
				<div className="mb-3 flex items-center justify-end gap-2 sm:mb-4">
					<button
						type="button"
						onClick={() => scrollCarousel("prev")}
						disabled={!canScrollPrev}
						aria-label="Previous services"
						className={buttonClassName}
					>
						<ChevronLeft className="size-5" />
					</button>

					<button
						type="button"
						onClick={() => scrollCarousel("next")}
						disabled={!canScrollNext}
						aria-label="Next services"
						className={buttonClassName}
					>
						<ChevronRight className="size-5" />
					</button>
				</div>
			)}

			<div
				ref={carouselRef}
				onScroll={updateScrollState}
				className="flex max-w-full flex-nowrap snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden scroll-smooth pb-2 sm:gap-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				{childItems.map((child) => (
					<div
						key={isValidElement(child) ? child.key : String(child)}
						className="min-w-0 shrink-0 basis-[calc((100%_-_0.75rem)_/_2)] snap-start sm:basis-[calc((100%_-_1.25rem)_/_2)] lg:basis-[calc((100%_-_2.5rem)_/_3)]"
					>
						{child}
					</div>
				))}
			</div>
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
			// biome-ignore lint/correctness/useUniqueElementIds: The detail page contains one related-services list used as a stable pagination scroll target.
			<div id="related-services-list-start">
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
					scrollTargetId="related-services-list-start"
					totalPages={totalPages}
				/>
			</div>
		);
	}

	return desktopCarousel;
}
