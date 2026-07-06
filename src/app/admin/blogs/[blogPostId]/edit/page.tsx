import { FileText } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { AdminPageHeader } from "src/components/admin/admin-page-header";
import { getBlogCategories, getBlogPostById } from "src/server/blogs";
import { BlogPostForm } from "../../blog-post-form";
import { getBlogRelatedOptions } from "../../blog-related-options";

export const metadata: Metadata = {
	title: "Sửa blog - Admin - Nghiệp Hưng",
	description: "Sửa blog",
};

export default async function EditBlogPostPage({
	params,
}: {
	params: Promise<{ blogPostId: string }>;
}) {
	await connection();

	const { blogPostId } = await params;
	const [blogPost, categories, relatedOptions] = await Promise.all([
		getBlogPostById(blogPostId),
		getBlogCategories(),
		getBlogRelatedOptions({ excludeBlogPostId: blogPostId }),
	]);

	if (!blogPost) {
		notFound();
	}

	return (
		<div className="w-full space-y-6">
			<AdminPageHeader
				title="Sửa blog"
				eyebrow="Quản trị nội dung"
				description="Cập nhật nội dung, gallery và liên kết liên quan cho bài blog."
				icon={FileText}
			/>

			<BlogPostForm
				blogPost={blogPost}
				categories={categories}
				relatedOptions={relatedOptions}
			/>
		</div>
	);
}
