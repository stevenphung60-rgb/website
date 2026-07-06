import { Edit, FileText, Plus, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "src/components/admin/admin-page-header";
import { Button } from "src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { getBlogCategories, getBlogPosts } from "src/server/blogs";
import { deleteBlogPostAction } from "./blog.actions";

export const metadata: Metadata = {
	title: "Blog - Admin - Nghiệp Hưng",
	description: "Quản lý blog website",
};

export default async function AdminBlogsPage() {
	const [blogPosts, categories] = await Promise.all([
		getBlogPosts(),
		getBlogCategories(),
	]);
	const categoryMap = new Map(categories.map((category) => [category.id, category]));

	return (
		<div className="w-full space-y-6">
			<AdminPageHeader
				title="Blog"
				eyebrow="Quản trị nội dung"
				description="Quản lý bài blog hiển thị trên website."
				icon={FileText}
				actions={<Button asChild className="bg-[#342312] text-[#E7D0AF] hover:bg-[#23160B]"><Link href="/admin/blogs/new"><Plus className="mr-2 size-4" />Thêm blog</Link></Button>}
			/>

			<Card className="border-[#E7D0AF] bg-white shadow-sm">
				<CardHeader className="border-b border-[#E7D0AF]/70">
					<CardTitle className="font-serif text-xl text-[#342312]">Danh sách blog</CardTitle>
				</CardHeader>

				<CardContent className="p-0">
					{blogPosts.length > 0 ? (
						<div className="divide-y divide-[#E7D0AF]/70">
							{blogPosts.map((blogPost) => {
								const category = blogPost.categoryId ? categoryMap.get(blogPost.categoryId) : null;

								return (
									<div key={blogPost.id} className="grid grid-cols-1 gap-4 px-5 py-4 lg:grid-cols-[minmax(0,1fr)_10rem_8rem_8rem] lg:items-center">
										<div className="min-w-0">
											<p className="truncate text-sm font-semibold text-[#342312]">{blogPost.title.vi || blogPost.title.en}</p>
											<p className="mt-1 text-xs text-[#342312]/60">{category?.name.vi || category?.name.en || "Chưa chọn loại"}</p>
										</div>

										<p className="text-sm capitalize text-[#342312]/70">{blogPost.status}</p>
										<p className="text-sm text-[#342312]/70">{blogPost.isFeatured ? "Nổi bật" : "Thường"}</p>

										<div className="flex items-center justify-end gap-2">
											<Button asChild variant="outline" size="sm"><Link href={`/admin/blogs/${blogPost.id}/edit`}><Edit className="mr-1 size-4" />Sửa</Link></Button>
											<form action={deleteBlogPostAction}>
												<input type="hidden" name="blogPostId" value={blogPost.id} />
												<Button type="submit" variant="destructive" size="sm"><Trash2 className="mr-1 size-4" />Xóa</Button>
											</form>
										</div>
									</div>
								);
							})}
						</div>
					) : (
						<div className="px-5 py-10 text-center text-sm text-[#342312]/65">Chưa có blog nào.</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
