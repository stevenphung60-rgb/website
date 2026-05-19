"use client";

import { AnimatePresence } from "framer-motion";
import { type ReactNode, useEffect, useState } from "react";
import SplashScreen from "src/components/splash-screen";

interface SplashScreenProviderProps {
	children: ReactNode;
}

const MIN_SPLASH_DURATION = 2100;
const READY_FALLBACK_DURATION = 2700;

export default function SplashScreenProvider({
	children,
}: SplashScreenProviderProps) {
	const [minimumTimeDone, setMinimumTimeDone] = useState(false);
	const [pageReady, setPageReady] = useState(false);
	const [showSplash, setShowSplash] = useState(true);

	useEffect(() => {
		const minTimer = window.setTimeout(() => {
			setMinimumTimeDone(true);
		}, MIN_SPLASH_DURATION);

		const fallbackTimer = window.setTimeout(() => {
			setPageReady(true);
		}, READY_FALLBACK_DURATION);

		return () => {
			window.clearTimeout(minTimer);
			window.clearTimeout(fallbackTimer);
		};
	}, []);

	useEffect(() => {
		if (document.readyState === "complete") {
			const readyTimer = window.setTimeout(() => {
				setPageReady(true);
			}, 220);

			return () => {
				window.clearTimeout(readyTimer);
			};
		}

		const handleLoad = () => {
			window.setTimeout(() => {
				setPageReady(true);
			}, 220);
		};

		window.addEventListener("load", handleLoad);

		return () => {
			window.removeEventListener("load", handleLoad);
		};
	}, []);

	useEffect(() => {
		if (minimumTimeDone && pageReady) {
			setShowSplash(false);
		}
	}, [minimumTimeDone, pageReady]);

	useEffect(() => {
		if (showSplash) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [showSplash]);

	return (
		<>
			{children}

			<AnimatePresence mode="wait">
				{showSplash ? <SplashScreen key="splash-screen" /> : null}
			</AnimatePresence>
		</>
	);
}