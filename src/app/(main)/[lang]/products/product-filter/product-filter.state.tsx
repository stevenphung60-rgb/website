"use client";

import { type ReactNode, useEffect } from "react";
import { createReducerContext } from "src/contexts/createReducerContext";
import {
	type ProductFilterAction,
	ProductFilterActionType,
	type ProductFilterState,
} from "./product-filter.type";

const initialState: ProductFilterState = {
	selectedCategory: null,
};

function productFilterReducer(
	state: ProductFilterState,
	action: ProductFilterAction,
): ProductFilterState {
	switch (action.type) {
		case ProductFilterActionType.SetCategory:
			return { ...state, selectedCategory: action.payload };

		default:
			return state;
	}
}

const [RawProductFilterProvider, useRawFilterState, useRawFilterDispatch] =
	createReducerContext(productFilterReducer, initialState);

function ProductFilterInitializer({
	selectedCategory,
}: {
	selectedCategory: string | null;
}) {
	const dispatch = useRawFilterDispatch();

	useEffect(() => {
		dispatch({
			type: ProductFilterActionType.SetCategory,
			payload: selectedCategory,
		});
	}, [dispatch, selectedCategory]);

	return null;
}

export function ProductFilterProvider({
	children,
	selectedCategory = null,
}: {
	children: ReactNode;
	selectedCategory?: string | null;
}) {
	return (
		<RawProductFilterProvider>
			<ProductFilterInitializer selectedCategory={selectedCategory} />
			{children}
		</RawProductFilterProvider>
	);
}

export function useProductFilterState() {
	const rawState = useRawFilterState();

	return {
		selectedCategory: rawState.selectedCategory,
		isAllSelected: rawState.selectedCategory === null,
	};
}

export function useProductFilterActions() {
	const dispatch = useRawFilterDispatch();

	return {
		selectCategory: (category: string | null) =>
			dispatch({
				type: ProductFilterActionType.SetCategory,
				payload: category,
			}),

		selectAll: () =>
			dispatch({
				type: ProductFilterActionType.SetCategory,
				payload: null,
			}),
	};
}