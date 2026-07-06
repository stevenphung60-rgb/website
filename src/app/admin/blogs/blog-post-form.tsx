import Link from "next/link";
import { Button } from "src/components/ui/button";
import { SITE_FONT_OPTIONS } from "src/lib/font-presets";
import type { BlogCategory, BlogPost } from "src/server/blogs";
import { DEFAULT_BLOG_APPEARANCE, EMPTY_BLOG_IMAGE } from "src/server/blogs";
import { createBlogPostAction, updateBlogPostAction } from "./blog.actions";
import { BlogContentEditor } from "./blog-content-editor";
import { BlogGalleryEditor } from "./blog-gallery-editor";

interface BlogPostFormProps {
	blogPost?: BlogPost | null;
	categories: BlogCategory[];
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
export function BlogPostForm({ blogPost, categories }: BlogPostFormProps) {
	const isEditing = Boolean(blogPost);
	const appearance = blogPost?.appearance || DEFAULT_BLOG_APPEARANCE;
	const coverImage = blogPost?.coverImage || EMPTY_BLOG_IMAGE;
	const fontOptions = Object.entries(SITE_FONT_OPTIONS);

	return (
		<form action={isEditing ? updateBlogPostAction : createBlogPostAction} className="space-y-6">
			{blogPost ? <input type="hidden" name="blogPostId" value={blogPost.id} /> : null}

			<div className="rounded-2xl border border-[#E7D0AF] bg-white p-5 shadow-sm">
				<h2 className="font-serif text-xl font-bold text-[#342312]">Thông tin blog</h2>
				<div className="mt-5 grid gap-5 lg:grid-cols-2">
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">Tiêu đề tiếng Việt</span><input name="titleVi" defaultValue={blogPost?.title.vi || ""} required className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" /></label>
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">Tiêu đề tiếng Anh</span><input name="titleEn" defaultValue={blogPost?.title.en || ""} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" /></label>
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">Slug tiếng Việt</span><input name="slugVi" defaultValue={blogPost?.slug.vi || ""} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" /></label>
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">Slug tiếng Anh</span><input name="slugEn" defaultValue={blogPost?.slug.en || ""} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" /></label>
					<label className="space-y-2 lg:col-span-2"><span className="text-sm font-semibold text-[#342312]">Mô tả ngắn tiếng Việt</span><textarea name="excerptVi" defaultValue={blogPost?.excerpt.vi || ""} rows={3} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" /></label>
					<label className="space-y-2 lg:col-span-2"><span className="text-sm font-semibold text-[#342312]">Mô tả ngắn tiếng Anh</span><textarea name="excerptEn" defaultValue={blogPost?.excerpt.en || ""} rows={3} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" /></label>
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">Loại blog</span><select name="categoryId" defaultValue={blogPost?.categoryId || ""} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm"><option value="">Chưa chọn</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name.vi || category.name.en}</option>)}</select></label>
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">Tags</span><input name="tags" defaultValue={blogPost?.tags.join(", ") || ""} placeholder="HVAC, PCCC, EI60" className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" /></label>
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">Trạng thái</span><select name="status" defaultValue={blogPost?.status || "draft"} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm"><option value="draft">Nháp</option><option value="published">Đã xuất bản</option><option value="hidden">Ẩn</option></select></label>
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">Ngày đăng</span><input type="datetime-local" name="publishedAt" defaultValue={toInputDateTime(blogPost?.publishedAt)} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" /></label>
					<label className="flex items-center gap-2"><input type="checkbox" name="isFeatured" defaultChecked={blogPost?.isFeatured || false} /> <span className="text-sm font-semibold text-[#342312]">Bài nổi bật</span></label>
				</div>
			</div>

			<div className="rounded-2xl border border-[#E7D0AF] bg-white p-5 shadow-sm">
				<h2 className="font-serif text-xl font-bold text-[#342312]">Ảnh đại diện</h2>
				<div className="mt-5 grid gap-5 lg:grid-cols-2">
					<label className="space-y-2 lg:col-span-2"><span className="text-sm font-semibold text-[#342312]">URL ảnh đại diện</span><input name="coverImageUrl" defaultValue={coverImage.url} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" /></label>
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">Alt tiếng Việt</span><input name="coverImageAltVi" defaultValue={coverImage.alt.vi} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" /></label>
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">Alt tiếng Anh</span><input name="coverImageAltEn" defaultValue={coverImage.alt.en} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" /></label>
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">Caption tiếng Việt</span><input name="coverImageCaptionVi" defaultValue={coverImage.caption?.vi || ""} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" /></label>
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">Caption tiếng Anh</span><input name="coverImageCaptionEn" defaultValue={coverImage.caption?.en || ""} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" /></label>
				</div>
			</div>

			<BlogContentEditor fieldName="contentVi" label="Nội dung tiếng Việt" defaultBlocks={blogPost?.content.vi || []} />
			<BlogContentEditor fieldName="contentEn" label="Nội dung tiếng Anh" defaultBlocks={blogPost?.content.en || []} />
			<BlogGalleryEditor fieldName="gallery" label="Gallery ảnh tổng của bài" defaultImages={blogPost?.gallery || []} />

			<div className="rounded-2xl border border-[#E7D0AF] bg-white p-5 shadow-sm">
				<h2 className="font-serif text-xl font-bold text-[#342312]">Kiểu hiển thị bài viết</h2>
				<div className="mt-5 grid gap-5 lg:grid-cols-3">
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">Font tiêu đề</span><select name="headingFontId" defaultValue={appearance.headingFontId} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm"><option value="site">Theo website</option>{fontOptions.map(([fontId, font]) => <option key={fontId} value={fontId}>{font.label}</option>)}</select></label>
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">Font nội dung</span><select name="bodyFontId" defaultValue={appearance.bodyFontId} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm"><option value="site">Theo website</option>{fontOptions.map(([fontId, font]) => <option key={fontId} value={fontId}>{font.label}</option>)}</select></label>
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">Cỡ chữ</span><select name="bodySize" defaultValue={appearance.bodySize} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm"><option value="compact">Gọn</option><option value="standard">Chuẩn</option><option value="comfortable">Dễ đọc</option><option value="large">Lớn</option></select></label>
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">Giãn dòng</span><select name="lineHeight" defaultValue={appearance.lineHeight} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm"><option value="compact">Gọn</option><option value="standard">Chuẩn</option><option value="relaxed">Rộng</option></select></label>
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">Độ rộng bài</span><select name="contentWidth" defaultValue={appearance.contentWidth} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm"><option value="narrow">Hẹp</option><option value="standard">Vừa</option><option value="wide">Rộng</option></select></label>
				</div>
			</div>

			<div className="rounded-2xl border border-[#E7D0AF] bg-white p-5 shadow-sm">
				<h2 className="font-serif text-xl font-bold text-[#342312]">Liên kết nội dung liên quan</h2>
				<div className="mt-5 grid gap-5 lg:grid-cols-2">
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">Sản phẩm liên quan</span><input name="relatedProductIds" defaultValue={blogPost?.relatedProductIds.join(", ") || ""} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" /></label>
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">Dịch vụ liên quan</span><input name="relatedServiceIds" defaultValue={blogPost?.relatedServiceIds.join(", ") || ""} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" /></label>
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">Dự án liên quan</span><input name="relatedProjectIds" defaultValue={blogPost?.relatedProjectIds.join(", ") || ""} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" /></label>
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">Blog liên quan</span><input name="relatedBlogPostIds" defaultValue={blogPost?.relatedBlogPostIds.join(", ") || ""} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" /></label>
				</div>
			</div>

			<div className="rounded-2xl border border-[#E7D0AF] bg-white p-5 shadow-sm">
				<h2 className="font-serif text-xl font-bold text-[#342312]">SEO</h2>
				<div className="mt-5 grid gap-5 lg:grid-cols-2">
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">SEO title VI</span><input name="seoTitleVi" defaultValue={blogPost?.seo.title.vi || ""} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" /></label>
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">SEO title EN</span><input name="seoTitleEn" defaultValue={blogPost?.seo.title.en || ""} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" /></label>
					<label className="space-y-2 lg:col-span-2"><span className="text-sm font-semibold text-[#342312]">SEO description VI</span><textarea name="seoDescriptionVi" defaultValue={blogPost?.seo.description.vi || ""} rows={2} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" /></label>
					<label className="space-y-2 lg:col-span-2"><span className="text-sm font-semibold text-[#342312]">SEO description EN</span><textarea name="seoDescriptionEn" defaultValue={blogPost?.seo.description.en || ""} rows={2} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" /></label>
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">Keywords</span><input name="seoKeywords" defaultValue={blogPost?.seo.keywords.join(", ") || ""} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" /></label>
					<label className="space-y-2"><span className="text-sm font-semibold text-[#342312]">OG image</span><input name="seoOgImage" defaultValue={blogPost?.seo.ogImage || ""} className="w-full rounded-lg border border-[#E7D0AF] bg-white p-3 text-sm" /></label>
				</div>
			</div>

			<div className="sticky bottom-0 z-10 flex justify-end gap-3 border border-[#E7D0AF] bg-white/95 p-4 shadow-lg backdrop-blur">
				<Button asChild type="button" variant="outline"><Link href="/admin/blogs">Hủy</Link></Button>
				<Button type="submit" className="bg-[#342312] text-[#E7D0AF] hover:bg-[#23160B]">{isEditing ? "Lưu thay đổi" : "Tạo blog"}</Button>
			</div>
		</form>
	);
}
