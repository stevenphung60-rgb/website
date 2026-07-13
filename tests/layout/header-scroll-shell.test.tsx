import { act, fireEvent, render, screen } from "@testing-library/react";
import { HeaderScrollShell } from "src/app/(main)/[lang]/layout/header-scroll-shell";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let mockedScrollY = 0;
let mockedViewportWidth = 390;

async function setScrollY(value: number) {
	mockedScrollY = value;

	await act(async () => {
		fireEvent.scroll(window);
		await Promise.resolve();
	});
}

function getShell() {
	const content = screen.getByText("Header content");
	const shell = content.parentElement;

	if (!shell) throw new Error("Header scroll shell was not rendered");

	return shell;
}

describe("HeaderScrollShell", () => {
	beforeEach(() => {
		let nextAnimationFrameId = 1;

		mockedScrollY = 0;
		mockedViewportWidth = 390;

		Object.defineProperty(window, "scrollY", {
			configurable: true,
			get: () => mockedScrollY,
		});

		Object.defineProperty(window, "matchMedia", {
			configurable: true,
			value: vi.fn((query: string) => ({
				matches: query === "(min-width: 768px)" && mockedViewportWidth >= 768,
				media: query,
				onchange: null,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				addListener: vi.fn(),
				removeListener: vi.fn(),
				dispatchEvent: vi.fn(),
			})),
		});

		vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
			const animationFrameId = nextAnimationFrameId;
			nextAnimationFrameId += 1;

			queueMicrotask(() => callback(0));

			return animationFrameId;
		});
		vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("hides on mobile after scrolling down and reveals after scrolling up", async () => {
		mockedScrollY = 100;

		render(
			<HeaderScrollShell>
				<div>Header content</div>
			</HeaderScrollShell>,
		);

		const shell = getShell();

		await setScrollY(108);
		expect(shell).toHaveClass("translate-y-0");

		await setScrollY(116);
		expect(shell).toHaveClass("-translate-y-full");

		await setScrollY(112);
		expect(shell).toHaveClass("-translate-y-full");

		await setScrollY(108);
		expect(shell).toHaveClass("translate-y-0");
	});

	it("always reveals the mobile header near the top of the page", async () => {
		mockedScrollY = 100;

		render(
			<HeaderScrollShell>
				<div>Header content</div>
			</HeaderScrollShell>,
		);

		const shell = getShell();

		await setScrollY(120);
		expect(shell).toHaveClass("-translate-y-full");

		await setScrollY(40);
		expect(shell).toHaveClass("translate-y-0");
	});

	it("preserves the existing immediate direction behavior on desktop", async () => {
		mockedViewportWidth = 1024;
		mockedScrollY = 100;

		render(
			<HeaderScrollShell>
				<div>Header content</div>
			</HeaderScrollShell>,
		);

		const shell = getShell();

		await setScrollY(101);
		expect(shell).toHaveClass("-translate-y-full");

		await setScrollY(100);
		expect(shell).toHaveClass("translate-y-0");
	});
});
