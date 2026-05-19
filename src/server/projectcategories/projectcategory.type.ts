import type { MultilingualText } from "src/lib/types/common.type";

export type { MultilingualText };

/**
 * Database document type for project categories
 */
export interface ProjectCategoryDocument {
	id: string;
	name: MultilingualText;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Client-facing project category
 */
export interface ProjectCategory {
	id: string;
	name: MultilingualText;
	createdAt: Date;
	updatedAt: Date;
}