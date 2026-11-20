"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "src/lib/i18n/config";

interface Props {
	currentLang: Locale;
}

const LANGUAGES: { code: Locale; label: string }[] = [
	{ code: "vi", label: "VI" },
	{ code: "en", label: "EN" },
];

/**
 * Pill-shaped VI / EN switch: the active language sits in a dark rounded pill
 * inside a light beige track.
 * Below md it only appears in the mobile menu, where the whole switch is 44px tall (touch target);
 * from md up it sits in the header at a compact size.
 */
export function LanguageSwitcher({ currentLang }: Props) {
	const pathname = usePathname();
	const pathWithoutLocale = pathname.replace(/^\/(en|vi)/, "");

	const buildPath = (lang: Locale) => `/${lang}${pathWithoutLocale}`;

	return (
		<div className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[#EADCC4] p-1 shadow-[inset_0_1px_2px_rgba(52,35,18,0.08)]">
			{LANGUAGES.map(({ code, label }) => {
				const isActive = currentLang === code;

				return (
					<button
						key={code}
						type="button"
						aria-pressed={isActive}
						className={`inline-flex h-9 min-w-14 items-center justify-center rounded-full px-4 text-[15px] font-bold leading-none tracking-[0.06em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A87E3C] md:h-8 md:min-w-12 md:px-3 md:text-[15px] ${
							isActive
								? "bg-[#342312] text-[#FFF8EC] shadow-sm"
								: "text-[#342312] hover:bg-[#342312]/10"
						}`}
						onClick={() => {
							if (!isActive) window.location.href = buildPath(code);
						}}
					>
						{label}
					</button>
				);
			})}
		</div>
	);
}
