"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function SplashScreen() {
	return (
		<motion.div
			initial={{ opacity: 1 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{
				duration: 0.75,
				ease: [0.22, 1, 0.36, 1],
			}}
			className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-[#342312]"
		>
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(231,208,175,0.08),transparent_36%,rgba(0,0,0,0.22))]" />
			<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#E7D0AF]/20" />
			<div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[#E7D0AF]/14" />

			<motion.div
				initial={{ opacity: 0, y: 14 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -12 }}
				transition={{
					duration: 0.9,
					ease: [0.22, 1, 0.36, 1],
				}}
				className="relative z-10 flex flex-col items-center px-8"
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.94 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.97 }}
					transition={{
						duration: 1,
						ease: [0.22, 1, 0.36, 1],
					}}
					className="relative"
				>
					<Image
						src="/nghiep_hung_logo_no_bg.svg"
						alt="Nghiệp Hưng Logo"
						width={224}
						height={224}
						priority
						className="h-24 w-24 drop-shadow-2xl sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-48 lg:w-48"
					/>
				</motion.div>

				<div className="mt-8 h-px w-[132px] overflow-hidden bg-[#E7D0AF]/18 sm:w-[172px] md:w-[220px]">
					<motion.div
						initial={{ x: "-100%" }}
						animate={{ x: "115%" }}
						transition={{
							duration: 1.75,
							ease: [0.65, 0, 0.35, 1],
							repeat: Infinity,
							repeatDelay: 0.18,
						}}
						className="h-full w-1/2 bg-[#E7D0AF]"
					/>
				</div>
			</motion.div>
		</motion.div>
	);
}