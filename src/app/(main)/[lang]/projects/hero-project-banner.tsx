"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Locale } from "src/lib/i18n/config";

type HeroProjectImage = {
	url: string;
	order: number;
};

interface HeroProjectBannerProps {
	locale: Locale;
	title: string;
	description: string;
	gallery: HeroProjectImage[];
}

export default function HeroProjectBanner({
	locale,
	title,
	description,
	gallery,
}: HeroProjectBannerProps) {
	const pathname = usePathname();

	const images = useMemo(() => {
		const sortedImages = [...gallery]
			.sort((a, b) => a.order - b.order)
			.map((image) => image.url)
			.filter(Boolean);

		return sortedImages.length > 0 ? sortedImages : ["/project-banner.jpg"];
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
		<section className="relative flex h-[520px] w-full items-center overflow-hidden bg-black">
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

			<div className="absolute inset-0 bg-black/50" />

			<div
				key={animationKey}
				className="relative z-10 mx-auto w-full max-w-7xl px-6"
			>
				<div className="max-w-3xl">
					<p
						className={[
							"mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#DCCABA]",
							"transition-all duration-[800ms] ease-out",
							textStep >= 1
								? "translate-y-0 opacity-100"
								: "translate-y-6 opacity-0",
						].join(" ")}
					>
						{locale === "vi" ? "DỰ ÁN" : "PROJECTS"}
					</p>

					<h1
						className={[
							"text-4xl font-bold leading-tight text-white md:text-6xl",
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
							"mt-6 max-w-2xl text-base leading-8 text-white/85 md:text-lg",
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
				<div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
					{images.map((_, index) => (
						<button
							key={index}
							type="button"
							aria-label={`Go to project banner image ${index + 1}`}
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