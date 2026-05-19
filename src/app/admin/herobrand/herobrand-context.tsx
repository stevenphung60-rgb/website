"use client";

import { createReducerContext } from "src/contexts/createReducerContext";
import type { HeroBrandInfo, HeroBrandLogo } from "./herobrand.type";

interface HeroBrandState {
	heroBrandInfo: HeroBrandInfo;
}

type HeroBrandAction =
	| { type: "SET_HEROBRAND_INFO"; payload: { heroBrandInfo: HeroBrandInfo } }
	| { type: "SET_LOGO"; payload: { logo: HeroBrandLogo } }
	| { type: "REMOVE_LOGO" }
	| { type: "UPDATE_COMPANY_NAME_EN"; payload: { en: string } }
	| { type: "UPDATE_COMPANY_NAME_VI"; payload: { vi: string } };

const initialHeroBrandInfo: HeroBrandInfo = {
	logo: {
		url: "",
	},
	companyName: {
		en: "",
		vi: "",
	},
};

const initialState: HeroBrandState = {
	heroBrandInfo: initialHeroBrandInfo,
};

function normalizeHeroBrandInfo(heroBrandInfo?: HeroBrandInfo): HeroBrandInfo {
	return {
		logo: {
			url: heroBrandInfo?.logo?.url ?? "",
		},
		companyName: {
			en: heroBrandInfo?.companyName?.en ?? "",
			vi: heroBrandInfo?.companyName?.vi ?? "",
		},
	};
}

function heroBrandReducer(
	state: HeroBrandState,
	action: HeroBrandAction,
): HeroBrandState {
	switch (action.type) {
		case "SET_HEROBRAND_INFO":
			return {
				...state,
				heroBrandInfo: normalizeHeroBrandInfo(action.payload.heroBrandInfo),
			};

		case "SET_LOGO":
			return {
				...state,
				heroBrandInfo: {
					...state.heroBrandInfo,
					logo: action.payload.logo,
				},
			};

		case "REMOVE_LOGO":
			return {
				...state,
				heroBrandInfo: {
					...state.heroBrandInfo,
					logo: {
						url: "",
					},
				},
			};

		case "UPDATE_COMPANY_NAME_EN":
			return {
				...state,
				heroBrandInfo: {
					...state.heroBrandInfo,
					companyName: {
						...state.heroBrandInfo.companyName,
						en: action.payload.en,
					},
				},
			};

		case "UPDATE_COMPANY_NAME_VI":
			return {
				...state,
				heroBrandInfo: {
					...state.heroBrandInfo,
					companyName: {
						...state.heroBrandInfo.companyName,
						vi: action.payload.vi,
					},
				},
			};

		default:
			return state;
	}
}

const [HeroBrandProviderBase, useHeroBrandStateRaw, useHeroBrandDispatch] =
	createReducerContext(heroBrandReducer, initialState);

export function HeroBrandProvider({
	children,
	heroBrandInfo = initialHeroBrandInfo,
}: {
	children: React.ReactNode;
	heroBrandInfo?: HeroBrandInfo;
}) {
	return (
		<HeroBrandProviderBase heroBrandInfo={normalizeHeroBrandInfo(heroBrandInfo)}>
			{children}
		</HeroBrandProviderBase>
	);
}

export function useHeroBrandInfo() {
	const state = useHeroBrandStateRaw();

	return normalizeHeroBrandInfo(state.heroBrandInfo);
}

export function useLogo() {
	const state = useHeroBrandStateRaw();
	const dispatch = useHeroBrandDispatch();

	return {
		logo: state.heroBrandInfo.logo,
		setLogo: (logo: HeroBrandLogo) => {
			dispatch({
				type: "SET_LOGO",
				payload: { logo },
			});
		},
		removeLogo: () => {
			dispatch({
				type: "REMOVE_LOGO",
			});
		},
	};
}

export function useCompanyName() {
	const state = useHeroBrandStateRaw();
	const dispatch = useHeroBrandDispatch();

	return {
		companyName: state.heroBrandInfo.companyName,
		updateCompanyNameEn: (en: string) => {
			dispatch({
				type: "UPDATE_COMPANY_NAME_EN",
				payload: { en },
			});
		},
		updateCompanyNameVi: (vi: string) => {
			dispatch({
				type: "UPDATE_COMPANY_NAME_VI",
				payload: { vi },
			});
		},
	};
}

export function useHeroBrandActions() {
	const dispatch = useHeroBrandDispatch();

	return {
		setHeroBrandInfo: (heroBrandInfo: HeroBrandInfo) => {
			dispatch({
				type: "SET_HEROBRAND_INFO",
				payload: { heroBrandInfo },
			});
		},
	};
}

export function useHeroBrand() {
	const heroBrandInfo = useHeroBrandInfo();
	const actions = useHeroBrandActions();

	return {
		heroBrandInfo,
		actions,
	};
}