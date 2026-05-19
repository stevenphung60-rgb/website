"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

type ProjectGalleryImage = {
	url: string;
	isMain?: boolean;
};

interface ProjectGalleryProps {
	images: ProjectGalleryImage[];
	projectName: string;
}

export function ProjectGallery({ images, projectName }: ProjectGalleryProps) {
	const thumbnailRef = useRef<HTMLDivElement>(null);

	const defaultImage = images.find((image) => image.isMain) ?? images[0];

	const [selected, setSelected] = useState<ProjectGalleryImage | undefined>(
		defaultImage,
	);

	const currentIndex = images.findIndex((img) => img.url === selected?.url);

	const handlePrev = () => {
		if (images.length === 0) return;

		const newIndex = currentIndex <= 0 ? images.length - 1 : currentIndex - 1;

		setSelected(images[newIndex]);
	};

	const handleNext = () => {
		if (images.length === 0) return;

		const newIndex = currentIndex >= images.length - 1 ? 0 : currentIndex + 1;

		setSelected(images[newIndex]);
	};

	const scrollThumbnails = (direction: "left" | "right") => {
		thumbnailRef.current?.scrollBy({
			left: direction === "left" ? -124 : 124,
			behavior: "smooth",
		});
	};

	return (
		<div className="w-full max-w-full overflow-hidden">
			{/* ẢNH CHÍNH + CHEVRON */}
			<div className="relative">
				<div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#F7F1E6] sm:aspect-square">
					<Image
						src={selected?.url || "/placeholder.svg"}
						alt={projectName}
						fill
						className="object-cover"
						sizes="(min-width: 1024px) 50vw, 100vw"
					/>
				</div>

				{images.length > 1 && (
					<>
						<button
							type="button"
							onClick={handlePrev}
							className="absolute left-3 top-1/2 z-10 -translate-y-1/2 p-2 text-[#342312]/70 transition hover:scale-110 hover:text-[#342312] sm:left-4 lg:left-0 lg:-translate-x-full lg:hover:scale-125"
							aria-label="Previous image"
						>
							<ChevronLeft className="h-8 w-8 sm:h-9 sm:w-9" />
						</button>

						<button
							type="button"
							onClick={handleNext}
							className="absolute right-3 top-1/2 z-10 -translate-y-1/2 p-2 text-[#342312]/70 transition hover:scale-110 hover:text-[#342312] sm:right-4 lg:right-0 lg:translate-x-full lg:hover:scale-125"
							aria-label="Next image"
						>
							<ChevronRight className="h-8 w-8 sm:h-9 sm:w-9" />
						</button>
					</>
				)}
			</div>

			{/* THUMBNAIL */}
			{images.length > 0 && (
				<div className="relative mt-4">
					<div
						ref={thumbnailRef}
						className="flex max-w-full flex-nowrap gap-2 overflow-x-auto overflow-y-hidden scroll-smooth pb-1 sm:gap-3 sm:overflow-x-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
					>
						{images.map((img, i) => (
							<button
								key={`${img.url}-${i}`}
								type="button"
								onClick={() => setSelected(img)}
								className={`h-[74px] w-[74px] shrink-0 overflow-hidden bg-[#F7F1E6] p-1.5 transition sm:h-[96px] sm:w-[96px] sm:p-2 lg:h-[110px] lg:w-[110px] ${
									selected?.url === img.url
										? "border-2 border-[#342312]"
										: "border border-[#E7D0AF] hover:border-[#342312]"
								}`}
							>
								<Image
									src={img.url}
									alt={`${projectName}-${i + 1}`}
									width={110}
									height={110}
									className="h-full w-full object-cover"
								/>
							</button>
						))}
					</div>

					{images.length > 5 && (
						<>
							<button
								type="button"
								onClick={() => scrollThumbnails("left")}
								className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 bg-[#F7F1E6]/90 p-1 text-[#342312] shadow sm:block"
								aria-label="Scroll thumbnails left"
							>
								<ChevronLeft className="h-5 w-5" />
							</button>

							<button
								type="button"
								onClick={() => scrollThumbnails("right")}
								className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 bg-[#F7F1E6]/90 p-1 text-[#342312] shadow sm:block"
								aria-label="Scroll thumbnails right"
							>
								<ChevronRight className="h-5 w-5" />
							</button>
						</>
					)}
				</div>
			)}
		</div>
	);
}