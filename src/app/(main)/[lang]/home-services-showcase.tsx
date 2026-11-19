"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "src/lib/i18n/config";

export interface HomeServiceShowcaseItem {
	id: string;
	name: string;
	imageUrl: string;
}

interface HomeServicesShowcaseProps {
	locale: Locale;
	services: HomeServiceShowcaseItem[];
	title?: string;
	description?: string;
}

const AUTO_SLIDE_DELAY = 3000;

const sectionText = {
	vi: {
		eyebrow: "Dịch vụ & giải pháp",
		headingLine1: "Giải pháp",
		headingLine2: "ống gió",
		description:
			"Nghiệp Hưng cung cấp hệ giải pháp đồng bộ trong lĩnh vực HVAC, MEP và PCCC, đáp ứng yêu cầu kỹ thuật, tiến độ và vận hành thực tế của từng công trình.",
		viewAll: "Xem tất cả dịch vụ",
		emptyTitle: "Chưa có dịch vụ",
		emptyDescription: "Danh sách dịch vụ đang được cập nhật.",
		imageLabel: "Dịch vụ",
	},
	en: {
		eyebrow: "Services & solutions",
		headingLine1: "Air duct",
		headingLine2: "solutions",
		description:
			"Nghiep Hung provides integrated solutions across HVAC, MEP and fire protection systems, meeting technical, schedule and operational requirements for every project.",
		viewAll: "View all services",
		emptyTitle: "No services yet",
		emptyDescription: "Service list is being updated.",
		imageLabel: "Service",
	},
};

