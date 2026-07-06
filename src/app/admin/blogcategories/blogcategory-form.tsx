import { AdminFormSection } from "src/components/admin/admin-form-section";
import { AdminStickyActions } from "src/components/admin/admin-sticky-actions";
import { Button } from "src/components/ui/button";
import { DialogClose } from "src/components/ui/dialog";
import type { BlogCategory } from "src/server/blogs";
import { saveBlogCategoryAction } from "./blogcategory.actions";

interface BlogCategoryFormProps {
	blogCategory?: BlogCategory | null;
}

/**
 * Blog category create/edit form
 * @param props - Blog category form props
 * @returns Blog category form
 */
export function BlogCategoryForm({ blogCategory }: BlogCategoryFormProps) {
	const isEditing = Boolean(blogCategory);

	return (
		<form action={saveBlogCategoryAction}>
			{blogCategory ? (
				<input type="hidden" name="blogCategoryId" value={blogCategory.id} />
			) : null}

			<div className="space-y-6">
				<AdminFormSection
					title="Thông tin loại blog"
					description="Nhập tên và slug của loại blog. Tiếng Việt là nội dung chính trên website."
				>
					<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
						<label className="space-y-2">
							<span className="text-sm font-semibold text-[#342312]">
								Tên loại blog tiếng Việt
							</span>

							<input
								name="nameVi"
								required
								defaultValue={blogCategory?.name.vi || ""}
								placeholder="Ví dụ: Kiến thức ống gió"
								className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm text-[#342312] outline-none transition focus:border-[#342312] focus:ring-2 focus:ring-[#342312]/10"
							/>
						</label>

						<label className="space-y-2">
							<span className="text-sm font-semibold text-[#342312]">
								Tên loại blog tiếng Anh
							</span>

							<input
								name="nameEn"
								defaultValue={blogCategory?.name.en || ""}
								placeholder="Ví dụ: Air duct knowledge"
								className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm text-[#342312] outline-none transition focus:border-[#342312] focus:ring-2 focus:ring-[#342312]/10"
							/>
						</label>

						<label className="space-y-2">
							<span className="text-sm font-semibold text-[#342312]">
								Slug tiếng Việt
							</span>

							<input
								name="slugVi"
								defaultValue={blogCategory?.slug.vi || ""}
								placeholder="kien-thuc-ong-gio"
								className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm text-[#342312] outline-none transition focus:border-[#342312] focus:ring-2 focus:ring-[#342312]/10"
							/>
						</label>

						<label className="space-y-2">
							<span className="text-sm font-semibold text-[#342312]">
								Slug tiếng Anh
							</span>

							<input
								name="slugEn"
								defaultValue={blogCategory?.slug.en || ""}
								placeholder="air-duct-knowledge"
								className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm text-[#342312] outline-none transition focus:border-[#342312] focus:ring-2 focus:ring-[#342312]/10"
							/>
						</label>

						<label className="space-y-2 lg:col-span-2">
							<span className="text-sm font-semibold text-[#342312]">
								Mô tả tiếng Việt
							</span>

							<textarea
								name="descriptionVi"
								rows={3}
								defaultValue={blogCategory?.description.vi || ""}
								placeholder="Mô tả ngắn về loại blog này"
								className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm text-[#342312] outline-none transition focus:border-[#342312] focus:ring-2 focus:ring-[#342312]/10"
							/>
						</label>

						<label className="space-y-2 lg:col-span-2">
							<span className="text-sm font-semibold text-[#342312]">
								Mô tả tiếng Anh
							</span>

							<textarea
								name="descriptionEn"
								rows={3}
								defaultValue={blogCategory?.description.en || ""}
								placeholder="English description"
								className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm text-[#342312] outline-none transition focus:border-[#342312] focus:ring-2 focus:ring-[#342312]/10"
							/>
						</label>
					</div>
				</AdminFormSection>

				<AdminStickyActions note="Sau khi lưu, loại blog có thể dùng để phân nhóm bài viết trên website.">
					<DialogClose asChild>
						<Button type="button" variant="outline">
							Hủy
						</Button>
					</DialogClose>

					<Button
						type="submit"
						className="bg-[#342312] text-[#E7D0AF] hover:bg-[#23160B]"
					>
						{isEditing ? "Lưu loại blog" : "Tạo loại blog"}
					</Button>
				</AdminStickyActions>
			</div>
		</form>
	);
}
