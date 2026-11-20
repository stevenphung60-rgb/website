"use client";

import { useEffect, useRef, useState } from "react";
import LocaleLink from "src/components/behaviors/LocaleLink";
import { ProjectGridCard } from "src/components/projects/project-grid-card";
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
				className="-mb-5 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-8 pt-2 [scrollbar-width:none] lg:mb-0 lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:overflow-visible lg:pb-0 lg:pt-0 lg:snap-none [&::-webkit-scrollbar]:hidden"
			>
				{activeGroup.projects.map((project, index) => (
					<div
						key={project.id}
						className="home-project-card-reveal flex w-[86vw] max-w-[420px] shrink-0 snap-start lg:w-auto lg:max-w-none"
						style={{ animationDelay: `${560 + index * 150}ms` }}
					>
						<ProjectGridCard
							locale={locale}
							projectId={project.id}
							name={project.name}
							categoryName={project.categoryName}
							imageUrl={project.imageUrl}
							location={project.location}
							year={project.year}
							imageSizes="(min-width: 1280px) 25vw, (min-width: 1024px) 50vw, (min-width: 768px) 420px, 86vw"
						/>
					</div>
				))}
			</div>
		</section>
	);
}
