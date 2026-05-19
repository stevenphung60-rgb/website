import type { Locale } from "src/lib/i18n/config";
import { getHeroAboutInfo } from "src/server/heroabout";
import AboutRevealSection from "./about-reveal-section";

interface AboutBusinessPhilosophySectionProps {
	locale: Locale;
}

const uiText = {
	vi: {
		eyebrow: "Triết lý kinh doanh",
		headingLine1: "Tuyên ngôn",
		headingLine2: "giá trị",
	},
	en: {
		eyebrow: "Business philosophy",
		headingLine1: "Value",
		headingLine2: "declaration",
	},
};

export default async function AboutBusinessPhilosophySection({
	locale,
}: AboutBusinessPhilosophySectionProps) {
	const heroAboutInfo = await getHeroAboutInfo();

	const lang = locale === "en" ? "en" : "vi";
	const text = uiText[lang];

	const valueStatementTitle =
		heroAboutInfo.valuestatementtitle?.[lang]?.trim() ||
		`${text.headingLine1}\n${text.headingLine2}`;

	const declarations = [
		{
			number: "01",
			title: heroAboutInfo.valuestatementtitle1?.[lang] || "",
			content: heroAboutInfo.valuestatementdetail1?.[lang] || "",
		},
		{
			number: "02",
			title: heroAboutInfo.valuestatementtitle2?.[lang] || "",
			content: heroAboutInfo.valuestatementdetail2?.[lang] || "",
		},
		{
			number: "03",
			title: heroAboutInfo.valuestatementtitle3?.[lang] || "",
			content: heroAboutInfo.valuestatementdetail3?.[lang] || "",
		},
	];

	return (
		<section className="w-full border-y border-[#E7D0AF] bg-[#FAF7F0] px-4 py-16 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
			<div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-[0.36fr_0.64fr] lg:items-end">
				<AboutRevealSection variant="fade-up" delay={0}>
					<div>
						<p className="text-[14px] font-bold uppercase tracking-[0.24em] text-[#A87E3C]">
							{text.eyebrow}
						</p>

						<h2 className="mt-5 whitespace-pre-line text-4xl font-extrabold uppercase leading-[1.08] tracking-[0.08em] text-[#342312] sm:text-5xl lg:text-[54px]">
							{valueStatementTitle}
						</h2>
					</div>
				</AboutRevealSection>
			</div>

			<div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
				{declarations.map((item, index) => (
					<AboutRevealSection
						key={item.number}
						variant="fade-up"
						delay={160 + index * 140}
					>
						<article className="group relative flex h-[360px] overflow-hidden border border-[#E7D0AF] bg-[#F7F1E6] p-6 transition duration-300 hover:border-[#A87E3C] hover:bg-[#FAF7F0] sm:h-[390px] sm:p-7 lg:h-[420px]">
							<div className="absolute right-5 top-5 text-[64px] font-extrabold leading-none tracking-tight text-[#A87E3C]/8 transition duration-300 group-hover:text-[#A87E3C]/14 sm:right-6 sm:text-[76px]">
								{item.number}
							</div>

							<div className="relative z-10 flex h-full w-full flex-col">
								<div>
									<p className="text-sm font-bold uppercase tracking-[0.22em] text-[#A87E3C]/80">
										{item.number}
									</p>

									<h3 className="mt-5 text-2xl font-extrabold uppercase leading-tight tracking-[0.08em] text-[#342312]/88">
										{item.title}
									</h3>

									<div className="mt-5 h-px w-16 bg-[#A87E3C]/80 transition duration-300 group-hover:w-24" />
								</div>

								<p className="mt-8 line-clamp-6 text-[16px] font-medium italic leading-8 text-[#342312]/58 sm:text-[18px] sm:leading-9">
									{item.content}
								</p>
							</div>

							<div className="absolute bottom-0 left-0 h-1 w-0 bg-[#A87E3C] transition-all duration-300 group-hover:w-full" />
						</article>
					</AboutRevealSection>
				))}
			</div>
		</section>
	);
}