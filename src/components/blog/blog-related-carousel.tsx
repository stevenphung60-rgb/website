"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
}: BlogRelatedCarouselProps) {
	const listRef = useRef<HTMLDivElement | null>(null);
	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(items.length > 3);
	const shouldShowControls = items.length > 3;

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

		const scrollAmount = Math.max(list.clientWidth - 48, 260);

		list.scrollBy({
			left: direction === "next" ? scrollAmount : -scrollAmount,
			behavior: "smooth",
		});
	}

	useEffect(() => {
		updateScrollState();
	}, [items.length]);

	if (items.length === 0) return null;

	return (
		<section className="border-t border-[#E7D0AF] bg-[#FAF7F1] px-4 py-14 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
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

				<div
					ref={listRef}
					onScroll={updateScrollState}
					className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
				>
					{items.map((item) => (
						<Link
							key={item.id}
							href={item.href}
							scroll
							className="group flex min-h-[470px] shrink-0 basis-[88%] snap-start flex-col border border-[#E7D0AF] bg-white shadow-sm transition-colors duration-300 hover:border-[#A87E3C]/70 sm:basis-[48%] lg:basis-[calc((100%-2.5rem)/3)]"
						>
							<div className="relative aspect-[16/9] overflow-hidden border-b border-[#E7D0AF] bg-[#F7F1E6]">
								{item.image ? (
									<Image
										src={item.image}
										alt={item.title}
										fill
										sizes="(max-width: 768px) 88vw, (max-width: 1024px) 48vw, 33vw"
										className="object-cover"
									/>
								) : null}
							</div>

							<div className="flex flex-1 flex-col px-6 py-6">
								<p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A87E3C]">
									{item.category}
								</p>

								<h3 className="font-heading mt-4 line-clamp-3 text-[24px] font-bold leading-[1.18] text-[#342312] transition-colors group-hover:text-[#A87E3C]">
									{item.title}
								</h3>

								<p className="mt-4 line-clamp-3 text-base leading-7 text-[#342312]/65">
									{item.excerpt}
								</p>

								<div className="mt-auto flex items-end justify-between gap-4 pt-8 text-sm text-[#342312]/55">
									<div className="space-y-1">
										<p>{item.date}</p>
										<p>{item.readingTime}</p>
									</div>

									<span className="inline-flex items-center gap-2 whitespace-nowrap text-xs font-bold uppercase tracking-[0.14em] text-[#A87E3C]">
										{item.readLabel}
										<ArrowRight className="size-4" />
									</span>
								</div>
							</div>
						</Link>
					))}
				</div>

				{shouldShowControls ? (
					<div className="mt-5 flex items-center justify-between gap-3 sm:hidden">
						<CarouselControls
							canScrollPrev={canScrollPrev}
							canScrollNext={canScrollNext}
							onPrevious={() => scrollCarousel("previous")}
							onNext={() => scrollCarousel("next")}
							fullWidth
						/>
					</div>
				) : null}
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
