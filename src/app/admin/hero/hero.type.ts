/**
 * Hero information data types
 * Defines the structure for hero information and related data
 */

export interface LocalizedText {
	en: string;
	vi: string;
}

export interface HeroSingleImage {
	url: string;
}

export interface HeroImage {
	url: string;
	order: number;
}

/**
 * Hero information data structure
 */
export interface HeroInfo {
	title: LocalizedText;
	description: LocalizedText;
	gallery: HeroImage[];

	productitle: LocalizedText;
	productdescription: LocalizedText;

	servicetitle: LocalizedText;
	servicedesription: LocalizedText;

	machinetitle: LocalizedText;
	machinedescription: LocalizedText;
	machinebackgroundimage: HeroSingleImage;

	machine1title: LocalizedText;
	machine1subtitle: LocalizedText;
	machine1description: LocalizedText;
	machine1image: HeroSingleImage;

	machine2title: LocalizedText;
	machine2subtitle: LocalizedText;
	machine2description: LocalizedText;
	machine2image: HeroSingleImage;

	machine3title: LocalizedText;
	machine3subtitle: LocalizedText;
	machine3description: LocalizedText;
	machine3image: HeroSingleImage;

	clienttitle: LocalizedText;
	clientdescription: LocalizedText;
	clientimagegallery: HeroImage[];

	projecttitle: LocalizedText;
}

/**
 * Hero information database document
 */
export interface HeroInfoDocument {
	_id?: unknown;
	id: string;

	title: LocalizedText;
	description: LocalizedText;
	gallery: HeroImage[];

	productitle: LocalizedText;
	productdescription: LocalizedText;

	servicetitle: LocalizedText;
	servicedesription: LocalizedText;

	machinetitle: LocalizedText;
	machinedescription: LocalizedText;
	machinebackgroundimage: HeroSingleImage;

	machine1title: LocalizedText;
	machine1subtitle: LocalizedText;
	machine1description: LocalizedText;
	machine1image: HeroSingleImage;

	machine2title: LocalizedText;
	machine2subtitle: LocalizedText;
	machine2description: LocalizedText;
	machine2image: HeroSingleImage;

	machine3title: LocalizedText;
	machine3subtitle: LocalizedText;
	machine3description: LocalizedText;
	machine3image: HeroSingleImage;

	clienttitle: LocalizedText;
	clientdescription: LocalizedText;
	clientimagegallery: HeroImage[];

	projecttitle: LocalizedText;

	createdAt: Date;
	updatedAt: Date;
}

/**
 * Hero information form data
 */
export interface HeroInfoFormData {
	title: LocalizedText;
	description: LocalizedText;
	gallery: HeroImage[];

	productitle: LocalizedText;
	productdescription: LocalizedText;

	servicetitle: LocalizedText;
	servicedesription: LocalizedText;

	machinetitle: LocalizedText;
	machinedescription: LocalizedText;
	machinebackgroundimage: HeroSingleImage;

	machine1title: LocalizedText;
	machine1subtitle: LocalizedText;
	machine1description: LocalizedText;
	machine1image: HeroSingleImage;

	machine2title: LocalizedText;
	machine2subtitle: LocalizedText;
	machine2description: LocalizedText;
	machine2image: HeroSingleImage;

	machine3title: LocalizedText;
	machine3subtitle: LocalizedText;
	machine3description: LocalizedText;
	machine3image: HeroSingleImage;

	clienttitle: LocalizedText;
	clientdescription: LocalizedText;
	clientimagegallery: HeroImage[];

	projecttitle: LocalizedText;
}