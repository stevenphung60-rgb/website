import { FileText } from "lucide-react";
import type { Metadata } from "next";
import { AdminPageHeader } from "src/components/admin/admin-page-header";
import { getBlogCategories } from "src/server/blogs";
import { BlogPostForm } from "../blog-post-form";

export const metadata: Metadata = {
	title: "Thêm blog - Admin - Nghiệp Hưng",
	description: "Thêm blog mới",
};

export default async function NewBlogPostPage() {
	const categories = await getBlogCategories();

	return (
		<div className="w-full space-y-6">
			<AdminPageHeader
				title="Thêm blog"
				eyebrow="Quản trị nội dung"
				description="Tạo bài blog mới cho website."
				icon={FileText}
			/>

			<BlogPostForm categories={categories} />
		</div>
	);
}
