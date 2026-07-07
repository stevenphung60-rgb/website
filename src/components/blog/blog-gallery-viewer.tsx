"use client";

import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { BlogImage } from "src/server/blogs";

interface BlogGalleryViewerProps {
	images: BlogImage[];
	locale: "vi" | "en";
	title: string;
}

const previewLimit = 6;

/**
 * Blog gallery with compact preview grid and lightbox viewer.
 * @param props - Blog gallery viewer props
 * @returns Gallery section with image preview and modal
 */
export function BlogGalleryViewer({ images, locale, title }: BlogGalleryViewerProps) {
	const visibleImages = useMemo(
		() => images.filter((image) => Boolean(image.url)),
		[images],
	);
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const activeImage = activeIndex === null ? null : visibleImages[activeIndex] || null;
	const previewImages = visibleImages.slice(0, previewLimit);
	const remainingCount = Math.max(visibleImages.length - previewLimit, 0);

	useEffect(() => {
		if (activeIndex === null) return;

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setActiveIndex(null);
				return;
			}

			if (event.key === "ArrowLeft") {
				setActiveIndex((currentIndex) =>
					currentIndex === null
						? currentIndex
						: currentIndex <= 0
							? visibleImages.length - 1
							: currentIndex - 1,
				);
				return;
			}

			if (event.key === "ArrowRight") {
				setActiveIndex((currentIndex) =>
					currentIndex === null
						? currentIndex
						: currentIndex >= visibleImages.length - 1
							? 0
							: currentIndex + 1,
				);
			}
		}

		document.addEventListener("keydown", handleKeyDown);
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "";
		};
	}, [activeIndex, visibleImages.length]);

	if (visibleImages.length === 0) return null;

	function showPreviousImage() {
		setActiveIndex((currentIndex) =>
			currentIndex === null
				? currentIndex
				: currentIndex <= 0
					? visibleImages.length - 1
					: currentIndex - 1,
		);
	}

	function showNextImage() {
		setActiveIndex((currentIndex) =>
			currentIndex === null
				? currentIndex
				: currentIndex >= visibleImages.length - 1
					? 0
					: currentIndex + 1,
		);
	}

	return (
		<section className="px-4 py-10 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
			<div className="mx-auto max-w-6xl">
				<div className="mb-5 flex flex-col gap-2 border-t border-[#E7D0AF] pt-8 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A87E3C]">
							Gallery
						</p>

						<h2 className="font-heading mt-2 text-2xl font-bold text-[#342312]">
							{title}
						</h2>
					</div>

					<p className="text-sm text-[#342312]/55">
						{visibleImages.length} ảnh
					</p>
				</div>

				<div className="grid grid-cols-2 gap-3 md:grid-cols-3">
					{previewImages.map((image, index) => {
						const isLastPreview = index === previewImages.length - 1;
						const shouldShowMoreOverlay = isLastPreview && remainingCount > 0;

						return (
							<button
								key={`${image.url}-${index}`}
								type="button"
								onClick={() => setActiveIndex(index)}
								className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-[#E7D0AF] bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
							>
								<Image
									src={image.url}
									alt={image.alt?.[locale] || "Blog gallery image"}
									fill
									sizes="(max-width: 768px) 50vw, 33vw"
									className="object-cover transition duration-500 group-hover:scale-105"
								/>

								<div className="absolute inset-0 bg-[#342312]/0 transition group-hover:bg-[#342312]/18" />

								<div className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full border border-white/50 bg-white/85 text-[#342312] opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100">
									<Expand className="size-4" />
								</div>

								{shouldShowMoreOverlay ? (
									<div className="absolute inset-0 flex items-center justify-center bg-[#342312]/72 text-white">
										<span className="font-heading text-3xl font-bold">
											+{remainingCount}
										</span>
									</div>
								) : null}
							</button>
						);
					})}
				</div>
			</div>

			{activeImage ? (
				<div className="fixed inset-0 z-[100000] bg-[#140C05]/92 px-4 py-5 text-white backdrop-blur-sm sm:px-6">
					<button
						type="button"
						onClick={() => setActiveIndex(null)}
						className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
						aria-label="Close gallery"
					>
						<X className="size-5" />
					</button>

					<button
						type="button"
						onClick={showPreviousImage}
						className="absolute left-4 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 sm:flex"
						aria-label="Previous image"
					>
						<ChevronLeft className="size-6" />
					</button>

					<button
						type="button"
						onClick={showNextImage}
						className="absolute right-4 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 sm:flex"
						aria-label="Next image"
					>
						<ChevronRight className="size-6" />
					</button>

					<div className="mx-auto flex h-full max-w-6xl flex-col justify-center gap-4">
						<div className="relative h-[72vh] overflow-hidden rounded-xl border border-white/15 bg-black/25">
							<Image
								src={activeImage.url}
								alt={activeImage.alt?.[locale] || "Blog gallery image"}
								fill
								sizes="100vw"
								className="object-contain"
								priority
							/>
						</div>

						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<p className="text-sm text-white/72">
								{(activeIndex ?? 0) + 1} / {visibleImages.length}
							</p>

							<div className="flex items-center gap-2 sm:hidden">
								<button
									type="button"
									onClick={showPreviousImage}
									className="flex h-10 flex-1 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-sm font-semibold"
								>
									Trước
								</button>

								<button
									type="button"
									onClick={showNextImage}
									className="flex h-10 flex-1 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-sm font-semibold"
								>
									Sau
								</button>
							</div>
						</div>
					</div>
				</div>
			) : null}
		</section>
	);
}
