"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
	useState,
} from "react";
import { MobilePageIndicator } from "src/components/mobile-page-indicator";
import type { Locale } from "src/lib/i18n/config";

const MOBILE_PAGE_SIZE = 12;
const MOBILE_BREAKPOINT = 768;

interface ServiceMobilePaginationContextValue {
	currentPage: number;
	goToPage: (page: number) => void;
	isVisible: (id: string) => boolean;
	totalPages: number;
}

const ServiceMobilePaginationContext = createContext<ServiceMobilePaginationContextValue | null>(
	null,
);

function useServiceMobilePagination() {
	const context = useContext(ServiceMobilePaginationContext);

	if (!context) {
		throw new Error(
			"useServiceMobilePagination must be used within ServiceMobilePaginationController",
		);
	}

	return context;
}

export function ServiceMobilePaginationController({
	children,
	serviceIds,
}: {
	children: ReactNode;
	serviceIds: string[];
}) {
	const [isMobile, setIsMobile] = useState(false);
	const [isReady, setIsReady] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const serviceIdsKey = serviceIds.join("\u0000");

	useLayoutEffect(() => {
		const updateViewport = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
			setIsReady(true);
		};

		updateViewport();
		window.addEventListener("resize", updateViewport);

		return () => window.removeEventListener("resize", updateViewport);
	}, []);

	const totalPages = isMobile ? Math.max(1, Math.ceil(serviceIds.length / MOBILE_PAGE_SIZE)) : 1;

	// biome-ignore lint/correctness/useExhaustiveDependencies: A viewport or service-list change must reset pagination even though their values are not read inside the effect.
	useEffect(() => {
		setCurrentPage(1);
	}, [isMobile, serviceIdsKey]);

	useEffect(() => {
		setCurrentPage((previousPage) => Math.min(Math.max(previousPage, 1), totalPages));
	}, [totalPages]);

	const visibleIds = useMemo(() => {
		if (!isMobile) return new Set(serviceIds);

		const safePage = Math.min(Math.max(currentPage, 1), totalPages);
		const startIndex = (safePage - 1) * MOBILE_PAGE_SIZE;

		return new Set(serviceIds.slice(startIndex, startIndex + MOBILE_PAGE_SIZE));
	}, [currentPage, isMobile, serviceIds, totalPages]);

	const isVisible = useCallback((id: string) => visibleIds.has(id), [visibleIds]);

	const goToPage = useCallback(
		(page: number) => {
			setCurrentPage(Math.min(Math.max(page, 1), totalPages));
		},
		[totalPages],
	);

	const contextValue = useMemo(
		() => ({
			currentPage,
			goToPage,
			isVisible,
			totalPages,
		}),
		[currentPage, goToPage, isVisible, totalPages],
	);

	return (
		<ServiceMobilePaginationContext.Provider value={contextValue}>
			<div style={{ visibility: isReady ? "visible" : "hidden" }}>{children}</div>
		</ServiceMobilePaginationContext.Provider>
	);
}

export function ServiceMobilePaginationItem({ children, id }: { children: ReactNode; id: string }) {
	const { isVisible } = useServiceMobilePagination();

	if (!isVisible(id)) return null;

	return children;
}

export function ServiceMobilePageIndicator({ locale }: { locale: Locale }) {
	const { currentPage, totalPages } = useServiceMobilePagination();

	return (
		<MobilePageIndicator
			className="mb-4 md:hidden"
			currentPage={currentPage}
			locale={locale}
			totalPages={totalPages}
		/>
	);
}

export function ServiceMobilePaginationControls({ locale }: { locale: Locale }) {
	const { currentPage, goToPage, totalPages } = useServiceMobilePagination();
	const previousLabel = locale === "vi" ? "Trang trước" : "Previous page";
	const nextLabel = locale === "vi" ? "Trang sau" : "Next page";

	if (totalPages <= 1) return null;

	const scrollToListStart = () => {
		window.requestAnimationFrame(() => {
			const target = document.getElementById("services-list-start");

			if (!target) return;

			const targetTop = target.getBoundingClientRect().top + window.scrollY;
			const headerOffset = window.innerWidth < 640 ? 92 : 104;

			window.scrollTo({
				top: Math.max(targetTop - headerOffset, 0),
				behavior: "smooth",
			});
		});
	};

	const handlePageChange = (page: number) => {
		goToPage(page);
		scrollToListStart();
	};

	const buttonClassName =
		"flex size-10 items-center justify-center rounded-full border border-[#E7D0AF] bg-[#F7F1E6] text-sm font-semibold text-[#342312] transition-colors hover:border-[#342312] hover:bg-[#342312] hover:text-[#E7D0AF] disabled:pointer-events-none disabled:opacity-40";

	return (
		<nav
			aria-label={locale === "vi" ? "Phân trang dịch vụ" : "Service pagination"}
			className="mt-8 flex flex-wrap items-center justify-center gap-2 md:hidden"
		>
			<button
				type="button"
				aria-label={previousLabel}
				className={buttonClassName}
				disabled={currentPage === 1}
				onClick={() => handlePageChange(currentPage - 1)}
			>
				<ChevronLeft className="size-4" />
			</button>

			{Array.from({ length: totalPages }, (_, index) => {
				const page = index + 1;
				const isActive = page === currentPage;

				return (
					<button
						key={page}
						type="button"
						aria-current={isActive ? "page" : undefined}
						aria-label={`${locale === "vi" ? "Trang" : "Page"} ${page}`}
						className={
							isActive
								? `${buttonClassName} border-[#342312] bg-[#342312] text-[#E7D0AF]`
								: buttonClassName
						}
						onClick={() => handlePageChange(page)}
					>
						{page}
					</button>
				);
			})}

			<button
				type="button"
				aria-label={nextLabel}
				className={buttonClassName}
				disabled={currentPage === totalPages}
				onClick={() => handlePageChange(currentPage + 1)}
			>
				<ChevronRight className="size-4" />
			</button>
		</nav>
	);
}

export { useServiceMobilePagination };
