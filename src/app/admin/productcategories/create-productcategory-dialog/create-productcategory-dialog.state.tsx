"use client";

import type { ReactNode } from "react";

interface ProductCategoryDialogProviderProps {
	children: ReactNode;
}

export function ProductCategoryDialogProvider({ children }: ProductCategoryDialogProviderProps) {
	return <>{children}</>;
}