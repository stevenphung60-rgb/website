import { Package } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { AdminEmptyState } from "src/components/admin/admin-empty-state";
import { AdminPageHeader } from "src/components/admin/admin-page-header";
import { Card, CardContent } from "src/components/ui/card";
import { getProductCounts, getProductIds, ProductStatus } from "src/server/products";
import CreateProductDialog from "./create-product-dialog/create-product-dialog";
import { ProductsList } from "./products-list";

export const metadata: Metadata = {
	title: "Products Management - Admin - Nghiệp Hưng",
	description: "Manage air duct products and inventory in the admin panel",
};

/**
 * Products management page
 * @returns Products admin page
 */
export default async function ProductsPage() {
	await connection();

	const [productIds, productCounts] = await Promise.all([getProductIds(), getProductCounts()]);
	const hasProducts = productIds.length > 0;

	return (
		<div className="w-full">
			<AdminPageHeader
				title="Sản phẩm"
				eyebrow="Quản trị nội dung"
				description="Quản lý sản phẩm hiển thị trên website."
				icon={Package}
				actions={<CreateProductDialog />}
			/>

			<div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
				<Card className="border-[#E7D0AF] bg-white">
					<CardContent className="px-5 py-5">
						<div className="flex items-center justify-between gap-4">
							<div>
								<p className="text-sm font-medium text-[#342312]/65">
									Tổng sản phẩm
								</p>

								<p className="mt-2 text-3xl font-bold text-[#342312]">
									{productIds.length}
								</p>
							</div>

							<div className="flex size-12 items-center justify-center rounded-xl bg-[#342312]/10">
								<Package className="size-6 text-[#342312]" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-green-200 bg-white">
					<CardContent className="px-5 py-5">
						<div className="flex items-center justify-between gap-4">
							<div>
								<p className="text-sm font-medium text-[#342312]/65">
									Đang hiển thị
								</p>

								<p className="mt-2 text-3xl font-bold text-green-700">
									{productCounts[ProductStatus.Active]}
								</p>
							</div>

							<div className="flex size-12 items-center justify-center rounded-xl bg-green-50">
								<Package className="size-6 text-green-700" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-yellow-200 bg-white">
					<CardContent className="px-5 py-5">
						<div className="flex items-center justify-between gap-4">
							<div>
								<p className="text-sm font-medium text-[#342312]/65">
									Bản nháp
								</p>

								<p className="mt-2 text-3xl font-bold text-yellow-700">
									{productCounts[ProductStatus.Draft]}
								</p>
							</div>

							<div className="flex size-12 items-center justify-center rounded-xl bg-yellow-50">
								<Package className="size-6 text-yellow-700" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{hasProducts ? (
				<ProductsList productIds={productIds} />
			) : (
				<AdminEmptyState
					icon={<Package className="size-7" />}
					title="Chưa có sản phẩm nào"
					description="Thêm sản phẩm đầu tiên để hiển thị trên website."
					action={<CreateProductDialog />}
				/>
			)}
		</div>
	);
}