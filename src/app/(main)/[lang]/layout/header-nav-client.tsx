"use client";

import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LocaleLink from "src/components/behaviors/LocaleLink";
import { HeaderMegaMenu } from "src/components/header-mega-menu";
import type { Locale } from "src/lib/i18n/config";
import type { HeaderNavigationItem } from "./header-navigation.types";

export function HeaderNavClient({
	navigation,
	dictionary,
	locale,
}: {
	navigation: HeaderNavigationItem[];
	dictionary: any;
	locale: Locale;
}) {
	const pathname = usePathname();
	const [activeMenu, setActiveMenu] = useState<string | null>(null);

	useEffect(() => {
		setActiveMenu(null);
	}, [pathname]);

	return (
		<nav className="hidden w-full items-center justify-center gap-1 font-heading md:flex lg:gap-4 xl:gap-8">
			{navigation.map((item) => {
				const hasChildren = !!item.children?.length;
				const isActive = activeMenu === item.name;

				if (!hasChildren) {
					return (
						<LocaleLink
							key={item.name}
							href={item.href}
							prefetch={true}
							onClick={() => setActiveMenu(null)}
							className="relative whitespace-nowrap px-2 py-2 text-[14px] font-semibold uppercase tracking-[0.06em] text-[#241407] lg:px-3 lg:text-[15px] lg:tracking-[0.08em] xl:px-4 xl:text-[16px] xl:tracking-[0.1em] hover:text-[#A87E3C]
							after:absolute after:left-4 after:right-4 after:-bottom-1 after:h-[2px]
							after:origin-left after:scale-x-0 after:bg-[#A87E3C] after:transition-transform
							hover:after:scale-x-100"
						>
							{item.name}
						</LocaleLink>
					);
				}

				return (
					<div
						key={item.name}
						className="relative"
						onMouseEnter={() => setActiveMenu(item.name)}
						onMouseLeave={() => setActiveMenu(null)}
					>
						<LocaleLink
							href={item.href}
							prefetch={true}
							onClick={() => setActiveMenu(null)}
							className={`relative whitespace-nowrap px-2 py-2 text-[14px] font-semibold uppercase tracking-[0.06em] text-[#241407] lg:px-3 lg:text-[15px] lg:tracking-[0.08em] xl:px-4 xl:text-[16px] xl:tracking-[0.1em] transition-colors hover:text-[#A87E3C]
							after:absolute after:left-4 after:right-4 after:-bottom-1 after:h-[2px]
							after:origin-left after:bg-[#A87E3C] after:transition-transform ${
								isActive ? "after:scale-x-100" : "after:scale-x-0"
							}`}
						>
							<span className="inline-flex items-center gap-1 whitespace-nowrap">
								<span>{item.name}</span>

								<ChevronDown
									className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
										isActive ? "rotate-[-90deg]" : ""
									}`}
								/>
							</span>
						</LocaleLink>

						<div
							className={`fixed inset-x-0 z-50 max-w-full overflow-x-hidden transition-all duration-300 before:absolute before:left-0 before:top-[-12px] before:h-[12px] before:w-full before:content-[''] ${
								isActive
									? "visible translate-y-0 opacity-100"
									: "invisible translate-y-2 opacity-0"
							}`}
							style={{
								top: "var(--header-h, 130px)",
							}}
						>
							<HeaderMegaMenu
								title={item.name}
								href={item.href}
								childrenItems={item.children || []}
								viewAllText={dictionary.header.viewAll}
								locale={locale}
								onClose={() => setActiveMenu(null)}
							/>
						</div>
					</div>
				);
			})}
		</nav>
	);
}
