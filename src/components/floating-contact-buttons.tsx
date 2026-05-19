"use client";

import { Phone, Facebook } from "lucide-react";

interface Props {
	phone?: string;
	facebook?: string;
}

export function FloatingContactButtons({ phone, facebook }: Props) {
	return (
		<div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">

			{/* FACEBOOK (không rung) */}
			{facebook && (
				<a
					href={facebook}
					target="_blank"
					rel="noopener noreferrer"
					className="
						flex items-center justify-center
						w-14 h-14 rounded-full
						bg-[#342312] text-[#E7D0AF]
						shadow-lg
						hover:scale-110 hover:shadow-xl
						transition-all duration-300
					"
				>
					<Facebook className="w-6 h-6" />
				</a>
			)}

			{/* PHONE (icon rung) */}
			{phone && (
				<a
					href={`tel:${phone}`}
					className="
						flex items-center justify-center
						w-14 h-14 rounded-full
						bg-[#342312] text-[#E7D0AF]
						shadow-lg
						hover:scale-110 hover:shadow-xl
						transition-all duration-300
					"
				>
					<Phone className="w-6 h-6 animate-shake hover:animate-none" />
				</a>
			)}

		</div>
	);
}