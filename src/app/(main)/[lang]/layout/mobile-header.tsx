"use client";

import { ArrowRight, ChevronDown, Mail, Menu, Phone, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import LocaleLink from "src/components/behaviors/LocaleLink";
import { LanguageSwitcher } from "src/components/language-toggle";
import type { Locale } from "src/lib/i18n/config";
import type { HeaderNavigationItem } from "./header-navigation.types";
import { HeaderSearch } from "./header-search";

interface MobileHeaderProps {
	navigation: HeaderNavigationItem[];
	locale: Locale;
	brandLogo?: string;
	brandCompanyName?: string;
	phone?: string;
	email?: string;
	searchPlaceholder?: string;
	viewAllText?: string;
}

const MENU_ANIMATION_DURATION = 220;
const FOCUSABLE_ELEMENTS = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	'[tabindex]:not([tabindex="-1"])',
].join(",");

function getLocalizedHref(locale: Locale, href: string) {
	const hrefPath = href.split(/[?#]/)[0] || "/";

	return hrefPath === "/" ? `/${locale}` : `/${locale}${hrefPath}`;
}

function isNavigationItemActive(pathname: string, locale: Locale, href: string) {
	const localizedHref = getLocalizedHref(locale, href);
	const hrefPath = href.split(/[?#]/)[0] || "/";

	if (hrefPath === "/") {
		return pathname === localizedHref || pathname === `${localizedHref}/`;
	}

	return pathname === localizedHref || pathname.startsWith(`${localizedHref}/`);
}

export function MobileHeader({
	navigation,
	locale,
	brandLogo = "",
	brandCompanyName = "",
	phone = "",
	email = "",
	searchPlaceholder = "",
	viewAllText = "",
}: MobileHeaderProps) {
	const pathname = usePathname();
	const navigationPanelId = useId();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [shouldRenderMenu, setShouldRenderMenu] = useState(false);
	const [expandedItemHref, setExpandedItemHref] = useState<string | null>(null);
	const [mounted, setMounted] = useState(false);
	const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const openAnimationFrameRef = useRef<number | null>(null);
	const openButtonRef = useRef<HTMLButtonElement | null>(null);
	const closeButtonRef = useRef<HTMLButtonElement | null>(null);
	const closeLabel = locale === "vi" ? "Đóng menu" : "Close menu";
	const openLabel = locale === "vi" ? "Mở menu" : "Open menu";

	const closeMenu = useCallback((restoreFocus = true) => {
		setIsMenuOpen(false);

		if (openAnimationFrameRef.current !== null) {
			cancelAnimationFrame(openAnimationFrameRef.current);
			openAnimationFrameRef.current = null;
		}

		if (closeTimeoutRef.current) {
			clearTimeout(closeTimeoutRef.current);
		}

		closeTimeoutRef.current = setTimeout(() => {
			setShouldRenderMenu(false);
			setExpandedItemHref(null);

			if (restoreFocus) {
				openButtonRef.current?.focus();
			}
		}, MENU_ANIMATION_DURATION);
	}, []);

	const closeForNavigation = useCallback(() => {
		closeMenu(false);
	}, [closeMenu]);

	useEffect(() => {
		setMounted(true);

		return () => {
			if (closeTimeoutRef.current) {
				clearTimeout(closeTimeoutRef.current);
			}

			if (openAnimationFrameRef.current !== null) {
				cancelAnimationFrame(openAnimationFrameRef.current);
			}
		};
	}, []);

	useEffect(() => {
		if (isMenuOpen) {
			closeButtonRef.current?.focus();
		}
	}, [isMenuOpen]);

	useEffect(() => {
		if (!shouldRenderMenu) return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [shouldRenderMenu]);

	useEffect(() => {
		if (!shouldRenderMenu) return;

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				event.preventDefault();
				closeMenu();
				return;
			}

			if (event.key !== "Tab") return;

			const panel = document.getElementById(navigationPanelId);
			if (!panel) return;

			const focusableElements = Array.from(
				panel.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS),
			).filter((element) => !element.closest("[inert]"));

			const firstElement = focusableElements[0];
			const lastElement = focusableElements.at(-1);
			if (!firstElement || !lastElement) return;

			const activeElement = document.activeElement;

			if (event.shiftKey && (activeElement === firstElement || !panel.contains(activeElement))) {
				event.preventDefault();
				lastElement.focus();
				return;
			}

			if (!event.shiftKey && (activeElement === lastElement || !panel.contains(activeElement))) {
				event.preventDefault();
				firstElement.focus();
			}
		}

		document.addEventListener("keydown", handleKeyDown);

		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [closeMenu, navigationPanelId, shouldRenderMenu]);

	useEffect(() => {
		function handleResize() {
			if (window.innerWidth >= 768 && shouldRenderMenu) {
				closeMenu(false);
			}
		}

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, [closeMenu, shouldRenderMenu]);

	const openMenu = () => {
		if (closeTimeoutRef.current) {
			clearTimeout(closeTimeoutRef.current);
		}

		const currentSection = navigation.find(
			(item) => !!item.children?.length && isNavigationItemActive(pathname, locale, item.href),
		);

		setExpandedItemHref(currentSection?.href ?? null);
		setShouldRenderMenu(true);

		openAnimationFrameRef.current = requestAnimationFrame(() => {
			setIsMenuOpen(true);
			openAnimationFrameRef.current = null;
		});
	};

	const toggleSubmenu = (href: string, trigger: HTMLButtonElement) => {
		setExpandedItemHref((currentHref) => {
			const nextHref = currentHref === href ? null : href;

			if (nextHref) {
				requestAnimationFrame(() => trigger.scrollIntoView?.({ block: "nearest" }));
			}

			return nextHref;
		});
	};

	const menuOverlay =
		shouldRenderMenu && mounted
			? createPortal(
					<div
						id={navigationPanelId}
						role="dialog"
						aria-modal="true"
						aria-label={locale === "vi" ? "Menu chính" : "Main menu"}
						className={`fixed inset-0 z-[99999] overflow-hidden bg-[#F7F1E6] text-[#342312] transition-opacity duration-200 ease-out motion-reduce:transition-none md:hidden ${
							isMenuOpen ? "opacity-100" : "opacity-0"
						}`}
					>
						<div
							className={`flex h-dvh w-full max-w-full flex-col overflow-x-hidden overflow-y-auto overscroll-contain bg-[#F7F1E6] transition-transform duration-200 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
								isMenuOpen ? "translate-x-0" : "translate-x-3"
							}`}
						>
							<div className="sticky top-0 z-30 flex min-h-[84px] items-center justify-between gap-3 border-b border-[#E7D0AF]/65 bg-[#F7F1E6]/95 px-4 pt-[env(safe-area-inset-top)] shadow-[0_6px_20px_rgba(52,35,18,0.04)] backdrop-blur-md sm:min-h-[88px] sm:px-5">
								<LocaleLink
									href="/"
									className="flex min-h-11 min-w-0 flex-1 items-center gap-2.5 overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8F672E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F1E6]"
									onClick={closeForNavigation}
								>
									{brandLogo ? (
										// biome-ignore lint/performance/noImgElement: The administrator-managed logo must preserve its natural dimensions.
										<img
											src={brandLogo}
											alt={brandCompanyName ? "" : "Logo"}
											className="h-11 w-auto shrink-0 object-contain sm:h-12"
										/>
									) : null}

									{brandCompanyName ? (
										<span className="min-w-0 overflow-hidden">
											<span className="block max-w-[calc(100vw-140px)] truncate font-heading text-[20px] font-black uppercase leading-[1.18] tracking-[0.075em] text-[#2F2114] drop-shadow-[0_1px_0_rgba(168,126,60,0.2)] sm:max-w-[250px] sm:text-[21px] sm:tracking-[0.09em]">
												{brandCompanyName}
											</span>
										</span>
									) : null}
								</LocaleLink>

								<button
									ref={closeButtonRef}
									type="button"
									aria-label={closeLabel}
									onClick={() => closeMenu()}
									className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#FBF7EF] p-0 text-[#8F672E] shadow-[0_8px_20px_rgba(52,35,18,0.08)] transition-colors duration-200 hover:bg-[#E7D0AF]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8F672E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F1E6] motion-reduce:transition-none"
								>
									<X className="size-5" strokeWidth={2.4} />
								</button>
							</div>

							<div className="px-4 py-5 sm:px-5">
								{searchPlaceholder ? (
									<div className="mb-5">
										<HeaderSearch
											locale={locale}
											placeholder={searchPlaceholder}
											variant="mobile"
											onNavigate={closeForNavigation}
										/>
									</div>
								) : null}

								<nav
									aria-label={locale === "vi" ? "Điều hướng chính" : "Main navigation"}
									className="flex flex-col font-heading"
								>
									{navigation.map((item, index) => {
										const hasChildren = !!item.children?.length;
										const isExpanded = expandedItemHref === item.href;
										const isCurrent = isNavigationItemActive(pathname, locale, item.href);
										const isHighlighted = isExpanded || isCurrent;
										const submenuId = `${navigationPanelId}-submenu-${index}`;
										const overviewLabel = viewAllText
											? `${viewAllText} ${item.name.toLocaleLowerCase(locale)}`
											: item.name;

										return (
											<div key={item.name} className="border-b border-[#E7D0AF]/55">
												{hasChildren ? (
													<>
														<button
															type="button"
															aria-expanded={isExpanded}
															aria-controls={submenuId}
															aria-current={isCurrent ? "location" : undefined}
															onClick={(event) => toggleSubmenu(item.href, event.currentTarget)}
															className={`relative flex min-h-14 w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-[15px] font-semibold uppercase leading-[1.3] tracking-[0.055em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8F672E] focus-visible:ring-inset motion-reduce:transition-none ${
																isHighlighted
																	? "bg-[#E7D0AF]/25 text-[#7A5426]"
																	: "text-[#342312] hover:bg-[#E7D0AF]/15 hover:text-[#7A5426]"
															}`}
														>
															<span
																className={`absolute left-0 top-1/2 h-7 w-0.5 -translate-y-1/2 rounded-full bg-[#A87E3C] transition-transform duration-200 motion-reduce:transition-none ${
																	isHighlighted ? "scale-y-100" : "scale-y-0"
																}`}
															/>

															<span className="min-w-0">{item.name}</span>

															<span
																className={`inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-[#A87E3C] transition-all duration-200 motion-reduce:transition-none ${
																	isExpanded ? "rotate-180 bg-[#E7D0AF]/45 text-[#5A3719]" : ""
																}`}
															>
																<ChevronDown className="size-[18px]" strokeWidth={2.2} />
															</span>
														</button>

														<div
															id={submenuId}
															aria-hidden={!isExpanded}
															inert={!isExpanded ? true : undefined}
															className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${
																isExpanded
																	? "grid-rows-[1fr] opacity-100"
																	: "pointer-events-none grid-rows-[0fr] opacity-0"
															}`}
														>
															<div className="overflow-hidden">
																<div className="mb-3 ml-3 border-l-2 border-[#D3B37B]/60 py-1 pl-3">
																	<LocaleLink
																		href={item.href}
																		onClick={closeForNavigation}
																		className="group mb-1 flex min-h-12 items-center justify-between gap-3 rounded-lg border border-[#A87E3C]/25 bg-[#A87E3C]/10 px-3 py-2 text-[13px] font-semibold tracking-[0.035em] text-[#A87E3C] transition-colors duration-200 hover:border-[#A87E3C]/40 hover:bg-[#A87E3C]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8F672E] motion-reduce:transition-none"
																	>
																		<span>{overviewLabel}</span>
																		<ArrowRight className="size-4 shrink-0 text-[#A87E3C] transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none" />
																	</LocaleLink>

																	{item.children?.map((child) => (
																		<LocaleLink
																			key={child.href}
																			href={child.href}
																			onClick={closeForNavigation}
																			className="flex min-h-12 items-center border-b border-[#E7D0AF]/45 px-3 py-2.5 text-[14px] font-medium normal-case leading-[1.35] tracking-[0.015em] text-[#49331F]/90 transition-colors duration-200 last:border-b-0 hover:bg-[#E7D0AF]/12 hover:text-[#7A5426] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8F672E] focus-visible:ring-inset motion-reduce:transition-none"
																		>
																			<span className="min-w-0">{child.name}</span>
																		</LocaleLink>
																	))}
																</div>
															</div>
														</div>
													</>
												) : (
													<LocaleLink
														href={item.href}
														onClick={closeForNavigation}
														aria-current={isCurrent ? "page" : undefined}
														className={`relative flex min-h-14 items-center rounded-xl px-3 py-2 text-[15px] font-semibold uppercase leading-[1.3] tracking-[0.055em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8F672E] focus-visible:ring-inset motion-reduce:transition-none ${
															isCurrent
																? "bg-[#E7D0AF]/25 text-[#7A5426]"
																: "text-[#342312] hover:bg-[#E7D0AF]/15 hover:text-[#7A5426]"
														}`}
													>
														<span
															className={`absolute left-0 top-1/2 h-7 w-0.5 -translate-y-1/2 rounded-full bg-[#A87E3C] ${
																isCurrent ? "scale-y-100" : "scale-y-0"
															}`}
														/>
														{item.name}
													</LocaleLink>
												)}
											</div>
										);
									})}
								</nav>

								<div className="pt-5 font-heading">
									<LanguageSwitcher currentLang={locale} />
								</div>
							</div>

							{phone || email ? (
								<div className="mt-auto border-t border-[#E7D0AF]/55 px-5 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
									<div className="space-y-1.5">
										{phone ? (
											<a
												href={`tel:${phone.replace(/[^\d+]/g, "")}`}
												className="flex min-h-11 items-center gap-3.5 rounded-lg font-heading text-[#342312] transition-colors duration-200 hover:text-[#7A5426] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8F672E] motion-reduce:transition-none"
											>
												<Phone className="size-[18px] shrink-0 text-[#A87E3C]" strokeWidth={2.2} />
												<span className="text-[15px] font-semibold">{phone}</span>
											</a>
										) : null}

										{email ? (
											<a
												href={`mailto:${email}`}
												className="flex min-h-11 items-center gap-3.5 rounded-lg font-heading text-[#342312] transition-colors duration-200 hover:text-[#7A5426] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8F672E] motion-reduce:transition-none"
											>
												<Mail className="size-[18px] shrink-0 text-[#A87E3C]" strokeWidth={2.2} />
												<span className="break-all text-[15px] font-semibold">{email}</span>
											</a>
										) : null}
									</div>
								</div>
							) : (
								<div className="pb-[env(safe-area-inset-bottom)]" />
							)}
						</div>
					</div>,
					document.body,
				)
			: null;

	return (
		<>
			<button
				ref={openButtonRef}
				type="button"
				aria-label={openLabel}
				aria-controls={navigationPanelId}
				aria-expanded={shouldRenderMenu && isMenuOpen}
				onClick={openMenu}
				className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#F7F1E6] p-0 text-[#A87E3C] shadow-[0_10px_24px_rgba(52,35,18,0.1)] transition-colors duration-200 hover:bg-[#E7D0AF]/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8F672E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F1E6] motion-reduce:transition-none md:hidden"
			>
				<Menu className="size-5" strokeWidth={2.5} />
			</button>

			{menuOverlay}
		</>
	);
}
