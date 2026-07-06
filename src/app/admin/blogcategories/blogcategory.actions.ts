"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { CACHE_TAGS } from "src/lib/cache-tags";
import { deleteBlogCategory, updateBlogCategory } from "src/server/blogs";

function getFormString(formData: FormData, key: string): string {
	return ((formData.get(key) as string | null) || "").trim();
}

function revalidateBlogCategoryPages() {
	revalidateTag(CACHE_TAGS.BLOG_CATEGORIES, "max");
	revalidateTag(CACHE_TAGS.BLOG_POSTS, "max");
	revalidatePath("/admin/blogcategories");
	revalidatePath("/admin/blogs");
	revalidatePath("/vi/blog");
	revalidatePath("/en/blog");
}

export async function saveBlogCategoryAction(formData: FormData) {
	const blogCategoryId = getFormString(formData, "blogCategoryId") || undefined;
	const nameVi = getFormString(formData, "nameVi");
	const nameEn = getFormString(formData, "nameEn") || nameVi;

	if (!nameVi) {
		throw new Error("Tên loại blog tiếng Việt là bắt buộc");
	}

	await updateBlogCategory({
		id: blogCategoryId,
		name: {
			vi: nameVi,
			en: nameEn,
		},
		slug: {
			vi: getFormString(formData, "slugVi"),
			en: getFormString(formData, "slugEn"),
		},
		description: {
			vi: getFormString(formData, "descriptionVi"),
			en: getFormString(formData, "descriptionEn"),
		},
	});

	revalidateBlogCategoryPages();
	redirect("/admin/blogcategories");
}

export async function deleteBlogCategoryAction(formData: FormData) {
	const blogCategoryId = getFormString(formData, "blogCategoryId");

	if (blogCategoryId) {
		await deleteBlogCategory(blogCategoryId);
	}

	revalidateBlogCategoryPages();
	redirect("/admin/blogcategories");
}
