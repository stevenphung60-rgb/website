"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "src/lib/i18n/config";

interface AboutCoreValuesSectionProps {
	locale: Locale;
}

type CoreValueContent = {
	number: string;
	viTitle: string;
	enTitle: string;
	viShortTitleLines: string[];
	enShortTitleLines: string[];
	viSubtitle: string;
	enSubtitle: string;
	color: string;
	textColor: string;
	viItems: string[];
	enItems: string[];
};

const coreValues: CoreValueContent[] = [
	{
		number: "01",
		viTitle: "Ứng xử văn minh",
		enTitle: "Civilized Conduct",
		viShortTitleLines: ["Ứng xử", "văn minh"],
		enShortTitleLines: ["Civilized", "Conduct"],
		viSubtitle: "Theo 7T",
		enSubtitle: "7 keys of civilized conduct",
		color: "#F5C743",
		textColor: "#ffffff",
		viItems: [
			"Tận tụy, trung thành đối với công ty",
			"Tận tình, chu đáo đối với khách hàng",
			"Tự trọng, cầu tiến đối với bản thân",
			"Thấu hiểu, gương mẫu đối với cấp dưới",
			"Tương trợ, cộng tác đối với đồng nghiệp",
			"Tôn kính, phục tùng đối với cấp trên",
			"Trung thực, khiêm tốn đối với mọi người",
		],
		enItems: [
			"Devoted and loyal to our company",
			"Dedicated and considerate towards clients",
			"Principled and driven towards self-improvement",
			"Empathetic and exemplary towards subordinates",
			"Supportive and cooperative towards colleagues",
			"Deferential and compliant towards superiors",
			"Truthful, modest and humble towards everyone",
		],
	},
	{
		number: "02",
		viTitle: "Hành xử chính trực",
		enTitle: "Ethical Behavior",
		viShortTitleLines: ["Hành xử", "chính trực"],
		enShortTitleLines: ["Ethical", "Behavior"],
		viSubtitle: "Theo 7 Công",
		enSubtitle: "7 keys of ethical behavior",
		color: "#FF9228",
		textColor: "#FFFFFF",
		viItems: [
			"Công tâm trong phán xử",
			"Công chính trong thu nhập",
			"Công bằng trong đối đãi",
			"Công minh trong thưởng phạt",
			"Công pháp trong hành động",
			"Công lý trong tư duy",
			"Công khai trong tài chính",
		],
		enItems: [
			"Fairness in arbitration",
			"Fairness in income",
			"Fairness in conduct",
			"Fairness in reward and punishment",
			"Fairness in actions",
			"Fairness in thoughts",
			"Fairness in financial transparency",
		],
	},
	{
		number: "03",
		viTitle: "Thực thi cam kết",
		enTitle: "Commitment Fulfillment",
		viShortTitleLines: ["Thực thi", "cam kết"],
		enShortTitleLines: ["Commitment", "Fulfillment"],
		viSubtitle: "Theo 7 Đúng",
		enSubtitle: "7 rights",
		color: "#DF4055",
		textColor: "#FFFFFF",
		viItems: [
			"Đúng chất lượng",
			"Đúng thời gian",
			"Đúng khối lượng",
			"Đúng giá trị",
			"Đúng tiêu chuẩn",
			"Đúng xuất xứ",
			"Đúng biện pháp",
		],
		enItems: [
			"Right quality",
			"Right time",
			"Right quantity",
			"Right value",
			"Right standards",
			"Right origins of goods",
			"Right methods",
		],
	},
	{
		number: "04",
		viTitle: "Tuân thủ kỷ luật",
		enTitle: "Discipline & Compliance",
		viShortTitleLines: ["Tuân thủ", "kỷ luật"],
		enShortTitleLines: ["Discipline", "& Compliance"],
		viSubtitle: "Theo 7 Không",
		enSubtitle: "7 no’s",
		color: "#98104D",
		textColor: "#FFFFFF",
		viItems: [
			"Không vi phạm pháp luật",
			"Không vi phạm điều lệ",
			"Không vi phạm thỏa ước",
			"Không vi phạm nội quy",
			"Không vi phạm quy chế",
			"Không vi phạm quy trình",
			"Không vi phạm thuần phong mỹ tục",
		],
		enItems: [
			"No violation of laws",
			"No violation of charters",
			"No violation of agreements",
			"No violation of regulations",
			"No violation of policies",
			"No violation of procedures",
			"No violation of social norms",
		],
	},
	{
		number: "05",
		viTitle: "Tích hợp tinh hoa",
		enTitle: "Integrating Quintessences",
		viShortTitleLines: ["Tích hợp", "tinh hoa"],
		enShortTitleLines: ["Integrating", "Quintessences"],
		viSubtitle: "(6 + 1)",
		enSubtitle: "(6 + 1)",
		color: "#075579",
		textColor: "#FFFFFF",
		viItems: [
			"Khởi nghiệp Israel",
			"Quản trị Mỹ",
			"Công nghệ Đức",
			"Kỹ năng Singapore",
			"Chất lượng Nhật",
			"Tốc độ Hàn Quốc",
		],
		enItems: [
			"Creative start-up spirit of Israel",
			"Effective governance of the U.S.",
			"Delicate technology of Germany",
			"Perfect skills of Singapore",
			"Comprehensive quality of Japan",
			"Legendary speed of Korea",
		],
	},
	{
		number: "06",
		viTitle: "Tích cực sáng tạo",
		enTitle: "Dynamic Creativity",
		viShortTitleLines: ["Tích cực", "sáng tạo"],
		enShortTitleLines: ["Dynamic", "Creativity"],
		viSubtitle: "Theo 7 lĩnh vực",
		enSubtitle: "7 areas",
		color: "#35A9D4",
		textColor: "#FFFFFF",
		viItems: [
			"Kỹ thuật",
			"Công nghệ",
			"Quản trị",
			"Kinh doanh",
			"Văn hóa",
			"Giáo dục",
			"Nghệ thuật",
		],
		enItems: [
			"Engineering",
			"Technology",
			"Governance",
			"Commerce",
			"Culture",
			"Education",
			"Arts",
		],
	},
	{
		number: "07",
		viTitle: "Chủ động hợp tác",
		enTitle: "Proactive Cooperation",
		viShortTitleLines: ["Chủ động", "hợp tác"],
		enShortTitleLines: ["Proactive", "Cooperation"],
		viSubtitle: "Theo 7 yêu cầu",
		enSubtitle: "7 requirements",
		color: "#69C9D1",
		textColor: "#FFFFFF",
		viItems: [
			"Khiêm nhường",
			"Kiên nhẫn",
			"Cởi mở",
			"Chân thành",
			"Hài hòa",
			"Thiện chí",
			"Thủy chung",
		],
		enItems: [
			"Humility",
			"Patience",
			"Hospitality",
			"Sincerity",
			"Harmony",
			"Goodwill",
			"Loyalty",
		],
	},
];

