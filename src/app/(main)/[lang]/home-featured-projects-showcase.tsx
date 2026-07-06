"use client";

import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import LocaleLink from "src/components/behaviors/LocaleLink";
import type { Locale } from "src/lib/i18n/config";

export type HomeProjectCardItem = {
	id: string;
	name: string;
	categoryName: string;
	location: string;
	year: string;
	description: string;
	imageUrl: string;
};

export type HomeProjectCategoryGroup = {
	key: string;
	label: string;
	projects: HomeProjectCardItem[];
};

interface HomeFeaturedProjectsShowcaseProps {
	locale: Locale;
	text: {
		eyebrow: string;
		heading: string;
		description: string;
		viewAll: string;
	};
	groups: HomeProjectCategoryGroup[];
}

export default function HomeFeaturedProjectsShowcase({
	locale,
	text,
	groups,
}: HomeFeaturedProjectsShowcaseProps) {
	const [activeCategoryKey, setActiveCategoryKey] = useState(
		groups[0]?.key || "",
	);

	const sectionRef = useRef<HTMLElement | null>(null);
	const [isVisible, setIsVisible] = useState(false);

	const activeGroup =
		groups.find((group) => group.key === activeCategoryKey) || groups[0];

	const locationLabel = locale === "vi" ? "Địa điểm" : "Location";
	const timeLabel = locale === "vi" ? "Thời gian" : "Time";

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
				threshold: 0.16,
				rootMargin: "0px 0px -8% 0px",
			},
		);

		observer.observe(currentSection);

		return () => observer.disconnect();
	}, []);

	if (!activeGroup) return null;

	return (
		<section
			ref={sectionRef}
			className={[
				"w-full overflow-hidden bg-[#FAF7F0] px-4 py-14 text-[#342312] sm:px-6 sm:py-16 lg:px-10 xl:px-16 2xl:px-24",
				isVisible ? "home-projects-visible" : "",
			].join(" ")}
		>
			<style jsx global>{`
				@keyframes homeProjectRevealUp {
					from {
						opacity: 0;
						transform: translateY(28px);
					}

					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes homeProjectCardReveal {
					from {
						opacity: 0;
						transform: translateY(24px);
					}

					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.home-project-reveal-up,
				.home-project-card-reveal {
					opacity: 0;
				}

				.home-projects-visible .home-project-reveal-up {
					animation: homeProjectRevealUp 760ms cubic-bezier(0.22, 1, 0.36, 1)
						both;
				}

				.home-projects-visible .home-project-card-reveal {
					animation: homeProjectCardReveal 680ms cubic-bezier(0.22, 1, 0.36, 1)
						both;
				}

				@media (prefers-reduced-motion: reduce) {
					.home-project-reveal-up,
					.home-project-card-reveal {
						opacity: 1 !important;
						transform: none !important;
						animation: none !important;
					}
				}
			`}</style>

			<div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-[0.48fr_0.52fr] lg:items-end">
				<div>
					<p
						className="home-project-reveal-up text-[13px] font-bold uppercase tracking-[0.24em] text-[#A87E3C] sm:text-[14px]"
						style={{ animationDelay: "0ms" }}
					>
						{text.eyebrow}
					</p>

					<div
						className="home-project-reveal-up mt-5 h-px w-20 bg-[#A87E3C]"
						style={{ animationDelay: "100ms" }}
					/>

					<h2
						className="home-project-reveal-up mt-8 text-4xl font-extrabold uppercase leading-[1.08] tracking-[0.08em] text-[#342312] sm:text-5xl lg:text-[54px]"
						style={{ animationDelay: "180ms" }}
					>
						{text.heading}
					</h2>
				</div>

				<div className="flex items-start lg:justify-end">
                    <LocaleLink
                        href="/projects"
                        className="home-project-reveal-up group relative isolate inline-flex items-center justify-center overflow-hidden border border-[#342312] bg-[#342312] px-6 py-4 text-[13px] font-extrabold uppercase tracking-[0.16em] text-[#E7D0AF] transition-colors duration-500 hover:border-[#A87E3C]"
                        style={{ animationDelay: "300ms" }}
                    >
						<span className="absolute inset-y-0 left-0 z-0 w-full origin-left scale-x-0 bg-[#A87E3C] transition-transform duration-500 ease-out group-hover:scale-x-100" />

						<span className="relative z-10 transition-colors duration-300 group-hover:text-white">
							{text.viewAll}
						</span>

						<span className="relative z-10 ml-3 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white">
							→
						</span>
					</LocaleLink>
				</div>
			</div>

			<div
				className="home-project-reveal-up mb-8 overflow-x-auto border-b border-[#E7D0AF] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
				style={{ animationDelay: "420ms" }}
			>
				<div className="flex min-w-max items-end gap-8 sm:gap-10 lg:min-w-0 lg:justify-between lg:gap-12">
					{groups.map((group) => {
						const isActive = group.key === activeGroup.key;

						return (
							<button
								key={group.key}
								type="button"
								onClick={() => setActiveCategoryKey(group.key)}
								className={[
									"relative flex min-w-[150px] items-center justify-center px-3 pb-4 text-center text-[16px] font-extrabold uppercase leading-6 tracking-[0.04em] transition-colors duration-300 sm:min-w-[180px] lg:min-w-0 lg:flex-1",
									isActive
										? "text-[#A87E3C]"
										: "text-[#342312]/42 hover:text-[#342312]",
								].join(" ")}
							>
								<span className="block w-full text-center">{group.label}</span>

								<span
									className={[
										"absolute bottom-0 left-0 h-[3px] w-full origin-left bg-[#A87E3C] transition-transform duration-300",
										isActive ? "scale-x-100" : "scale-x-0",
									].join(" ")}
								/>
							</button>
						);
					})}
				</div>
			</div>

			<div
				key={activeGroup.key}
				className="grid grid-cols-1 gap-5 md:grid-cols-3"
			>
				{activeGroup.projects.map((project, index) => (
					<LocaleLink
						key={project.id}
						href={`/projects/${project.id}`}
						className="home-project-card-reveal group block h-full"
						style={{ animationDelay: `${560 + index * 150}ms` }}
					>
						<article className="relative h-[390px] overflow-hidden bg-[#342312] sm:h-[430px] lg:h-[480px]">
							<Image
								src={project.imageUrl}
								alt={project.name}
								fill
								className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
								sizes="(min-width: 1024px) 33vw, (min-width: 768px) 33vw, 100vw"
							/>

							<div className="absolute inset-0 bg-gradient-to-t from-[#342312] via-[#342312]/68 to-transparent transition duration-500 group-hover:via-[#342312]/76" />

							<div className="absolute left-5 top-5 flex max-w-[calc(100%-2.5rem)] items-center gap-3 sm:left-6 sm:top-6">
								<span className="h-px w-8 shrink-0 bg-[#A87E3C]" />

								<p className="line-clamp-1 min-w-0 text-[11px] font-bold uppercase tracking-[0.2em] text-[#E7D0AF] sm:text-[12px]">
									{project.categoryName}
								</p>
							</div>

							<div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
								<h3 className="line-clamp-3 break-words text-[28px] font-black uppercase leading-[1.12] tracking-[0.01em] text-[#F7F1E6] transition-colors duration-300 group-hover:text-[#E7D0AF] sm:text-[32px] lg:text-[38px]">
									{project.name}
								</h3>

								{project.location || project.year ? (
									<div className="mt-5 space-y-2.5 border-y border-[#E7D0AF]/18 py-4">
										{project.location ? (
											<div className="flex min-w-0 items-start gap-3">
												<MapPin className="mt-1 size-4 shrink-0 text-[#A87E3C]" />

												<p className="min-w-0 text-[13px] leading-6 text-[#F7F1E6]/82 sm:text-[14px]">
													<span className="font-light text-[#E7D0AF]/72">
														{locationLabel}:{" "}
													</span>

													<span className="font-bold">
														{project.location}
													</span>
												</p>
											</div>
										) : null}

										{project.year ? (
											<div className="flex min-w-0 items-start gap-3">
												<Calendar className="mt-1 size-4 shrink-0 text-[#A87E3C]" />

												<p className="min-w-0 text-[13px] leading-6 text-[#F7F1E6]/82 sm:text-[14px]">
													<span className="font-light text-[#E7D0AF]/72">
														{timeLabel}:{" "}
													</span>

													<span className="font-bold">{project.year}</span>
												</p>
											</div>
										) : null}
									</div>
								) : null}

								{project.description ? (
									<p className="mt-4 line-clamp-2 text-[14px] leading-[1.75] text-[#F7F1E6]/68">
										{project.description}
									</p>
								) : null}
							</div>

							<span className="absolute bottom-0 left-0 h-[4px] w-full origin-left scale-x-0 bg-[#A87E3C] transition-transform duration-500 ease-out group-hover:scale-x-100" />
						</article>
					</LocaleLink>
				))}
			</div>
		</section>
	);
}