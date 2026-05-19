"use client";

import { type ReactNode, useEffect } from "react";
import { useProductVisibility } from "./product-visibility";

interface ProductCardWrapperProps {
	id: string;
	categoryId: string | null;
	children: ReactNode;
}

export function ProductCardWrapper({
	id,
	categoryId,
	children,
}: ProductCardWrapperProps) {
	const { registerProduct, isVisible, animationKey, getAnimationDelay } =
		useProductVisibility();

	useEffect(() => {
		registerProduct(id, categoryId);
	}, [id, categoryId, registerProduct]);

	if (!isVisible(id)) return null;

	return (
		<div className="overflow-visible">
			<div
				key={`${id}-${animationKey}`}
				className="h-full animate-product-row-reveal overflow-visible opacity-0 will-change-transform"
				style={{
					animationDelay: `${getAnimationDelay(id)}ms`,
					animationDuration: "780ms",
					animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
					animationFillMode: "forwards",
				}}
			>
				{children}
			</div>
		</div>
	);
}