import type { MultilingualText } from "src/lib/types/common.type";

export type { MultilingualText };

/**
 * Database document type for product categories
 */
export interface ProductCategoryDocument {
	id: string;
	name: MultilingualText;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Client-facing product category
 */
export interface ProductCategory {
	id: string;
	name: MultilingualText;
	createdAt: Date;
	updatedAt: Date;
}