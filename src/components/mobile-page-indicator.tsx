import type { Locale } from "src/lib/i18n/config";
import { cn } from "src/lib/utils";

interface MobilePageIndicatorProps {
	className?: string;
	currentPage: number;
	locale: Locale;
	totalPages: number;
}

export function MobilePageIndicator({
	className,
	currentPage,
	locale,
	totalPages,
}: MobilePageIndicatorProps) {
	const pageLabel = locale === "vi" ? "Trang" : "Page";

	return (
		<output aria-live="polite" className={cn("flex w-full items-center gap-3", className)}>
			<span
				aria-hidden="true"
				className="h-px min-w-0 flex-1 bg-gradient-to-r from-[#E7D0AF]/25 to-[#A87E3C]"
			/>

			<span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-[#342312]/65">
				{pageLabel} <strong className="font-semibold text-[#A87E3C]">{currentPage}</strong>
				{" / "}
				<span className="text-[#342312]">{totalPages}</span>
			</span>
		</output>
	);
}
