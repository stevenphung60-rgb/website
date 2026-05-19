"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface ProjectHeroGalleryProps {
	projectName: string;
	categoryName: string;
	images: {
		key: string;
		url: string;
	}[];
}

export default function ProjectHeroGallery({
	projectName,
	categoryName,
	images,
}: ProjectHeroGalleryProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		if (images.length <= 1) {
			return;
		}

		const interval = setInterval(() => {
			setCurrentIndex((prev) =>
				prev === images.length - 1 ? 0 : prev + 1,
			);
		}, 4000);

		return () => clearInterval(interval);
	}, [images.length]);

	const goPrev = () => {
		setCurrentIndex((prev) =>
			prev === 0 ? images.length - 1 : prev - 1,
		);
	};

	const goNext = () => {
		setCurrentIndex((prev) =>
			prev === images.length - 1 ? 0 : prev + 1,
		);
	};

	return (
		<div className="relative overflow-hidden bg-[#342312]">
			<div className="relative min-h-[520px] w-full overflow-hidden sm:min-h-[600px] lg:min-h-[660px]">
				{images.map((image, index) => (
					<div
						key={image.key}
						className={`
							absolute inset-0 transition-all duration-[1400ms]
							${
								index === currentIndex
									? "z-10 scale-100 opacity-100"
									: "z-0 scale-105 opacity-0"
							}
						`}
					>
						<Image
							src={image.url}
							alt={projectName}
							fill
							priority={index === 0}
							className="object-cover"
							sizes="100vw"
						/>
					</div>
				))}

				<div className="absolute inset-0 z-20 bg-black/30" />

				<div className="absolute inset-0 z-30 flex items-center">
					<div className="w-full max-w-none px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
						<div
							className="reveal-fade-up max-w-5xl"
							style={{
								animationDelay: "250ms",
							}}
						>
							<div
								className="reveal-fade-up mb-4 flex max-w-full items-center gap-3 sm:mb-5 sm:gap-4"
								style={{
									animationDelay: "350ms",
								}}
							>
								<span className="h-[2px] w-10 shrink-0 bg-[#A87E3C] sm:w-14" />

								<p className="min-w-0 break-words text-[12px] font-bold uppercase leading-relaxed tracking-[0.18em] text-[#A87E3C] sm:text-[14px] sm:tracking-[0.22em] lg:text-[16px]">
									{categoryName}
								</p>
							</div>

							<h1
								className="
									reveal-fade-up
									max-w-5xl break-words font-serif text-[38px] font-bold
									leading-[1.12] text-white
									drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)]
									sm:text-[52px] sm:leading-[1.1]
									md:text-[58px]
									lg:text-[68px] lg:leading-[1.08]
									xl:text-[76px]
								"
								style={{
									animationDelay: "500ms",
								}}
							>
								{projectName}
							</h1>
						</div>
					</div>
				</div>

				{images.length > 1 ? (
					<>
						<button
							type="button"
							onClick={goPrev}
							className="
								absolute bottom-5 right-[72px] z-40
								flex h-11 w-11 items-center justify-center
								rounded-full border border-white/20
								bg-black/25 text-white backdrop-blur-md
								transition-all duration-300
								hover:scale-110
								hover:border-[#E7D0AF]
								hover:bg-[#342312]
								sm:bottom-8 sm:right-[88px] sm:h-12 sm:w-12
								lg:bottom-auto lg:left-6 lg:right-auto lg:top-1/2 lg:-translate-y-1/2
							"
							aria-label="Previous image"
						>
							<ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
						</button>

						<button
							type="button"
							onClick={goNext}
							className="
								absolute bottom-5 right-4 z-40
								flex h-11 w-11 items-center justify-center
								rounded-full border border-white/20
								bg-black/25 text-white backdrop-blur-md
								transition-all duration-300
								hover:scale-110
								hover:border-[#E7D0AF]
								hover:bg-[#342312]
								sm:bottom-8 sm:right-6 sm:h-12 sm:w-12
								lg:bottom-auto lg:right-6 lg:top-1/2 lg:-translate-y-1/2
							"
							aria-label="Next image"
						>
							<ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
						</button>
					</>
				) : null}
			</div>
		</div>
	);
}