"use client";

import { createContext, useContext } from "react";

interface ProjectVisibilityContextValue {
	registerProject: (id: string, categoryId: string | null) => void;
	isVisible: (id: string) => boolean;
	hasMore: boolean;
	isReady: boolean;
	currentPage: number;
	totalPages: number;
	goToPage: (page: number) => void;
}

const ProjectVisibilityContext =
	createContext<ProjectVisibilityContextValue | null>(null);

export function useProjectVisibility() {
	const context = useContext(ProjectVisibilityContext);

	if (!context) {
		throw new Error("useProjectVisibility must be used within ProjectVisibilityProvider");
	}

	return context;
}

export { ProjectVisibilityContext };