"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Locale } from "src/lib/i18n/config";

type HeroServiceImage = {
	url: string;
	order: number;
};

interface HeroServiceBannerProps {
	locale: Locale;
	title: string;
	description: string;
	gallery: HeroServiceImage[];
}

export default function HeroServiceBanner({
	locale,
	title,
	description,
	gallery,
}: HeroServiceBannerProps) {
	const pathname = usePathname();

	const images = useMemo(() => {
		const sortedImages = [...gallery]
			.sort((a, b) => a.order - b.order)
			.map((image) => image.url)
			.filter(Boolean);

		return sortedImages.length > 0 ? sortedImages : ["/service-banner.jpg"];
	}, [gallery]);

	const [activeIndex, setActiveIndex] = useState(0);
	const [textStep, setTextStep] = useState(0);
	const [canAnimateImages, setCanAnimateImages] = useState(false);
	const [animationKey, setAnimationKey] = useState(0);

	useEffect(() => {
		setAnimationKey((currentKey) => currentKey + 1);
	}, [pathname]);

	useEffect(() => {
		setActiveIndex(0);
		setTextStep(0);
		setCanAnimateImages(false);

		const eyebrowTimer = window.setTimeout(() => {
			setTextStep(1);
		}, 150);

		const titleTimer = window.setTimeout(() => {
			setTextStep(2);
		}, 500);

		const descriptionTimer = window.setTimeout(() => {
			setTextStep(3);
		}, 900);

		const imageAnimationTimer = window.setTimeout(() => {
			setCanAnimateImages(true);
		}, 1200);

		return () => {
			window.clearTimeout(eyebrowTimer);
			window.clearTimeout(titleTimer);
			window.clearTimeout(descriptionTimer);
			window.clearTimeout(imageAnimationTimer);
		};
	}, [animationKey]);

	useEffect(() => {
		images.forEach((src) => {
			const image = new window.Image();
			image.src = src;
		});
	}, [images]);

	useEffect(() => {
		if (images.length <= 1) return;

		const timer = window.setInterval(() => {
			setActiveIndex((currentIndex) =>
				currentIndex >= images.length - 1 ? 0 : currentIndex + 1,
			);
		}, 6000);

		return () => window.clearInterval(timer);
	}, [images.length]);

	return (
		<section className="relative flex min-h-[420px] w-full items-center overflow-hidden bg-black py-16 sm:min-h-[480px] sm:py-20 lg:h-[520px] lg:py-0">
			{images.map((image, index) => (
				<div
					key={`${image}-${index}`}
					className={[
						"absolute inset-0 bg-cover bg-center bg-no-repeat",
						canAnimateImages
							? "transition-opacity duration-[1600ms] ease-in-out will-change-[opacity]"
							: "",
						index === activeIndex ? "opacity-100" : "opacity-0",
					].join(" ")}
					style={{
						backgroundImage: `url("${image}")`,
					}}
				/>
			))}

			<div className="absolute inset-0 bg-black/55 sm:bg-black/50" />
			<div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-transparent" />
			<div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

			<div
				key={animationKey}
				className="relative z-10 w-full max-w-none px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24"
			>
				<div className="max-w-3xl">
					<p
						className={[
							"mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#DCCABA] sm:mb-4 sm:text-sm sm:tracking-[0.35em]",
							"transition-all duration-[800ms] ease-out",
							textStep >= 1
								? "translate-y-0 opacity-100"
								: "translate-y-6 opacity-0",
						].join(" ")}
					>
						{locale === "vi" ? "DỊCH VỤ" : "SERVICES"}
					</p>

					<h1
						className={[
							"text-3xl font-bold leading-tight text-white sm:text-5xl md:text-6xl",
							"transition-all duration-[900ms] ease-out",
							textStep >= 2
								? "translate-y-0 opacity-100"
								: "translate-y-8 opacity-0",
						].join(" ")}
					>
						{title}
					</h1>

					<p
						className={[
							"mt-5 max-w-2xl text-sm leading-7 text-white/85 sm:mt-6 sm:text-base sm:leading-8 md:text-lg",
							"transition-all duration-[900ms] ease-out",
							textStep >= 3
								? "translate-y-0 opacity-100"
								: "translate-y-8 opacity-0",
						].join(" ")}
					>
						{description}
					</p>
				</div>
			</div>

			{images.length > 1 && (
				<div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-8">
					{images.map((_, index) => (
						<button
							key={index}
							type="button"
							aria-label={`Go to service banner image ${index + 1}`}
							onClick={() => setActiveIndex(index)}
							className={[
								"h-2 rounded-full transition-all duration-300",
								index === activeIndex
									? "w-8 bg-[#DCCABA]"
									: "w-2 bg-white/50 hover:bg-white",
							].join(" ")}
						/>
					))}
				</div>
			)}
		</section>
	);
}