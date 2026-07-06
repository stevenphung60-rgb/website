import { FileText } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "src/components/admin/admin-page-header";
import { getBlogCategories, getBlogPostById } from "src/server/blogs";
import { BlogPostForm } from "../../blog-post-form";

export const metadata: Metadata = {
	title: "Sửa blog - Admin - Nghiệp Hưng",
	description: "Sửa blog",
};

export default async function EditBlogPostPage({
	params,
}: {
	params: Promise<{ blogId: string }>;
}) {
	const { blogId } = await params;
	const [blogPost, categories] = await Promise.all([
		getBlogPostById(blogId),
		getBlogCategories(),
	]);

	if (!blogPost) {
		notFound();
	}

	return (
		<div className="w-full space-y-6">
			<AdminPageHeader
				title="Sửa blog"
				eyebrow="Quản trị nội dung"
				description={blogPost.title.vi || blogPost.title.en || "Cập nhật bài blog"}
				icon={FileText}
			/>

			<BlogPostForm blogPost={blogPost} categories={categories} />
		</div>
	);
}
