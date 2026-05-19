"use client";

import { ChevronsRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "src/lib/i18n/config";

interface ServiceNavigationItem {
	id: string;
	name: string;
}

interface ServiceListNavigationProps {
	locale: Locale;
	items: ServiceNavigationItem[];
}

const uiText = {
	vi: {
		heading: "Dịch vụ",
		mobileLabel: "Danh sách",
	},
	en: {
		heading: "Services",
		mobileLabel: "List",
	},
};

function getScrollOffset() {
	if (window.innerWidth >= 1024) {
		return 180;
	}

	if (window.innerWidth >= 640) {
		return 150;
	}

	return 150;
}

function getBottomGap() {
	if (window.innerWidth >= 1024) {
		return 48;
	}

	if (window.innerWidth >= 640) {
		return 36;
	}

	return 24;
}

export function ServiceListNavigation({
	locale,
	items,
}: ServiceListNavigationProps) {
	const text = uiText[locale === "en" ? "en" : "vi"];

	const [activeId, setActiveId] = useState(items[0]?.id ?? "");

	const listRef = useRef<HTMLDivElement>(null);
	const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

	useEffect(() => {
		setActiveId(items[0]?.id ?? "");
	}, [items]);

	const getFullyVisibleServiceId = useCallback(() => {
		if (items.length === 0) return "";

		const topLimit = getScrollOffset();
		const bottomLimit = window.innerHeight - getBottomGap();

		for (const item of items) {
			const element = document.getElementById(`service-card-${item.id}`);

			if (!element) continue;

			const rect = element.getBoundingClientRect();

			const isFullyVisible =
				rect.top >= topLimit && rect.bottom <= bottomLimit;

			if (isFullyVisible) {
				return item.id;
			}
		}

		return "";
	}, [items]);

	useEffect(() => {
		if (items.length === 0) return;

		let ticking = false;

		const updateActiveService = () => {
			const fullyVisibleServiceId = getFullyVisibleServiceId();

			if (fullyVisibleServiceId) {
				setActiveId(fullyVisibleServiceId);
			}
		};

		const handleScroll = () => {
			if (ticking) return;

			ticking = true;

			window.requestAnimationFrame(() => {
				updateActiveService();
				ticking = false;
			});
		};

		updateActiveService();

		window.addEventListener("scroll", handleScroll, { passive: true });
		window.addEventListener("resize", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleScroll);
		};
	}, [items, getFullyVisibleServiceId]);

	useEffect(() => {
		if (!activeId) return;
		if (window.innerWidth < 1024) return;

		const listElement = listRef.current;
		const activeButton = buttonRefs.current[activeId];

		if (!listElement || !activeButton) return;

		const listRect = listElement.getBoundingClientRect();
		const buttonRect = activeButton.getBoundingClientRect();

		const isAbove = buttonRect.top < listRect.top + 16;
		const isBelow = buttonRect.bottom > listRect.bottom - 16;

		if (!isAbove && !isBelow) return;

		const buttonTopInsideList =
			buttonRect.top - listRect.top + listElement.scrollTop;

		const targetScrollTop =
			buttonTopInsideList -
			listElement.clientHeight / 2 +
			activeButton.clientHeight / 2;

		listElement.scrollTo({
			top: targetScrollTop,
			behavior: "smooth",
		});
	}, [activeId]);

	const scrollToService = (id: string) => {
		const element = document.getElementById(`service-card-${id}`);

		if (!element) return;

		setActiveId(id);

		const elementTop = element.getBoundingClientRect().top + window.scrollY;
		const offset = getScrollOffset();

		window.scrollTo({
			top: Math.max(elementTop - offset, 0),
			behavior: "smooth",
		});
	};

	if (items.length === 0) return null;

	return (
		<aside className="w-full max-w-full overflow-hidden lg:sticky lg:top-28 lg:w-[300px] lg:shrink-0 lg:self-start">
			<div className="mb-4 flex items-end justify-between gap-4 border-b border-[#E7D0AF] pb-3 lg:mb-5 lg:block lg:border-b-0 lg:pb-0">
				<h3 className="inline-block border-b-2 border-[#A87E3C] pb-2 text-lg font-bold uppercase text-[#00164A] sm:text-xl">
					{text.heading}
				</h3>

				<span className="shrink-0 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-[#A87E3C] lg:hidden">
					{text.mobileLabel}
				</span>
			</div>

			<div
				ref={listRef}
				className="grid max-w-full grid-cols-1 gap-2 overflow-hidden sm:grid-cols-2 lg:flex lg:max-h-[calc(100vh-12rem)] lg:flex-col lg:gap-0 lg:overflow-y-auto lg:overflow-x-hidden lg:pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
			>
				{items.map((item) => {
					const isActive = activeId === item.id;

					return (
						<button
							key={item.id}
							ref={(element) => {
								buttonRefs.current[item.id] = element;
							}}
							type="button"
							onClick={() => scrollToService(item.id)}
							aria-current={isActive ? "true" : undefined}
							className={`group flex min-h-[52px] w-full max-w-full min-w-0 items-center justify-center overflow-hidden border px-3 py-3 text-center text-[13px] font-bold uppercase leading-5 tracking-[0.04em] transition lg:min-h-0 lg:justify-between lg:border-x-0 lg:border-t-0 lg:px-3 lg:py-4 lg:text-left lg:text-[16px] ${
								isActive
									? "border-[#342312] bg-[#342312] text-[#E7D0AF] lg:border-[#A87E3C] lg:bg-[#F7F1E6] lg:text-[#A87E3C]"
									: "border-[#E7D0AF] bg-[#FAF7F0] text-[#00164A] hover:border-[#A87E3C] hover:text-[#A87E3C] lg:border-[#d8dee8] lg:bg-transparent"
							}`}
						>
							<span className="min-w-0 max-w-full whitespace-normal break-words">
								{item.name}
							</span>

							<ChevronsRight
								className={`hidden size-4 shrink-0 transition-all duration-300 lg:block ${
									isActive ? "translate-x-0 opacity-100" : "opacity-0"
								}`}
							/>
						</button>
					);
				})}
			</div>
		</aside>
	);
}