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
	const [activeCategoryKey, setActiveCategoryKey] = useState(groups[0]?.key || "");

	const sectionRef = useRef<HTMLElement | null>(null);
	const [isVisible, setIsVisible] = useState(false);

	const activeGroup = groups.find((group) => group.key === activeCategoryKey) || groups[0];

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

				@media (max-width: 1023px) {
					.home-project-card-reveal,
					.home-projects-visible .home-project-card-reveal {
						opacity: 1;
						transform: none;
						animation: none;
					}
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
						className="home-project-reveal-up mt-8 text-4xl font-extrabold uppercase leading-[1.08] tracking-[0.08em] text-[#342312] [overflow-wrap:anywhere] sm:text-5xl md:[overflow-wrap:normal] lg:text-[54px]"
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
									isActive ? "text-[#A87E3C]" : "text-[#342312]/42 hover:text-[#342312]",
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
				className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0 lg:snap-none [&::-webkit-scrollbar]:hidden"
			>
				{activeGroup.projects.map((project, index) => (
					<LocaleLink
						key={project.id}
						href={`/projects/${project.id}`}
						className="home-project-card-reveal group flex h-[460px] w-[86vw] max-w-[420px] shrink-0 snap-start sm:h-[510px] lg:block lg:h-full lg:w-auto lg:max-w-none"
						style={{ animationDelay: `${560 + index * 150}ms` }}
					>
						<article className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden border border-[#A87E3C]/28 bg-[#F7F1E6] lg:block lg:h-[480px] lg:border-[#342312]/15 lg:bg-[#342312]">
							<div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[#E7D0AF]/25 lg:absolute lg:inset-0 lg:aspect-auto">
								<Image
									src={project.imageUrl}
									alt={project.name}
									fill
									className="object-cover transition duration-700 ease-out lg:group-hover:scale-[1.045] lg:group-hover:brightness-[1.04] lg:group-hover:saturate-[1.05]"
									sizes="(min-width: 1024px) 33vw, (min-width: 768px) 420px, 86vw"
								/>

								<div className="absolute inset-0 bg-gradient-to-t from-[#342312]/18 via-transparent to-transparent lg:bg-gradient-to-t lg:from-[#342312]/82 lg:via-[#342312]/26 lg:transition lg:duration-500" />
							</div>

							<div className="pointer-events-none absolute inset-0 border border-[#E7D0AF]/20 transition duration-500 lg:border-[#E7D0AF]/14 lg:group-hover:border-[#E7D0AF]/55" />

							<div className="relative z-10 flex min-w-0 items-center gap-2 px-5 pb-0 pt-4 lg:absolute lg:left-6 lg:top-6 lg:max-w-[calc(100%-2.5rem)] lg:gap-3 lg:p-0">
								<span className="h-px w-6 shrink-0 bg-[#A87E3C] lg:w-8 lg:bg-[#E7D0AF]" />

								<p className="line-clamp-1 min-w-0 text-[11px] font-bold uppercase tracking-[0.1em] text-[#A87E3C] lg:text-[12px] lg:tracking-[0.2em] lg:text-[#F0D5AB] lg:[text-shadow:0_1px_6px_rgba(22,14,6,0.85)]">
									{project.categoryName}
								</p>
							</div>

							<div className="relative z-10 flex min-w-0 flex-1 flex-col bg-[#F7F1E6] p-5 pt-3 lg:absolute lg:inset-x-0 lg:bottom-0 lg:block lg:bg-transparent lg:p-6 lg:[text-shadow:0_2px_10px_rgba(22,14,6,0.72)]">
								<h3 className="mb-3 line-clamp-2 break-words text-[20px] font-black uppercase leading-[1.22] tracking-[-0.02em] text-[#342312] transition-colors duration-300 group-hover:text-[#A87E3C] lg:mb-0 lg:line-clamp-3 lg:text-[38px] lg:leading-[1.03] lg:tracking-[-0.04em] lg:text-[#F7F1E6] lg:group-hover:text-[#E7D0AF]">
									{project.name}
								</h3>

								{project.location || project.year ? (
									<div className="mb-3 space-y-2 border-y border-[#A87E3C]/22 py-3 lg:mb-0 lg:mt-5 lg:space-y-2.5 lg:border-[#E7D0AF]/32 lg:py-4">
										{project.location ? (
											<div className="flex min-w-0 items-start gap-2.5 lg:gap-3">
												<MapPin className="mt-0.5 size-4 shrink-0 text-[#A87E3C] lg:mt-1 lg:text-[#F0D5AB]" />

												<p className="min-w-0 flex-1 truncate text-[14px] font-semibold leading-5 text-[#5A3719] lg:line-clamp-none lg:overflow-visible lg:text-clip lg:whitespace-normal lg:leading-6 lg:text-[#F7F1E6]/95">
													<span className="font-medium text-[#A87E3C] lg:font-light lg:text-[#F0D5AB]/88">
														{locationLabel}:{" "}
													</span>

													<span className="font-bold">{project.location}</span>
												</p>
											</div>
										) : null}

										{project.year ? (
											<div className="flex min-w-0 items-start gap-2.5 lg:gap-3">
												<Calendar className="mt-0.5 size-4 shrink-0 text-[#A87E3C] lg:mt-1 lg:text-[#F0D5AB]" />

												<p className="min-w-0 flex-1 truncate text-[14px] font-semibold leading-5 text-[#5A3719] lg:line-clamp-none lg:overflow-visible lg:text-clip lg:whitespace-normal lg:leading-6 lg:text-[#F7F1E6]/95">
													<span className="font-medium text-[#A87E3C] lg:font-light lg:text-[#F0D5AB]/88">
														{timeLabel}:{" "}
													</span>

													<span className="font-bold">{project.year}</span>
												</p>
											</div>
										) : null}
									</div>
								) : null}

								{project.description ? (
									<p className="line-clamp-2 text-[14px] leading-[1.65] text-[#6B5137] lg:mt-4 lg:leading-[1.75] lg:text-[#F7F1E6]/92">
										{project.description}
									</p>
								) : null}
							</div>
						</article>
					</LocaleLink>
				))}
			</div>
		</section>
	);
}
