"use client";

import { createReducerContext } from "src/contexts/createReducerContext";
import type { HeroServiceImage, HeroServiceInfo } from "./heroservice.type";

interface HeroServiceState {
	heroServiceInfo: HeroServiceInfo;
}

type HeroServiceAction =
	| { type: "SET_HEROSERVICE_INFO"; payload: { heroServiceInfo: HeroServiceInfo } }
	| { type: "UPDATE_TITLE_EN"; payload: { en: string } }
	| { type: "UPDATE_TITLE_VI"; payload: { vi: string } }
	| { type: "UPDATE_DESCRIPTION_EN"; payload: { en: string } }
	| { type: "UPDATE_DESCRIPTION_VI"; payload: { vi: string } }
	| { type: "SET_GALLERY"; payload: { gallery: HeroServiceImage[] } }
	| { type: "ADD_GALLERY_IMAGE"; payload: { image: HeroServiceImage } }
	| { type: "REMOVE_GALLERY_IMAGE"; payload: { url: string } };

const initialHeroServiceInfo: HeroServiceInfo = {
	title: {
		en: "",
		vi: "",
	},
	description: {
		en: "",
		vi: "",
	},
	gallery: [],
};

const initialState: HeroServiceState = {
	heroServiceInfo: initialHeroServiceInfo,
};

function heroServiceReducer(state: HeroServiceState, action: HeroServiceAction): HeroServiceState {
	switch (action.type) {
		case "SET_HEROSERVICE_INFO":
			return {
				...state,
				heroServiceInfo: action.payload.heroServiceInfo,
			};

		case "UPDATE_TITLE_EN":
			return {
				...state,
				heroServiceInfo: {
					...state.heroServiceInfo,
					title: {
						...state.heroServiceInfo.title,
						en: action.payload.en,
					},
				},
			};

		case "UPDATE_TITLE_VI":
			return {
				...state,
				heroServiceInfo: {
					...state.heroServiceInfo,
					title: {
						...state.heroServiceInfo.title,
						vi: action.payload.vi,
					},
				},
			};

		case "UPDATE_DESCRIPTION_EN":
			return {
				...state,
				heroServiceInfo: {
					...state.heroServiceInfo,
					description: {
						...state.heroServiceInfo.description,
						en: action.payload.en,
					},
				},
			};

		case "UPDATE_DESCRIPTION_VI":
			return {
				...state,
				heroServiceInfo: {
					...state.heroServiceInfo,
					description: {
						...state.heroServiceInfo.description,
						vi: action.payload.vi,
					},
				},
			};

		case "SET_GALLERY":
			return {
				...state,
				heroServiceInfo: {
					...state.heroServiceInfo,
					gallery: action.payload.gallery,
				},
			};

		case "ADD_GALLERY_IMAGE":
			return {
				...state,
				heroServiceInfo: {
					...state.heroServiceInfo,
					gallery: [...state.heroServiceInfo.gallery, action.payload.image],
				},
			};

		case "REMOVE_GALLERY_IMAGE":
			return {
				...state,
				heroServiceInfo: {
					...state.heroServiceInfo,
					gallery: state.heroServiceInfo.gallery
						.filter((image) => image.url !== action.payload.url)
						.map((image, index) => ({
							...image,
							order: index,
						})),
				},
			};

		default:
			return state;
	}
}

const [HeroServiceProviderBase, useHeroServiceStateRaw, useHeroServiceDispatch] = createReducerContext(
	heroServiceReducer,
	initialState,
);

export function HeroServiceProvider({
	children,
	heroServiceInfo = initialHeroServiceInfo,
}: {
	children: React.ReactNode;
	heroServiceInfo?: HeroServiceInfo;
}) {
	return <HeroServiceProviderBase heroServiceInfo={heroServiceInfo}>{children}</HeroServiceProviderBase>;
}

export function useHeroServiceInfo() {
	const state = useHeroServiceStateRaw();
	return state.heroServiceInfo;
}

export function useTitle() {
	const state = useHeroServiceStateRaw();
	const dispatch = useHeroServiceDispatch();

	return {
		title: state.heroServiceInfo.title,
		updateTitleEn: (en: string) => {
			dispatch({ type: "UPDATE_TITLE_EN", payload: { en } });
		},
		updateTitleVi: (vi: string) => {
			dispatch({ type: "UPDATE_TITLE_VI", payload: { vi } });
		},
	};
}

export function useDescription() {
	const state = useHeroServiceStateRaw();
	const dispatch = useHeroServiceDispatch();

	return {
		description: state.heroServiceInfo.description,
		updateDescriptionEn: (en: string) => {
			dispatch({ type: "UPDATE_DESCRIPTION_EN", payload: { en } });
		},
		updateDescriptionVi: (vi: string) => {
			dispatch({ type: "UPDATE_DESCRIPTION_VI", payload: { vi } });
		},
	};
}

export function useGallery() {
	const state = useHeroServiceStateRaw();
	const dispatch = useHeroServiceDispatch();

	return {
		gallery: state.heroServiceInfo.gallery,
		setGallery: (gallery: HeroServiceImage[]) => {
			dispatch({ type: "SET_GALLERY", payload: { gallery } });
		},
		addGalleryImage: (image: HeroServiceImage) => {
			dispatch({ type: "ADD_GALLERY_IMAGE", payload: { image } });
		},
		removeGalleryImage: (url: string) => {
			dispatch({ type: "REMOVE_GALLERY_IMAGE", payload: { url } });
		},
	};
}

export function useHeroServiceActions() {
	const dispatch = useHeroServiceDispatch();

	return {
		setHeroServiceInfo: (heroServiceInfo: HeroServiceInfo) => {
			dispatch({ type: "SET_HEROSERVICE_INFO", payload: { heroServiceInfo } });
		},
	};
}

export function useHeroService() {
	const heroServiceInfo = useHeroServiceInfo();
	const actions = useHeroServiceActions();

	return { heroServiceInfo, actions };
}