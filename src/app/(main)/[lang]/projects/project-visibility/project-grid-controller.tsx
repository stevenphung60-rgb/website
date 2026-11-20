"use client";

import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useState,
} from "react";
import { useProjectFilterState } from "../project-filter/project-filter.state";
import { ProjectVisibilityContext } from "./project-visibility.state";

/** Two full rows of the 4-column desktop grid; divides evenly into 1 and 2 columns too */
const PAGE_SIZE = 8;

interface ProjectGridControllerProps {
	projectIds: string[];
	limitRows?: boolean;
	children: React.ReactNode;
}

/**
 * Client component that manages project visibility based on:
 * - Filter state selected categoryId
 * - Pagination, 8 projects per page
 *
 * Cards register themselves when they load, and visibility is recalculated.
 */
export function ProjectGridController({
	projectIds,
	limitRows = true,
	children,
}: ProjectGridControllerProps) {
	const { selectedCategory } = useProjectFilterState();
	const [isReady, setIsReady] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [loadedProjects, setLoadedProjects] = useState<
		Map<string, string | null>
	>(new Map());

	useLayoutEffect(() => {
		setIsReady(true);
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: A category change must reset pagination even though its value is not read inside the effect.
	useEffect(() => {
		setCurrentPage(1);
	}, [selectedCategory]);

	const registerProject = useCallback((id: string, categoryId: string | null) => {
		setLoadedProjects((prev) => {
			if (prev.get(id) === categoryId) return prev;

			const next = new Map(prev);
			next.set(id, categoryId);
			return next;
		});
	}, []);

	const { visibleIds, hasMore, totalPages } = useMemo(() => {
		const filtered = projectIds.filter((id) => {
			if (!loadedProjects.has(id)) return false;

			const categoryId = loadedProjects.get(id) ?? null;

			if (selectedCategory === null) return true;

			return categoryId === selectedCategory;
		});

		if (!limitRows) {
			return {
				visibleIds: new Set(filtered),
				hasMore: false,
				totalPages: 1,
			};
		}

		const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
		const safePage = Math.min(currentPage, pageCount);
		const startIndex = (safePage - 1) * PAGE_SIZE;
		const visible = new Set(filtered.slice(startIndex, startIndex + PAGE_SIZE));

		return {
			visibleIds: visible,
			hasMore: pageCount > 1,
			totalPages: pageCount,
		};
	}, [
		projectIds,
		loadedProjects,
		selectedCategory,
		limitRows,
		currentPage,
	]);

	useEffect(() => {
		setCurrentPage((previousPage) =>
			Math.min(Math.max(previousPage, 1), totalPages),
		);
	}, [totalPages]);

	const goToPage = useCallback(
		(page: number) => {
			setCurrentPage(Math.min(Math.max(page, 1), totalPages));
		},
		[totalPages],
	);

	const isVisible = useCallback((id: string) => visibleIds.has(id), [visibleIds]);

	const contextValue = useMemo(
		() => ({
			registerProject,
			isVisible,
			hasMore,
			isReady,
			currentPage,
			totalPages,
			goToPage,
		}),
		[
			registerProject,
			isVisible,
			hasMore,
			isReady,
			currentPage,
			totalPages,
			goToPage,
		],
	);

	return (
		<ProjectVisibilityContext.Provider value={contextValue}>
			<div style={{ visibility: isReady ? "visible" : "hidden" }}>
				{children}
			</div>
		</ProjectVisibilityContext.Provider>
	);
}
