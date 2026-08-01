"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroInfo } from "src/app/admin/hero/hero.type";
import type { Locale } from "src/lib/i18n/config";

interface HomeFeaturedClientsSectionProps {
	locale: Locale;
	heroInfo?: HeroInfo;
}

type FeaturedClient = {
	name: string;
	imageUrl: string;
};

const sectionText = {
	vi: {
		eyebrow: "Khách hàng tiêu biểu",
		heading: "Đối tác & khách hàng",
		description:
			"Những đơn vị đã đồng hành cùng Nghiệp Hưng trong các công trình thương mại, công nghiệp và dân dụng.",
	},
	en: {
		eyebrow: "Featured clients",
		heading: "Partners & clients",
		description:
			"Companies that have accompanied Nghiep Hung across commercial, industrial and residential projects.",
	},
};

export default function HomeFeaturedClientsSection({
	locale,
	heroInfo,
}: HomeFeaturedClientsSectionProps) {
	const lang = locale === "en" ? "en" : "vi";
	const text = sectionText[lang];

	const sectionRef = useRef<HTMLElement | null>(null);
	const [isVisible, setIsVisible] = useState(false);

	const clientTitle = heroInfo?.clienttitle?.[lang] || text.heading;
	const clientDescription = heroInfo?.clientdescription?.[lang] || text.description;

	const clients: FeaturedClient[] =
		heroInfo?.clientimagegallery && heroInfo.clientimagegallery.length > 0
			? [...heroInfo.clientimagegallery]
					.sort((a, b) => a.order - b.order)
					.map((image, index) => ({
						name: `Client ${String(index + 1).padStart(2, "0")}`,
						imageUrl: image.url,
					}))
			: [];

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

	return (
		<section
			ref={sectionRef}
			className={[
				"w-full bg-[#FAF7F0] px-4 py-12 text-[#342312] sm:px-6 sm:py-14 lg:px-10 xl:px-16 2xl:px-24",
				isVisible ? "home-clients-visible" : "",
			].join(" ")}
		>
			<style>
				{`
					@keyframes homeClientsRevealUp {
						from {
							opacity: 0;
							transform: translateY(24px);
						}

						to {
							opacity: 1;
							transform: translateY(0);
						}
					}

					@keyframes homeClientsLogoReveal {
						from {
							opacity: 0;
							transform: translateY(18px) scale(0.96);
						}

						to {
							opacity: 1;
							transform: translateY(0) scale(1);
						}
					}

					.home-clients-reveal-up,
					.home-clients-logo-reveal {
						opacity: 0;
					}

					.home-clients-visible .home-clients-reveal-up {
						animation: homeClientsRevealUp 760ms cubic-bezier(0.22, 1, 0.36, 1) both;
					}

					.home-clients-visible .home-clients-logo-reveal {
						animation: homeClientsLogoReveal 620ms cubic-bezier(0.22, 1, 0.36, 1) both;
					}

					@media (prefers-reduced-motion: reduce) {
						.home-clients-reveal-up,
						.home-clients-logo-reveal {
							opacity: 1 !important;
							transform: none !important;
							animation: none !important;
						}
					}
				`}
			</style>

			<div className="mx-auto mb-8 max-w-4xl text-center">
				<p
					className="home-clients-reveal-up text-[13px] font-bold uppercase tracking-[0.22em] text-[#A87E3C]"
					style={{ animationDelay: "0ms" }}
				>
					{text.eyebrow}
				</p>

				<h2
					className="home-clients-reveal-up mt-4 text-3xl font-extrabold uppercase leading-[1.1] tracking-[0.08em] text-[#342312] [overflow-wrap:anywhere] sm:text-4xl md:[overflow-wrap:normal] lg:text-[44px]"
					style={{ animationDelay: "120ms" }}
				>
					{clientTitle}
				</h2>

				<p
					className="home-clients-reveal-up mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#342312]/70 [overflow-wrap:anywhere] sm:text-base md:[overflow-wrap:normal]"
					style={{ animationDelay: "240ms" }}
				>
					{clientDescription}
				</p>
			</div>

			{clients.length > 0 ? (
				<div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
					{clients.map((client, index) => (
						<div
							key={`${client.name}-${client.imageUrl}`}
							className="home-clients-logo-reveal aspect-square min-w-0 bg-[#FAF7F0] p-4 sm:aspect-[4/3] sm:p-5 lg:aspect-square lg:p-6"
							style={{ animationDelay: `${360 + index * 55}ms` }}
						>
							<img
								src={client.imageUrl}
								alt={client.name}
								className="h-full w-full object-contain"
							/>
						</div>
					))}
				</div>
			) : null}
		</section>
	);
}
