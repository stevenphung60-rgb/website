"use client";

import { createReducerContext } from "src/contexts/createReducerContext";
import type {
	ContactInfo,
	ContactSingleImage,
	LocalizedText,
} from "./contact.type";
import type {
	SocialMediaLink,
	SocialMediaPlatformId,
} from "./social-media/social-media.type";

interface ContactState {
	contactInfo: ContactInfo;
}

type LocalizedContactField =
	| "consultanttitle"
	| "consultantsubtitle"
	| "consultantdescription"
	| "footercompanyname"
	| "footercompanydescription"
	| "workingHours";

type SingleImageContactField = "consultantimage" | "footerlogo";

type ContactAction =
	| { type: "SET_CONTACT_INFO"; payload: { contactInfo: ContactInfo } }
	| { type: "UPDATE_PHONE1"; payload: { phone1: string } }
	| { type: "UPDATE_PHONE2"; payload: { phone2: string } }
	| { type: "UPDATE_EMAIL1"; payload: { email1: string } }
	| { type: "UPDATE_EMAIL2"; payload: { email2: string } }
	| {
			type: "UPDATE_LOCALIZED_FIELD";
			payload: {
				field: LocalizedContactField;
				locale: "en" | "vi";
				value: string;
			};
	  }
	| {
			type: "SET_SINGLE_IMAGE";
			payload: {
				field: SingleImageContactField;
				image: ContactSingleImage;
			};
	  }
	| {
			type: "REMOVE_SINGLE_IMAGE";
			payload: {
				field: SingleImageContactField;
			};
	  }
	| {
			type: "ADD_SOCIAL_MEDIA_LINK";
			payload: { platformId: SocialMediaPlatformId };
	  }
	| { type: "REMOVE_SOCIAL_MEDIA_LINK"; payload: { linkId: string } }
	| {
			type: "UPDATE_SOCIAL_MEDIA_PLATFORM";
			payload: { linkId: string; platformId: SocialMediaPlatformId };
	  }
	| { type: "UPDATE_SOCIAL_MEDIA_URL"; payload: { linkId: string; url: string } }
	| { type: "SET_SOCIAL_MEDIA_LINKS"; payload: { links: SocialMediaLink[] } };

const emptyLocalizedText: LocalizedText = {
	en: "",
	vi: "",
};

const emptySingleImage: ContactSingleImage = {
	url: "",
};

const initialContactInfo: ContactInfo = {
	phone1: "",
	phone2: "",
	email1: "",
	email2: "",

	consultanttitle: {
		en: "",
		vi: "",
	},
	consultantsubtitle: {
		en: "",
		vi: "",
	},
	consultantdescription: {
		en: "",
		vi: "",
	},
	consultantimage: {
		url: "",
	},

	footerlogo: {
		url: "",
	},
	footercompanyname: {
		en: "",
		vi: "",
	},
	footercompanydescription: {
		en: "",
		vi: "",
	},

	workingHours: {
		en: "",
		vi: "",
	},

	socialMedia: [],
};

const initialState: ContactState = {
	contactInfo: initialContactInfo,
};

