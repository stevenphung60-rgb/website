import { FormBoundaryProvider } from "src/components/form-state";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "src/components/ui/card";
import { ProductCategoryRow } from "./productcategory-row";
import { ProductCategoryRowProvider } from "./productcategory-row-context.state";

interface ProductCategoriesListProps {
	productCategoryIds: string[];
}

/**
 * Display product category list in the admin panel
 * @param props - Product categories list props
 * @returns Product category list card
 */
export function ProductCategoriesList({
	productCategoryIds,
}: ProductCategoriesListProps) {
	return (
		<Card className="border-[#E7D0AF] bg-white shadow-sm">
			<CardHeader className="border-b border-[#E7D0AF]/70">
				<CardTitle className="font-serif text-xl text-[#342312]">
					Danh sách loại sản phẩm
				</CardTitle>

				<CardDescription className="mt-1 text-[#342312]/65">
					Hiện có {productCategoryIds.length} loại sản phẩm trong hệ thống.
				</CardDescription>
			</CardHeader>

			<CardContent className="p-0">
				<div className="hidden border-b border-[#E7D0AF]/70 bg-[#FAF7F1] px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/70 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_10rem_5rem] lg:gap-4">
					<div>Tên tiếng Việt</div>
					<div>Tên tiếng Anh</div>
					<div>Cập nhật</div>
					<div className="text-right">Thao tác</div>
				</div>

				<div className="divide-y divide-[#E7D0AF]/70">
					{productCategoryIds.map((productCategoryId) => (
						<FormBoundaryProvider key={productCategoryId}>
							<ProductCategoryRowProvider>
								<ProductCategoryRow productCategoryId={productCategoryId} />
							</ProductCategoryRowProvider>
						</FormBoundaryProvider>
					))}
				</div>
			</CardContent>
		</Card>
	);
}