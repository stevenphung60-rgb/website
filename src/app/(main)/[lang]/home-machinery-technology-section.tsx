"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { HeroInfo } from "src/app/admin/hero/hero.type";
import type { Locale } from "src/lib/i18n/config";

interface HomeMachineryTechnologySectionProps {
	locale: Locale;
	heroInfo?: HeroInfo;
}

type MachineryItem = {
	name: string;
	role: string;
	description: string;
	imageUrl: string;
	imageAlt: string;
};

const sectionText = {
	vi: {
		eyebrow: "Máy móc & công nghệ",
		heading: "Thiết bị hiện đại",
		description:
			"Nghiệp Hưng đầu tư hệ thống máy móc chuyên dụng cho sản xuất ống gió, hỗ trợ kiểm soát độ chính xác, năng suất và tiến độ thi công cho các công trình quy mô lớn.",
		close: "Đóng",
	},
	en: {
		eyebrow: "Machinery & technology",
		heading: "Modern equipment",
		description:
			"Nghiep Hung invests in specialized machinery for air duct manufacturing, supporting precision, productivity and project delivery for large-scale construction works.",
		close: "Close",
	},
};

const defaultMachineryItems: Record<"vi" | "en", MachineryItem[]> = {
	vi: [
		{
			name: "AutoLine VII / III",
			role: "Dây chuyền sản xuất ống gió tự động",
			description:
				"Hỗ trợ gia công ống gió theo quy trình liên tục, tăng tốc độ sản xuất và đảm bảo độ đồng đều cho từng hạng mục.",
			imageUrl: "/autoline7.png",
			imageAlt: "AutoLine VII / III",
		},
		{
			name: "Máy cắt Plasma CNC",
			role: "Cắt phôi chính xác theo bản vẽ kỹ thuật",
			description:
				"Gia công biên dạng tôn với độ chính xác cao, phù hợp cho các chi tiết ống gió, phụ kiện và cấu kiện theo yêu cầu công trình.",
			imageUrl: "/maycatcncplasma.png",
			imageAlt: "Máy cắt Plasma CNC",
		},
		{
			name: "Máy tạo hình mặt bích TDC",
			role: "Hoàn thiện liên kết và lắp ghép ống gió",
			description:
				"Tạo mặt bích đồng bộ, hỗ trợ thi công lắp đặt nhanh, chắc chắn và đảm bảo tính ổn định cho hệ thống ống gió.",
			imageUrl: "/maytaohinhmatbich.png",
			imageAlt: "Máy tạo hình mặt bích TDC",
		},
	],
	en: [
		{
			name: "AutoLine VII / III",
			role: "Automatic air duct production line",
			description:
				"Supports continuous duct fabrication, improving production speed and consistency across project requirements.",
			imageUrl: "/autoline7.png",
			imageAlt: "AutoLine VII / III",
		},
		{
			name: "CNC Plasma Cutting Machine",
			role: "Accurate cutting based on technical drawings",
			description:
				"Processes sheet metal profiles with high precision for duct components, accessories and customized project details.",
			imageUrl: "/maycatcncplasma.png",
			imageAlt: "CNC Plasma Cutting Machine",
		},
		{
			name: "TDC Flange Forming Machine",
			role: "Duct connection and assembly finishing",
			description:
				"Forms consistent flanges for faster installation, stronger connection and improved duct system stability.",
			imageUrl: "/maytaohinhmatbich.png",
			imageAlt: "TDC Flange Forming Machine",
		},
	],
};

