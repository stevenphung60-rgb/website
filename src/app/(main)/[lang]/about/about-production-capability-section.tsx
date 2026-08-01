import type { Locale } from "src/lib/i18n/config";
import { getHeroAboutInfo } from "src/server/heroabout";
import AboutRevealSection from "./about-reveal-section";

interface AboutProductionCapabilitySectionProps {
	locale: Locale;
}

const uiText = {
	vi: {
		eyebrow: "Năng lực sản xuất",
		headingLine1: "Dây chuyền",
		headingLine2: "sản xuất",
	},
	en: {
		eyebrow: "Production capability",
		headingLine1: "Production",
		headingLine2: "line",
	},
};

export default async function AboutProductionCapabilitySection({
	locale,
}: AboutProductionCapabilitySectionProps) {
	const heroAboutInfo = await getHeroAboutInfo();

	const lang = locale === "en" ? "en" : "vi";
	const text = uiText[lang];

	const capacityTitle =
		heroAboutInfo.capacitytitle?.[lang]?.trim() || `${text.headingLine1}\n${text.headingLine2}`;

	const productionDescription = heroAboutInfo.capacitydescription?.[lang]?.trim() || "";

	const productionStats = [
		{
			value: heroAboutInfo.capacitytitle1?.[lang] || "",
			label: heroAboutInfo.capacitydetail1?.[lang] || "",
		},
		{
			value: heroAboutInfo.capacitytitle2?.[lang] || "",
			label: heroAboutInfo.capacitydetail2?.[lang] || "",
		},
		{
			value: heroAboutInfo.capacitytitle3?.[lang] || "",
			label: heroAboutInfo.capacitydetail3?.[lang] || "",
		},
		{
			value: heroAboutInfo.capacitytitle4?.[lang] || "",
			label: heroAboutInfo.capacitydetail4?.[lang] || "",
		},
	].filter((item) => item.value || item.label);

	return (
		<section className="w-full border-b border-[#E7D0AF] bg-[#FAF7F0] px-4 py-14 sm:px-6 sm:py-16 lg:px-10 xl:px-16 2xl:px-24">
			<div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.54fr_0.46fr] lg:items-start lg:gap-12">
				<div className="order-2 border-b border-[#E7D0AF] lg:order-1">
					{productionStats.map((item, index) => (
						<AboutRevealSection
							key={`production-stat-${index}`}
							variant="fade-right"
							delay={index * 140}
						>
							<div
								className={`group relative grid grid-cols-1 gap-3 py-6 transition duration-300 hover:bg-[#F7F1E6] sm:py-8 md:grid-cols-[300px_1fr] md:items-center xl:grid-cols-[340px_1fr] ${
									index > 0 ? "border-t border-[#E7D0AF]" : ""
								}`}
							>
								<div className="absolute left-0 top-0 h-full w-0 bg-[#A87E3C] transition-all duration-300 group-hover:w-1" />

								<div className="min-w-0 md:pl-7">
									<p className="break-words text-[38px] font-extrabold leading-none tracking-tight text-[#A87E3C] transition duration-300 [overflow-wrap:anywhere] group-hover:text-[#A87E3C] sm:text-[48px] md:whitespace-nowrap md:[overflow-wrap:normal] xl:text-[60px]">
										{item.value}
									</p>
								</div>

								<div className="md:pr-7">
									<p className="max-w-[620px] break-words text-sm font-semibold leading-7 text-[#342312]/78 [overflow-wrap:anywhere] sm:text-lg md:[overflow-wrap:normal]">
										{item.label}
									</p>
								</div>

								<div className="absolute bottom-0 left-0 h-px w-0 bg-[#A87E3C] transition-all duration-300 group-hover:w-full" />
							</div>
						</AboutRevealSection>
					))}
				</div>

				<div className="order-1 border-b border-[#E7D0AF] py-8 lg:order-2 lg:pl-4 lg:py-10">
					<AboutRevealSection variant="fade-left" delay={120}>
						<p className="break-words text-[14px] font-bold uppercase tracking-[0.24em] text-[#A87E3C] [overflow-wrap:anywhere] md:[overflow-wrap:normal]">
							{text.eyebrow}
						</p>

						<h2 className="mt-5 whitespace-pre-line break-words text-4xl font-extrabold uppercase leading-[1.08] tracking-[0.08em] text-[#342312] [overflow-wrap:anywhere] sm:text-5xl md:[overflow-wrap:normal] lg:text-[54px]">
							{capacityTitle}
						</h2>

						<div className="mt-8 h-px w-20 bg-[#A87E3C]" />

						{productionDescription ? (
							<p className="mt-8 max-w-[760px] break-words text-[16px] font-normal leading-8 text-[#342312]/70 [overflow-wrap:anywhere] sm:leading-9 md:[overflow-wrap:normal]">
								{productionDescription}
							</p>
						) : null}
					</AboutRevealSection>
				</div>
			</div>
		</section>
	);
}
