"use client";

import { useEffect, useState } from "react";

export function HeaderScrollShell({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isHidden, setIsHidden] = useState(false);

	useEffect(() => {
		let lastScrollY = window.scrollY;

		function handleScroll() {
			const currentScrollY = window.scrollY;
			const isDesktop = window.matchMedia("(min-width: 768px)").matches;

			if (!isDesktop) {
				setIsHidden(false);
				lastScrollY = currentScrollY;
				return;
			}

			if (currentScrollY < 80) {
				setIsHidden(false);
				lastScrollY = currentScrollY;
				return;
			}

			const scrollingDown = currentScrollY > lastScrollY;

			setIsHidden(scrollingDown);
			lastScrollY = currentScrollY;
		}

		handleScroll();

		window.addEventListener("scroll", handleScroll, { passive: true });
		window.addEventListener("resize", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleScroll);
		};
	}, []);

	return (
		<div
			className={`sticky top-0 z-50 transition-transform duration-300 ease-out ${
				isHidden ? "md:-translate-y-full" : "translate-y-0"
			}`}
		>
			{children}
		</div>
	);
}