export default function HomeServicesShowcase({
	locale,
	services,
	title,
	description,
}: HomeServicesShowcaseProps) {
	const lang = locale === "en" ? "en" : "vi";
	const text = sectionText[lang];

	const sectionRef = useRef<HTMLElement | null>(null);

	const [activeIndex, setActiveIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [canAutoSlide, setCanAutoSlide] = useState(false);

	const activeService = services[activeIndex] || services[0];

	const displayTitle = title || `${text.headingLine1}\n${text.headingLine2}`;
	const displayTitleLines = displayTitle.split("\n").filter(Boolean);
	const displayDescription = description || text.description;

	useEffect(() => {
		setActiveIndex(0);
	}, [services.length]);

	useEffect(() => {
		const mediaQuery = window.matchMedia(
			"(min-width: 768px) and (hover: hover) and (prefers-reduced-motion: no-preference)",
		);
		const updateAutoSlide = () => setCanAutoSlide(mediaQuery.matches);

		updateAutoSlide();
		mediaQuery.addEventListener("change", updateAutoSlide);

		return () => mediaQuery.removeEventListener("change", updateAutoSlide);
	}, []);

	useEffect(() => {
		if (!canAutoSlide || isPaused || services.length <= 1) return;

		const timer = window.setInterval(() => {
			setActiveIndex((currentIndex) => (currentIndex + 1) % services.length);
		}, AUTO_SLIDE_DELAY);

		return () => window.clearInterval(timer);
	}, [canAutoSlide, isPaused, services.length]);

	useEffect(() => {
		const currentSection = sectionRef.current;

		if (!currentSection) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;

				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.disconnect();
				}
			},
			{
				threshold: 0.18,
				rootMargin: "0px 0px -8% 0px",
			},
		);

		observer.observe(currentSection);

		return () => observer.disconnect();
	}, []);

	if (services.length === 0) {
		return (
			<section className="w-full bg-[#342312] px-4 py-14 text-[#F7F1E6] sm:px-6 sm:py-16 lg:px-10 lg:pb-16 lg:pt-5 xl:px-16 2xl:px-24">
				<div className="bg-white/5 p-8">
					<p className="text-xl font-extrabold uppercase tracking-[0.08em] text-[#FFF8EC]">
						{text.emptyTitle}
					</p>

					<p className="mt-3 text-sm leading-7 text-white">{text.emptyDescription}</p>
				</div>
			</section>
		);
	}

	return (
		<section
			ref={sectionRef}
			className={[
				"w-full overflow-x-hidden bg-[#342312] px-4 py-14 text-[#F7F1E6] sm:px-6 sm:py-16 lg:px-10 lg:pb-16 lg:pt-5 xl:px-16 2xl:px-24",
				isVisible ? "home-service-visible" : "",
			].join(" ")}
		>
			<style>
				{`
					@keyframes homeServiceRevealUp {
						from {
							opacity: 0;
							transform: translateY(28px);
						}

						to {
							opacity: 1;
							transform: translateY(0);
						}
					}

					@keyframes homeServiceRevealRight {
						from {
							opacity: 0;
							transform: translateX(34px);
						}

						to {
							opacity: 1;
							transform: translateX(0);
						}
					}

					@keyframes homeServiceTextEnter {
						from {
							opacity: 0;
							transform: translateY(14px);
						}

						to {
							opacity: 1;
							transform: translateY(0);
						}
					}

					.home-service-reveal-up,
					.home-service-reveal-right {
						opacity: 0;
					}

					.home-service-visible .home-service-reveal-up {
						animation: homeServiceRevealUp 760ms cubic-bezier(0.22, 1, 0.36, 1) both;
					}

					.home-service-visible .home-service-reveal-right {
						animation: homeServiceRevealRight 760ms cubic-bezier(0.22, 1, 0.36, 1) both;
					}

					.home-service-text-enter {
						animation: homeServiceTextEnter 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
					}

					@media (prefers-reduced-motion: reduce) {
						.home-service-reveal-up,
						.home-service-reveal-right,
						.home-service-text-enter {
							opacity: 1 !important;
							transform: none !important;
							animation: none !important;
						}
					}
				`}
			</style>

			<div>
				<div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-[0.58fr_0.42fr] lg:items-end">
					<div className="max-w-[820px]">
						<p
							className="home-service-reveal-up text-[14px] font-bold uppercase tracking-[0.24em] text-[#C79A58]"
							style={{ animationDelay: "0ms" }}
						>
							{text.eyebrow}
						</p>

						<div
							className="home-service-reveal-up mt-5 h-px w-20 bg-[#C79A58]"
							style={{ animationDelay: "100ms" }}
						/>

						<h2
							className="home-service-reveal-up mt-8 text-balance break-words text-[clamp(1.875rem,9vw,2.25rem)] font-extrabold uppercase leading-[1.08] tracking-[0.05em] text-[#FFF8EC] sm:text-5xl sm:tracking-[0.08em] lg:text-[54px]"
							style={{ animationDelay: "180ms" }}
						>
							{displayTitleLines.map((line, index) => (
								<span key={`${line}-${index}`}>
									{line}
									{index < displayTitleLines.length - 1 ? <br /> : null}
								</span>
							))}
						</h2>
					</div>

					<div className="flex flex-col items-start lg:items-end">
						<Link
							href={`/${locale}/services`}
							className="home-service-reveal-up group relative isolate inline-flex w-full items-center justify-center overflow-hidden bg-[#E7D0AF] px-4 py-4 text-[14px] font-extrabold uppercase tracking-[0.16em] text-[#342312] md:w-auto md:px-6"
							style={{ animationDelay: "300ms" }}
						>
							<span className="absolute inset-y-0 left-0 z-0 w-full origin-left scale-x-0 bg-[#A87E3C] transition-transform duration-500 ease-out group-hover:scale-x-100" />

							<span className="relative z-10 transition-colors duration-300 group-hover:text-[#FFF8EC]">
								{text.viewAll}
							</span>

							<span className="relative z-10 ml-3 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#FFF8EC]">
								→
							</span>
						</Link>

						<p
							className="home-service-reveal-up mt-6 max-w-[620px] text-sm leading-7 text-white sm:text-base lg:text-right"
							style={{ animationDelay: "420ms" }}
						>
							{displayDescription}
						</p>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)]">
				<Link
					href={`/${locale}/services/${activeService.id}`}
					className="home-service-reveal-up group/image relative block h-[clamp(360px,112vw,420px)] w-full overflow-hidden bg-[#24180D] sm:h-[500px] lg:h-[660px]"
					style={{ animationDelay: "540ms" }}
					aria-label={activeService.name}
					onMouseEnter={() => setIsPaused(true)}
					onMouseLeave={() => setIsPaused(false)}
				>
					{services.map((service, index) => {
						const isActive = index === activeIndex;

						if (!service.imageUrl) return null;

						return (
							<img
								key={service.id}
								src={service.imageUrl}
								alt={service.name}
								className={[
									"absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-out",
									isActive
										? "scale-100 opacity-100 blur-0 group-hover/image:scale-[1.025]"
										: "scale-[1.035] opacity-0 blur-sm",
								].join(" ")}
							/>
						);
					})}

					{!activeService.imageUrl ? (
						<div className="flex h-full w-full items-center justify-center bg-[#24180D] px-8 text-center">
							<p className="text-2xl font-extrabold uppercase tracking-[0.08em] text-[#FFF8EC]">
								{activeService.name}
							</p>
						</div>
					) : null}

					<div className="absolute inset-0 bg-gradient-to-t from-[#342312]/95 via-[#342312]/34 to-transparent" />

					<div
						key={`${activeService.id}-content`}
						className="home-service-text-enter absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10 xl:p-12"
					>
						<p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#E7D0AF]/85">
							{text.imageLabel}
						</p>

						<h3 className="mt-4 max-w-[760px] break-words text-[clamp(1.5rem,7.5vw,1.875rem)] font-extrabold uppercase leading-[1.12] tracking-[0.04em] text-[#FFF8EC] transition-colors duration-300 group-hover/image:text-[#E7D0AF] sm:text-4xl sm:tracking-[0.06em] lg:text-5xl">
							{activeService.name}
						</h3>
					</div>

					<span className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-[#A87E3C] transition-transform duration-500 ease-out group-hover/image:scale-x-100" />
				</Link>

				<div
					className="h-auto overflow-visible bg-[#342312] lg:h-[660px] lg:overflow-x-hidden lg:overflow-y-auto"
					onMouseEnter={() => setIsPaused(true)}
					onMouseLeave={() => setIsPaused(false)}
				>
					<div className="flex flex-col lg:h-full">
						{services.map((service, index) => {
							const isActive = index === activeIndex;

							return (
								<Link
									key={service.id}
									href={`/${locale}/services/${service.id}`}
									aria-current={isActive ? "true" : undefined}
									onMouseEnter={() => setActiveIndex(index)}
									onFocus={() => setActiveIndex(index)}
									className={[
										"home-service-reveal-right group relative flex min-h-[112px] flex-none items-center overflow-hidden border-b border-white/10 px-5 py-5 text-left transition-all duration-500 ease-out last:border-b-0 sm:min-h-[118px] sm:px-6 lg:min-h-0 lg:flex-1 lg:px-8",
										isActive ? "bg-white/[0.06]" : "bg-transparent",
									].join(" ")}
									style={{ animationDelay: `${660 + index * 110}ms` }}
								>
									<span
										className={[
											"absolute inset-y-0 left-0 w-[4px] bg-[#C79A58] transition-all duration-500 ease-out",
											isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100",
										].join(" ")}
									/>

									<span
										className={[
											"absolute inset-0 origin-left bg-[#E7D0AF]/10 transition-transform duration-500 ease-out",
											isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
										].join(" ")}
									/>

									<span className="relative z-10 flex w-full items-center justify-between gap-5">
										<span
											className={[
												"block min-w-0 flex-1 break-words text-[15px] font-extrabold uppercase leading-6 tracking-[0.08em] transition-colors duration-500 ease-out",
												isActive ? "text-[#FFF8EC]" : "text-[#E7D0AF] group-hover:text-[#FFF8EC]",
											].join(" ")}
										>
											{service.name}
										</span>

										<span
											className={[
												"shrink-0 text-xl leading-none transition-all duration-500 ease-out",
												isActive
													? "translate-x-1 text-[#FFF8EC]"
													: "text-[#C79A58]/70 group-hover:translate-x-1 group-hover:text-[#FFF8EC]",
											].join(" ")}
										>
											→
										</span>
									</span>
								</Link>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
