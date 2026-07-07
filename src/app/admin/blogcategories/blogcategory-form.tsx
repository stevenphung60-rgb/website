import { AdminFormSection } from "src/components/admin/admin-form-section";
import { AdminStickyActions } from "src/components/admin/admin-sticky-actions";
import { Button } from "src/components/ui/button";
import { DialogClose } from "src/components/ui/dialog";
import type { BlogCategory } from "src/server/blogs";
import { saveBlogCategoryAction } from "./blogcategory.actions";

interface BlogCategoryFormProps {
	category?: BlogCategory | null;
}

export function BlogCategoryForm({ category }: BlogCategoryFormProps) {
	return (
		<form action={saveBlogCategoryAction} className="space-y-6">
			{category ? <input type="hidden" name="blogCategoryId" value={category.id} /> : null}

			<AdminFormSection
				title="Thông tin loại blog"
				description="Nhập tên và mô tả loại blog. Slug sẽ được hệ thống tự tạo từ tên loại blog."
			>
				<div className="grid gap-5 lg:grid-cols-2">
					<label className="space-y-2">
						<span className="text-sm font-semibold text-[#342312]">
							Tên loại blog tiếng Việt *
						</span>
						<input
							name="nameVi"
							defaultValue={category?.name.vi || ""}
							required
							className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm"
						/>
					</label>

					<label className="space-y-2">
						<span className="text-sm font-semibold text-[#342312]">
							Tên loại blog tiếng Anh
						</span>
						<input
							name="nameEn"
							defaultValue={category?.name.en || ""}
							className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm"
						/>
					</label>

					<label className="space-y-2 lg:col-span-2">
						<span className="text-sm font-semibold text-[#342312]">
							Mô tả tiếng Việt
						</span>
						<textarea
							name="descriptionVi"
							defaultValue={category?.description.vi || ""}
							rows={3}
							className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm"
						/>
					</label>

					<label className="space-y-2 lg:col-span-2">
						<span className="text-sm font-semibold text-[#342312]">
							Mô tả tiếng Anh
						</span>
						<textarea
							name="descriptionEn"
							defaultValue={category?.description.en || ""}
							rows={3}
							className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm"
						/>
					</label>
				</div>
			</AdminFormSection>

			<AdminStickyActions note="Sau khi lưu, loại blog có thể dùng để phân nhóm bài viết.">
				<DialogClose asChild>
					<Button
						type="button"
						variant="outline"
						className="border-[#E7D0AF] bg-white text-[#342312]"
					>
						Hủy
					</Button>
				</DialogClose>

				<Button type="submit" className="bg-[#342312] text-[#E7D0AF] hover:bg-[#23160B]">
					{category ? "Lưu thay đổi" : "Tạo loại blog"}
				</Button>
			</AdminStickyActions>
		</form>
	);
}
