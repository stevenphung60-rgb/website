import { Tags } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { Card, CardContent } from "src/components/ui/card";
import { getProductCategoryCount, getProductCategoryIds } from "src/server/productcategories";
import CreateProductCategoryDialog from "./create-productcategory-dialog/create-productcategory-dialog";
import { EmptyStateWithDialog } from "./empty-state-with-dialog";
import { ProductCategoriesList } from "./productcategories-list";

export const metadata: Metadata = {
	title: "Product Categories Management - Admin - Nghiệp Hưng",
	description: "Manage product categories in the admin panel",
};

export default async function ProductCategoriesPage() {
	await connection();

	const [productCategoryIds, totalCount] = await Promise.all([
		getProductCategoryIds(),
		getProductCategoryCount(),
	]);

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center space-x-4">
					<div className="p-2 rounded-lg bg-primary/10">
						<Tags className="size-6 text-primary" />
					</div>
					<div>
						<h1 className="text-2xl font-serif font-bold text-foreground">
							Product Categories
						</h1>
						<p className="text-muted-foreground">
							Manage your product categories
						</p>
					</div>
				</div>

				<CreateProductCategoryDialog />
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
				<Card className="border-l-4 border-l-blue-500">
					<CardContent className="px-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-4xl font-bold text-blue-600">
									{totalCount}
								</p>
								<p className="text-sm font-medium text-muted-foreground mt-1">
									Total Categories
								</p>
							</div>
							<div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
								<Tags className="size-8 text-blue-600" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* List */}
			{productCategoryIds.length === 0 ? (
				<EmptyStateWithDialog />
			) : (
				<ProductCategoriesList productCategoryIds={productCategoryIds} />
			)}
		</div>
	);
}