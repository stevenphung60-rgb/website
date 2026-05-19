"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "src/lib/i18n/config";

interface Props {
	currentLang: Locale;
}

export function LanguageSwitcher({ currentLang }: Props) {
	const pathname = usePathname();
	const pathWithoutLocale = pathname.replace(/^\/(en|vi)/, "");

	const buildPath = (lang: Locale) => `/${lang}${pathWithoutLocale}`;

	return (
		<div className="inline-flex shrink-0 items-center overflow-hidden rounded-full border border-[#E7D0AF] bg-[#E7D0AF] text-[12px] font-semibold leading-none shadow-sm sm:text-[14px]">
			<button
				type="button"
				aria-pressed={currentLang === "vi"}
				className={`min-h-8 min-w-9 px-2.5 py-1 transition-colors duration-200 sm:min-h-9 sm:min-w-10 sm:px-3 ${
					currentLang === "vi"
						? "bg-[#342312] text-[#E7D0AF]"
						: "bg-[#E7D0AF] text-[#342312] hover:bg-[#DABF96]"
				}`}
				onClick={() => {
					window.location.href = buildPath("vi");
				}}
			>
				VI
			</button>

			<button
				type="button"
				aria-pressed={currentLang === "en"}
				className={`min-h-8 min-w-9 px-2.5 py-1 transition-colors duration-200 sm:min-h-9 sm:min-w-10 sm:px-3 ${
					currentLang === "en"
						? "bg-[#342312] text-[#E7D0AF]"
						: "bg-[#E7D0AF] text-[#342312] hover:bg-[#DABF96]"
				}`}
				onClick={() => {
					window.location.href = buildPath("en");
				}}
			>
				EN
			</button>
		</div>
	);
}