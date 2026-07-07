import { Tags } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { AdminEmptyState } from "src/components/admin/admin-empty-state";
import { AdminPageHeader } from "src/components/admin/admin-page-header";
import { Card, CardContent } from "src/components/ui/card";
import { getBlogCategoryIds } from "src/server/blogs";
import { BlogCategoriesList } from "./blogcategories-list";
import { CreateBlogCategoryDialog } from "./create-blogcategory-dialog";

export const metadata: Metadata = {
	title: "Loại blog - Admin - Nghiệp Hưng",
	description: "Quản lý loại blog",
};

/**
 * Blog categories management page
 * @returns Blog categories admin page
 */
export default async function AdminBlogCategoriesPage() {
	await connection();

	const blogCategoryIds = await getBlogCategoryIds();
	const hasCategories = blogCategoryIds.length > 0;

	return (
		<div className="w-full">
			<AdminPageHeader
				title="Loại blog"
				eyebrow="Quản trị nội dung"
				description="Quản lý loại blog hiển thị trên website."
				icon={Tags}
				actions={<CreateBlogCategoryDialog />}
			/>

			<div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
				<Card className="border-[#E7D0AF] bg-white">
					<CardContent className="px-5 py-5">
						<div className="flex items-center justify-between gap-4">
							<div>
								<p className="text-sm font-medium text-[#342312]/65">
									Tổng loại blog
								</p>

								<p className="mt-2 text-3xl font-bold text-[#342312]">
									{blogCategoryIds.length}
								</p>
							</div>

							<div className="flex size-12 items-center justify-center rounded-xl bg-[#342312]/10">
								<Tags className="size-6 text-[#342312]" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{hasCategories ? (
				<BlogCategoriesList blogCategoryIds={blogCategoryIds} />
			) : (
				<AdminEmptyState
					icon={<Tags className="size-7" />}
					title="Chưa có loại blog nào"
					description="Thêm loại blog đầu tiên để phân nhóm bài viết trên website."
					action={<CreateBlogCategoryDialog />}
				/>
			)}
		</div>
	);
}
