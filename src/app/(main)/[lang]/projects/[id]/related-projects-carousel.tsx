"use client";

import { Calendar, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import LocaleLink from "src/components/behaviors/LocaleLink";
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

	const locationLabel = locale === "vi" ? "Địa điểm" : "Location";
	const timeLabel = locale === "vi" ? "Thời gian" : "Time";

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
								: "flex max-w-full flex-nowrap snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
						}
					>
						{displayedProjects.map((project) => {
							const projectName = project.name?.[locale] ?? project.name?.en ?? "";

							const projectDescription =
								project.description?.[locale] ?? project.description?.en ?? "";

							const projectLocation = project.location?.[locale] ?? project.location?.en ?? "";

							const projectYear = project.year?.[locale] ?? project.year?.en ?? "";

							const mainImage =
								project.gallery?.find((image) => image.isMain) ?? project.gallery?.[0];

							return (
								<div
									key={project.id}
									className={
										isMobile
											? "min-w-0"
											: "min-w-0 shrink-0 basis-[calc((100%-1.25rem)/2)] snap-start lg:basis-[calc((100%_-_2.5rem)_/_3)]"
									}
								>
									{isMobile ? (
										<LocaleLink
											href={`/projects/${project.id}`}
											className="block h-full min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A87E3C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F0]"
										>
											<article className="relative h-full min-w-0 overflow-hidden border border-[#A87E3C]/28 bg-[#F7F1E6]">
												<div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E7D0AF]/25">
													<Image
														src={mainImage?.url || "/placeholder.svg"}
														alt={projectName}
														fill
														className="object-cover"
														sizes="calc(100vw - 2rem)"
													/>

													<div className="absolute inset-0 bg-gradient-to-t from-[#342312]/18 via-transparent to-transparent" />
												</div>

												<div className="pointer-events-none absolute inset-0 border border-[#E7D0AF]/20" />

												<div className="relative z-10 flex min-w-0 items-center gap-2 px-5 pb-0 pt-4">
													<span className="h-px w-6 shrink-0 bg-[#A87E3C]" />

													<p className="line-clamp-1 min-w-0 text-[11px] font-bold uppercase tracking-[0.1em] text-[#A87E3C]">
														{categoryName}
													</p>
												</div>

												<div className="relative z-10 min-w-0 bg-[#F7F1E6] p-5 pt-3">
													<h3 className="mb-3 line-clamp-2 break-words text-[20px] font-black uppercase leading-[1.22] tracking-[-0.02em] text-[#342312]">
														{projectName}
													</h3>

													{projectLocation || projectYear ? (
														<div className="mb-3 space-y-2 border-y border-[#A87E3C]/22 py-3">
															{projectLocation ? (
																<div className="flex min-w-0 items-start gap-2.5">
																	<MapPin className="mt-0.5 size-4 shrink-0 text-[#A87E3C]" />

																	<p className="min-w-0 flex-1 text-[14px] font-semibold leading-5 text-[#5A3719]">
																		<span className="font-medium text-[#A87E3C]">
																			{locationLabel}:{" "}
																		</span>

																		<span className="font-bold">{projectLocation}</span>
																	</p>
																</div>
															) : null}

															{projectYear ? (
																<div className="flex min-w-0 items-start gap-2.5">
																	<Calendar className="mt-0.5 size-4 shrink-0 text-[#A87E3C]" />

																	<p className="min-w-0 flex-1 text-[14px] font-semibold leading-5 text-[#5A3719]">
																		<span className="font-medium text-[#A87E3C]">
																			{timeLabel}:{" "}
																		</span>

																		<span className="font-bold">{projectYear}</span>
																	</p>
																</div>
															) : null}
														</div>
													) : null}

													{projectDescription ? (
														<p className="line-clamp-3 text-[14px] leading-[1.65] text-[#6B5137]">
															{projectDescription}
														</p>
													) : null}
												</div>
											</article>
										</LocaleLink>
									) : (
										<LocaleLink href={`/projects/${project.id}`} className="group block h-full">
											<article className="relative h-[340px] overflow-hidden border border-[#342312]/15 bg-[#342312] md:h-[450px] lg:h-[480px]">
												<Image
													src={mainImage?.url || "/placeholder.svg"}
													alt={projectName}
													fill
													className="object-cover transition duration-700 ease-out group-hover:scale-[1.045] group-hover:brightness-[1.04] group-hover:saturate-[1.05]"
													sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, calc((100vw - 2.75rem) / 2)"
												/>

												<div className="absolute inset-0 bg-gradient-to-t from-[#342312]/82 via-[#342312]/26 to-transparent transition duration-500" />

												<div className="pointer-events-none absolute inset-0 border border-[#E7D0AF]/14 transition duration-500 group-hover:border-[#E7D0AF]/55" />

												<div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 md:left-6 md:top-6 md:max-w-[calc(100%-2.5rem)] md:gap-3">
													<span className="h-px w-4 shrink-0 bg-[#E7D0AF] md:w-8" />

													<p className="line-clamp-1 min-w-0 text-[8px] font-bold uppercase tracking-[0.12em] text-[#F0D5AB] [text-shadow:0_1px_6px_rgba(22,14,6,0.85)] md:text-[12px] md:tracking-[0.2em]">
														{categoryName}
													</p>
												</div>

												<div className="absolute inset-x-0 bottom-0 p-3 [text-shadow:0_2px_10px_rgba(22,14,6,0.72)] md:p-6">
													<h3 className="line-clamp-3 break-words text-[17px] font-black uppercase leading-[1.08] tracking-[-0.02em] text-[#F7F1E6] transition-colors duration-300 group-hover:text-[#E7D0AF] md:text-[34px] md:leading-[1.03] md:tracking-[-0.04em] lg:text-[38px]">
														{projectName}
													</h3>

													{projectLocation || projectYear ? (
														<div className="mt-3 space-y-1.5 border-y border-[#E7D0AF]/32 py-2 md:mt-5 md:space-y-2.5 md:py-4">
															{projectLocation ? (
																<div className="flex min-w-0 items-start gap-1.5 md:gap-3">
																	<MapPin className="mt-0.5 size-3 shrink-0 text-[#F0D5AB] md:mt-1 md:size-4" />

																	<p className="line-clamp-2 min-w-0 text-[10px] leading-4 text-[#F7F1E6]/95 md:line-clamp-none md:text-[14px] md:leading-6">
																		<span className="hidden font-light text-[#F0D5AB]/88 md:inline">
																			{locationLabel}:{" "}
																		</span>

																		<span className="font-bold">{projectLocation}</span>
																	</p>
																</div>
															) : null}

															{projectYear ? (
																<div className="flex min-w-0 items-start gap-1.5 md:gap-3">
																	<Calendar className="mt-0.5 size-3 shrink-0 text-[#F0D5AB] md:mt-1 md:size-4" />

																	<p className="line-clamp-2 min-w-0 text-[10px] leading-4 text-[#F7F1E6]/95 md:line-clamp-none md:text-[14px] md:leading-6">
																		<span className="hidden font-light text-[#F0D5AB]/88 md:inline">
																			{timeLabel}:{" "}
																		</span>

																		<span className="font-bold">{projectYear}</span>
																	</p>
																</div>
															) : null}
														</div>
													) : null}

													{projectDescription ? (
														<p className="mt-4 hidden text-[14px] leading-[1.75] text-[#F7F1E6]/92 md:line-clamp-2">
															{projectDescription}
														</p>
													) : null}
												</div>
											</article>
										</LocaleLink>
									)}
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