const maxItemCount = Math.max(
	...coreValues.map((value) =>
		Math.max(value.viItems.length, value.enItems.length),
	),
);

function roundSvgNumber(value: number) {
	return Number(value.toFixed(3));
}

function polarToCartesian(
	centerX: number,
	centerY: number,
	radius: number,
	angleInDegrees: number,
) {
	const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

	return {
		x: roundSvgNumber(centerX + radius * Math.cos(angleInRadians)),
		y: roundSvgNumber(centerY + radius * Math.sin(angleInRadians)),
	};
}

function describePieSegment(
	centerX: number,
	centerY: number,
	radius: number,
	startAngle: number,
	endAngle: number,
) {
	const start = polarToCartesian(centerX, centerY, radius, endAngle);
	const end = polarToCartesian(centerX, centerY, radius, startAngle);
	const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

	return [
		`M ${centerX} ${centerY}`,
		`L ${start.x} ${start.y}`,
		`A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
		"Z",
	].join(" ");
}

export default function AboutCoreValuesSection({
	locale,
}: AboutCoreValuesSectionProps) {
	const sectionRef = useRef<HTMLElement | null>(null);

	const [activeIndex, setActiveIndex] = useState(0);
	const [isVisible, setIsVisible] = useState(false);

	const isEnglish = locale === "en";
	const center = 260;
	const radius = 235;
	const segmentAngle = 360 / coreValues.length;
	const activeValue = coreValues[activeIndex];

	const activeTitle = isEnglish ? activeValue.enTitle : activeValue.viTitle;
	const activeSubtitle = isEnglish
		? activeValue.enSubtitle
		: activeValue.viSubtitle;
	const activeItems = isEnglish ? activeValue.enItems : activeValue.viItems;
	const missingItemCount = maxItemCount - activeItems.length;

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
				"w-full border-y border-[#E7D0AF] bg-[#F7F1E6] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 xl:px-16 2xl:px-24",
				isVisible ? "about-core-values-visible" : "",
			].join(" ")}
		>
			<style jsx global>{`
				@keyframes aboutCoreRevealUp {
					from {
						opacity: 0;
						transform: translateY(28px);
					}

					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes aboutCoreRevealLeft {
					from {
						opacity: 0;
						transform: translateX(-34px);
					}

					to {
						opacity: 1;
						transform: translateX(0);
					}
				}

				@keyframes aboutCoreRevealRight {
					from {
						opacity: 0;
						transform: translateX(34px);
					}

					to {
						opacity: 1;
						transform: translateX(0);
					}
				}

				.about-core-reveal-up,
				.about-core-reveal-left,
				.about-core-reveal-right {
					opacity: 0;
				}

				.about-core-values-visible .about-core-reveal-up {
					animation: aboutCoreRevealUp 760ms cubic-bezier(0.22, 1, 0.36, 1)
						both;
				}

				.about-core-values-visible .about-core-reveal-left {
					animation: aboutCoreRevealLeft 760ms cubic-bezier(0.22, 1, 0.36, 1)
						both;
				}

				.about-core-values-visible .about-core-reveal-right {
					animation: aboutCoreRevealRight 760ms cubic-bezier(0.22, 1, 0.36, 1)
						both;
				}

				@media (prefers-reduced-motion: reduce) {
					.about-core-reveal-up,
					.about-core-reveal-left,
					.about-core-reveal-right {
						opacity: 1 !important;
						transform: none !important;
						animation: none !important;
					}
				}
			`}</style>

			<div className="mb-8 grid grid-cols-1 gap-6 sm:mb-12 lg:grid-cols-[0.36fr_0.64fr] lg:items-end">
				<div>
					<p
						className="about-core-reveal-up text-[12px] font-bold uppercase tracking-[0.2em] text-[#A87E3C] sm:text-[14px] sm:tracking-[0.24em]"
						style={{ animationDelay: "0ms" }}
					>
						{isEnglish ? "Corporate culture" : "Văn hóa doanh nghiệp"}
					</p>

					<h2
						className="about-core-reveal-up mt-4 text-3xl font-extrabold uppercase leading-[1.08] tracking-[0.05em] text-[#342312] sm:mt-5 sm:text-5xl sm:tracking-[0.08em] lg:text-[54px]"
						style={{ animationDelay: "120ms" }}
					>
						{isEnglish ? "Core values" : "Giá trị cốt lõi"}
					</h2>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.52fr_0.48fr] lg:items-center lg:gap-10">
				<div
					className="about-core-reveal-left"
					style={{ animationDelay: "240ms" }}
				>
					<div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
						<div className="mx-auto w-full min-w-[420px] max-w-[620px]">
							<svg
								viewBox="0 0 540 540"
								className="h-auto w-full"
								role="img"
								aria-label={
									isEnglish
										? "Nghiep Hung core values"
										: "Giá trị cốt lõi Nghiệp Hưng"
								}
							>
								<circle
									cx={center}
									cy={center}
									r={radius + 10}
									fill="none"
									stroke="#FFFFFF"
									strokeWidth="6"
								/>

								{coreValues.map((value, index) => {
									const startAngle = index * segmentAngle;
									const endAngle = startAngle + segmentAngle;
									const middleAngle = startAngle + segmentAngle / 2;

									const labelPosition = polarToCartesian(
										center,
										center,
										154,
										middleAngle,
									);

									const isActive = activeIndex === index;
									const activeOffset = polarToCartesian(0, 0, 10, middleAngle);
									const labelLines = isEnglish
										? value.enShortTitleLines
										: value.viShortTitleLines;

									return (
										<g
											key={value.number}
											onMouseEnter={() => setActiveIndex(index)}
											onFocus={() => setActiveIndex(index)}
											onClick={() => setActiveIndex(index)}
											onKeyDown={(event) => {
												if (event.key === "Enter" || event.key === " ") {
													event.preventDefault();
													setActiveIndex(index);
												}
											}}
											role="button"
											tabIndex={0}
											aria-label={isEnglish ? value.enTitle : value.viTitle}
											className="cursor-pointer outline-none transition-transform duration-300"
											style={{
												transform: isActive
													? `translate(${activeOffset.x}px, ${activeOffset.y}px)`
													: "translate(0, 0)",
											}}
										>
											<path
												d={describePieSegment(
													center,
													center,
													radius,
													startAngle,
													endAngle,
												)}
												fill={value.color}
												stroke={isActive ? "#FFFFFF" : "#F7F1E6"}
												strokeWidth={isActive ? 3 : 2}
												className="transition-all duration-300"
												style={{
													filter: isActive
														? "drop-shadow(0 12px 16px rgba(52, 35, 18, 0.22))"
														: "drop-shadow(0 4px 8px rgba(52, 35, 18, 0.08))",
												}}
											/>

											<text
												x={labelPosition.x}
												y={labelPosition.y - 10}
												textAnchor="middle"
												dominantBaseline="middle"
												fill={value.textColor}
												className="pointer-events-none text-[15px] font-extrabold uppercase"
											>
												{labelLines.map((line, lineIndex) => (
													<tspan
														key={line}
														x={labelPosition.x}
														dy={lineIndex === 0 ? 0 : 25}
													>
														{line}
													</tspan>
												))}
											</text>
										</g>
									);
								})}

								<circle
									cx={center}
									cy={center}
									r="92"
									fill="#FAF7F0"
									stroke="#E7D0AF"
									strokeWidth="4"
								/>

								<text
									x={center}
									y="246"
									textAnchor="middle"
									className="fill-[#342312] text-[25px] font-extrabold uppercase tracking-wide"
								>
									{isEnglish ? "Core" : "Giá trị"}
								</text>

								<text
									x={center}
									y="280"
									textAnchor="middle"
									className="fill-[#342312] text-[25px] font-extrabold uppercase tracking-wide"
								>
									{isEnglish ? "values" : "cốt lõi"}
								</text>
							</svg>
						</div>
					</div>

					<div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-7 lg:hidden">
						{coreValues.map((value, index) => {
							const isActive = activeIndex === index;

							return (
								<button
									key={value.number}
									type="button"
									onClick={() => setActiveIndex(index)}
									className="min-h-10 border px-2 text-sm font-extrabold transition duration-300"
									style={{
										borderColor: isActive ? value.color : "#E7D0AF",
										color: isActive ? value.color : "#342312",
										backgroundColor: isActive ? `${value.color}18` : "#FAF7F0",
									}}
								>
									{value.number}
								</button>
							);
						})}
					</div>
				</div>

				<div
					className="about-core-reveal-right relative overflow-hidden border border-[#E7D0AF] bg-[#FAF7F0] transition duration-300 lg:min-h-[560px]"
					style={{ animationDelay: "380ms" }}
				>
					<div
						className="absolute left-0 top-0 h-full w-1.5 sm:w-2"
						style={{ backgroundColor: activeValue.color }}
					/>

					<div className="flex flex-col p-5 pl-6 sm:p-8 lg:min-h-[560px]">
						<div className="flex items-start justify-between gap-5 sm:gap-6">
							<div>
								<p
									className="text-sm font-extrabold tracking-[0.24em]"
									style={{ color: activeValue.color }}
								>
									{activeValue.number}
								</p>

								<h3 className="mt-3 text-2xl font-extrabold uppercase leading-tight tracking-[0.05em] text-[#342312] sm:mt-4 sm:text-3xl">
									{activeTitle}
								</h3>

								<p
									className="mt-3 text-xs font-bold uppercase tracking-[0.16em] sm:text-sm sm:tracking-[0.18em]"
									style={{ color: activeValue.color }}
								>
									{activeSubtitle}
								</p>
							</div>

							<div
								className="hidden size-16 shrink-0 items-center justify-center border text-2xl font-extrabold sm:flex"
								style={{
									borderColor: activeValue.color,
									color: activeValue.color,
									backgroundColor: `${activeValue.color}16`,
								}}
							>
								{activeValue.number}
							</div>
						</div>

						<div className="mt-6 grid flex-1 grid-cols-1 gap-3 sm:mt-8">
							{activeItems.map((item, index) => (
								<div
									key={item}
									className="flex min-h-[38px] gap-3 border-t border-[#E7D0AF] pt-3 sm:gap-4"
								>
									<span
										className="mt-0.5 shrink-0 text-sm font-extrabold"
										style={{ color: activeValue.color }}
									>
										{String(index + 1).padStart(2, "0")}
									</span>

									<p className="text-sm font-semibold leading-7 text-[#342312]/85 sm:text-base">
										{item}
									</p>
								</div>
							))}

							{Array.from({ length: missingItemCount }).map((_, index) => (
								<div
									key={`empty-core-value-row-${index}`}
									className="hidden min-h-[38px] border-t border-transparent pt-3 lg:block"
									aria-hidden="true"
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}