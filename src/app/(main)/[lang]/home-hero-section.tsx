"use client";

import { ArrowRight, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { HeroInfo } from "src/app/admin/hero/hero.type";
import LocaleLink from "src/components/behaviors/LocaleLink";
import type { Locale } from "src/lib/i18n/config";
import { getDictionary } from "src/lib/i18n/dictionaries";

interface HeroSectionProps {
	locale: Locale;
	heroInfo: HeroInfo;
}

export default function HeroSection({ locale, heroInfo }: HeroSectionProps) {
	const dictionary = getDictionary(locale);
	const lang = locale.startsWith("vi") ? "vi" : "en";

	const heroTitle = heroInfo.title?.[lang] || dictionary.hero.title;
	const heroDescription = heroInfo.description?.[lang] || dictionary.hero.description;

	const fireResistanceStandards = ["EI30", "EI45", "EI60", "EI120"];

	const standardLabel =
		lang === "en" ? "Fire-rated duct standards" : "Tiêu chuẩn ống gió chống cháy";

	const defaultHeroImages = [
		{ src: "/Hero-Image.png", alt: dictionary.hero.imageAlt },
		{ src: "/about-gallery-1.jpg", alt: dictionary.hero.imageAlt },
		{ src: "/about-gallery-2.jpg", alt: dictionary.hero.imageAlt },
		{ src: "/about-gallery-3.png", alt: dictionary.hero.imageAlt },
		{ src: "/duct-installation-team.png", alt: dictionary.hero.imageAlt },
	];

	const heroImages =
		heroInfo.gallery && heroInfo.gallery.length > 0
			? [...heroInfo.gallery]
					.sort((a, b) => a.order - b.order)
					.map((image) => ({
						src: image.url,
						alt: dictionary.hero.imageAlt,
					}))
			: defaultHeroImages;

	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		if (heroImages.length <= 1) return;

		const timer = window.setInterval(() => {
			setCurrentIndex((currentIndex) =>
				currentIndex >= heroImages.length - 1 ? 0 : currentIndex + 1,
			);
		}, 4000);

		return () => window.clearInterval(timer);
	}, [heroImages.length]);

	return (
		<section id="home" className="relative w-full overflow-hidden">
			<style jsx global>{`
				@keyframes heroMaskReveal {
					from {
						opacity: 0;
						transform: translateY(100%);
					}

					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes heroStandardReveal {
					from {
						opacity: 0;
						transform: translateX(44px);
					}

					to {
						opacity: 1;
						transform: translateX(0);
					}
				}

				.hero-line-mask {
					display: block;
					overflow: hidden;
				}

				.hero-line-reveal {
					display: block;
					opacity: 0;
					animation: heroMaskReveal 0.75s cubic-bezier(0.16, 1, 0.3, 1)
						forwards;
					will-change: transform, opacity;
				}

				.hero-standard-reveal {
					opacity: 0;
					animation: heroStandardReveal 0.85s cubic-bezier(0.16, 1, 0.3, 1)
						forwards;
					will-change: transform, opacity;
				}
			`}</style>

			<div className="relative min-h-[540px] sm:min-h-[600px] lg:min-h-[680px]">
				<div className="absolute inset-0 overflow-hidden bg-black">
					{heroImages.map((image, index) => (
						<img
							key={`${image.src}-${index}`}
							src={image.src}
							alt={image.alt}
							className={[
								"absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-in-out will-change-[opacity]",
								index === currentIndex ? "opacity-100" : "opacity-0",
							].join(" ")}
						/>
					))}

					<div className="absolute inset-0 bg-black/48" />
					<div className="absolute inset-0 bg-gradient-to-r from-[#342312]/72 via-[#342312]/34 to-transparent" />
					<div className="absolute inset-0 bg-gradient-to-t from-[#342312]/46 via-transparent to-black/18" />
				</div>

				<div className="relative z-10 flex min-h-[540px] items-center sm:min-h-[600px] lg:min-h-[680px]">
					<div className="w-full max-w-none px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
						<div className="grid w-full grid-cols-1 gap-8 py-14 sm:gap-10 sm:py-16 md:py-24 lg:grid-cols-[minmax(0,0.64fr)_minmax(240px,0.36fr)] lg:items-center lg:gap-8 lg:py-28 xl:gap-12">
							<div className="max-w-3xl">
								<div className="hero-reveal hero-delay-1 mb-5 flex w-fit max-w-full items-center gap-2 rounded-full border border-[#E7D0AF]/45 bg-transparent px-4 py-2 text-[13px] font-semibold text-[#F7F1E6] backdrop-blur-sm sm:mb-6 sm:text-sm">
									<span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#A87E3C]" />
									<span className="min-w-0 break-words">{dictionary.hero.badge}</span>
								</div>

								<h1 className="font-heading mb-5 min-w-0 max-w-4xl break-words text-[34px] font-black leading-[1.06] text-white [overflow-wrap:anywhere] sm:mb-6 sm:text-5xl md:text-6xl md:[overflow-wrap:normal] lg:text-7xl">
									{heroTitle.split("\n").map((line, index) => (
										<span key={index} className="hero-line-mask">
											<span
												className="hero-line-reveal"
												style={{ animationDelay: `${200 + index * 180}ms` }}
											>
												{line}
											</span>
										</span>
									))}
								</h1>

								<div className="mb-8 max-w-2xl text-[15px] leading-7 text-white/86 sm:mb-10 sm:text-lg sm:leading-relaxed md:text-xl">
									<span className="hero-line-mask">
										<span className="hero-line-reveal" style={{ animationDelay: "740ms" }}>
											{heroDescription}
										</span>
									</span>
								</div>

								<div className="mb-8 overflow-visible sm:mb-10">
									<div className="hero-line-reveal" style={{ animationDelay: "900ms" }}>
										<div className="flex w-full max-w-[420px] flex-col gap-4 sm:max-w-none sm:flex-row sm:items-center sm:gap-6">
											<LocaleLink
												href="/products"
												className="group relative isolate flex h-[54px] w-full items-center justify-center overflow-hidden border border-[#E7D0AF] bg-[#E7D0AF] px-7 text-[14px] font-bold uppercase tracking-[0.08em] text-[#342312] sm:w-auto sm:min-w-[220px] sm:px-8 sm:text-[15px]"
											>
												<span className="absolute inset-y-0 left-0 z-0 w-full origin-left scale-x-0 bg-[#A87E3C] transition-transform duration-500 ease-out group-hover:scale-x-100" />

												<span className="relative z-10 whitespace-nowrap transition-colors duration-300 group-hover:text-white">
													{dictionary.hero.buttons.viewProducts}
												</span>

												<ArrowRight className="relative z-10 ml-2 h-5 w-5 shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
											</LocaleLink>

											<LocaleLink
												href="/contact"
												className="group relative isolate flex h-[54px] w-full items-center justify-center overflow-hidden border border-[#E7D0AF]/80 bg-transparent px-7 text-[14px] font-bold uppercase tracking-[0.08em] text-[#E7D0AF] backdrop-blur-sm sm:w-auto sm:min-w-[240px] sm:px-8 sm:text-[15px]"
											>
												<span className="absolute inset-y-0 left-0 z-0 w-full origin-left scale-x-0 bg-[#F7F1E6] transition-transform duration-500 ease-out group-hover:scale-x-100" />

												<span className="relative z-10 whitespace-nowrap transition-colors duration-300 group-hover:text-[#342312]">
													{dictionary.hero.buttons.contactConsultation}
												</span>
											</LocaleLink>
										</div>
									</div>
								</div>

								<div className="grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5 lg:gap-6">
									<div className="flex items-center gap-2">
										<CheckCircle className="h-5 w-5 shrink-0 text-[#E7D0AF]" />

										<span className="text-sm font-semibold text-white">
											{dictionary.hero.features.standardDucts}
										</span>
									</div>

									<div className="flex items-center gap-2">
										<CheckCircle className="h-5 w-5 shrink-0 text-[#E7D0AF]" />

										<span className="text-sm font-semibold text-white">
											{dictionary.hero.features.fastService}
										</span>
									</div>

									<div className="flex items-center gap-2">
										<CheckCircle className="h-5 w-5 shrink-0 text-[#E7D0AF]" />

										<span className="text-sm font-semibold text-white">
											{dictionary.hero.features.goodPrice}
										</span>
									</div>
								</div>
							</div>

							<div className="w-full max-w-[360px] justify-self-start lg:max-w-[300px] lg:justify-self-end">
								<p
									className="hero-standard-reveal mb-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-[#E7D0AF]/80 lg:text-right"
									style={{ animationDelay: "1040ms" }}
								>
									{standardLabel}
								</p>

								<div className="grid w-full grid-cols-2 gap-2 sm:max-w-[340px] md:flex md:flex-col lg:ml-auto lg:max-w-[300px]">
									{fireResistanceStandards.map((standard, index) => (
										<div
											key={standard}
											className="hero-standard-reveal flex h-[44px] w-full items-center rounded-full border border-[#E7D0AF]/40 bg-[#342312]/24 px-5 text-left text-[#F7F1E6] backdrop-blur-[2px] sm:h-[48px] sm:px-6 lg:h-[52px]"
											style={{ animationDelay: `${1120 + index * 150}ms` }}
										>
											<span className="block text-left text-[18px] font-black uppercase tracking-[0.12em] sm:text-[20px] lg:text-[22px]">
												{standard}
											</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>

				{heroImages.length > 1 ? (
					<div className="absolute bottom-6 left-1/2 z-20 flex max-w-[calc(100%-2rem)] -translate-x-1/2 gap-2 overflow-x-auto px-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:bottom-8 [&::-webkit-scrollbar]:hidden">
						{heroImages.map((_, index) => (
							<button
								key={index}
								type="button"
								aria-label={`Go to home banner image ${index + 1}`}
								onClick={() => setCurrentIndex(index)}
								className={[
									"h-2 shrink-0 rounded-full transition-all duration-300",
									index === currentIndex ? "w-8 bg-[#DCCABA]" : "w-2 bg-white/50 hover:bg-white",
								].join(" ")}
							/>
						))}
					</div>
				) : null}

				{/* stats block giữ nguyên comment của bạn */}
			</div>
		</section>
	);
}
