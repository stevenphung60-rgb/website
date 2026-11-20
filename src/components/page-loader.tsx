"use client";

import useLocale from "src/hooks/useLocale";

interface PageLoaderProps {
	/** "page": public pages (fills most of the screen); "admin": compact, inside the admin shell */
	variant?: "page" | "admin";
}

const TEXT = {
	vi: { title: "Đang tải", hint: "Bạn chờ một chút, nội dung sẽ hiện ngay." },
	en: { title: "Loading", hint: "Just a moment, the page is almost ready." },
} as const;

/**
 * Shared loading screen shown while a page is fetching its content.
 * Brand name, a gold "airflow" bar sliding through a track, and a short friendly line.
 * It fades in after a short delay (see .page-loader in globals.css), so fast loads never flash it.
 */
export function PageLoader({ variant = "page" }: PageLoaderProps) {
	const locale = useLocale();
	const text = TEXT[locale] ?? TEXT.vi;

	return (
		<div
			role="status"
			aria-live="polite"
			className={`page-loader flex w-full items-center justify-center px-6 ${
				variant === "admin" ? "min-h-[50vh]" : "min-h-[70vh] bg-[#FAF7F0]"
			}`}
		>
			<div className="flex w-full max-w-[280px] flex-col items-center text-center md:max-w-[340px]">
				<p className="text-[13px] font-bold uppercase tracking-[0.28em] text-[#342312] md:text-[15px]">
					Nghiệp Hưng
				</p>

				<div className="relative mt-5 h-[3px] w-full overflow-hidden rounded-full bg-[#E7D0AF]/70">
					<span className="page-loader-bar absolute inset-y-0 left-0 w-2/5 rounded-full bg-[#A87E3C]" />
				</div>

				<p className="mt-5 text-[15px] font-semibold text-[#342312] md:text-[17px]">{text.title}…</p>
				<p className="mt-1 text-[14px] leading-relaxed text-[#342312]/65 md:text-[15px]">{text.hint}</p>
			</div>
		</div>
	);
}

/**
 * Plain placeholder with the real header's height, so nothing jumps when the header arrives
 */
export function HeaderPlaceholder() {
	return (
		<div
			aria-hidden="true"
			className="h-[78px] border-b border-[#E7D0AF]/60 bg-[#F7F1E6] md:h-[154px] lg:h-[162px]"
		/>
	);
}

/**
 * Plain dark block standing in for the footer while it loads
 */
export function FooterPlaceholder() {
	return <div aria-hidden="true" className="min-h-[320px] bg-[#342312]" />;
}
