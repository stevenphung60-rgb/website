"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Locale } from "src/lib/i18n/config";

type HeroContactImage = {
	url: string;
	order: number;
};

interface HeroContactBannerProps {
	locale: Locale;
	title: string;
	description: string;
	gallery: HeroContactImage[];
}

export default function HeroContactBanner({
	locale,
	title,
	description,
	gallery,
}: HeroContactBannerProps) {
	const pathname = usePathname();

	const images = useMemo(() => {
		const sortedImages = [...gallery]
			.sort((a, b) => a.order - b.order)
			.map((image) => image.url)
			.filter(Boolean);

		return sortedImages.length > 0 ? sortedImages : ["/contact-banner.jpg"];
	}, [gallery]);

	const [activeIndex, setActiveIndex] = useState(0);
	const [textStep, setTextStep] = useState(0);
	const [canAnimateImages, setCanAnimateImages] = useState(false);
	const [animationKey, setAnimationKey] = useState(0);

	useEffect(() => {
		setAnimationKey((currentKey) => currentKey + 1);
	}, [pathname]);

	useEffect(() => {
		setTextStep(0);
		setCanAnimateImages(false);

		const resetTimer = window.setTimeout(() => {
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
		}, 30);

		return () => {
			window.clearTimeout(resetTimer);
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
		<section className="relative flex min-h-[420px] w-full items-center overflow-hidden bg-[#342312] py-16 sm:min-h-[480px] sm:py-20 lg:min-h-[520px] lg:py-0">
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

			<div className="absolute inset-0 bg-[#342312]/62" />

			<div
				key={animationKey}
				className="relative z-10 w-full max-w-none px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24"
			>
				<div className="max-w-3xl">
					<p
						className={[
							"mb-3 break-words text-[11px] font-semibold uppercase leading-relaxed tracking-[0.28em] text-[#E7D0AF] sm:mb-4 sm:text-sm sm:tracking-[0.35em]",
							"transition-all duration-[800ms] ease-out",
							textStep >= 1
								? "translate-y-0 opacity-100"
								: "translate-y-6 opacity-0",
						].join(" ")}
					>
						{locale === "vi" ? "LIÊN HỆ" : "CONTACT"}
					</p>

					<h1
						className={[
							"max-w-4xl break-words text-[34px] font-bold leading-[1.12] text-[#F7F1E6] sm:text-5xl sm:leading-tight md:text-6xl",
							"transition-all duration-[900ms] ease-out",
							textStep >= 2
								? "translate-y-0 opacity-100"
								: "translate-y-8 opacity-0",
						].join(" ")}
					>
						{title}
					</h1>

					{description ? (
						<p
							className={[
								"mt-5 max-w-2xl whitespace-pre-line text-sm leading-7 text-[#F7F1E6]/86 sm:mt-6 sm:text-base sm:leading-8 md:text-lg",
								"transition-all duration-[900ms] ease-out",
								textStep >= 3
									? "translate-y-0 opacity-100"
									: "translate-y-8 opacity-0",
							].join(" ")}
						>
							{description}
						</p>
					) : null}
				</div>
			</div>

			{images.length > 1 && (
				<div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-8">
					{images.map((_, index) => (
						<button
							key={index}
							type="button"
							aria-label={`Go to contact banner image ${index + 1}`}
							onClick={() => setActiveIndex(index)}
							className={[
								"h-2 rounded-full transition-all duration-300",
								index === activeIndex
									? "w-8 bg-[#E7D0AF]"
									: "w-2 bg-[#F7F1E6]/55 hover:bg-[#F7F1E6]",
							].join(" ")}
						/>
					))}
				</div>
			)}
		</section>
	);
}