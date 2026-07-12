"use client";

import { Calendar, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import LocaleLink from "src/components/behaviors/LocaleLink";
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
	if (window.innerWidth >= 640) return 2;
	return 1;
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

	const shouldShowControls = projects.length > visibleCount;

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

		return () => window.removeEventListener("resize", updateVisibleCount);
	}, [updateScrollState]);

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
			window.innerWidth < 640
				? getScrollAmount(carouselElement)
				: carouselElement.clientWidth;

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
		<section className="w-full overflow-hidden bg-[#FAF7F0] px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
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

				<div
					ref={carouselRef}
					onScroll={updateScrollState}
					className="flex max-w-full snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
				>
					{projects.map((project) => {
						const projectName =
							project.name?.[locale] ?? project.name?.en ?? "";

						const projectDescription =
							project.description?.[locale] ?? project.description?.en ?? "";

						const projectLocation =
							project.location?.[locale] ?? project.location?.en ?? "";

						const projectYear =
							project.year?.[locale] ?? project.year?.en ?? "";

						const mainImage =
							project.gallery?.find((image) => image.isMain) ??
							project.gallery?.[0];

						return (
							<div
								key={project.id}
								className="min-w-0 shrink-0 basis-full snap-start sm:basis-[calc((100%-1.25rem)/2)] lg:basis-[calc((100%-2.5rem)/3)]"
							>
								<LocaleLink
									href={`/projects/${project.id}`}
									className="group block h-full"
								>
									<article className="relative h-[420px] overflow-hidden border border-[#342312]/15 bg-[#342312] sm:h-[450px] lg:h-[480px]">
										<Image
											src={mainImage?.url || "/placeholder.svg"}
											alt={projectName}
											fill
											className="object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
											sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, calc(100vw - 2rem)"
										/>

										<div className="absolute inset-0 bg-gradient-to-t from-[#342312] via-[#342312]/70 to-transparent transition duration-500 group-hover:via-[#342312]/78" />

										<div className="absolute inset-0 border border-[#E7D0AF]/14 transition duration-500 group-hover:border-[#E7D0AF]/55" />

										<div className="absolute left-5 top-5 flex max-w-[calc(100%-2.5rem)] items-center gap-3 sm:left-6 sm:top-6">
											<span className="h-px w-8 shrink-0 bg-[#E7D0AF]" />

											<p className="line-clamp-1 min-w-0 text-[11px] font-bold uppercase tracking-[0.2em] text-[#E7D0AF] sm:text-[12px]">
												{categoryName}
											</p>
										</div>

										<div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
											<h3 className="line-clamp-3 break-words text-[28px] font-black uppercase leading-[1.03] tracking-[-0.04em] text-[#F7F1E6] transition-colors duration-300 group-hover:text-[#E7D0AF] sm:text-[34px] lg:text-[38px]">
												{projectName}
											</h3>

											{projectLocation || projectYear ? (
												<div className="mt-5 space-y-2.5 border-y border-[#E7D0AF]/18 py-4">
													{projectLocation ? (
														<div className="flex min-w-0 items-start gap-3">
															<MapPin className="mt-1 size-4 shrink-0 text-[#E7D0AF]" />

															<p className="min-w-0 text-[13px] leading-6 text-[#F7F1E6]/82 sm:text-[14px]">
																<span className="font-light text-[#E7D0AF]/72">
																	{locationLabel}:{" "}
																</span>

																<span className="font-bold">
																	{projectLocation}
																</span>
															</p>
														</div>
													) : null}

													{projectYear ? (
														<div className="flex min-w-0 items-start gap-3">
															<Calendar className="mt-1 size-4 shrink-0 text-[#E7D0AF]" />

															<p className="min-w-0 text-[13px] leading-6 text-[#F7F1E6]/82 sm:text-[14px]">
																<span className="font-light text-[#E7D0AF]/72">
																	{timeLabel}:{" "}
																</span>

																<span className="font-bold">
																	{projectYear}
																</span>
															</p>
														</div>
													) : null}
												</div>
											) : null}

											{projectDescription ? (
												<p className="mt-4 line-clamp-2 text-[14px] leading-[1.75] text-[#F7F1E6]/68">
													{projectDescription}
												</p>
											) : null}
										</div>
									</article>
								</LocaleLink>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
