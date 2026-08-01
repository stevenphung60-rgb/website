import { act, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import type { HeaderNavigationItem } from "src/app/(main)/[lang]/layout/header-navigation.types";
import { MobileHeader } from "src/app/(main)/[lang]/layout/mobile-header";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const navigationMocks = vi.hoisted(() => ({
	pathname: "/vi",
}));

vi.mock("next/navigation", () => ({
	usePathname: () => navigationMocks.pathname,
}));

vi.mock("src/components/behaviors/LocaleLink", () => ({
	default: ({
		children,
		href,
		onClick,
		...props
	}: {
		children: ReactNode;
		href: string;
		onClick?: () => void;
		[key: string]: unknown;
	}) => (
		<a
			href={href}
			onClick={(event) => {
				event.preventDefault();
				onClick?.();
			}}
			{...props}
		>
			{children}
		</a>
	),
}));

vi.mock("src/components/language-toggle", () => ({
	LanguageSwitcher: () => <div data-testid="language-switcher">VI / EN</div>,
}));

vi.mock("src/app/(main)/[lang]/layout/header-search", () => ({
	HeaderSearch: ({ onNavigate }: { onNavigate?: () => void }) => (
		<button type="button" onClick={onNavigate}>
			Search result
		</button>
	),
}));

const navigation: HeaderNavigationItem[] = [
	{ name: "TRANG CH\u1ee6", href: "/" },
	{
		name: "S\u1ea2N PH\u1ea8M",
		href: "/products",
		children: [
			{ name: "\u1ed0NG GI\u00d3 CH\u1ed0NG CH\u00c1Y", href: "/products?category=fire" },
			{ name: "\u1ed0NG GI\u00d3 TI\u00caU CHU\u1ea8N", href: "/products?category=standard" },
		],
	},
	{
		name: "D\u1ecaCH V\u1ee4",
		href: "/services",
		children: [
			{ name: "THI\u1ebeT K\u1ebe H\u1ec6 TH\u1ed0NG", href: "/services/service-design" },
			{ name: "THI C\u00d4NG L\u1eaeP \u0110\u1eb6T", href: "/services/service-installation" },
		],
	},
	{
		name: "D\u1ef0 \u00c1N",
		href: "/projects",
		children: [{ name: "NH\u00c0 M\u00c1Y", href: "/projects?category=factory" }],
	},
	{ name: "BLOG", href: "/blog" },
];

function renderMobileHeader() {
	return render(
		<MobileHeader
			navigation={navigation}
			locale="vi"
			brandCompanyName={"NGHI\u1ec6P H\u01afNG"}
			searchPlaceholder={"T\u00ecm ki\u1ebfm"}
			viewAllText={"Xem t\u1ea5t c\u1ea3"}
		/>,
	);
}

describe("MobileHeader multilevel navigation", () => {
	beforeEach(() => {
		navigationMocks.pathname = "/vi";
		document.body.style.overflow = "";
		Object.defineProperty(window, "innerWidth", {
			configurable: true,
			value: 390,
			writable: true,
		});
		vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
			callback(0);
			return 1;
		});
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllGlobals();
		document.body.style.overflow = "";
	});

	it("opens one submenu at a time and keeps a link to each overview page", () => {
		renderMobileHeader();

		const openButton = screen.getByRole("button", { name: "M\u1edf menu" });
		fireEvent.click(openButton);

		expect(screen.getByRole("dialog", { name: "Menu ch\u00ednh" })).toBeInTheDocument();
		expect(document.body).toHaveStyle({ overflow: "hidden" });
		expect(openButton).toHaveAttribute("aria-expanded", "true");

		const productsButton = screen.getByRole("button", { name: "S\u1ea2N PH\u1ea8M" });
		const servicesButton = screen.getByRole("button", { name: "D\u1ecaCH V\u1ee4" });

		expect(productsButton).toHaveAttribute("aria-expanded", "false");
		fireEvent.click(productsButton);

		expect(productsButton).toHaveAttribute("aria-expanded", "true");
		expect(
			screen.getByRole("link", { name: "Xem t\u1ea5t c\u1ea3 s\u1ea3n ph\u1ea9m" }),
		).toHaveAttribute("href", "/products");
		expect(
			screen.getByRole("link", { name: "\u1ed0NG GI\u00d3 CH\u1ed0NG CH\u00c1Y" }),
		).toHaveAttribute("href", "/products?category=fire");

		fireEvent.click(servicesButton);

		expect(productsButton).toHaveAttribute("aria-expanded", "false");
		expect(servicesButton).toHaveAttribute("aria-expanded", "true");
		const serviceDetailLink = screen.getByRole("link", {
			name: "THI\u1ebeT K\u1ebe H\u1ec6 TH\u1ed0NG",
		});
		expect(serviceDetailLink).toHaveAttribute("href", "/services/service-design");
		expect(serviceDetailLink.querySelector("svg")).toBeNull();
	});

	it("opens the current section automatically and closes after navigating", () => {
		vi.useFakeTimers();
		navigationMocks.pathname = "/vi/projects/project-1";
		renderMobileHeader();

		fireEvent.click(screen.getByRole("button", { name: "M\u1edf menu" }));

		const projectsButton = screen.getByRole("button", { name: "D\u1ef0 \u00c1N" });
		expect(projectsButton).toHaveAttribute("aria-expanded", "true");

		fireEvent.click(screen.getByRole("link", { name: "NH\u00c0 M\u00c1Y" }));

		act(() => {
			vi.advanceTimersByTime(220);
		});

		expect(screen.queryByRole("dialog", { name: "Menu ch\u00ednh" })).not.toBeInTheDocument();
		expect(document.body).toHaveStyle({ overflow: "" });
		expect(screen.getByRole("button", { name: "M\u1edf menu" })).not.toHaveFocus();
	});

	it("traps keyboard focus and restores it after closing with Escape", () => {
		vi.useFakeTimers();
		renderMobileHeader();

		fireEvent.click(screen.getByRole("button", { name: "M\u1edf menu" }));
		act(() => {
			vi.advanceTimersByTime(20);
		});

		const closeButton = screen.getByRole("button", { name: "\u0110\u00f3ng menu" });
		const firstFocusableElement = screen.getByRole("link", { name: "NGHI\u1ec6P H\u01afNG" });
		const lastNavigationLink = screen.getByRole("link", { name: "BLOG" });

		expect(closeButton).toHaveFocus();

		firstFocusableElement.focus();
		fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
		expect(lastNavigationLink).toHaveFocus();

		fireEvent.keyDown(document, { key: "Tab" });
		expect(firstFocusableElement).toHaveFocus();

		fireEvent.keyDown(document, { key: "Escape" });

		act(() => {
			vi.advanceTimersByTime(220);
		});

		expect(screen.queryByRole("dialog", { name: "Menu ch\u00ednh" })).not.toBeInTheDocument();
		expect(document.body).toHaveStyle({ overflow: "" });
		expect(screen.getByRole("button", { name: "M\u1edf menu" })).toHaveFocus();
	});

	it("marks the current top-level location", () => {
		navigationMocks.pathname = "/vi/blog";
		renderMobileHeader();

		fireEvent.click(screen.getByRole("button", { name: "M\u1edf menu" }));

		expect(screen.getByRole("link", { name: "BLOG" })).toHaveAttribute("aria-current", "page");
	});

	it("closes the mobile overlay when the viewport changes to desktop", () => {
		vi.useFakeTimers();
		renderMobileHeader();

		fireEvent.click(screen.getByRole("button", { name: "M\u1edf menu" }));
		window.innerWidth = 1024;
		fireEvent.resize(window);

		act(() => {
			vi.advanceTimersByTime(220);
		});

		expect(screen.queryByRole("dialog", { name: "Menu ch\u00ednh" })).not.toBeInTheDocument();
		expect(document.body).toHaveStyle({ overflow: "" });
	});
});
