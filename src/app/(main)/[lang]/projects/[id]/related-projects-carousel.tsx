"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProjectGridCard } from "src/components/projects/project-grid-card";
import {
	RelatedContentMobilePageIndicator,
	RelatedContentMobilePaginationControls,
	useRelatedContentMobilePagination,
} from "src/components/related-content-mobile-pagination";
import type { Locale } from "src/lib/i18n/config";
import type { Project } from "src/server/projects";

interface RelatedProjectsCarouselProps {
	locale: Locale;
	title: string;
	categoryName: string;
	projects: Project[];
}

function getVisibleCount() {
	if (window.innerWidth >= 1280) return 4;
	if (window.innerWidth >= 1024) return 3;
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

export default function RelatedProjectsCarousel({
	locale,
	title,
	categoryName,
	projects,
}: RelatedProjectsCarouselProps) {
	const carouselRef = useRef<HTMLDivElement>(null);
	const [visibleCount, setVisibleCount] = useState(3);
	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(false);
	const contentKey = projects.map((project) => project.id).join("|");
	const { currentPage, goToPage, isItemVisible, isMobile, isReady, totalPages } =
		useRelatedContentMobilePagination({
			contentKey,
			itemCount: projects.length,
		});
	const displayedProjects = projects.filter((_, index) => isItemVisible(index));
	const scrollTargetId = "related-projects-list";

	const shouldShowControls = isReady && !isMobile && projects.length > visibleCount;

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

		return () => window.removeEventListener("resize", updateVisibleCount);
	}, [updateScrollState]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Project and visible counts change the carousel bounds even though updateScrollState reads the resulting DOM dimensions.
	useEffect(() => {
		updateScrollState();
	}, [projects.length, visibleCount, updateScrollState]);

	if (projects.length === 0) {
		return null;
	}

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
		"inline-flex size-10 items-center justify-center border border-[#342312]/20 bg-transparent text-[#342312] transition-colors duration-300 hover:border-[#342312] hover:bg-[#342312] hover:text-[#E7D0AF] disabled:pointer-events-none disabled:border-[#342312]/10 disabled:text-[#342312]/25 sm:size-11";

	return (
		<section
			className="w-full overflow-hidden bg-[#FAF7F0] px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24"
			style={{ visibility: isReady ? "visible" : "hidden" }}
		>
			<div className="mx-auto w-full max-w-7xl">
				<div className="mb-6 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
					<div className="min-w-0">
						<div className="mb-3 flex items-center gap-3 sm:mb-4">
							<span className="h-px w-10 bg-[#A87E3C] sm:w-14" />

							<p className="min-w-0 break-words text-[12px] font-bold uppercase tracking-[0.22em] text-[#A87E3C] sm:text-[14px]">
								{categoryName}
							</p>
						</div>

						<h2 className="break-words font-serif text-[28px] font-bold leading-tight text-[#342312] sm:text-[36px] lg:text-[42px]">
							{title}
						</h2>
					</div>

					{shouldShowControls ? (
						<div className="flex shrink-0 items-center gap-2">
							<button
								type="button"
								onClick={() => scrollCarousel("prev")}
								disabled={!canScrollPrev}
								aria-label="Previous projects"
								className={buttonClassName}
							>
								<ChevronLeft className="size-5" />
							</button>

							<button
								type="button"
								onClick={() => scrollCarousel("next")}
								disabled={!canScrollNext}
								aria-label="Next projects"
								className={buttonClassName}
							>
								<ChevronRight className="size-5" />
							</button>
						</div>
					) : null}
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
						ref={carouselRef}
						onScroll={updateScrollState}
						className={
							isMobile
								? "grid max-w-full grid-cols-1 gap-6"
								: "-mb-6 flex max-w-full flex-nowrap snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden scroll-smooth pb-8 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
						}
					>
						{displayedProjects.map((project) => {
							const mainImage =
								project.gallery?.find((image) => image.isMain) ?? project.gallery?.[0];

							return (
								<div
									key={project.id}
									className={
										isMobile
											? "min-w-0"
											: "min-w-0 shrink-0 basis-[calc((100%-1.25rem)/2)] snap-start lg:basis-[calc((100%_-_2.5rem)_/_3)] xl:basis-[calc((100%_-_3.75rem)_/_4)]"
									}
								>
									<ProjectGridCard
										locale={locale}
										projectId={project.id}
										name={project.name?.[locale] ?? project.name?.en ?? ""}
										categoryName={categoryName}
										imageUrl={mainImage?.url}
										location={project.location?.[locale] ?? project.location?.en}
										year={project.year?.[locale] ?? project.year?.en}
										imageSizes="(min-width: 1280px) 300px, (min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
									/>
								</div>
							);
						})}
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
