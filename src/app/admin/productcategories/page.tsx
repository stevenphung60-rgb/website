import { Tags } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { AdminEmptyState } from "src/components/admin/admin-empty-state";
import { AdminPageHeader } from "src/components/admin/admin-page-header";
import { Card, CardContent } from "src/components/ui/card";
import {
	getProductCategoryCount,
	getProductCategoryIds,
} from "src/server/productcategories";
import CreateProductCategoryDialog from "./create-productcategory-dialog/create-productcategory-dialog";
import { ProductCategoriesList } from "./productcategories-list";

export const metadata: Metadata = {
	title: "Product Categories Management - Admin - Nghiệp Hưng",
	description: "Manage product categories in the admin panel",
};

/**
 * Product categories management page
 * @returns Product categories admin page
 */
export default async function ProductCategoriesPage() {
	await connection();

	const [productCategoryIds, totalCount] = await Promise.all([
		getProductCategoryIds(),
		getProductCategoryCount(),
	]);

	const hasCategories = productCategoryIds.length > 0;

	return (
		<div className="w-full">
			<AdminPageHeader
				title="Loại sản phẩm"
				eyebrow="Quản trị nội dung"
				description="Quản lý loại sản phẩm hiển thị trên website."
				icon={Tags}
				actions={<CreateProductCategoryDialog />}
			/>

			<div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
				<Card className="border-[#E7D0AF] bg-white">
					<CardContent className="px-5 py-5">
						<div className="flex items-center justify-between gap-4">
							<div>
								<p className="text-sm font-medium text-[#342312]/65">
									Tổng loại sản phẩm
								</p>

								<p className="mt-2 text-3xl font-bold text-[#342312]">
									{totalCount}
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
				<ProductCategoriesList productCategoryIds={productCategoryIds} />
			) : (
				<AdminEmptyState
					icon={<Tags className="size-7" />}
					title="Chưa có loại sản phẩm nào"
					description="Thêm loại sản phẩm đầu tiên để phân nhóm sản phẩm trên website."
					action={<CreateProductCategoryDialog />}
				/>
			)}
		</div>
	);
}