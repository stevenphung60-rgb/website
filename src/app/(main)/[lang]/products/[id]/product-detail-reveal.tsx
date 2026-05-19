"use client";

import type { ReactNode } from "react";

interface ProductDetailRevealProps {
	children: ReactNode;
}

export function ProductDetailReveal({ children }: ProductDetailRevealProps) {
	return (
		<div className="animate-product-detail-reveal">
			{children}
		</div>
	);
}