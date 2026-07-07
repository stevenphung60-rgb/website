import { Edit, FileText, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
	CancelButton,
	ConfirmButton,
	ConfirmDialog,
	Form,
	FormErrorDisplay,
	FormPendingMessage,
	FormSubmitMessage,
	SubmitButton,
} from "src/components/form-state";
import { Button } from "src/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "src/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";
import { getBlogCategoryById, getBlogPostById } from "src/server/blogs";
import { getMainBlogImage } from "src/server/blogs/blog-utils";
import { deleteBlogPostAction } from "./blog.actions";

interface BlogRowProps {
	blogPostId: string;
}

function getBlogStatusLabel(status: string): string {
	if (status === "published") return "Đã xuất bản";
	if (status === "hidden") return "Ẩn";
	return "Nháp";
}

function getBlogStatusClassName(status: string): string {
	if (status === "published") return "border-green-200 bg-green-50 text-green-700";
	if (status === "hidden") return "border-slate-200 bg-slate-50 text-slate-600";
	return "border-yellow-200 bg-yellow-50 text-yellow-700";
}

function formatDate(value: Date | string | null | undefined): string {
	if (!value) return "Chưa đăng";

	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return "Chưa đăng";
	}

	return date.toLocaleDateString("vi-VN", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
}

/**
 * Display a single blog row in the admin list
 * @param props - Blog row props
 * @returns Blog row with dropdown actions
 */
export async function BlogRow({ blogPostId }: BlogRowProps) {
	const blogPost = await getBlogPostById(blogPostId);

	if (!blogPost) {
		throw new Error(`Blog post with id ${blogPostId} not found`);
	}

	const category = blogPost.categoryId
		? await getBlogCategoryById(blogPost.categoryId)
		: null;
	const titleVi = blogPost.title.vi || blogPost.title.en || "Chưa có tiêu đề";
	const titleEn = blogPost.title.en || "Chưa có tiêu đề tiếng Anh";
	const categoryName = category?.name.vi || category?.name.en || "Chưa phân loại";
	const mainImage = getMainBlogImage(blogPost.gallery) || blogPost.coverImage;
	const statusLabel = getBlogStatusLabel(blogPost.status);
	const publishedDate = formatDate(blogPost.publishedAt);
	const updatedDate = formatDate(blogPost.updatedAt);

	return (
		<div className="bg-white px-4 py-4 transition-colors hover:bg-[#FAF7F1] sm:px-5">
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-[5rem_minmax(0,1.45fr)_minmax(0,0.8fr)_8rem_9rem_5rem] lg:items-center lg:gap-4">
				<div className="flex items-start gap-4 lg:block">
					<div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-[#E7D0AF] bg-[#FAF7F1] lg:size-16">
						{mainImage?.url ? (
							<Image
								src={mainImage.url}
								alt={mainImage.alt?.vi || titleVi}
								fill
								className="object-cover"
								sizes="80px"
							/>
						) : (
							<div className="flex size-full items-center justify-center">
								<FileText className="size-7 text-[#342312]/45" />
							</div>
						)}
					</div>

					<div className="min-w-0 lg:hidden">
						<h3 className="break-words text-base font-semibold text-[#342312]">
							{titleVi}
						</h3>

						<p className="mt-1 break-words text-sm text-[#342312]/65">
							{titleEn}
						</p>

						<div className="mt-3 flex flex-wrap items-center gap-2">
							<BlogStatusBadge status={blogPost.status} label={statusLabel} />
							{blogPost.isFeatured ? (
								<span className="rounded-full border border-[#E7D0AF] bg-white px-2.5 py-1 text-xs font-semibold text-[#342312]/70">
									Nổi bật
								</span>
							) : null}
						</div>
					</div>
				</div>

				<div className="hidden min-w-0 lg:block">
					<h3 className="truncate text-sm font-semibold text-[#342312]">
						{titleVi}
					</h3>

					<p className="mt-1 truncate text-sm text-[#342312]/65">{titleEn}</p>

					<p className="mt-1 truncate text-xs text-[#342312]/50">
						Cập nhật: {updatedDate}
						{blogPost.isFeatured ? " · Nổi bật" : ""}
					</p>
				</div>

				<div className="min-w-0 lg:block">
					<p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55 lg:hidden">
						Loại blog
					</p>

					<p className="truncate text-sm text-[#342312]/75">{categoryName}</p>
				</div>

				<div className="hidden lg:block">
					<BlogStatusBadge status={blogPost.status} label={statusLabel} />
				</div>

				<div className="min-w-0 lg:block">
					<p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55 lg:hidden">
						Ngày đăng
					</p>

					<p className="truncate text-sm text-[#342312]/70">{publishedDate}</p>
				</div>

				<div className="flex items-center justify-end">
					<Form action={deleteBlogPostAction} confirmBeforeSubmit>
						<input type="hidden" name="blogPostId" value={blogPost.id} />

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="text-[#342312]">
									<MoreHorizontal className="size-4" />
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuContent align="end" className="w-52 bg-white">
								<DropdownMenuItem asChild className="flex items-center gap-2">
									<Link href={`/admin/blogs/${blogPost.id}/edit`}>
										<Edit className="size-4" />
										Sửa thông tin
									</Link>
								</DropdownMenuItem>

								<SubmitButton asChild className="flex w-full items-center gap-2">
									<DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
										<Trash2 className="size-4" />
										Xóa blog
									</DropdownMenuItem>
								</SubmitButton>
							</DropdownMenuContent>
						</DropdownMenu>

						<ConfirmDialog>
							<DialogContent className="bg-white sm:max-w-2xl">
								<DialogHeader className="space-y-3">
									<div className="flex items-start gap-3">
										<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
											<Trash2 className="size-5 text-destructive" />
										</div>

										<div className="space-y-1">
											<DialogTitle>Xóa blog</DialogTitle>

											<DialogDescription>
												Thao tác này không thể hoàn tác. Blog sẽ bị xóa khỏi hệ thống.
											</DialogDescription>
										</div>
									</div>
								</DialogHeader>

								<div className="space-y-3">
									<div className="rounded-xl border border-[#E7D0AF] bg-[#FAF7F1] p-4">
										<p className="font-medium text-[#342312]">{titleVi}</p>

										<p className="mt-1 text-sm text-[#342312]/65">{titleEn}</p>

										<p className="mt-2 text-xs text-[#342312]/65">
											Ngày đăng: {publishedDate}
										</p>
									</div>

									<FormErrorDisplay />
								</div>

								<DialogFooter className="gap-2">
									<CancelButton>Hủy</CancelButton>

									<ConfirmButton variant="destructive">
										<FormSubmitMessage>Xóa blog</FormSubmitMessage>
										<FormPendingMessage>Đang xóa...</FormPendingMessage>
									</ConfirmButton>
								</DialogFooter>
							</DialogContent>
						</ConfirmDialog>
					</Form>
				</div>
			</div>
		</div>
	);
}

interface BlogStatusBadgeProps {
	status: string;
	label: string;
}

function BlogStatusBadge({ status, label }: BlogStatusBadgeProps) {
	return (
		<span
			className={[
				"inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
				getBlogStatusClassName(status),
			].join(" ")}
		>
			{label}
		</span>
	);
}
