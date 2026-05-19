"use client";

import { type ReactNode, useEffect } from "react";
import { createReducerContext } from "src/contexts/createReducerContext";
import {
	type ProjectFilterAction,
	ProjectFilterActionType,
	type ProjectFilterState,
} from "./project-filter.type";

const initialState: ProjectFilterState = {
	selectedCategory: null, // null means "All"
};

function projectFilterReducer(
	state: ProjectFilterState,
	action: ProjectFilterAction,
): ProjectFilterState {
	switch (action.type) {
		case ProjectFilterActionType.SetCategory:
			return { ...state, selectedCategory: action.payload };

		default:
			return state;
	}
}

const [RawProjectFilterProvider, useRawFilterState, useRawFilterDispatch] =
	createReducerContext(projectFilterReducer, initialState);

function ProjectFilterInitializer({
	selectedCategory,
}: {
	selectedCategory: string | null;
}) {
	const dispatch = useRawFilterDispatch();

	useEffect(() => {
		dispatch({
			type: ProjectFilterActionType.SetCategory,
			payload: selectedCategory,
		});
	}, [dispatch, selectedCategory]);

	return null;
}

export function ProjectFilterProvider({
	children,
	selectedCategory = null,
}: {
	children: ReactNode;
	selectedCategory?: string | null;
}) {
	return (
		<RawProjectFilterProvider>
			<ProjectFilterInitializer selectedCategory={selectedCategory} />
			{children}
		</RawProjectFilterProvider>
	);
}

export function useProjectFilterState() {
	const rawState = useRawFilterState();

	return {
		selectedCategory: rawState.selectedCategory,
		isAllSelected: rawState.selectedCategory === null,
	};
}

export function useProjectFilterActions() {
	const dispatch = useRawFilterDispatch();

	return {
		selectCategory: (category: string | null) =>
			dispatch({
				type: ProjectFilterActionType.SetCategory,
				payload: category,
			}),

		selectAll: () =>
			dispatch({
				type: ProjectFilterActionType.SetCategory,
				payload: null,
			}),
	};
}