function contactReducer(
	state: ContactState,
	action: ContactAction,
): ContactState {
	switch (action.type) {
		case "SET_CONTACT_INFO":
			return {
				...state,
				contactInfo: {
					...initialContactInfo,
					...action.payload.contactInfo,
				},
			};

		case "UPDATE_PHONE1":
			return {
				...state,
				contactInfo: {
					...state.contactInfo,
					phone1: action.payload.phone1,
				},
			};

		case "UPDATE_PHONE2":
			return {
				...state,
				contactInfo: {
					...state.contactInfo,
					phone2: action.payload.phone2,
				},
			};

		case "UPDATE_EMAIL1":
			return {
				...state,
				contactInfo: {
					...state.contactInfo,
					email1: action.payload.email1,
				},
			};

		case "UPDATE_EMAIL2":
			return {
				...state,
				contactInfo: {
					...state.contactInfo,
					email2: action.payload.email2,
				},
			};

		case "UPDATE_LOCALIZED_FIELD": {
			const currentValue =
				state.contactInfo[action.payload.field] || emptyLocalizedText;

			return {
				...state,
				contactInfo: {
					...state.contactInfo,
					[action.payload.field]: {
						...currentValue,
						[action.payload.locale]: action.payload.value,
					},
				},
			};
		}

		case "SET_SINGLE_IMAGE":
			return {
				...state,
				contactInfo: {
					...state.contactInfo,
					[action.payload.field]: action.payload.image,
				},
			};

		case "REMOVE_SINGLE_IMAGE":
			return {
				...state,
				contactInfo: {
					...state.contactInfo,
					[action.payload.field]: emptySingleImage,
				},
			};

		case "ADD_SOCIAL_MEDIA_LINK":
			return {
				...state,
				contactInfo: {
					...state.contactInfo,
					socialMedia: [
						...state.contactInfo.socialMedia,
						{
							id: `link-${Date.now()}-${Math.random()
								.toString(36)
								.substr(2, 9)}`,
							platformId: action.payload.platformId,
							url: "",
						},
					],
				},
			};

		case "REMOVE_SOCIAL_MEDIA_LINK":
			return {
				...state,
				contactInfo: {
					...state.contactInfo,
					socialMedia: state.contactInfo.socialMedia.filter(
						(link) => link.id !== action.payload.linkId,
					),
				},
			};

		case "UPDATE_SOCIAL_MEDIA_PLATFORM":
			return {
				...state,
				contactInfo: {
					...state.contactInfo,
					socialMedia: state.contactInfo.socialMedia.map((link) =>
						link.id === action.payload.linkId
							? {
									...link,
									platformId: action.payload.platformId,
									url: "",
								}
							: link,
					),
				},
			};

		case "UPDATE_SOCIAL_MEDIA_URL":
			return {
				...state,
				contactInfo: {
					...state.contactInfo,
					socialMedia: state.contactInfo.socialMedia.map((link) =>
						link.id === action.payload.linkId
							? {
									...link,
									url: action.payload.url,
								}
							: link,
					),
				},
			};

		case "SET_SOCIAL_MEDIA_LINKS":
			return {
				...state,
				contactInfo: {
					...state.contactInfo,
					socialMedia: action.payload.links,
				},
			};

		default:
			return state;
	}
}

const [ContactProviderBase, useContactStateRaw, useContactDispatch] =
	createReducerContext(contactReducer, initialState);

export function ContactProvider({
	children,
	contactInfo = initialContactInfo,
}: {
	children: React.ReactNode;
	contactInfo?: ContactInfo;
}) {
	return (
		<ContactProviderBase
			contactInfo={{
				...initialContactInfo,
				...contactInfo,
			}}
		>
			{children}
		</ContactProviderBase>
	);
}

export function useContactInfo() {
	const state = useContactStateRaw();

	return {
		...initialContactInfo,
		...state.contactInfo,
	};
}

export function usePhone1() {
	const state = useContactStateRaw();
	const dispatch = useContactDispatch();

	return {
		phone1: state.contactInfo.phone1,
		updatePhone1: (phone1: string) => {
			dispatch({ type: "UPDATE_PHONE1", payload: { phone1 } });
		},
	};
}

export function usePhone2() {
	const state = useContactStateRaw();
	const dispatch = useContactDispatch();

	return {
		phone2: state.contactInfo.phone2,
		updatePhone2: (phone2: string) => {
			dispatch({ type: "UPDATE_PHONE2", payload: { phone2 } });
		},
	};
}

export function useEmail1() {
	const state = useContactStateRaw();
	const dispatch = useContactDispatch();

	return {
		email1: state.contactInfo.email1,
		updateEmail1: (email1: string) => {
			dispatch({ type: "UPDATE_EMAIL1", payload: { email1 } });
		},
	};
}

export function useEmail2() {
	const state = useContactStateRaw();
	const dispatch = useContactDispatch();

	return {
		email2: state.contactInfo.email2,
		updateEmail2: (email2: string) => {
			dispatch({ type: "UPDATE_EMAIL2", payload: { email2 } });
		},
	};
}

