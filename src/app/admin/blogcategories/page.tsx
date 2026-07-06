import { FileText, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { AdminEmptyState } from "src/components/admin/admin-empty-state";
import { AdminPageHeader } from "src/components/admin/admin-page-header";
import { Button } from "src/components/ui/button";
import { Card, CardContent } from "src/components/ui/card";
import { getBlogCategories } from "src/server/blogs";
import { deleteBlogCategoryAction } from "./blogcategory.actions";
import { CreateBlogCategoryDialog } from "./create-blogcategory-dialog";
import { EditBlogCategoryDialog } from "./edit-blogcategory-dialog";

export const metadata: Metadata = {
	title: "Loại blog - Admin - Nghiệp Hưng",
	description: "Quản lý loại blog",
};

export default async function AdminBlogCategoriesPage() {
	await connection();

	const categories = await getBlogCategories();
	const hasCategories = categories.length > 0;

	return (
		<div className="w-full">
			<AdminPageHeader
				title="Loại blog"
				eyebrow="Quản trị nội dung"
				description="Quản lý loại blog dùng để phân nhóm bài viết."
				icon={FileText}
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
									{categories.length}
								</p>
							</div>

							<div className="flex size-12 items-center justify-center rounded-xl bg-[#342312]/10">
								<FileText className="size-6 text-[#342312]" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{hasCategories ? (
				<Card className="border-[#E7D0AF] bg-white shadow-sm">
					<CardContent className="p-0">
						<div className="divide-y divide-[#E7D0AF]/70">
							{categories.map((category) => (
								<div
									key={category.id}
									className="grid gap-4 px-5 py-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
								>
									<div className="min-w-0">
										<p className="truncate text-sm font-semibold text-[#342312]">
											{category.name.vi || category.name.en}
										</p>
										<p className="mt-1 text-xs text-[#342312]/60">
											/{category.slug.vi || category.slug.en}
										</p>
									</div>

									<div className="flex items-center justify-end gap-2">
										<EditBlogCategoryDialog category={category} />
										<form action={deleteBlogCategoryAction}>
											<input type="hidden" name="blogCategoryId" value={category.id} />
											<Button type="submit" variant="destructive" size="sm">
												<Trash2 className="mr-1 size-4" />
												Xóa
											</Button>
										</form>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			) : (
				<AdminEmptyState
					icon={<FileText className="size-7" />}
					title="Chưa có loại blog nào"
					description="Thêm loại blog đầu tiên để phân nhóm bài viết trên website."
					action={<CreateBlogCategoryDialog />}
				/>
			)}
		</div>
	);
}
