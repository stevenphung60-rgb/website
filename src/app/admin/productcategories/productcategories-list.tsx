import { FormBoundaryProvider } from "src/components/form-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { ProductCategoryRow } from "./productcategory-row";
import { ProductCategoryRowProvider } from "./productcategory-row-context.state";

interface ProductCategoriesListProps {
	productCategoryIds: string[];
}

/**
 * Component that displays the list of product categories
 */
export function ProductCategoriesList({ productCategoryIds }: ProductCategoriesListProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{"All Product Categories"}</CardTitle>
				<CardDescription>{"Manage your product categories"}</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="space-y-4">
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