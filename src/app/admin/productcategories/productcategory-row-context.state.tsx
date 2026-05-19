"use client";

import { createReducerContext } from "src/contexts/createReducerContext";

export interface ProductCategoryRowState {
	isPreviewDialogOpen: boolean;
	isEditDialogOpen: boolean;
}

export type ProductCategoryRowAction =
	| { type: "OPEN_PREVIEW_DIALOG" }
	| { type: "CLOSE_PREVIEW_DIALOG" }
	| { type: "OPEN_EDIT_DIALOG" }
	| { type: "CLOSE_EDIT_DIALOG" };

const initialState: ProductCategoryRowState = {
	isPreviewDialogOpen: false,
	isEditDialogOpen: false,
};

function productCategoryRowReducer(
	state: ProductCategoryRowState,
	action: ProductCategoryRowAction,
): ProductCategoryRowState {
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
	ProductCategoryRowProvider,
	useRawProductCategoryRowState,
	useRawProductCategoryRowDispatch,
] = createReducerContext(productCategoryRowReducer, initialState);

export function useOpenPreviewDialog() {
	const state = useRawProductCategoryRowState();
	return state.isPreviewDialogOpen;
}

export function useOpenEditDialog() {
	const state = useRawProductCategoryRowState();
	return state.isEditDialogOpen;
}

export function useProductCategoryRowActions() {
	const dispatch = useRawProductCategoryRowDispatch();

	return {
		openPreviewDialog: () => dispatch({ type: "OPEN_PREVIEW_DIALOG" }),
		closePreviewDialog: () => dispatch({ type: "CLOSE_PREVIEW_DIALOG" }),
		openEditDialog: () => dispatch({ type: "OPEN_EDIT_DIALOG" }),
		closeEditDialog: () => dispatch({ type: "CLOSE_EDIT_DIALOG" }),
	};
}

export { ProductCategoryRowProvider };