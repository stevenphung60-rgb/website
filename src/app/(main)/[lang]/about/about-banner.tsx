"use client";

import { Building2, Factory } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { Locale } from "src/lib/i18n/config";

interface AboutBannerGalleryItem {
	url: string;
	order: number;
}

interface AboutBannerInfo {
	title: {
		vi?: string;
		en?: string;
	};
	description: {
		vi?: string;
		en?: string;
	};
	officeaddress: {
		vi?: string;
		en?: string;
	};
	factoryaddress: {
		vi?: string;
		en?: string;
	};
	gallery: AboutBannerGalleryItem[];
}

interface AboutBannerProps {
	locale: Locale;
	heroAboutInfo: AboutBannerInfo;
}

const uiText = {
	vi: {
		eyebrow: "Về chúng tôi",
		officeLabel: "Văn phòng đại diện",
		factoryLabel: "Nhà máy sản xuất",
		imageAlt: "Ảnh giới thiệu Nghiệp Hưng",
	},
	en: {
		eyebrow: "About us",
		officeLabel: "Representative office",
		factoryLabel: "Factory",
		imageAlt: "Nghiep Hung about image",
	},
};

export default function AboutBanner({
	locale,
	heroAboutInfo,
}: AboutBannerProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	const lang = locale === "en" ? "en" : "vi";
	const text = uiText[lang];

	const title = heroAboutInfo.title[lang] || "";
	const description = heroAboutInfo.description[lang] || "";

	const officeAddress = heroAboutInfo.officeaddress[lang] || "";
	const factoryAddress = heroAboutInfo.factoryaddress[lang] || "";

	const bannerImages = useMemo(
		() =>
			[...heroAboutInfo.gallery]
				.sort((a, b) => a.order - b.order)
				.map((image) => image.url)
				.filter(Boolean),
		[heroAboutInfo.gallery],
	);

	useEffect(() => {
		if (bannerImages.length <= 1) return;

		const timer = window.setInterval(() => {
			setCurrentIndex((currentIndex) =>
				currentIndex >= bannerImages.length - 1 ? 0 : currentIndex + 1,
			);
		}, 3000);

		return () => {
			window.clearInterval(timer);
		};
	}, [bannerImages.length]);

	const locations = [
		{
			label: text.officeLabel,
			value: officeAddress,
			icon: Building2,
		},
		{
			label: text.factoryLabel,
			value: factoryAddress,
			icon: Factory,
		},
	];

	return (
		<section className="relative w-full overflow-hidden bg-[#342312]">
			<style>
				{`
					@keyframes aboutBannerFadeUp {
						from {
							opacity: 0;
							transform: translateY(24px);
						}
						to {
							opacity: 1;
							transform: translateY(0);
						}
					}

					@keyframes aboutBannerFadeLeft {
						from {
							opacity: 0;
							transform: translateX(28px);
						}
						to {
							opacity: 1;
							transform: translateX(0);
						}
					}

					@keyframes aboutBannerLine {
						from {
							opacity: 0;
							transform: scaleX(0);
						}
						to {
							opacity: 1;
							transform: scaleX(1);
						}
					}
				`}
			</style>

			<div className="relative min-h-[620px] overflow-hidden lg:min-h-[640px]">
				{bannerImages.map((image, index) => (
					<Image
						key={`${image}-${index}`}
						src={image}
						alt={title || text.imageAlt}
						fill
						priority={index === 0}
						sizes="100vw"
						className={[
							"object-cover object-center transition-all duration-[1400ms] ease-out",
							index === currentIndex
								? "scale-100 opacity-100"
								: "scale-[1.04] opacity-0",
						].join(" ")}
					/>
				))}

				<div className="absolute inset-0 bg-[#342312]/10" />
				<div className="absolute inset-0 bg-gradient-to-r from-[#342312]/82 via-[#342312]/46 to-[#342312]/18 lg:from-[#342312]/78 lg:via-[#342312]/34 lg:to-transparent" />
				<div className="absolute inset-0 bg-gradient-to-t from-[#342312]/56 via-transparent to-transparent" />

				<div className="relative z-10 grid min-h-[620px] grid-cols-1 items-center gap-8 px-4 py-14 sm:px-6 lg:min-h-[640px] lg:grid-cols-[0.58fr_0.42fr] lg:gap-10 lg:px-10 xl:px-16 2xl:px-24">
					<div className="max-w-[820px]">
						<p
							className="text-xs font-bold uppercase tracking-[0.24em] text-[#E7D0AF]"
							style={{
								animation: "aboutBannerFadeUp 700ms ease-out 120ms both",
							}}
						>
							{text.eyebrow}
						</p>

						<h1
							className="mt-4 text-4xl font-extrabold uppercase leading-none tracking-[0.06em] text-white sm:text-6xl lg:text-[60px]"
							style={{
								animation: "aboutBannerFadeUp 760ms ease-out 260ms both",
							}}
						>
							{title}
						</h1>

						<div
							className="mt-7 h-px w-24 origin-left bg-[#E7D0AF]"
							style={{
								animation: "aboutBannerLine 700ms ease-out 430ms both",
							}}
						/>

						<p
							className="mt-3 max-w-[720px] text-[16px] font-normal leading-8 text-white/84 sm:text-2xl"
							style={{
								animation: "aboutBannerFadeUp 760ms ease-out 560ms both",
							}}
						>
							{description}
						</p>
					</div>

					<div className="flex self-auto justify-start pb-0 lg:self-end lg:justify-end lg:pb-10">
						<div className="w-full max-w-none space-y-3 lg:max-w-[430px]">
							{locations.map((item, index) => {
								const Icon = item.icon;

								return (
									<div
										key={item.label}
										className="group flex gap-4 rounded-2xl border border-[#E7D0AF]/50 bg-[#FAF7F0]/82 p-4 text-[#342312] shadow-[0_18px_50px_rgba(52,35,18,0.14)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-[#FAF7F0]/92 sm:p-5"
										style={{
											animation: `aboutBannerFadeLeft 760ms ease-out ${
												720 + index * 160
											}ms both`,
										}}
									>
										<div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#E7D0AF] bg-[#F7F1E6]/80 sm:size-11">
											<Icon className="size-5 text-[#A87E3C]" />
										</div>

										<div>
											<p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#A87E3C] sm:text-xs">
												{item.label}
											</p>

											<p className="mt-2 text-sm font-semibold leading-6 text-[#342312]/82">
												{item.value}
											</p>
										</div>
									</div>
								);
							})}

							<div
								className="ml-auto h-px w-24 origin-right bg-[#E7D0AF]/70"
								style={{
									animation: "aboutBannerLine 700ms ease-out 1100ms both",
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}