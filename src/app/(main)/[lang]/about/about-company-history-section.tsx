import type { Locale } from "src/lib/i18n/config";
import { getHeroAboutInfo } from "src/server/heroabout";
import AboutRevealSection from "./about-reveal-section";

interface AboutCompanyHistorySectionProps {
	locale: Locale;
}

const uiText = {
	vi: {
		eyebrow: "Hành trình phát triển",
		headingLine1: "Lịch sử",
		headingLine2: "hình thành",
	},
	en: {
		eyebrow: "Development journey",
		headingLine1: "Company",
		headingLine2: "history",
	},
};

export default async function AboutCompanyHistorySection({
	locale,
}: AboutCompanyHistorySectionProps) {
	const heroAboutInfo = await getHeroAboutInfo();

	const lang = locale === "en" ? "en" : "vi";
	const text = uiText[lang];

	const historyTitle =
		heroAboutInfo.historytitle?.[lang]?.trim() ||
		`${text.headingLine1}\n${text.headingLine2}`;

	const historyDescription =
		heroAboutInfo.historydescription?.[lang]?.trim() || "";

	const historyItems = [
		{
			year: heroAboutInfo.historytime1?.[lang] || "",
			title: heroAboutInfo.historytitle1?.[lang] || "",
			description: heroAboutInfo.historydetail1?.[lang] || "",
		},
		{
			year: heroAboutInfo.historytime2?.[lang] || "",
			title: heroAboutInfo.historytitle2?.[lang] || "",
			description: heroAboutInfo.historydetail2?.[lang] || "",
		},
		{
			year: heroAboutInfo.historytime3?.[lang] || "",
			title: heroAboutInfo.historytitle3?.[lang] || "",
			description: heroAboutInfo.historydetail3?.[lang] || "",
		},
	].filter((item) => item.year || item.title || item.description);

	return (
		<section className="w-full border-y border-[#E7D0AF] bg-[#FAF7F0] px-4 py-14 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
			<div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.34fr_0.66fr] lg:items-start">
				<AboutRevealSection variant="fade-up" delay={0}>
					<div>
						<p className="text-[14px] font-bold uppercase tracking-[0.24em] text-[#A87E3C]">
							{text.eyebrow}
						</p>

						<h2 className="mt-5 whitespace-pre-line text-4xl font-extrabold uppercase leading-[1.08] tracking-[0.06em] text-[#342312] sm:text-5xl lg:text-[50px]">
							{historyTitle}
						</h2>

						{historyDescription ? (
							<p className="mt-6 max-w-[420px] text-sm leading-7 text-[#342312]/70 sm:text-base">
								{historyDescription}
							</p>
						) : null}
					</div>
				</AboutRevealSection>

				<div className="relative">
					<AboutRevealSection variant="fade-up" delay={120}>
						<div className="absolute left-[23px] top-0 hidden h-full w-px bg-[#E7D0AF] sm:block" />
					</AboutRevealSection>

					<div className="space-y-5">
						{historyItems.map((item, index) => (
							<AboutRevealSection
								key={`${item.year}-${item.title}-${index}`}
								variant="fade-up"
								delay={180 + index * 140}
							>
								<article className="group relative grid grid-cols-1 gap-4 border border-[#E7D0AF] bg-[#F7F1E6] p-5 transition duration-300 hover:border-[#A87E3C] hover:bg-[#FAF7F0] sm:grid-cols-[110px_1fr] sm:p-6">
									<div className="hidden sm:block">
										<div className="relative z-10 flex size-12 items-center justify-center">
											<span className="size-3 rounded-full bg-[#A87E3C] transition duration-300 group-hover:scale-125" />
										</div>
									</div>

									<div>
										<div className="flex flex-wrap items-end gap-x-5 gap-y-2">
											<p className="text-4xl font-extrabold leading-none tracking-tight text-[#A87E3C] sm:text-[46px]">
												{item.year}
											</p>

											<h3 className="pb-1 text-xl font-extrabold uppercase tracking-[0.05em] text-[#342312]">
												{item.title}
											</h3>
										</div>

										<div className="mt-4 h-px w-16 bg-[#A87E3C] transition duration-300 group-hover:w-24" />

										<p className="mt-4 max-w-[760px] text-sm leading-7 text-[#342312]/72 sm:text-base">
											{item.description}
										</p>
									</div>
								</article>
							</AboutRevealSection>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}