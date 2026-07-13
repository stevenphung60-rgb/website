"use client";

import { useEffect, useState } from "react";

const TOP_REVEAL_OFFSET = 80;
const MOBILE_HIDE_DISTANCE = 16;
const MOBILE_SHOW_DISTANCE = 8;

export function HeaderScrollShell({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isHidden, setIsHidden] = useState(false);

	useEffect(() => {
		let lastScrollY = Math.max(window.scrollY, 0);
		let mobileScrollDistance = 0;
		let lastMobileDirection = 0;
		let animationFrameId: number | null = null;

		function updateHeaderVisibility() {
			const currentScrollY = Math.max(window.scrollY, 0);
			const scrollDelta = currentScrollY - lastScrollY;
			const isDesktop = window.matchMedia("(min-width: 768px)").matches;

			if (currentScrollY < TOP_REVEAL_OFFSET) {
				setIsHidden(false);
				mobileScrollDistance = 0;
				lastMobileDirection = 0;
				lastScrollY = currentScrollY;
				return;
			}

			if (isDesktop) {
				setIsHidden(scrollDelta > 0);
				mobileScrollDistance = 0;
				lastMobileDirection = 0;
				lastScrollY = currentScrollY;
				return;
			}

			const currentDirection = scrollDelta > 0 ? 1 : scrollDelta < 0 ? -1 : 0;

			if (currentDirection !== 0) {
				if (currentDirection !== lastMobileDirection) {
					mobileScrollDistance = 0;
					lastMobileDirection = currentDirection;
				}

				mobileScrollDistance += Math.abs(scrollDelta);

				const directionThreshold =
					currentDirection > 0 ? MOBILE_HIDE_DISTANCE : MOBILE_SHOW_DISTANCE;

				if (mobileScrollDistance >= directionThreshold) {
					setIsHidden(currentDirection > 0);
					mobileScrollDistance = 0;
				}
			}

			lastScrollY = currentScrollY;
		}

		function handleScroll() {
			const isDesktop = window.matchMedia("(min-width: 768px)").matches;

			if (isDesktop) {
				updateHeaderVisibility();
				return;
			}

			if (animationFrameId !== null) return;

			animationFrameId = window.requestAnimationFrame(() => {
				animationFrameId = null;
				updateHeaderVisibility();
			});
		}

		function handleResize() {
			if (animationFrameId !== null) {
				window.cancelAnimationFrame(animationFrameId);
				animationFrameId = null;
			}

			lastScrollY = Math.max(window.scrollY, 0);
			mobileScrollDistance = 0;
			lastMobileDirection = 0;
			setIsHidden(false);
		}

		updateHeaderVisibility();

		window.addEventListener("scroll", handleScroll, { passive: true });
		window.addEventListener("resize", handleResize);

		return () => {
			if (animationFrameId !== null) {
				window.cancelAnimationFrame(animationFrameId);
			}

			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<div
			className={`sticky top-0 z-50 transition-transform duration-300 ease-out ${
				isHidden ? "-translate-y-full" : "translate-y-0"
			}`}
		>
			{children}
		</div>
	);
}
