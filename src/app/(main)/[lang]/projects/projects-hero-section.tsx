import type { Locale } from "src/lib/i18n/config";

type ProjectsHeroSectionProps = {
	lang: Locale;
};

export function ProjectsHeroSection({
	lang,
}: ProjectsHeroSectionProps) {
	return (
		<>	<style jsx global>{`
				@keyframes projectHeroReveal {
					from {
						opacity: 0;
						transform: translateY(32px);
					}

					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.project-hero-reveal {
					opacity: 0;
					animation: projectHeroReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1)
						forwards;
					will-change: transform, opacity;
				}

				.project-hero-delay-1 {
					animation-delay: 120ms;
				}

				.project-hero-delay-2 {
					animation-delay: 320ms;
				}

				.project-hero-delay-3 {
					animation-delay: 560ms;
				}
			`}</style>
			<section
				className="relative flex min-h-[650px] w-full items-center overflow-hidden bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: "url('/project-banner.jpg')",
				}}
			>
				<div className="absolute inset-0 bg-black/30" />

				<div className="relative z-10 mx-auto w-full max-w-7xl px-6">
					<div className="max-w-3xl">
						<p className="project-hero-reveal project-hero-delay-1 mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#A87E3C]">
							{lang === "vi" ? "DỰ ÁN" : "PROJECTS"}
						</p>

						<h1 className="project-hero-reveal project-hero-delay-2 text-4xl font-bold leading-tight text-white md:text-6xl">
							{lang === "vi"
								? "Các Dự Án Tiêu Biểu"
								: "Featured Projects"}
						</h1>

						<p className="project-hero-reveal project-hero-delay-3 mt-6 w-full text-base leading-8 text-white/85 md:text-lg">
							{lang === "vi"
								? "Khám phá các công trình và giải pháp hệ thống do Nghiệp Hưng thực hiện."
								: "Explore projects and system solutions delivered by Nghiep Hung.Explore projects and system solutions delivered by Nghiep HungExplore projects and system solutions delivered by Nghiep HungExplore projects and system solutions delivered by Nghiep Hung"}
						</p>
					</div>
				</div>
			</section>
		</>
	);
}