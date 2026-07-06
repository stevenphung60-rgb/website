import { getDatabase } from "src/lib/database";
import type { BlogPostDocument } from "./blog.types";

export async function deleteBlogPost(id: string): Promise<void> {
	const db = await getDatabase();
	await db.collection<BlogPostDocument>("blogPosts").deleteOne({ id });
}
