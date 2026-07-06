import { FileText, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import { AdminPageHeader } from "src/components/admin/admin-page-header";
import { Button } from "src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { getBlogCategories } from "src/server/blogs";
import { deleteBlogCategoryAction, saveBlogCategoryAction } from "./blogcategory.actions";

export const metadata: Metadata = {
	title: "Loại blog - Admin - Nghiệp Hưng",
	description: "Quản lý loại blog",
};

export default async function AdminBlogCategoriesPage() {
	const categories = await getBlogCategories();

	return (
		<div className="w-full space-y-6">
			<AdminPageHeader
				title="Loại blog"
				eyebrow="Quản trị nội dung"
				description="Quản lý loại blog dùng để phân nhóm bài viết."
				icon={FileText}
			/>

			<Card className="border-[#E7D0AF] bg-white shadow-sm">
				<CardHeader className="border-b border-[#E7D0AF]/70"><CardTitle className="font-serif text-xl text-[#342312]">Thêm / sửa loại blog</CardTitle></CardHeader>
				<CardContent className="px-5 py-6">
					<form action={saveBlogCategoryAction} className="grid gap-4 lg:grid-cols-2">
						<input name="nameVi" required placeholder="Tên loại blog tiếng Việt" className="rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" />
						<input name="nameEn" placeholder="Tên loại blog tiếng Anh" className="rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" />
						<input name="slugVi" placeholder="slug tiếng Việt" className="rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" />
						<input name="slugEn" placeholder="slug tiếng Anh" className="rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" />
						<textarea name="descriptionVi" placeholder="Mô tả tiếng Việt" rows={3} className="rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm lg:col-span-2" />
						<textarea name="descriptionEn" placeholder="Mô tả tiếng Anh" rows={3} className="rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm lg:col-span-2" />
						<div className="lg:col-span-2"><Button type="submit" className="bg-[#342312] text-[#E7D0AF] hover:bg-[#23160B]">Lưu loại blog</Button></div>
					</form>
				</CardContent>
			</Card>

			<Card className="border-[#E7D0AF] bg-white shadow-sm">
				<CardHeader className="border-b border-[#E7D0AF]/70"><CardTitle className="font-serif text-xl text-[#342312]">Danh sách loại blog</CardTitle></CardHeader>
				<CardContent className="p-0">
					<div className="divide-y divide-[#E7D0AF]/70">
						{categories.map((category) => (
							<div key={category.id} className="grid gap-4 px-5 py-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
								<div>
									<p className="text-sm font-semibold text-[#342312]">{category.name.vi || category.name.en}</p>
									<p className="mt-1 text-xs text-[#342312]/60">/{category.slug.vi || category.slug.en}</p>
								</div>
								<form action={deleteBlogCategoryAction}>
									<input type="hidden" name="blogCategoryId" value={category.id} />
									<Button type="submit" variant="destructive" size="sm"><Trash2 className="mr-1 size-4" />Xóa</Button>
								</form>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