export default function HomeMachineryTechnologySection({
	locale,
	heroInfo,
}: HomeMachineryTechnologySectionProps) {
	const lang = locale === "en" ? "en" : "vi";
	const text = sectionText[lang];
	const defaultItems = defaultMachineryItems[lang];

	const sectionTitle = heroInfo?.machinetitle?.[lang] || text.heading;
	const sectionDescription =
		heroInfo?.machinedescription?.[lang] || text.description;

	const items: MachineryItem[] = [
		{
			name: heroInfo?.machine1title?.[lang] || defaultItems[0].name,
			role: heroInfo?.machine1subtitle?.[lang] || defaultItems[0].role,
			description:
				heroInfo?.machine1description?.[lang] || defaultItems[0].description,
			imageUrl: heroInfo?.machine1image?.url || defaultItems[0].imageUrl,
			imageAlt: heroInfo?.machine1title?.[lang] || defaultItems[0].imageAlt,
		},
		{
			name: heroInfo?.machine2title?.[lang] || defaultItems[1].name,
			role: heroInfo?.machine2subtitle?.[lang] || defaultItems[1].role,
			description:
				heroInfo?.machine2description?.[lang] || defaultItems[1].description,
			imageUrl: heroInfo?.machine2image?.url || defaultItems[1].imageUrl,
			imageAlt: heroInfo?.machine2title?.[lang] || defaultItems[1].imageAlt,
		},
		{
			name: heroInfo?.machine3title?.[lang] || defaultItems[2].name,
			role: heroInfo?.machine3subtitle?.[lang] || defaultItems[2].role,
			description:
				heroInfo?.machine3description?.[lang] || defaultItems[2].description,
			imageUrl: heroInfo?.machine3image?.url || defaultItems[2].imageUrl,
			imageAlt: heroInfo?.machine3title?.[lang] || defaultItems[2].imageAlt,
		},
	];

	const sectionBackgroundImage =
		heroInfo?.machinebackgroundimage?.url ||
		items[0]?.imageUrl ||
		"/autoline7.png";

	const sectionRef = useRef<HTMLElement | null>(null);

	const [selectedItem, setSelectedItem] = useState<MachineryItem | null>(null);
	const [isVisible, setIsVisible] = useState(false);

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

	useEffect(() => {
		if (!selectedItem) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setSelectedItem(null);
			}
		};

		const previousOverflow = document.body.style.overflow;

		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [selectedItem]);

	return (
		<section
			ref={sectionRef}
			className={[
				"relative w-full overflow-x-hidden px-4 py-14 text-[#F7F1E6] sm:px-6 sm:py-16 lg:px-10 xl:px-16 2xl:px-24",
				isVisible ? "home-machinery-visible" : "",
			].join(" ")}
		>
			<style>
				{`
					@keyframes homeMachineryRevealUp {
						from {
							opacity: 0;
							transform: translateY(28px);
						}

						to {
							opacity: 1;
							transform: translateY(0);
						}
					}

					@keyframes homeMachineryRevealRight {
						from {
							opacity: 0;
							transform: translateX(34px);
						}

						to {
							opacity: 1;
							transform: translateX(0);
						}
					}

					.home-machinery-reveal-up,
					.home-machinery-reveal-right {
						opacity: 0;
					}

					.home-machinery-visible .home-machinery-reveal-up {
						animation: homeMachineryRevealUp 760ms cubic-bezier(0.22, 1, 0.36, 1) both;
					}

					.home-machinery-visible .home-machinery-reveal-right {
						animation: homeMachineryRevealRight 760ms cubic-bezier(0.22, 1, 0.36, 1) both;
					}

					@media (prefers-reduced-motion: reduce) {
						.home-machinery-reveal-up,
						.home-machinery-reveal-right {
							opacity: 1 !important;
							transform: none !important;
							animation: none !important;
						}
					}
				`}
			</style>

			<div
				className="absolute inset-0 bg-cover bg-center bg-scroll lg:bg-fixed"
				style={{ backgroundImage: `url(${sectionBackgroundImage})` }}
			/>

			<div className="absolute inset-0 bg-[#342312]/48" />
			<div className="absolute inset-0 bg-gradient-to-b from-[#342312]/24 via-[#342312]/8 to-[#342312]/46" />

			<div className="relative z-10">
				<div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-[0.5fr_0.5fr] lg:items-end">
					<div>
						<p
							className="home-machinery-reveal-up text-[13px] font-bold uppercase tracking-[0.24em] text-[#E7D0AF] sm:text-[14px]"
							style={{ animationDelay: "0ms" }}
						>
							{text.eyebrow}
						</p>

						<div
							className="home-machinery-reveal-up mt-5 h-px w-20 bg-[#A87E3C]"
							style={{ animationDelay: "100ms" }}
						/>

						<h2
							className="home-machinery-reveal-up mt-8 whitespace-pre-line text-4xl font-extrabold uppercase leading-[1.08] tracking-[0.08em] text-[#F7F1E6] sm:text-5xl lg:text-[54px]"
							style={{ animationDelay: "180ms" }}
						>
							{sectionTitle}
						</h2>
					</div>

					<p
						className="home-machinery-reveal-up max-w-[640px] text-sm leading-7 text-[#F7F1E6]/90 sm:text-base lg:ml-auto lg:text-right"
						style={{ animationDelay: "300ms" }}
					>
						{sectionDescription}
					</p>
				</div>

				<div className="grid w-full grid-cols-1 items-stretch gap-5 md:grid-cols-3">
					{items.map((item, index) => (
						<button
							key={`${item.name}-${index}`}
							type="button"
							onClick={() => setSelectedItem(item)}
							className="home-machinery-reveal-right group relative flex h-auto min-h-[560px] w-full flex-col overflow-hidden bg-[#FAF7F0] text-left text-[#342312] outline-none transition-colors duration-300 hover:bg-[#FAF7F0] focus-visible:ring-2 focus-visible:ring-[#A87E3C] md:min-h-[540px] lg:min-h-[600px]"
							style={{ animationDelay: `${420 + index * 140}ms` }}
						>
							<div className="relative h-[250px] w-full shrink-0 overflow-hidden bg-[#FAF7F0] sm:h-[300px] lg:h-[350px]">
								<img
									src={item.imageUrl}
									alt={item.imageAlt}
									className="h-full w-full object-cover"
								/>

								<div className="absolute inset-0 bg-gradient-to-t from-[#342312]/18 via-transparent to-transparent" />
							</div>

							<div className="flex flex-1 flex-col justify-between p-6 sm:p-7 lg:p-8">
								<div>
									<p className="line-clamp-2 text-[12px] font-bold uppercase leading-6 tracking-[0.18em] text-[#A87E3C]">
										{item.role}
									</p>

									<h3 className="mt-5 line-clamp-2 text-2xl font-extrabold uppercase leading-[1.12] tracking-[0.06em] text-[#342312] transition-colors duration-300 group-hover:text-[#A87E3C] sm:text-[28px]">
										{item.name}
									</h3>
								</div>

								<div className="mt-6">
									<p className="line-clamp-3 text-sm leading-7 text-[#342312]/72 transition-colors duration-300 group-hover:text-[#A87E3C]">
										{item.description}
									</p>

									<div className="mt-6 border-t border-[#E7D0AF] pt-5">
										<span className="block h-px w-12 bg-[#A87E3C] transition-[width] duration-300 ease-out group-hover:w-20" />
									</div>
								</div>
							</div>

							<span className="absolute bottom-0 left-0 h-[4px] w-full origin-left scale-x-0 bg-[#A87E3C] transition-transform duration-300 ease-out group-hover:scale-x-100" />
						</button>
					))}
				</div>
			</div>

			{selectedItem ? (
				<div
					className="fixed inset-0 z-[100] flex items-center justify-center bg-transparent p-4 sm:p-6 lg:p-10"
					onClick={() => setSelectedItem(null)}
				>
					<div
						className="relative w-full max-w-6xl"
						onClick={(event) => event.stopPropagation()}
					>
						<button
							type="button"
							aria-label={text.close}
							onClick={() => setSelectedItem(null)}
							className="absolute -top-14 right-0 flex h-11 w-11 items-center justify-center border border-[#342312]/35 bg-[#FAF7F0] text-[#342312] transition-colors duration-300 hover:border-[#A87E3C] hover:bg-[#A87E3C] hover:text-white"
						>
							<X className="h-5 w-5" />
						</button>

						<div className="border border-[#E7D0AF] bg-[#FAF7F0] p-3 shadow-2xl">
							<img
								src={selectedItem.imageUrl}
								alt={selectedItem.imageAlt}
								className="max-h-[78vh] w-full object-contain"
							/>
						</div>

						<div className="mt-4 border-l-2 border-[#A87E3C] bg-[#FAF7F0] px-4 py-3 shadow-xl">
							<p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#A87E3C]">
								{selectedItem.role}
							</p>

							<p className="mt-2 text-xl font-extrabold uppercase tracking-[0.08em] text-[#342312]">
								{selectedItem.name}
							</p>
						</div>
					</div>
				</div>
			) : null}
		</section>
	);
}