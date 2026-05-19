"use client";

import { createReducerContext } from "src/contexts/createReducerContext";

export interface ProjectCategoryRowState {
	isPreviewDialogOpen: boolean;
	isEditDialogOpen: boolean;
}

export type ProjectCategoryRowAction =
	| { type: "OPEN_PREVIEW_DIALOG" }
	| { type: "CLOSE_PREVIEW_DIALOG" }
	| { type: "OPEN_EDIT_DIALOG" }
	| { type: "CLOSE_EDIT_DIALOG" };

const initialState: ProjectCategoryRowState = {
	isPreviewDialogOpen: false,
	isEditDialogOpen: false,
};

function projectCategoryRowReducer(
	state: ProjectCategoryRowState,
	action: ProjectCategoryRowAction,
): ProjectCategoryRowState {
	switch (action.type) {
		case "OPEN_PREVIEW_DIALOG":
			return {
				...state,
				isPreviewDialogOpen: true,
				isEditDialogOpen: false,
			};
		case "CLOSE_PREVIEW_DIALOG":
			return {
				...state,
				isPreviewDialogOpen: false,
			};
		case "OPEN_EDIT_DIALOG":
			return {
				...state,
				isPreviewDialogOpen: false,
				isEditDialogOpen: true,
			};
		case "CLOSE_EDIT_DIALOG":
			return {
				...state,
				isEditDialogOpen: false,
			};
		default:
			return state;
	}
}

const [
	ProjectCategoryRowProvider,
	useRawProjectCategoryRowState,
	useRawProjectCategoryRowDispatch,
] = createReducerContext(projectCategoryRowReducer, initialState);

export function useOpenPreviewDialog() {
	const state = useRawProjectCategoryRowState();
	return state.isPreviewDialogOpen;
}

export function useOpenEditDialog() {
	const state = useRawProjectCategoryRowState();
	return state.isEditDialogOpen;
}

export function useProjectCategoryRowActions() {
	const dispatch = useRawProjectCategoryRowDispatch();

	return {
		openPreviewDialog: () => dispatch({ type: "OPEN_PREVIEW_DIALOG" }),
		closePreviewDialog: () => dispatch({ type: "CLOSE_PREVIEW_DIALOG" }),
		openEditDialog: () => dispatch({ type: "OPEN_EDIT_DIALOG" }),
		closeEditDialog: () => dispatch({ type: "CLOSE_EDIT_DIALOG" }),
	};
}

export { ProjectCategoryRowProvider };