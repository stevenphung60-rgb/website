import Link from "next/link";
import { AdminFormSection } from "src/components/admin/admin-form-section";
import { AdminStickyActions } from "src/components/admin/admin-sticky-actions";
import { Button } from "src/components/ui/button";
import { SITE_FONT_OPTIONS } from "src/lib/font-presets";
import type { BlogCategory, BlogPost } from "src/server/blogs";
import { DEFAULT_BLOG_APPEARANCE } from "src/server/blogs";
import { createBlogPostAction, updateBlogPostAction } from "./blog.actions";
import { BlogGallerySelector } from "./blog-gallery-selector";
import { BlogRelatedContentSelector, type RelatedContentOption } from "./blog-related-content-selector";
import { BlogRichTextEditor } from "./blog-rich-text-editor";

interface BlogRelatedOptions {
	products: RelatedContentOption[];
	productCategories: RelatedContentOption[];
	services: RelatedContentOption[];
	projects: RelatedContentOption[];
	projectCategories: RelatedContentOption[];
	blogPosts: RelatedContentOption[];
}

interface BlogPostFormProps {
	blogPost?: BlogPost | null;
	categories: BlogCategory[];
	relatedOptions: BlogRelatedOptions;
}

function toInputDateTime(value: Date | null | undefined) {
	if (!value) return "";
	const date = new Date(value);
	date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
	return date.toISOString().slice(0, 16);
}

/**
 * Blog post create/edit form
 * @param props - Blog post form props
 * @returns Blog post form
 */
