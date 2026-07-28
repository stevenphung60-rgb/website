"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
	RelatedContentMobilePageIndicator,
	RelatedContentMobilePaginationControls,
	useRelatedContentMobilePagination,
} from "src/components/related-content-mobile-pagination";
import type { Locale } from "src/lib/i18n/config";

export interface BlogRelatedCarouselItem {
	id: string;
	href: string;
	image: string;
	category: string;
	title: string;
	excerpt: string;
	date: string;
	readingTime: string;
	readLabel: string;
}

interface BlogRelatedCarouselProps {
	eyebrow: string;
	title: string;
	items: BlogRelatedCarouselItem[];
	countLabel: string;
	locale: Locale;
}

function getScrollAmount(list: HTMLDivElement) {
	const firstItem = list.firstElementChild;
	const itemWidth =
		firstItem instanceof HTMLElement ? firstItem.getBoundingClientRect().width : list.clientWidth;
	const gap = Number.parseFloat(window.getComputedStyle(list).columnGap) || 0;

	return itemWidth + gap;
}

/**
 * Smooth related blog carousel with stable editorial cards.
 * @param props - Carousel props
 * @returns Related blog carousel
 */
export function BlogRelatedCarousel({
	eyebrow,
	title,
	items,
	countLabel,
	locale,
}: BlogRelatedCarouselProps) {
	const listRef = useRef<HTMLDivElement | null>(null);
	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(items.length > 3);
	const contentKey = items.map((item) => item.id).join("|");
	const { currentPage, goToPage, isItemVisible, isMobile, isReady, totalPages } =
		useRelatedContentMobilePagination({
			contentKey,
			itemCount: items.length,
		});
	const displayedItems = items.filter((_, index) => isItemVisible(index));
	const shouldShowControls = isReady && !isMobile && items.length > 3;
	const scrollTargetId = "related-blog-list";

	function updateScrollState() {
		const list = listRef.current;

		if (!list) return;

		const maxScrollLeft = list.scrollWidth - list.clientWidth;
		setCanScrollPrev(list.scrollLeft > 4);
		setCanScrollNext(list.scrollLeft < maxScrollLeft - 4);
	}

	function scrollCarousel(direction: "previous" | "next") {
		const list = listRef.current;

		if (!list) return;

		const scrollAmount =
			window.innerWidth < 640 ? getScrollAmount(list) : Math.max(list.clientWidth - 48, 260);

		list.scrollBy({
			left: direction === "next" ? scrollAmount : -scrollAmount,
			behavior: "smooth",
		});
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: The item count changes the carousel bounds even though updateScrollState reads the resulting DOM dimensions.
	useEffect(() => {
		updateScrollState();
	}, [items.length]);

	if (items.length === 0) return null;

	return (
		<section
			className="border-t border-[#E7D0AF] bg-[#FAF7F1] px-4 py-14 sm:px-6 lg:px-10 xl:px-16 2xl:px-24"
			style={{ visibility: isReady ? "visible" : "hidden" }}
		>
			<div className="mx-auto max-w-[1500px]">
				<div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A87E3C]">
							{eyebrow}
						</p>

						<h2 className="font-heading mt-2 text-[32px] font-bold leading-tight text-[#342312] sm:text-[40px]">
							{title}
						</h2>
					</div>

					<div className="flex items-center justify-between gap-4 sm:justify-end">
						<p className="text-sm text-[#342312]/55">{countLabel}</p>

						{shouldShowControls ? (
							<CarouselControls
								canScrollPrev={canScrollPrev}
								canScrollNext={canScrollNext}
								onPrevious={() => scrollCarousel("previous")}
								onNext={() => scrollCarousel("next")}
							/>
						) : null}
					</div>
				</div>

				<div id={scrollTargetId}>
					{isMobile ? (
						<RelatedContentMobilePageIndicator
							currentPage={currentPage}
							locale={locale}
							totalPages={totalPages}
						/>
					) : null}

					<div
						ref={listRef}
						onScroll={updateScrollState}
						className={
							isMobile
								? "grid grid-cols-2 gap-3"
								: "flex flex-nowrap snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
						}
					>
						{displayedItems.map((item) => (
							<Link
								key={item.id}
								href={item.href}
								scroll
								className={
									isMobile
										? "group flex min-h-[350px] min-w-0 flex-col border border-[#E7D0AF] bg-white shadow-sm transition-colors duration-300 hover:border-[#A87E3C]/70"
										: "group flex min-h-[470px] min-w-0 shrink-0 basis-[calc((100%-1.25rem)/2)] snap-start flex-col border border-[#E7D0AF] bg-white shadow-sm transition-colors duration-300 hover:border-[#A87E3C]/70 lg:basis-[calc((100%-2.5rem)/3)]"
								}
							>
								<div className="relative aspect-[16/9] overflow-hidden border-b border-[#E7D0AF] bg-[#F7F1E6]">
									{item.image ? (
										<Image
											src={item.image}
											alt={item.title}
											fill
											sizes="(max-width: 639px) calc((100vw - 2rem - 0.75rem) / 2), (max-width: 1023px) 50vw, 33vw"
											className="object-cover"
										/>
									) : null}
								</div>

								<div className="flex flex-1 flex-col px-3 py-4 md:px-6 md:py-6">
									<p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A87E3C] md:text-xs md:tracking-[0.18em]">
										{item.category}
									</p>

									<h3 className="font-heading mt-2 line-clamp-3 text-[15px] font-bold leading-[1.25] text-[#342312] transition-colors group-hover:text-[#A87E3C] md:mt-4 md:text-[24px] md:leading-[1.18]">
										{item.title}
									</h3>

									<p className="mt-2 line-clamp-2 text-xs leading-5 text-[#342312]/65 md:mt-4 md:line-clamp-3 md:text-base md:leading-7">
										{item.excerpt}
									</p>

									<div className="mt-auto flex flex-col items-start gap-2 pt-4 text-[11px] leading-4 text-[#342312]/55 md:flex-row md:items-end md:justify-between md:gap-4 md:pt-8 md:text-sm md:leading-normal">
										<div className="space-y-1">
											<p>{item.date}</p>
											<p>{item.readingTime}</p>
										</div>

										<span className="inline-flex items-center gap-1 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.08em] text-[#A87E3C] md:gap-2 md:text-xs md:tracking-[0.14em]">
											{item.readLabel}
											<ArrowRight className="size-3 md:size-4" />
										</span>
									</div>
								</div>
							</Link>
						))}
					</div>

					{isMobile ? (
						<RelatedContentMobilePaginationControls
							currentPage={currentPage}
							locale={locale}
							onPageChange={goToPage}
							scrollTargetId={scrollTargetId}
							totalPages={totalPages}
						/>
					) : null}
				</div>
			</div>
		</section>
	);
}

function CarouselControls({
	canScrollPrev,
	canScrollNext,
	onPrevious,
	onNext,
	fullWidth,
}: {
	canScrollPrev: boolean;
	canScrollNext: boolean;
	onPrevious: () => void;
	onNext: () => void;
	fullWidth?: boolean;
}) {
	const buttonClassName = [
		"flex h-11 items-center justify-center border border-[#E7D0AF] bg-white text-[#342312] transition enabled:hover:border-[#A87E3C] enabled:hover:text-[#A87E3C] disabled:cursor-not-allowed disabled:opacity-35",
		fullWidth ? "flex-1" : "w-11",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div className="flex w-full items-center gap-2 sm:w-auto">
			<button
				type="button"
				onClick={onPrevious}
				disabled={!canScrollPrev}
				className={buttonClassName}
				aria-label="Previous related articles"
			>
				<ChevronLeft className="size-5" />
			</button>

			<button
				type="button"
				onClick={onNext}
				disabled={!canScrollNext}
				className={buttonClassName}
				aria-label="Next related articles"
			>
				<ChevronRight className="size-5" />
			</button>
		</div>
	);
}
