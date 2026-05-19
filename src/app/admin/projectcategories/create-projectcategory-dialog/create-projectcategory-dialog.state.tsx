"use client";

import type { ReactNode } from "react";

interface ProjectCategoryDialogProviderProps {
	children: ReactNode;
}

export function ProjectCategoryDialogProvider({ children }: ProjectCategoryDialogProviderProps) {
	return <>{children}</>;
}