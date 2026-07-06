import { FormBoundaryProvider } from "src/components/form-state";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "src/components/ui/card";
import { ProductRow } from "./product-row";
import { ProductRowProvider } from "./product-row-context.state";

interface ProductsListProps {
	productIds: string[];
}

/**
 * Display product list in the admin panel
 * @param props - Products list props
 * @returns Product list card
 */
export function ProductsList({ productIds }: ProductsListProps) {
	return (
		<Card className="border-[#E7D0AF] bg-white shadow-sm">
			<CardHeader className="border-b border-[#E7D0AF]/70">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<CardTitle className="font-serif text-xl text-[#342312]">
							Danh sách sản phẩm
						</CardTitle>

						<CardDescription className="mt-1 text-[#342312]/65">
							Hiện có {productIds.length} sản phẩm trong hệ thống.
						</CardDescription>
					</div>
				</div>
			</CardHeader>

			<CardContent className="p-0">
				<div className="hidden border-b border-[#E7D0AF]/70 bg-[#FAF7F1] px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/70 lg:grid lg:grid-cols-[5rem_minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_8rem_5rem] lg:gap-4">
					<div>Ảnh</div>
					<div>Sản phẩm</div>
					<div>Mã</div>
					<div>Danh mục</div>
					<div>Trạng thái</div>
					<div className="text-right">Thao tác</div>
				</div>

				<div className="divide-y divide-[#E7D0AF]/70">
					{productIds.map((productId) => (
						<FormBoundaryProvider key={productId}>
							<ProductRowProvider>
								<ProductRow productId={productId} />
							</ProductRowProvider>
						</FormBoundaryProvider>
					))}
				</div>
			</CardContent>
		</Card>
	);
}