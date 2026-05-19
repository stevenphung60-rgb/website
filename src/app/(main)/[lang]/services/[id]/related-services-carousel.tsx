"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
	Children,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

interface RelatedServicesCarouselProps {
	children: ReactNode;
	itemCount: number;
}

function getVisibleCount() {
	if (window.innerWidth >= 1024) {
		return 3;
	}

	if (window.innerWidth >= 640) {
		return 2;
	}

	return 1;
}

export default function RelatedServicesCarousel({
	children,
	itemCount,
}: RelatedServicesCarouselProps) {
	const carouselRef = useRef<HTMLDivElement>(null);

	const [visibleCount, setVisibleCount] = useState(3);
	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(false);

	const shouldShowControls = itemCount > visibleCount;

	const updateScrollState = useCallback(() => {
		const carouselElement = carouselRef.current;

		if (!carouselElement) return;

		const maxScrollLeft =
			carouselElement.scrollWidth - carouselElement.clientWidth;

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

	useEffect(() => {
		updateScrollState();
	}, [itemCount, visibleCount, updateScrollState]);

	const scrollCarousel = (direction: "prev" | "next") => {
		const carouselElement = carouselRef.current;

		if (!carouselElement) return;

		carouselElement.scrollBy({
			left:
				direction === "next"
					? carouselElement.clientWidth
					: -carouselElement.clientWidth,
			behavior: "smooth",
		});
	};

	const buttonClassName =
		"inline-flex size-11 items-center justify-center rounded-full border border-[#342312]/20 bg-transparent text-[#342312] transition-colors duration-300 hover:border-[#342312] hover:bg-[#342312] hover:text-[#E7D0AF] disabled:pointer-events-none disabled:border-[#342312]/10 disabled:text-[#342312]/25";

	return (
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
				className="flex max-w-full snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				{Children.map(children, (child) => (
					<div className="min-w-0 shrink-0 basis-[88%] snap-start sm:basis-[calc((100%_-_1.25rem)_/_2)] lg:basis-[calc((100%_-_2.5rem)_/_3)]">
						{child}
					</div>
				))}
			</div>
		</div>
	);
}