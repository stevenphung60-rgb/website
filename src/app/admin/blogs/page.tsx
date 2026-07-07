import { FileText, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { AdminEmptyState } from "src/components/admin/admin-empty-state";
import { AdminPageHeader } from "src/components/admin/admin-page-header";
import { Button } from "src/components/ui/button";
import { Card, CardContent } from "src/components/ui/card";
import { getBlogPosts } from "src/server/blogs";
import { BlogsList } from "./blogs-list";

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

	const blogPosts = await getBlogPosts();
	const blogPostIds = blogPosts.map((blogPost) => blogPost.id);
	const publishedCount = blogPosts.filter(
		(blogPost) => blogPost.status === "published",
	).length;
	const draftCount = blogPosts.filter(
		(blogPost) => blogPost.status === "draft",
	).length;
	const featuredCount = blogPosts.filter((blogPost) => blogPost.isFeatured).length;
	const hasBlogPosts = blogPostIds.length > 0;

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

			<div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
				<BlogMetricCard label="Tổng blog" value={blogPosts.length} />
				<BlogMetricCard label="Đã xuất bản" value={publishedCount} />
				<BlogMetricCard label="Bản nháp" value={draftCount} />
				<BlogMetricCard label="Bài nổi bật" value={featuredCount} />
			</div>

			{hasBlogPosts ? (
				<BlogsList blogPostIds={blogPostIds} />
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

/**
 * Blog metric card
 * @param props - Metric card props
 * @returns Metric card
 */
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
