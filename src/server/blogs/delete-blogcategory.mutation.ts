import { getDatabase } from "src/lib/database";
import type { BlogCategoryDocument, BlogPostDocument } from "./blog.types";

export async function deleteBlogCategory(id: string): Promise<void> {
	const db = await getDatabase();

	await db.collection<BlogCategoryDocument>("blogCategories").deleteOne({ id });
	await db.collection<BlogPostDocument>("blogPosts").updateMany(
		{ categoryId: id },
		{
			$set: {
				categoryId: "",
				updatedAt: new Date(),
			},
		},
	);
}
