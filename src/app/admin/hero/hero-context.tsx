"use client";

import { createReducerContext } from "src/contexts/createReducerContext";
import type {
	HeroImage,
	HeroInfo,
	HeroSingleImage,
	LocalizedText,
} from "./hero.type";

interface HeroState {
	heroInfo: HeroInfo;
}

type LocalizedHeroField =
	| "title"
	| "description"
	| "productitle"
	| "productdescription"
	| "servicetitle"
	| "servicedesription"
	| "machinetitle"
	| "machinedescription"
	| "machine1title"
	| "machine1subtitle"
	| "machine1description"
	| "machine2title"
	| "machine2subtitle"
	| "machine2description"
	| "machine3title"
	| "machine3subtitle"
	| "machine3description"
	| "clienttitle"
	| "clientdescription"
	| "projecttitle";

type SingleImageHeroField =
	| "machinebackgroundimage"
	| "machine1image"
	| "machine2image"
	| "machine3image";

type GalleryHeroField = "gallery" | "clientimagegallery";

type LocaleKey = keyof LocalizedText;

type HeroAction =
	| { type: "SET_HERO_INFO"; payload: { heroInfo: HeroInfo } }
	| {
			type: "UPDATE_LOCALIZED_FIELD";
			payload: {
				field: LocalizedHeroField;
				lang: LocaleKey;
				value: string;
			};
	  }
	| {
			type: "SET_SINGLE_IMAGE";
			payload: {
				field: SingleImageHeroField;
				image: HeroSingleImage;
			};
	  }
	| {
			type: "SET_GALLERY";
			payload: {
				field: GalleryHeroField;
				gallery: HeroImage[];
			};
	  }
	| {
			type: "ADD_GALLERY_IMAGE";
			payload: {
				field: GalleryHeroField;
				image: HeroImage;
			};
	  }
	| {
			type: "REMOVE_GALLERY_IMAGE";
			payload: {
				field: GalleryHeroField;
				url: string;
			};
	  };

const emptyLocalizedText: LocalizedText = {
	en: "",
	vi: "",
};

const emptySingleImage: HeroSingleImage = {
	url: "",
};

const initialHeroInfo: HeroInfo = {
	title: emptyLocalizedText,
	description: emptyLocalizedText,
	gallery: [],

	productitle: emptyLocalizedText,
	productdescription: emptyLocalizedText,

	servicetitle: emptyLocalizedText,
	servicedesription: emptyLocalizedText,

	machinetitle: emptyLocalizedText,
	machinedescription: emptyLocalizedText,
	machinebackgroundimage: emptySingleImage,

	machine1title: emptyLocalizedText,
	machine1subtitle: emptyLocalizedText,
	machine1description: emptyLocalizedText,
	machine1image: emptySingleImage,

	machine2title: emptyLocalizedText,
	machine2subtitle: emptyLocalizedText,
	machine2description: emptyLocalizedText,
	machine2image: emptySingleImage,

	machine3title: emptyLocalizedText,
	machine3subtitle: emptyLocalizedText,
	machine3description: emptyLocalizedText,
	machine3image: emptySingleImage,

	clienttitle: emptyLocalizedText,
	clientdescription: emptyLocalizedText,
	clientimagegallery: [],

	projecttitle: emptyLocalizedText,
};

const initialState: HeroState = {
	heroInfo: initialHeroInfo,
};

