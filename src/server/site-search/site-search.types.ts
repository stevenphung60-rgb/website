export type SiteSearchResultType = "product" | "service" | "project" | "blog";

export interface SiteSearchResult {
	id: string;
	type: SiteSearchResultType;
	label: string;
	title: string;
	description: string;
	href: string;
	score: number;
}

export interface SiteSearchInput {
	query: string;
	locale: "vi" | "en";
	limit?: number;
}
