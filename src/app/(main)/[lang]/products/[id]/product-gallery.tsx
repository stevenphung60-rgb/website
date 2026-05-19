"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ProductGalleryImage = {
	url: string;
	isMain?: boolean;
};

interface ProductGalleryProps {
	images: ProductGalleryImage[];
	productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
	const thumbnailRef = useRef<HTMLDivElement>(null);

	const defaultImage = images.find((image) => image.isMain) ?? images[0];

	const [selected, setSelected] = useState<ProductGalleryImage | undefined>(
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
		<div className="w-full overflow-hidden lg:overflow-visible">
			<div className="relative overflow-visible">
				<div className="relative aspect-square overflow-hidden rounded-xl bg-[#F7F1E6]">
					<Image
						src={selected?.url || "/placeholder.svg"}
						alt={productName}
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
							className="absolute left-2 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#F7F1E6]/90 text-[#342312]/80 shadow transition hover:scale-110 hover:text-[#342312] sm:size-10 lg:left-0 lg:size-auto lg:-translate-x-full lg:bg-transparent lg:p-2 lg:shadow-none lg:hover:scale-125"
							aria-label="Previous image"
						>
							<ChevronLeft className="size-6 sm:size-7 lg:h-9 lg:w-9" />
						</button>

						<button
							type="button"
							onClick={handleNext}
							className="absolute right-2 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#F7F1E6]/90 text-[#342312]/80 shadow transition hover:scale-110 hover:text-[#342312] sm:size-10 lg:right-0 lg:size-auto lg:translate-x-full lg:bg-transparent lg:p-2 lg:shadow-none lg:hover:scale-125"
							aria-label="Next image"
						>
							<ChevronRight className="size-6 sm:size-7 lg:h-9 lg:w-9" />
						</button>
					</>
				)}
			</div>

			{images.length > 0 && (
				<div className="relative mt-3 sm:mt-4">
					<div
						ref={thumbnailRef}
						className="flex flex-nowrap gap-2 overflow-x-auto scroll-smooth pb-1 sm:gap-3 lg:overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
					>
						{images.map((img, i) => (
							<button
								key={`${img.url}-${i}`}
								type="button"
								onClick={() => setSelected(img)}
								className={`h-20 w-20 shrink-0 overflow-hidden bg-[#F7F1E6] p-1.5 transition sm:h-24 sm:w-24 sm:p-2 lg:h-[110px] lg:w-[110px] ${
									selected?.url === img.url
										? "border-2 border-[#342312]"
										: "border border-[#E7D0AF] hover:border-[#342312]"
								}`}
							>
								<Image
									src={img.url}
									alt={`${productName}-${i + 1}`}
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
								className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 bg-[#F7F1E6]/90 p-1 text-[#342312] shadow lg:block"
								aria-label="Scroll thumbnails left"
							>
								<ChevronLeft className="h-5 w-5" />
							</button>

							<button
								type="button"
								onClick={() => scrollThumbnails("right")}
								className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 bg-[#F7F1E6]/90 p-1 text-[#342312] shadow lg:block"
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