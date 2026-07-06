import { Edit, FileText, Plus, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { AdminEmptyState } from "src/components/admin/admin-empty-state";
import { AdminPageHeader } from "src/components/admin/admin-page-header";
import { Button } from "src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { getBlogCategories, getBlogPosts } from "src/server/blogs";
import { deleteBlogPostAction } from "./blog.actions";

export const metadata: Metadata = {
	title: "Blog - Admin - Nghiệp Hưng",
	description: "Quản lý blog website",
};

/**
 * Blog post management page
 * @returns Blog post admin page
 */
export default async function AdminBlogsPage() {
	await connection();

	const [blogPosts, categories] = await Promise.all([
		getBlogPosts(),
		getBlogCategories(),
	]);
	const categoryMap = new Map(categories.map((category) => [category.id, category]));
	const publishedCount = blogPosts.filter((blogPost) => blogPost.status === "published").length;
	const draftCount = blogPosts.filter((blogPost) => blogPost.status === "draft").length;
	const featuredCount = blogPosts.filter((blogPost) => blogPost.isFeatured).length;
	const hasBlogPosts = blogPosts.length > 0;

	return (
		<div className="w-full">
			<AdminPageHeader
				title="Blog"
				eyebrow="Quản trị nội dung"
				description="Quản lý bài blog hiển thị trên website."
				icon={FileText}
				actions={
					<Button
						asChild
						className="bg-[#342312] text-[#E7D0AF] hover:bg-[#23160B]"
					>
						<Link href="/admin/blogs/new">
							<Plus className="mr-2 size-4" />
							Thêm blog
						</Link>
					</Button>
				}
			/>

			<div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
				<BlogMetricCard label="Tổng blog" value={blogPosts.length} />
				<BlogMetricCard label="Đã xuất bản" value={publishedCount} />
				<BlogMetricCard label="Bài nổi bật" value={featuredCount} />
			</div>

			{hasBlogPosts ? (
				<Card className="border-[#E7D0AF] bg-white shadow-sm">
					<CardHeader className="border-b border-[#E7D0AF]/70">
						<CardTitle className="font-serif text-xl text-[#342312]">
							Danh sách blog
						</CardTitle>
					</CardHeader>

					<CardContent className="p-0">
						<div className="hidden border-b border-[#E7D0AF]/70 bg-[#FAF7F1] px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/65 lg:grid lg:grid-cols-[minmax(0,1fr)_10rem_8rem_8rem] lg:gap-4">
							<div>Blog</div>
							<div>Trạng thái</div>
							<div>Loại</div>
							<div className="text-right">Thao tác</div>
						</div>

						<div className="divide-y divide-[#E7D0AF]/70">
							{blogPosts.map((blogPost) => {
								const category = blogPost.categoryId
									? categoryMap.get(blogPost.categoryId)
									: null;

								return (
									<div
										key={blogPost.id}
										className="grid grid-cols-1 gap-4 px-5 py-4 lg:grid-cols-[minmax(0,1fr)_10rem_8rem_8rem] lg:items-center lg:gap-4"
									>
										<div className="min-w-0">
											<p className="truncate text-sm font-semibold text-[#342312]">
												{blogPost.title.vi || blogPost.title.en}
											</p>

											<p className="mt-1 truncate text-xs text-[#342312]/60">
												/{blogPost.slug.vi || blogPost.slug.en}
												{blogPost.isFeatured ? " · Nổi bật" : ""}
											</p>
										</div>

										<p className="text-sm capitalize text-[#342312]/70">
											{blogPost.status === "published"
												? "Đã xuất bản"
												: blogPost.status === "hidden"
													? "Ẩn"
													: "Nháp"}
										</p>

										<p className="text-sm text-[#342312]/70">
											{category?.name.vi || category?.name.en || "Chưa chọn"}
										</p>

										<div className="flex items-center justify-end gap-2">
											<Button asChild variant="outline" size="sm">
												<Link href={`/admin/blogs/${blogPost.id}/edit`}>
													<Edit className="mr-1 size-4" />
													Sửa
												</Link>
											</Button>

											<form action={deleteBlogPostAction}>
												<input
													type="hidden"
													name="blogPostId"
													value={blogPost.id}
												/>

												<Button type="submit" variant="destructive" size="sm">
													<Trash2 className="mr-1 size-4" />
													Xóa
												</Button>
											</form>
										</div>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			) : (
				<AdminEmptyState
					icon={<FileText className="size-7" />}
					title="Chưa có blog nào"
					description="Thêm blog đầu tiên để chia sẻ kiến thức, tiêu chuẩn kỹ thuật và giải pháp cho khách hàng."
					action={
						<Button
							asChild
							className="bg-[#342312] text-[#E7D0AF] hover:bg-[#23160B]"
						>
							<Link href="/admin/blogs/new">
								<Plus className="mr-2 size-4" />
								Thêm blog
							</Link>
						</Button>
					}
				/>
			)}
		</div>
	);
}

interface BlogMetricCardProps {
	label: string;
	value: number;
}

function BlogMetricCard({ label, value }: BlogMetricCardProps) {
	return (
		<Card className="border-[#E7D0AF] bg-white">
			<CardContent className="px-5 py-5">
				<div className="flex items-center justify-between gap-4">
					<div>
						<p className="text-sm font-medium text-[#342312]/65">{label}</p>

						<p className="mt-2 text-3xl font-bold text-[#342312]">{value}</p>
					</div>

					<div className="flex size-12 items-center justify-center rounded-xl bg-[#342312]/10">
						<FileText className="size-6 text-[#342312]" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
