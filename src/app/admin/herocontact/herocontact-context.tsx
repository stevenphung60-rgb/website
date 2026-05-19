"use client";

import { createReducerContext } from "src/contexts/createReducerContext";
import type { HeroContactImage, HeroContactInfo } from "./herocontact.type";

interface HeroContactState {
	heroContactInfo: HeroContactInfo;
}

type HeroContactAction =
	| { type: "SET_HEROCONTACT_INFO"; payload: { heroContactInfo: HeroContactInfo } }
	| { type: "UPDATE_TITLE_EN"; payload: { en: string } }
	| { type: "UPDATE_TITLE_VI"; payload: { vi: string } }
	| { type: "UPDATE_DESCRIPTION_EN"; payload: { en: string } }
	| { type: "UPDATE_DESCRIPTION_VI"; payload: { vi: string } }
	| { type: "SET_GALLERY"; payload: { gallery: HeroContactImage[] } }
	| { type: "ADD_GALLERY_IMAGE"; payload: { image: HeroContactImage } }
	| { type: "REMOVE_GALLERY_IMAGE"; payload: { url: string } };

const initialHeroContactInfo: HeroContactInfo = {
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

const initialState: HeroContactState = {
	heroContactInfo: initialHeroContactInfo,
};

function heroContactReducer(state: HeroContactState, action: HeroContactAction): HeroContactState {
	switch (action.type) {
		case "SET_HEROCONTACT_INFO":
			return {
				...state,
				heroContactInfo: action.payload.heroContactInfo,
			};

		case "UPDATE_TITLE_EN":
			return {
				...state,
				heroContactInfo: {
					...state.heroContactInfo,
					title: {
						...state.heroContactInfo.title,
						en: action.payload.en,
					},
				},
			};

		case "UPDATE_TITLE_VI":
			return {
				...state,
				heroContactInfo: {
					...state.heroContactInfo,
					title: {
						...state.heroContactInfo.title,
						vi: action.payload.vi,
					},
				},
			};

		case "UPDATE_DESCRIPTION_EN":
			return {
				...state,
				heroContactInfo: {
					...state.heroContactInfo,
					description: {
						...state.heroContactInfo.description,
						en: action.payload.en,
					},
				},
			};

		case "UPDATE_DESCRIPTION_VI":
			return {
				...state,
				heroContactInfo: {
					...state.heroContactInfo,
					description: {
						...state.heroContactInfo.description,
						vi: action.payload.vi,
					},
				},
			};

		case "SET_GALLERY":
			return {
				...state,
				heroContactInfo: {
					...state.heroContactInfo,
					gallery: action.payload.gallery,
				},
			};

		case "ADD_GALLERY_IMAGE":
			return {
				...state,
				heroContactInfo: {
					...state.heroContactInfo,
					gallery: [...state.heroContactInfo.gallery, action.payload.image],
				},
			};

		case "REMOVE_GALLERY_IMAGE":
			return {
				...state,
				heroContactInfo: {
					...state.heroContactInfo,
					gallery: state.heroContactInfo.gallery
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

const [HeroContactProviderBase, useHeroContactStateRaw, useHeroContactDispatch] = createReducerContext(
	heroContactReducer,
	initialState,
);

export function HeroContactProvider({
	children,
	heroContactInfo = initialHeroContactInfo,
}: {
	children: React.ReactNode;
	heroContactInfo?: HeroContactInfo;
}) {
	return <HeroContactProviderBase heroContactInfo={heroContactInfo}>{children}</HeroContactProviderBase>;
}

export function useHeroContactInfo() {
	const state = useHeroContactStateRaw();
	return state.heroContactInfo;
}

export function useTitle() {
	const state = useHeroContactStateRaw();
	const dispatch = useHeroContactDispatch();

	return {
		title: state.heroContactInfo.title,
		updateTitleEn: (en: string) => {
			dispatch({ type: "UPDATE_TITLE_EN", payload: { en } });
		},
		updateTitleVi: (vi: string) => {
			dispatch({ type: "UPDATE_TITLE_VI", payload: { vi } });
		},
	};
}

export function useDescription() {
	const state = useHeroContactStateRaw();
	const dispatch = useHeroContactDispatch();

	return {
		description: state.heroContactInfo.description,
		updateDescriptionEn: (en: string) => {
			dispatch({ type: "UPDATE_DESCRIPTION_EN", payload: { en } });
		},
		updateDescriptionVi: (vi: string) => {
			dispatch({ type: "UPDATE_DESCRIPTION_VI", payload: { vi } });
		},
	};
}

export function useGallery() {
	const state = useHeroContactStateRaw();
	const dispatch = useHeroContactDispatch();

	return {
		gallery: state.heroContactInfo.gallery,
		setGallery: (gallery: HeroContactImage[]) => {
			dispatch({ type: "SET_GALLERY", payload: { gallery } });
		},
		addGalleryImage: (image: HeroContactImage) => {
			dispatch({ type: "ADD_GALLERY_IMAGE", payload: { image } });
		},
		removeGalleryImage: (url: string) => {
			dispatch({ type: "REMOVE_GALLERY_IMAGE", payload: { url } });
		},
	};
}

export function useHeroContactActions() {
	const dispatch = useHeroContactDispatch();

	return {
		setHeroContactInfo: (heroContactInfo: HeroContactInfo) => {
			dispatch({ type: "SET_HEROCONTACT_INFO", payload: { heroContactInfo } });
		},
	};
}

export function useHeroContact() {
	const heroContactInfo = useHeroContactInfo();
	const actions = useHeroContactActions();

	return { heroContactInfo, actions };
}