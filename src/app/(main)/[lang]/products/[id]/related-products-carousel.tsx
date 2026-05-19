"use client";

import { Children, type ReactNode, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RelatedProductsCarouselProps {
	children: ReactNode;
	itemCount: number;
}

export function RelatedProductsCarousel({
	children,
	itemCount,
}: RelatedProductsCarouselProps) {
	const carouselRef = useRef<HTMLDivElement>(null);

	const scrollCarousel = (direction: "left" | "right") => {
		const carouselElement = carouselRef.current;

		if (!carouselElement) return;

		carouselElement.scrollBy({
			left:
				direction === "left"
					? -carouselElement.clientWidth
					: carouselElement.clientWidth,
			behavior: "smooth",
		});
	};

	return (
		<div className="relative">
			<div
				ref={carouselRef}
				className="flex snap-x snap-mandatory flex-nowrap gap-3 overflow-x-auto scroll-smooth pb-4 sm:gap-5 lg:gap-6 lg:overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
			>
				{Children.map(children, (child, index) => (
					<div
						key={index}
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
}