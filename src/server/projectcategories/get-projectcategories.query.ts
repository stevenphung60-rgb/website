import { getDatabase } from "src/lib/database";
import type { ProjectCategoryDocument, ProjectCategory } from "./projectcategory.type";

export async function getProjectCategories(): Promise<ProjectCategory[]> {
	const db = await getDatabase();

	const categories = await db
		.collection<ProjectCategoryDocument>("projectCategories")
		.find({})
		.sort({ createdAt: -1 })
		.toArray();

	return categories.map((category) => ({
		id: category.id,
		name: category.name,
		createdAt: category.createdAt,
		updatedAt: category.updatedAt,
	}));
}