"use client";

import { createReducerContext } from "src/contexts/createReducerContext";
import type {
	HeroAboutImage,
	HeroAboutInfo,
	LocalizedText,
} from "./heroabout.type";

interface HeroAboutState {
	heroAboutInfo: HeroAboutInfo;
}

type LocalizedHeroAboutField =
	| "title"
	| "description"
	| "factoryaddress"
	| "officeaddress"
	| "youtubelink"
	| "videotitle"
	| "videodescription"
	| "historytitle"
	| "historydescription"
	| "historytime1"
	| "historytitle1"
	| "historydetail1"
	| "historytime2"
	| "historytitle2"
	| "historydetail2"
	| "historytime3"
	| "historytitle3"
	| "historydetail3"
	| "valuestatementtitle"
	| "valuestatementtitle1"
	| "valuestatementdetail1"
	| "valuestatementtitle2"
	| "valuestatementdetail2"
	| "valuestatementtitle3"
	| "valuestatementdetail3"
	| "capacitytitle"
	| "capacitydescription"
	| "capacitytitle1"
	| "capacitydetail1"
	| "capacitytitle2"
	| "capacitydetail2"
	| "capacitytitle3"
	| "capacitydetail3"
	| "capacitytitle4"
	| "capacitydetail4";

type HeroAboutAction =
	| { type: "SET_HEROABOUT_INFO"; payload: { heroAboutInfo: HeroAboutInfo } }
	| {
			type: "UPDATE_LOCALIZED_FIELD";
			payload: {
				field: LocalizedHeroAboutField;
				locale: "en" | "vi";
				value: string;
			};
	  }
	| { type: "SET_GALLERY"; payload: { gallery: HeroAboutImage[] } }
	| { type: "ADD_GALLERY_IMAGE"; payload: { image: HeroAboutImage } }
	| { type: "REMOVE_GALLERY_IMAGE"; payload: { url: string } };

const emptyLocalizedText: LocalizedText = {
	en: "",
	vi: "",
};

const initialHeroAboutInfo: HeroAboutInfo = {
	title: {
		en: "",
		vi: "",
	},
	description: {
		en: "",
		vi: "",
	},
	gallery: [],

	factoryaddress: { en: "", vi: "" },
	officeaddress: { en: "", vi: "" },
	youtubelink: { en: "", vi: "" },
	videotitle: { en: "", vi: "" },
	videodescription: { en: "", vi: "" },

	historytitle: { en: "", vi: "" },
	historydescription: { en: "", vi: "" },
	historytime1: { en: "", vi: "" },
	historytitle1: { en: "", vi: "" },
	historydetail1: { en: "", vi: "" },
	historytime2: { en: "", vi: "" },
	historytitle2: { en: "", vi: "" },
	historydetail2: { en: "", vi: "" },
	historytime3: { en: "", vi: "" },
	historytitle3: { en: "", vi: "" },
	historydetail3: { en: "", vi: "" },

	valuestatementtitle: { en: "", vi: "" },
	valuestatementtitle1: { en: "", vi: "" },
	valuestatementdetail1: { en: "", vi: "" },
	valuestatementtitle2: { en: "", vi: "" },
	valuestatementdetail2: { en: "", vi: "" },
	valuestatementtitle3: { en: "", vi: "" },
	valuestatementdetail3: { en: "", vi: "" },

	capacitytitle: { en: "", vi: "" },
	capacitydescription: { en: "", vi: "" },
	capacitytitle1: { en: "", vi: "" },
	capacitydetail1: { en: "", vi: "" },
	capacitytitle2: { en: "", vi: "" },
	capacitydetail2: { en: "", vi: "" },
	capacitytitle3: { en: "", vi: "" },
	capacitydetail3: { en: "", vi: "" },
	capacitytitle4: { en: "", vi: "" },
	capacitydetail4: { en: "", vi: "" },
};

const initialState: HeroAboutState = {
	heroAboutInfo: initialHeroAboutInfo,
};

