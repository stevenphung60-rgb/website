"use client";

import { ChevronsRight, Mail, Menu, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import LocaleLink from "src/components/behaviors/LocaleLink";
import { LanguageSwitcher } from "src/components/language-toggle";
import type { Locale } from "src/lib/i18n/config";
import { HeaderSearch } from "./header-search";

interface MobileHeaderProps {
	navigation: Array<{
		name: string;
		href: string;
		children?: unknown[];
	}>;
	locale: Locale;
	brandLogo?: string;
	brandCompanyName?: string;
	phone?: string;
	email?: string;
	searchPlaceholder?: string;
}

const MENU_ANIMATION_DURATION = 280;

export function MobileHeader({
	navigation,
	locale,
	brandLogo = "",
	brandCompanyName = "",
	phone = "",
	email = "",
	searchPlaceholder = "",
}: MobileHeaderProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [shouldRenderMenu, setShouldRenderMenu] = useState(false);
	const [mounted, setMounted] = useState(false);
	const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		setMounted(true);

		return () => {
			if (closeTimeoutRef.current) {
				clearTimeout(closeTimeoutRef.current);
			}
		};
	}, []);

	useEffect(() => {
		document.body.style.overflow = shouldRenderMenu ? "hidden" : "";

		return () => {
			document.body.style.overflow = "";
		};
	}, [shouldRenderMenu]);

	useEffect(() => {
		function handleResize() {
			if (window.innerWidth >= 768) {
				closeMenu();
			}
		}

		handleResize();

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const openMenu = () => {
		if (closeTimeoutRef.current) {
			clearTimeout(closeTimeoutRef.current);
		}

		setShouldRenderMenu(true);

		requestAnimationFrame(() => {
			setIsMenuOpen(true);
		});
	};

	const closeMenu = () => {
		setIsMenuOpen(false);

		if (closeTimeoutRef.current) {
			clearTimeout(closeTimeoutRef.current);
		}

		closeTimeoutRef.current = setTimeout(() => {
			setShouldRenderMenu(false);
		}, MENU_ANIMATION_DURATION);
	};

	const menuOverlay =
		shouldRenderMenu && mounted
			? createPortal(
					<div
						className={`fixed inset-0 z-[99999] overflow-hidden bg-[#F7F1E6] text-[#342312] transition-opacity duration-300 ease-out md:hidden ${
							isMenuOpen ? "opacity-100" : "opacity-0"
						}`}
					>
						<div
							className={`flex h-dvh w-full max-w-full flex-col overflow-x-hidden overflow-y-auto bg-[#F7F1E6] transition-transform duration-300 ease-out ${
								isMenuOpen ? "translate-x-0" : "translate-x-4"
							}`}
						>
							<div className="flex min-h-[88px] items-center justify-between gap-3 border-b border-[#E7D0AF]/55 px-4 sm:min-h-[92px] sm:px-5">
								<LocaleLink
									href="/"
									className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden"
									onClick={closeMenu}
								>
									{brandLogo ? (
										<img
											src={brandLogo}
											alt={brandCompanyName || "Logo"}
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
									type="button"
									aria-label="Close menu"
									onClick={closeMenu}
									className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#F7F1E6] p-0 text-[#A87E3C] shadow-[0_10px_24px_rgba(52,35,18,0.1)] transition-colors duration-300 hover:bg-[#E7D0AF]/35"
								>
									<Menu className="size-5" strokeWidth={2.5} />
								</button>
							</div>

							<div className="px-5 py-5">
								{searchPlaceholder ? (
									<div className="mb-5">
										<HeaderSearch
											locale={locale}
											placeholder={searchPlaceholder}
											variant="mobile"
											onNavigate={closeMenu}
										/>
									</div>
								) : null}

								<nav className="flex flex-col divide-y divide-[#E7D0AF]/50 font-heading">
									{navigation.map((item, index) => (
										<LocaleLink
											key={item.name}
											href={item.href}
											onClick={closeMenu}
											className={`py-4 text-[14px] font-bold uppercase tracking-[0.08em] text-[#342312] transition-all duration-300 hover:text-[#A87E3C] ${
												isMenuOpen
													? "translate-y-0 opacity-100"
													: "translate-y-2 opacity-0"
											}`}
											style={{
												transitionDelay: isMenuOpen
													? `${70 + index * 30}ms`
													: "0ms",
											}}
										>
											{item.name}
										</LocaleLink>
									))}
								</nav>

								<div
									className={`pt-5 font-heading transition-all duration-300 ${
										isMenuOpen
											? "translate-y-0 opacity-100"
											: "translate-y-2 opacity-0"
									}`}
									style={{
										transitionDelay: isMenuOpen ? "240ms" : "0ms",
									}}
								>
									<LanguageSwitcher currentLang={locale} />
								</div>
							</div>

							<div
								className={`mt-auto border-t border-[#E7D0AF]/55 px-5 py-5 transition-all duration-300 ${
									isMenuOpen
										? "translate-y-0 opacity-100"
										: "translate-y-3 opacity-0"
								}`}
								style={{
									transitionDelay: isMenuOpen ? "280ms" : "0ms",
								}}
							>
								{phone || email ? (
									<div className="space-y-3.5">
										{phone ? (
											<a
												href={`tel:${phone.replace(/[^\d+]/g, "")}`}
												className="flex items-center gap-3.5 font-heading text-[#342312] transition-colors hover:text-[#A87E3C]"
											>
												<Phone
													className="size-[18px] shrink-0 text-[#A87E3C]"
													strokeWidth={2.2}
												/>

												<span className="text-[15px] font-semibold">
													{phone}
												</span>
											</a>
										) : null}

										{email ? (
											<a
												href={`mailto:${email}`}
												className="flex items-center gap-3.5 font-heading text-[#342312] transition-colors hover:text-[#A87E3C]"
											>
												<Mail
													className="size-[18px] shrink-0 text-[#A87E3C]"
													strokeWidth={2.2}
												/>

												<span className="break-all text-[15px] font-semibold">
													{email}
												</span>
											</a>
										) : null}
									</div>
								) : null}

								<button
									type="button"
									aria-label="Close menu"
									onClick={closeMenu}
									className="mt-5 inline-flex h-10 w-24 items-center justify-center rounded-2xl bg-[#342312] text-[#E7D0AF] shadow-[0_12px_28px_rgba(52,35,18,0.18)] transition-colors duration-300 hover:bg-[#A87E3C] hover:text-[#F7F1E6]"
								>
									<ChevronsRight className="size-5" strokeWidth={2.4} />
								</button>
							</div>
						</div>
					</div>,
					document.body,
				)
			: null;

	return (
		<>
			<button
				type="button"
				aria-label="Open menu"
				onClick={openMenu}
				className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#F7F1E6] p-0 text-[#A87E3C] shadow-[0_10px_24px_rgba(52,35,18,0.1)] transition-colors duration-300 hover:bg-[#E7D0AF]/35 md:hidden"
			>
				<Menu className="size-5" strokeWidth={2.5} />
			</button>

			{menuOverlay}
		</>
	);
}
