"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealVariant = "fade-up" | "fade-left" | "fade-right" | "zoom";

interface AboutRevealSectionProps {
	children: ReactNode;
	variant?: RevealVariant;
	delay?: number;
	className?: string;
	revealOnMount?: boolean;
}

const hiddenClassByVariant: Record<RevealVariant, string> = {
	"fade-up": "translate-y-10 opacity-0",
	"fade-left": "translate-x-10 opacity-0",
	"fade-right": "-translate-x-10 opacity-0",
	zoom: "scale-[0.98] opacity-0",
};

export default function AboutRevealSection({
	children,
	variant = "fade-up",
	delay = 0,
	className = "",
	revealOnMount = false,
}: AboutRevealSectionProps) {
	const sectionRef = useRef<HTMLDivElement | null>(null);
	const frameRef = useRef<number | null>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const section = sectionRef.current;

		if (!section) return;

		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (prefersReducedMotion) {
			setIsVisible(true);
			return;
		}

		const playOnMount = () => {
			setIsVisible(false);

			if (frameRef.current) {
				window.cancelAnimationFrame(frameRef.current);
			}

			frameRef.current = window.requestAnimationFrame(() => {
				frameRef.current = window.requestAnimationFrame(() => {
					setIsVisible(true);
				});
			});
		};

		if (revealOnMount) {
			playOnMount();
			window.addEventListener("pageshow", playOnMount);

			return () => {
				window.removeEventListener("pageshow", playOnMount);

				if (frameRef.current) {
					window.cancelAnimationFrame(frameRef.current);
				}
			};
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				setIsVisible(entry.isIntersecting);
			},
			{
				threshold: 0.12,
				rootMargin: "0px 0px -12% 0px",
			},
		);

		observer.observe(section);

		return () => {
			observer.disconnect();

			if (frameRef.current) {
				window.cancelAnimationFrame(frameRef.current);
			}
		};
	}, [revealOnMount]);

	return (
		<div
			ref={sectionRef}
			className={`transform-gpu transition-all duration-700 ease-out ${className} ${
				isVisible
					? "translate-x-0 translate-y-0 scale-100 opacity-100"
					: hiddenClassByVariant[variant]
			}`}
			style={{
				transitionDelay: `${delay}ms`,
			}}
		>
			{children}
		</div>
	);
}