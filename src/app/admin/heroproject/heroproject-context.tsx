"use client";

import { createReducerContext } from "src/contexts/createReducerContext";
import type { HeroProjectImage, HeroProjectInfo } from "./heroproject.type";

interface HeroProjectState {
	heroProjectInfo: HeroProjectInfo;
}

type HeroProjectAction =
	| { type: "SET_HEROPROJECT_INFO"; payload: { heroProjectInfo: HeroProjectInfo } }
	| { type: "UPDATE_TITLE_EN"; payload: { en: string } }
	| { type: "UPDATE_TITLE_VI"; payload: { vi: string } }
	| { type: "UPDATE_DESCRIPTION_EN"; payload: { en: string } }
	| { type: "UPDATE_DESCRIPTION_VI"; payload: { vi: string } }
	| { type: "SET_GALLERY"; payload: { gallery: HeroProjectImage[] } }
	| { type: "ADD_GALLERY_IMAGE"; payload: { image: HeroProjectImage } }
	| { type: "REMOVE_GALLERY_IMAGE"; payload: { url: string } };

const initialHeroProjectInfo: HeroProjectInfo = {
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

const initialState: HeroProjectState = {
	heroProjectInfo: initialHeroProjectInfo,
};

function heroProjectReducer(state: HeroProjectState, action: HeroProjectAction): HeroProjectState {
	switch (action.type) {
		case "SET_HEROPROJECT_INFO":
			return {
				...state,
				heroProjectInfo: action.payload.heroProjectInfo,
			};

		case "UPDATE_TITLE_EN":
			return {
				...state,
				heroProjectInfo: {
					...state.heroProjectInfo,
					title: {
						...state.heroProjectInfo.title,
						en: action.payload.en,
					},
				},
			};

		case "UPDATE_TITLE_VI":
			return {
				...state,
				heroProjectInfo: {
					...state.heroProjectInfo,
					title: {
						...state.heroProjectInfo.title,
						vi: action.payload.vi,
					},
				},
			};

		case "UPDATE_DESCRIPTION_EN":
			return {
				...state,
				heroProjectInfo: {
					...state.heroProjectInfo,
					description: {
						...state.heroProjectInfo.description,
						en: action.payload.en,
					},
				},
			};

		case "UPDATE_DESCRIPTION_VI":
			return {
				...state,
				heroProjectInfo: {
					...state.heroProjectInfo,
					description: {
						...state.heroProjectInfo.description,
						vi: action.payload.vi,
					},
				},
			};

		case "SET_GALLERY":
			return {
				...state,
				heroProjectInfo: {
					...state.heroProjectInfo,
					gallery: action.payload.gallery,
				},
			};

		case "ADD_GALLERY_IMAGE":
			return {
				...state,
				heroProjectInfo: {
					...state.heroProjectInfo,
					gallery: [...state.heroProjectInfo.gallery, action.payload.image],
				},
			};

		case "REMOVE_GALLERY_IMAGE":
			return {
				...state,
				heroProjectInfo: {
					...state.heroProjectInfo,
					gallery: state.heroProjectInfo.gallery
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

const [HeroProjectProviderBase, useHeroProjectStateRaw, useHeroProjectDispatch] = createReducerContext(
	heroProjectReducer,
	initialState,
);

export function HeroProjectProvider({
	children,
	heroProjectInfo = initialHeroProjectInfo,
}: {
	children: React.ReactNode;
	heroProjectInfo?: HeroProjectInfo;
}) {
	return <HeroProjectProviderBase heroProjectInfo={heroProjectInfo}>{children}</HeroProjectProviderBase>;
}

export function useHeroProjectInfo() {
	const state = useHeroProjectStateRaw();
	return state.heroProjectInfo;
}

export function useTitle() {
	const state = useHeroProjectStateRaw();
	const dispatch = useHeroProjectDispatch();

	return {
		title: state.heroProjectInfo.title,
		updateTitleEn: (en: string) => {
			dispatch({ type: "UPDATE_TITLE_EN", payload: { en } });
		},
		updateTitleVi: (vi: string) => {
			dispatch({ type: "UPDATE_TITLE_VI", payload: { vi } });
		},
	};
}

export function useDescription() {
	const state = useHeroProjectStateRaw();
	const dispatch = useHeroProjectDispatch();

	return {
		description: state.heroProjectInfo.description,
		updateDescriptionEn: (en: string) => {
			dispatch({ type: "UPDATE_DESCRIPTION_EN", payload: { en } });
		},
		updateDescriptionVi: (vi: string) => {
			dispatch({ type: "UPDATE_DESCRIPTION_VI", payload: { vi } });
		},
	};
}

export function useGallery() {
	const state = useHeroProjectStateRaw();
	const dispatch = useHeroProjectDispatch();

	return {
		gallery: state.heroProjectInfo.gallery,
		setGallery: (gallery: HeroProjectImage[]) => {
			dispatch({ type: "SET_GALLERY", payload: { gallery } });
		},
		addGalleryImage: (image: HeroProjectImage) => {
			dispatch({ type: "ADD_GALLERY_IMAGE", payload: { image } });
		},
		removeGalleryImage: (url: string) => {
			dispatch({ type: "REMOVE_GALLERY_IMAGE", payload: { url } });
		},
	};
}

export function useHeroProjectActions() {
	const dispatch = useHeroProjectDispatch();

	return {
		setHeroProjectInfo: (heroProjectInfo: HeroProjectInfo) => {
			dispatch({ type: "SET_HEROPROJECT_INFO", payload: { heroProjectInfo } });
		},
	};
}

export function useHeroProject() {
	const heroProjectInfo = useHeroProjectInfo();
	const actions = useHeroProjectActions();

	return { heroProjectInfo, actions };
}