export function useLocalizedContactField(field: LocalizedContactField) {
	const state = useContactStateRaw();
	const dispatch = useContactDispatch();

	const value = state.contactInfo[field] || emptyLocalizedText;

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

export function useSingleContactImage(field: SingleImageContactField) {
	const state = useContactStateRaw();
	const dispatch = useContactDispatch();

	const image = state.contactInfo[field] || emptySingleImage;

	return {
		image,
		setImage: (newImage: ContactSingleImage) => {
			dispatch({
				type: "SET_SINGLE_IMAGE",
				payload: {
					field,
					image: newImage,
				},
			});
		},
		removeImage: () => {
			dispatch({
				type: "REMOVE_SINGLE_IMAGE",
				payload: {
					field,
				},
			});
		},
	};
}

export function useConsultantContent() {
	const consultanttitle = useLocalizedContactField("consultanttitle");
	const consultantsubtitle = useLocalizedContactField("consultantsubtitle");
	const consultantdescription = useLocalizedContactField(
		"consultantdescription",
	);
	const consultantimage = useSingleContactImage("consultantimage");

	return {
		consultanttitle: consultanttitle.value,
		updateConsultanttitleEn: consultanttitle.updateEn,
		updateConsultanttitleVi: consultanttitle.updateVi,

		consultantsubtitle: consultantsubtitle.value,
		updateConsultantsubtitleEn: consultantsubtitle.updateEn,
		updateConsultantsubtitleVi: consultantsubtitle.updateVi,

		consultantdescription: consultantdescription.value,
		updateConsultantdescriptionEn: consultantdescription.updateEn,
		updateConsultantdescriptionVi: consultantdescription.updateVi,

		consultantimage: consultantimage.image,
		setConsultantimage: consultantimage.setImage,
		removeConsultantimage: consultantimage.removeImage,
	};
}

export function useFooterContent() {
	const footerlogo = useSingleContactImage("footerlogo");
	const footercompanyname = useLocalizedContactField("footercompanyname");
	const footercompanydescription = useLocalizedContactField(
		"footercompanydescription",
	);

	return {
		footerlogo: footerlogo.image,
		setFooterlogo: footerlogo.setImage,
		removeFooterlogo: footerlogo.removeImage,

		footercompanyname: footercompanyname.value,
		updateFootercompanynameEn: footercompanyname.updateEn,
		updateFootercompanynameVi: footercompanyname.updateVi,

		footercompanydescription: footercompanydescription.value,
		updateFootercompanydescriptionEn: footercompanydescription.updateEn,
		updateFootercompanydescriptionVi: footercompanydescription.updateVi,
	};
}

export function useWorkingHours() {
	const { value, updateEn, updateVi } =
		useLocalizedContactField("workingHours");

	return {
		workingHours: value,
		updateWorkingHoursEn: updateEn,
		updateWorkingHoursVi: updateVi,
	};
}

export function useSocialMedia() {
	const state = useContactStateRaw();
	const dispatch = useContactDispatch();

	return {
		socialMedia: state.contactInfo.socialMedia,
		addSocialMediaLink: (platformId: SocialMediaPlatformId) => {
			dispatch({
				type: "ADD_SOCIAL_MEDIA_LINK",
				payload: { platformId },
			});
		},
		removeSocialMediaLink: (linkId: string) => {
			dispatch({
				type: "REMOVE_SOCIAL_MEDIA_LINK",
				payload: { linkId },
			});
		},
		updateSocialMediaPlatform: (
			linkId: string,
			platformId: SocialMediaPlatformId,
		) => {
			dispatch({
				type: "UPDATE_SOCIAL_MEDIA_PLATFORM",
				payload: { linkId, platformId },
			});
		},
		updateSocialMediaUrl: (linkId: string, url: string) => {
			dispatch({
				type: "UPDATE_SOCIAL_MEDIA_URL",
				payload: { linkId, url },
			});
		},
		setSocialMediaLinks: (links: SocialMediaLink[]) => {
			dispatch({
				type: "SET_SOCIAL_MEDIA_LINKS",
				payload: { links },
			});
		},
	};
}

export function useSocialMediaLinks() {
	const {
		socialMedia,
		addSocialMediaLink,
		removeSocialMediaLink,
		updateSocialMediaPlatform,
		updateSocialMediaUrl,
		setSocialMediaLinks,
	} = useSocialMedia();

	return {
		socialMediaLinks: socialMedia,
		addSocialMediaLink,
		removeSocialMediaLink,
		updateSocialMediaPlatform,
		updateSocialMediaUrl,
		setSocialMediaLinks,
	};
}

export function useContactActions() {
	const dispatch = useContactDispatch();

	return {
		setContactInfo: (contactInfo: ContactInfo) => {
			dispatch({ type: "SET_CONTACT_INFO", payload: { contactInfo } });
		},
	};
}

export function useContact() {
	const contactInfo = useContactInfo();
	const actions = useContactActions();

	return {
		contactInfo,
		actions,
	};
}