export function BlogPostForm({ blogPost, categories, relatedOptions }: BlogPostFormProps) {
	const isEditing = Boolean(blogPost);
	const appearance = blogPost?.appearance || DEFAULT_BLOG_APPEARANCE;
	const fontOptions = Object.entries(SITE_FONT_OPTIONS);

	return (
		<form action={isEditing ? updateBlogPostAction : createBlogPostAction} className="space-y-6">
			{blogPost ? <input type="hidden" name="blogPostId" value={blogPost.id} /> : null}

			<AdminFormSection
				title="Thông tin blog"
				description="Nhập tiêu đề, mô tả ngắn, loại blog và trạng thái hiển thị. Slug và SEO sẽ được tự tạo từ tiêu đề và mô tả."
			>
				<div className="grid gap-5 lg:grid-cols-2">
					<label className="space-y-2">
						<span className="text-sm font-semibold text-[#342312]">Tiêu đề tiếng Việt *</span>
						<input name="titleVi" defaultValue={blogPost?.title.vi || ""} required className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" />
					</label>

					<label className="space-y-2">
						<span className="text-sm font-semibold text-[#342312]">Tiêu đề tiếng Anh</span>
						<input name="titleEn" defaultValue={blogPost?.title.en || ""} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" />
					</label>

					<label className="space-y-2 lg:col-span-2">
						<span className="text-sm font-semibold text-[#342312]">Mô tả ngắn tiếng Việt</span>
						<textarea name="excerptVi" defaultValue={blogPost?.excerpt.vi || ""} rows={3} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" />
					</label>

					<label className="space-y-2 lg:col-span-2">
						<span className="text-sm font-semibold text-[#342312]">Mô tả ngắn tiếng Anh</span>
						<textarea name="excerptEn" defaultValue={blogPost?.excerpt.en || ""} rows={3} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" />
					</label>

					<label className="space-y-2">
						<span className="text-sm font-semibold text-[#342312]">Loại blog</span>
						<select name="categoryId" defaultValue={blogPost?.categoryId || ""} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm">
							<option value="">Chưa chọn</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name.vi || category.name.en}
								</option>
							))}
						</select>
					</label>

					<label className="space-y-2">
						<span className="text-sm font-semibold text-[#342312]">Tags</span>
						<input name="tags" defaultValue={blogPost?.tags.join(", ") || ""} placeholder="HVAC, PCCC, EI60" className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" />
					</label>

					<label className="space-y-2">
						<span className="text-sm font-semibold text-[#342312]">Trạng thái</span>
						<select name="status" defaultValue={blogPost?.status || "draft"} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm">
							<option value="draft">Nháp</option>
							<option value="published">Đã xuất bản</option>
							<option value="hidden">Ẩn</option>
						</select>
					</label>

					<label className="space-y-2">
						<span className="text-sm font-semibold text-[#342312]">Ngày đăng</span>
						<input type="datetime-local" name="publishedAt" defaultValue={toInputDateTime(blogPost?.publishedAt)} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" />
					</label>

					<label className="flex items-center gap-2">
						<input type="checkbox" name="isFeatured" defaultChecked={blogPost?.isFeatured || false} />
						<span className="text-sm font-semibold text-[#342312]">Bài nổi bật</span>
					</label>
				</div>
			</AdminFormSection>

			<BlogGallerySelector fieldName="gallery" defaultImages={blogPost?.gallery || []} />

			<BlogRichTextEditor fieldName="contentHtmlVi" label="Nội dung tiếng Việt" defaultHtml={blogPost?.content.vi || ""} />
			<BlogRichTextEditor fieldName="contentHtmlEn" label="Nội dung tiếng Anh" defaultHtml={blogPost?.content.en || ""} />

			<AdminFormSection
				title="Kiểu hiển thị bài viết"
				description="Nếu không chọn riêng, bài viết sẽ dùng font theo cấu hình website."
			>
				<div className="grid gap-5 lg:grid-cols-3">
					<label className="space-y-2">
						<span className="text-sm font-semibold text-[#342312]">Font tiêu đề</span>
						<select name="headingFontId" defaultValue={appearance.headingFontId} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm">
							<option value="site">Theo website</option>
							{fontOptions.map(([fontId, font]) => (
								<option key={fontId} value={fontId}>
									{font.label}
								</option>
							))}
						</select>
					</label>

					<label className="space-y-2">
						<span className="text-sm font-semibold text-[#342312]">Font nội dung</span>
						<select name="bodyFontId" defaultValue={appearance.bodyFontId} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm">
							<option value="site">Theo website</option>
							{fontOptions.map(([fontId, font]) => (
								<option key={fontId} value={fontId}>
									{font.label}
								</option>
							))}
						</select>
					</label>

					<label className="space-y-2">
						<span className="text-sm font-semibold text-[#342312]">Cỡ chữ nội dung</span>
						<select name="bodySize" defaultValue={appearance.bodySize} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm">
							<option value="compact">Gọn</option>
							<option value="standard">Chuẩn</option>
							<option value="comfortable">Dễ đọc</option>
							<option value="large">Lớn</option>
						</select>
					</label>

					<label className="space-y-2">
						<span className="text-sm font-semibold text-[#342312]">Giãn dòng</span>
						<select name="lineHeight" defaultValue={appearance.lineHeight} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm">
							<option value="compact">Gọn</option>
							<option value="standard">Chuẩn</option>
							<option value="relaxed">Rộng</option>
						</select>
					</label>

					<label className="space-y-2">
						<span className="text-sm font-semibold text-[#342312]">Độ rộng bài</span>
						<select name="contentWidth" defaultValue={appearance.contentWidth} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm">
							<option value="narrow">Hẹp</option>
							<option value="standard">Vừa</option>
							<option value="wide">Rộng</option>
						</select>
					</label>
				</div>
			</AdminFormSection>

			<BlogRelatedContentSelector
				products={relatedOptions.products}
				productCategories={relatedOptions.productCategories}
				services={relatedOptions.services}
				projects={relatedOptions.projects}
				projectCategories={relatedOptions.projectCategories}
				blogPosts={relatedOptions.blogPosts}
				defaultProductIds={blogPost?.relatedProductIds || []}
				defaultProductCategoryIds={blogPost?.relatedProductCategoryIds || []}
				defaultServiceIds={blogPost?.relatedServiceIds || []}
				defaultProjectIds={blogPost?.relatedProjectIds || []}
				defaultProjectCategoryIds={blogPost?.relatedProjectCategoryIds || []}
				defaultBlogPostIds={blogPost?.relatedBlogPostIds || []}
			/>

			<AdminStickyActions note="Slug và SEO cơ bản sẽ được tự tạo từ tiêu đề, mô tả và ảnh chính trong gallery.">
				<Button asChild type="button" variant="outline" className="border-[#E7D0AF] bg-white text-[#342312]">
					<Link href="/admin/blogs">Hủy</Link>
				</Button>

				<Button type="submit" className="bg-[#342312] text-[#E7D0AF] hover:bg-[#23160B]">
					{isEditing ? "Lưu thay đổi" : "Tạo blog"}
				</Button>
			</AdminStickyActions>
		</form>
	);
}
