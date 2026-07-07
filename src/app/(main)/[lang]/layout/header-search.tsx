"use client";

import { ArrowUpRight, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "src/lib/i18n/config";
import type { SiteSearchResult } from "src/server/site-search";

interface HeaderSearchProps {
	locale: Locale;
	placeholder: string;
	variant?: "desktop" | "mobile";
	onNavigate?: () => void;
}

interface SearchResponse {
	results: SiteSearchResult[];
	error?: string;
}

const emptyResults: SiteSearchResult[] = [];

const resultTypeTone: Record<SiteSearchResult["type"], string> = {
	product: "border-[#A87E3C]/35 bg-[#FAF7F1] text-[#5A3719]",
	service: "border-[#A87E3C]/35 bg-[#FAF7F1] text-[#5A3719]",
	project: "border-[#A87E3C]/35 bg-[#FAF7F1] text-[#5A3719]",
	blog: "border-[#A87E3C]/35 bg-[#FAF7F1] text-[#5A3719]",
};

/**
 * Remove leading separators from search descriptions.
 * @param value - Description text
 * @returns Cleaned description
 */
function cleanDescription(value: string): string {
	return value.replace(/^[-–—]\s*/, "").trim();
}

/**
 * Header search box for public website content.
 * @param props - Header search props
 * @returns Search input with live results dropdown
 */
export function HeaderSearch({
	locale,
	placeholder,
	variant = "desktop",
	onNavigate,
}: HeaderSearchProps) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SiteSearchResult[]>(emptyResults);
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const rootRef = useRef<HTMLDivElement | null>(null);

	const trimmedQuery = query.trim();
	const lang = locale === "en" ? "en" : "vi";
	const hasSearchQuery = trimmedQuery.length >= 2;
	const resultCountLabel =
		lang === "en"
			? `${results.length} result${results.length === 1 ? "" : "s"}`
			: `${results.length} kết quả`;

	useEffect(() => {
		function handlePointerDown(event: MouseEvent) {
			if (!rootRef.current?.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handlePointerDown);

		return () => document.removeEventListener("mousedown", handlePointerDown);
	}, []);

	useEffect(() => {
		if (!hasSearchQuery) {
			setResults(emptyResults);
			setError("");
			setIsLoading(false);
			return;
		}

		const abortController = new AbortController();
		const timer = window.setTimeout(async () => {
			try {
				setIsLoading(true);
				setError("");

				const response = await fetch(
					`/api/site-search?q=${encodeURIComponent(trimmedQuery)}&locale=${lang}`,
					{
						signal: abortController.signal,
					},
				);

				const data = (await response.json()) as SearchResponse;

				if (!response.ok) {
					throw new Error(data.error || "Search failed");
				}

				setResults(data.results || emptyResults);
				setIsOpen(true);
			} catch (searchError) {
				if (abortController.signal.aborted) return;

				console.error("Header search error:", searchError);
				setResults(emptyResults);
				setError(lang === "en" ? "Search failed" : "Không thể tìm kiếm");
			} finally {
				if (!abortController.signal.aborted) {
					setIsLoading(false);
				}
			}
		}, 220);

		return () => {
			abortController.abort();
			window.clearTimeout(timer);
		};
	}, [hasSearchQuery, lang, trimmedQuery]);

	function handleNavigate() {
		setIsOpen(false);
		setQuery("");
		onNavigate?.();
	}

	function clearSearch() {
		setQuery("");
		setResults(emptyResults);
		setError("");
		setIsOpen(false);
	}

	const inputClassName =
		variant === "mobile"
			? "w-full rounded-full border border-[#E7D0AF] bg-[#FAF7F0] py-3 pl-12 pr-11 text-[15px] font-medium text-[#342312] placeholder:text-[#342312]/55 outline-none transition focus:border-[#A87E3C] focus:ring-2 focus:ring-[#A87E3C]/15"
			: "w-full rounded-full border border-[#E7D0AF] bg-[#F7F3EF] py-1.5 pl-12 pr-10 text-sm text-[#342312] placeholder:text-[#8a7663] outline-none transition focus:border-[#A87E3C] focus:ring-1 focus:ring-[#AA8140]";

	return (
		<div ref={rootRef} className="relative w-full">
			<div
				className={[
					"absolute left-3 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-[#E7D0AF] text-[#342312]",
					variant === "mobile" ? "size-9" : "p-1.5",
				].join(" ")}
			>
				<Search className={variant === "mobile" ? "size-[18px]" : "h-3.5 w-3.5"} />
			</div>

			<input
				type="search"
				value={query}
				placeholder={placeholder}
				className={inputClassName}
				onChange={(event) => {
					setQuery(event.target.value);
					setIsOpen(true);
				}}
				onFocus={() => {
					if (hasSearchQuery) {
						setIsOpen(true);
					}
				}}
			/>

			{query ? (
				<button
					type="button"
					aria-label={lang === "en" ? "Clear search" : "Xóa tìm kiếm"}
					onClick={clearSearch}
					className={[
						"absolute right-3 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full text-[#342312]/60 transition hover:bg-[#E7D0AF]/45 hover:text-[#342312]",
						variant === "mobile" ? "size-8" : "size-7",
					].join(" ")}
				>
					<X className={variant === "mobile" ? "size-5" : "size-4"} />
				</button>
			) : null}

			{isOpen && hasSearchQuery ? (
				<div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[100000] overflow-hidden rounded-2xl border border-[#E7D0AF] bg-white shadow-[0_22px_60px_rgba(52,35,18,0.16)]">
					<div className="flex items-center justify-end border-b border-[#E7D0AF]/70 bg-[#FAF7F1] px-4 py-3">
						<div className="rounded-full border border-[#E7D0AF] bg-white px-3 py-1 text-xs font-semibold text-[#342312]/65">
							{isLoading ? (lang === "en" ? "Searching..." : "Đang tìm...") : resultCountLabel}
						</div>
					</div>

					<div className="max-h-[360px] overflow-y-auto">
						{!isLoading && error ? (
							<div className="px-4 py-4 text-sm text-destructive">{error}</div>
						) : null}

						{!isLoading && !error && results.length === 0 ? (
							<div className="px-4 py-5 text-sm text-[#342312]/60">
								{lang === "en" ? "No matching content." : "Không có nội dung phù hợp."}
							</div>
						) : null}

						{results.map((result) => {
							const description = cleanDescription(result.description || "");

							return (
								<Link
									key={`${result.type}-${result.id}`}
									href={result.href}
									onClick={handleNavigate}
									className="group block border-b border-[#E7D0AF]/60 px-4 py-4 transition last:border-b-0 hover:bg-[#FAF7F1]"
								>
									<div className="flex items-center justify-between gap-4">
										<div className="min-w-0 flex-1">
											<div className="flex min-w-0 flex-wrap items-center gap-2">
												<p className="min-w-0 truncate text-sm font-bold uppercase leading-5 text-[#342312] transition group-hover:text-[#A87E3C] sm:text-base">
													{result.title}
												</p>

												<span
													className={[
														"shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]",
														resultTypeTone[result.type],
													].join(" ")}
												>
													{result.label}
												</span>
											</div>

											{description ? (
												<p className="mt-1 line-clamp-1 text-xs leading-5 text-[#342312]/58 sm:text-sm">
													{description}
												</p>
											) : null}
										</div>

										<ArrowUpRight className="size-4 shrink-0 text-[#A87E3C]/75 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#A87E3C]" />
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			) : null}
		</div>
	);
}