function heroReducer(state: HeroState, action: HeroAction): HeroState {
	switch (action.type) {
		case "SET_HERO_INFO":
			return {
				...state,
				heroInfo: action.payload.heroInfo,
			};

		case "UPDATE_LOCALIZED_FIELD":
			return {
				...state,
				heroInfo: {
					...state.heroInfo,
					[action.payload.field]: {
						...state.heroInfo[action.payload.field],
						[action.payload.lang]: action.payload.value,
					},
				},
			};

		case "SET_SINGLE_IMAGE":
			return {
				...state,
				heroInfo: {
					...state.heroInfo,
					[action.payload.field]: action.payload.image,
				},
			};

		case "SET_GALLERY":
			return {
				...state,
				heroInfo: {
					...state.heroInfo,
					[action.payload.field]: action.payload.gallery,
				},
			};

		case "ADD_GALLERY_IMAGE":
			return {
				...state,
				heroInfo: {
					...state.heroInfo,
					[action.payload.field]: [
						...state.heroInfo[action.payload.field],
						action.payload.image,
					],
				},
			};

		case "REMOVE_GALLERY_IMAGE":
			return {
				...state,
				heroInfo: {
					...state.heroInfo,
					[action.payload.field]: state.heroInfo[action.payload.field]
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

const [HeroProviderBase, useHeroStateRaw, useHeroDispatch] =
	createReducerContext(heroReducer, initialState);

export function HeroProvider({
	children,
	heroInfo = initialHeroInfo,
}: {
	children: React.ReactNode;
	heroInfo?: HeroInfo;
}) {
	return <HeroProviderBase heroInfo={heroInfo}>{children}</HeroProviderBase>;
}

export function useHeroInfo() {
	const state = useHeroStateRaw();
	return state.heroInfo;
}

export function useLocalizedHeroField(field: LocalizedHeroField) {
	const state = useHeroStateRaw();
	const dispatch = useHeroDispatch();

	return {
		value: state.heroInfo[field],
		updateEn: (value: string) => {
			dispatch({
				type: "UPDATE_LOCALIZED_FIELD",
				payload: { field, lang: "en", value },
			});
		},
		updateVi: (value: string) => {
			dispatch({
				type: "UPDATE_LOCALIZED_FIELD",
				payload: { field, lang: "vi", value },
			});
		},
	};
}

export function useSingleHeroImage(field: SingleImageHeroField) {
	const state = useHeroStateRaw();
	const dispatch = useHeroDispatch();

	return {
		image: state.heroInfo[field],
		setImage: (image: HeroSingleImage) => {
			dispatch({
				type: "SET_SINGLE_IMAGE",
				payload: { field, image },
			});
		},
		removeImage: () => {
			dispatch({
				type: "SET_SINGLE_IMAGE",
				payload: { field, image: emptySingleImage },
			});
		},
	};
}

export function useHeroGallery(field: GalleryHeroField) {
	const state = useHeroStateRaw();
	const dispatch = useHeroDispatch();

	return {
		gallery: state.heroInfo[field],
		setGallery: (gallery: HeroImage[]) => {
			dispatch({
				type: "SET_GALLERY",
				payload: { field, gallery },
			});
		},
		addGalleryImage: (image: HeroImage) => {
			dispatch({
				type: "ADD_GALLERY_IMAGE",
				payload: { field, image },
			});
		},
		removeGalleryImage: (url: string) => {
			dispatch({
				type: "REMOVE_GALLERY_IMAGE",
				payload: { field, url },
			});
		},
	};
}

/* =========================
   Existing hooks
========================= */
export function useTitle() {
	const title = useLocalizedHeroField("title");

	return {
		title: title.value,
		updateTitleEn: title.updateEn,
		updateTitleVi: title.updateVi,
	};
}

export function useDescription() {
	const description = useLocalizedHeroField("description");

	return {
		description: description.value,
		updateDescriptionEn: description.updateEn,
		updateDescriptionVi: description.updateVi,
	};
}

export function useGallery() {
	return useHeroGallery("gallery");
}

/* =========================
   Home content hooks
========================= */
export function useHomeProducts() {
	const productitle = useLocalizedHeroField("productitle");
	const productdescription = useLocalizedHeroField("productdescription");

	return {
		productitle: productitle.value,
		productdescription: productdescription.value,
		updateProductitleEn: productitle.updateEn,
		updateProductitleVi: productitle.updateVi,
		updateProductdescriptionEn: productdescription.updateEn,
		updateProductdescriptionVi: productdescription.updateVi,
	};
}

export function useHomeServices() {
	const servicetitle = useLocalizedHeroField("servicetitle");
	const servicedesription = useLocalizedHeroField("servicedesription");

	return {
		servicetitle: servicetitle.value,
		servicedesription: servicedesription.value,
		updateServicetitleEn: servicetitle.updateEn,
		updateServicetitleVi: servicetitle.updateVi,
		updateServicedesriptionEn: servicedesription.updateEn,
		updateServicedesriptionVi: servicedesription.updateVi,
	};
}

export function useHomeMachinery() {
	const machinetitle = useLocalizedHeroField("machinetitle");
	const machinedescription = useLocalizedHeroField("machinedescription");
	const machinebackgroundimage = useSingleHeroImage("machinebackgroundimage");

	const machine1title = useLocalizedHeroField("machine1title");
	const machine1subtitle = useLocalizedHeroField("machine1subtitle");
	const machine1description = useLocalizedHeroField("machine1description");
	const machine1image = useSingleHeroImage("machine1image");

	const machine2title = useLocalizedHeroField("machine2title");
	const machine2subtitle = useLocalizedHeroField("machine2subtitle");
	const machine2description = useLocalizedHeroField("machine2description");
	const machine2image = useSingleHeroImage("machine2image");

	const machine3title = useLocalizedHeroField("machine3title");
	const machine3subtitle = useLocalizedHeroField("machine3subtitle");
	const machine3description = useLocalizedHeroField("machine3description");
	const machine3image = useSingleHeroImage("machine3image");

	return {
		machinetitle: machinetitle.value,
		machinedescription: machinedescription.value,
		machinebackgroundimage: machinebackgroundimage.image,

		machine1title: machine1title.value,
		machine1subtitle: machine1subtitle.value,
		machine1description: machine1description.value,
		machine1image: machine1image.image,

		machine2title: machine2title.value,
		machine2subtitle: machine2subtitle.value,
		machine2description: machine2description.value,
		machine2image: machine2image.image,

		machine3title: machine3title.value,
		machine3subtitle: machine3subtitle.value,
		machine3description: machine3description.value,
		machine3image: machine3image.image,

		updateMachinetitleEn: machinetitle.updateEn,
		updateMachinetitleVi: machinetitle.updateVi,
		updateMachinedescriptionEn: machinedescription.updateEn,
		updateMachinedescriptionVi: machinedescription.updateVi,
		setMachinebackgroundimage: machinebackgroundimage.setImage,
		removeMachinebackgroundimage: machinebackgroundimage.removeImage,

		updateMachine1titleEn: machine1title.updateEn,
		updateMachine1titleVi: machine1title.updateVi,
		updateMachine1subtitleEn: machine1subtitle.updateEn,
		updateMachine1subtitleVi: machine1subtitle.updateVi,
		updateMachine1descriptionEn: machine1description.updateEn,
		updateMachine1descriptionVi: machine1description.updateVi,
		setMachine1image: machine1image.setImage,
		removeMachine1image: machine1image.removeImage,

		updateMachine2titleEn: machine2title.updateEn,
		updateMachine2titleVi: machine2title.updateVi,
		updateMachine2subtitleEn: machine2subtitle.updateEn,
		updateMachine2subtitleVi: machine2subtitle.updateVi,
		updateMachine2descriptionEn: machine2description.updateEn,
		updateMachine2descriptionVi: machine2description.updateVi,
		setMachine2image: machine2image.setImage,
		removeMachine2image: machine2image.removeImage,

		updateMachine3titleEn: machine3title.updateEn,
		updateMachine3titleVi: machine3title.updateVi,
		updateMachine3subtitleEn: machine3subtitle.updateEn,
		updateMachine3subtitleVi: machine3subtitle.updateVi,
		updateMachine3descriptionEn: machine3description.updateEn,
		updateMachine3descriptionVi: machine3description.updateVi,
		setMachine3image: machine3image.setImage,
		removeMachine3image: machine3image.removeImage,
	};
}

export function useHomeClients() {
	const clienttitle = useLocalizedHeroField("clienttitle");
	const clientdescription = useLocalizedHeroField("clientdescription");
	const clientimagegallery = useHeroGallery("clientimagegallery");

	return {
		clienttitle: clienttitle.value,
		clientdescription: clientdescription.value,
		clientimagegallery: clientimagegallery.gallery,

		updateClienttitleEn: clienttitle.updateEn,
		updateClienttitleVi: clienttitle.updateVi,
		updateClientdescriptionEn: clientdescription.updateEn,
		updateClientdescriptionVi: clientdescription.updateVi,

		setClientimagegallery: clientimagegallery.setGallery,
		addClientimagegalleryImage: clientimagegallery.addGalleryImage,
		removeClientimagegalleryImage: clientimagegallery.removeGalleryImage,
	};
}

export function useHomeProjects() {
	const projecttitle = useLocalizedHeroField("projecttitle");

	return {
		projecttitle: projecttitle.value,
		updateProjecttitleEn: projecttitle.updateEn,
		updateProjecttitleVi: projecttitle.updateVi,
	};
}

export function useHeroActions() {
	const dispatch = useHeroDispatch();

	return {
		setHeroInfo: (heroInfo: HeroInfo) => {
			dispatch({ type: "SET_HERO_INFO", payload: { heroInfo } });
		},
	};
}

export function useHero() {
	const heroInfo = useHeroInfo();
	const actions = useHeroActions();

	return { heroInfo, actions };
}