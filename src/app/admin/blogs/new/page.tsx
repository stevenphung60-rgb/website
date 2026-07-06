import { FileText } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { AdminPageHeader } from "src/components/admin/admin-page-header";
import { getBlogCategories } from "src/server/blogs";
import { BlogPostForm } from "../blog-post-form";
import { getBlogRelatedOptions } from "../blog-related-options";

export const metadata: Metadata = {
	title: "Thêm blog - Admin - Nghiệp Hưng",
	description: "Thêm blog mới",
};

export default async function NewBlogPostPage() {
	await connection();

	const [categories, relatedOptions] = await Promise.all([
		getBlogCategories(),
		getBlogRelatedOptions(),
	]);

	return (
		<div className="w-full space-y-6">
			<AdminPageHeader
				title="Thêm blog"
				eyebrow="Quản trị nội dung"
				description="Tạo bài blog mới cho website. Tiếng Việt là nội dung chính."
				icon={FileText}
			/>

			<BlogPostForm categories={categories} relatedOptions={relatedOptions} />
		</div>
	);
}