function heroAboutReducer(
	state: HeroAboutState,
	action: HeroAboutAction,
): HeroAboutState {
	switch (action.type) {
		case "SET_HEROABOUT_INFO":
			return {
				...state,
				heroAboutInfo: {
					...initialHeroAboutInfo,
					...action.payload.heroAboutInfo,
				},
			};

		case "UPDATE_LOCALIZED_FIELD": {
			const currentValue =
				state.heroAboutInfo[action.payload.field] || emptyLocalizedText;

			return {
				...state,
				heroAboutInfo: {
					...state.heroAboutInfo,
					[action.payload.field]: {
						...currentValue,
						[action.payload.locale]: action.payload.value,
					},
				},
			};
		}

		case "SET_GALLERY":
			return {
				...state,
				heroAboutInfo: {
					...state.heroAboutInfo,
					gallery: action.payload.gallery,
				},
			};

		case "ADD_GALLERY_IMAGE":
			return {
				...state,
				heroAboutInfo: {
					...state.heroAboutInfo,
					gallery: [...state.heroAboutInfo.gallery, action.payload.image],
				},
			};

		case "REMOVE_GALLERY_IMAGE":
			return {
				...state,
				heroAboutInfo: {
					...state.heroAboutInfo,
					gallery: state.heroAboutInfo.gallery
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

const [HeroAboutProviderBase, useHeroAboutStateRaw, useHeroAboutDispatch] =
	createReducerContext(heroAboutReducer, initialState);

export function HeroAboutProvider({
	children,
	heroAboutInfo = initialHeroAboutInfo,
}: {
	children: React.ReactNode;
	heroAboutInfo?: HeroAboutInfo;
}) {
	return (
		<HeroAboutProviderBase
			heroAboutInfo={{
				...initialHeroAboutInfo,
				...heroAboutInfo,
			}}
		>
			{children}
		</HeroAboutProviderBase>
	);
}

export function useHeroAboutInfo() {
	const state = useHeroAboutStateRaw();

	return {
		...initialHeroAboutInfo,
		...state.heroAboutInfo,
	};
}

export function useLocalizedHeroAboutField(field: LocalizedHeroAboutField) {
	const state = useHeroAboutStateRaw();
	const dispatch = useHeroAboutDispatch();

	const value = state.heroAboutInfo[field] || emptyLocalizedText;

	return {
		value,
		updateEn: (en: string) => {
			dispatch({
				type: "UPDATE_LOCALIZED_FIELD",
				payload: {
					field,
					locale: "en",
					value: en,
				},
			});
		},
		updateVi: (vi: string) => {
			dispatch({
				type: "UPDATE_LOCALIZED_FIELD",
				payload: {
					field,
					locale: "vi",
					value: vi,
				},
			});
		},
	};
}

export function useTitle() {
	const { value, updateEn, updateVi } = useLocalizedHeroAboutField("title");

	return {
		title: value,
		updateTitleEn: updateEn,
		updateTitleVi: updateVi,
	};
}

export function useDescription() {
	const { value, updateEn, updateVi } =
		useLocalizedHeroAboutField("description");

	return {
		description: value,
		updateDescriptionEn: updateEn,
		updateDescriptionVi: updateVi,
	};
}

export function useGallery() {
	const state = useHeroAboutStateRaw();
	const dispatch = useHeroAboutDispatch();

	return {
		gallery: state.heroAboutInfo.gallery,
		setGallery: (gallery: HeroAboutImage[]) => {
			dispatch({ type: "SET_GALLERY", payload: { gallery } });
		},
		addGalleryImage: (image: HeroAboutImage) => {
			dispatch({ type: "ADD_GALLERY_IMAGE", payload: { image } });
		},
		removeGalleryImage: (url: string) => {
			dispatch({ type: "REMOVE_GALLERY_IMAGE", payload: { url } });
		},
	};
}

export function useHeroAboutActions() {
	const dispatch = useHeroAboutDispatch();

	return {
		setHeroAboutInfo: (heroAboutInfo: HeroAboutInfo) => {
			dispatch({ type: "SET_HEROABOUT_INFO", payload: { heroAboutInfo } });
		},
	};
}

export function useHeroAbout() {
	const heroAboutInfo = useHeroAboutInfo();
	const actions = useHeroAboutActions();

	return { heroAboutInfo, actions };
}