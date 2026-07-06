import { Edit, FileText } from "lucide-react";
import { Button } from "src/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "src/components/ui/dialog";
import type { BlogCategory } from "src/server/blogs";
import { BlogCategoryForm } from "./blogcategory-form";

interface EditBlogCategoryDialogProps {
	blogCategory: BlogCategory;
}

/**
 * Edit blog category dialog
 * @param props - Edit blog category dialog props
 * @returns Edit blog category dialog
 */
export function EditBlogCategoryDialog({ blogCategory }: EditBlogCategoryDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button type="button" variant="outline" size="sm">
					<Edit className="mr-1 size-4" />
					Sửa
				</Button>
			</DialogTrigger>

			<DialogContent className="max-h-[95vh] w-[95vw] max-w-3xl overflow-y-auto bg-[#FAF7F1] p-0">
				<DialogHeader className="sticky top-0 z-10 border-b border-[#E7D0AF] bg-white px-5 py-5 sm:px-6">
					<div className="flex items-start gap-4">
						<div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#342312]/10 text-[#342312]">
							<FileText className="size-5" />
						</div>

						<div className="min-w-0">
							<DialogTitle className="break-words font-serif text-2xl font-bold text-[#342312]">
								Sửa loại blog
							</DialogTitle>

							<DialogDescription className="mt-2 break-words text-sm leading-6 text-[#342312]/70">
								Cập nhật thông tin loại blog đang dùng để phân nhóm bài viết.
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="px-5 py-6 sm:px-6">
					<BlogCategoryForm blogCategory={blogCategory} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
