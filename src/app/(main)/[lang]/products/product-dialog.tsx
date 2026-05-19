import Image from "next/image";
import LocaleLink from "src/components/behaviors/LocaleLink";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import type { Locale } from "src/lib/i18n/config";
import { getDictionary } from "src/lib/i18n/dictionaries";
import { getProductCategoryById } from "src/server/productcategories";
import type { Product } from "src/server/products";
import { getProductById } from "src/server/products";

interface ProductDialogProps {
	productId: string;
	locale: Locale;
}

export default async function ProductDialog({
	productId,
	locale,
}: ProductDialogProps) {
	const product: Product | null = await getProductById(productId);

	if (!product) {
		return <NotFoundProductDialog locale={locale} />;
	}

	const dictionary = getDictionary(locale);

	const productName = product.name?.[locale] ?? product.name?.en ?? "";
	const productCode = product.code ?? "";

	const productCategory = product.categoryId
		? await getProductCategoryById(product.categoryId)
		: null;

	const productCategoryName =
		productCategory?.name?.[locale] ?? productCategory?.name?.en ?? "";

	const mainImage =
		product.gallery?.find((img) => img.isMain) || product.gallery?.[0];

	return (
		<LocaleLink href={`/products/${product.id}`} className="block h-full">
			<div className="group relative h-full cursor-pointer transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[-18px_24px_45px_rgba(0,0,0,0.12)]">
				<div className="pointer-events-none absolute left-0 top-0 z-20 h-[3px] w-full origin-left scale-x-0 bg-[#342312] transition-transform duration-500 ease-out group-hover:scale-x-100 sm:h-[4px]" />

				<Card
					data-testid="product-card"
					className="relative h-full overflow-hidden rounded-none border-x border-t border-[#e5e7eb] bg-[#F7F1E6] py-0 transition-colors duration-300 group-hover:border-transparent"
				>
					<div className="aspect-square overflow-hidden rounded-none px-0">
						<Image
							src={mainImage?.url || "/placeholder.svg"}
							alt={productName}
							width={400}
							height={300}
							className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
						/>
					</div>

					<CardContent className="flex min-h-[142px] flex-col items-center justify-end px-3 pb-3 pt-3 sm:min-h-[172px] sm:px-5 sm:pb-5 sm:pt-4 lg:min-h-[188px] lg:px-6 lg:pb-6">
						<div className="flex w-full min-w-0 flex-col items-center text-center">
							{productCategoryName ? (
								<p className="mb-1.5 line-clamp-1 max-w-full text-[10px] font-bold uppercase tracking-[0.04em] text-[#A87E3C] sm:mb-2 sm:text-[12px] lg:text-[13px]">
									{productCategoryName}
								</p>
							) : null}

							<CardTitle className="flex min-h-[38px] w-full min-w-0 items-center justify-center text-center font-serif text-[13px] font-semibold leading-[1.35] text-foreground transition-colors duration-300 group-hover:text-[#A87E3C] sm:min-h-[42px] sm:text-[15px] lg:min-h-[44px] lg:text-[16px]">
								<span className="line-clamp-2 max-w-full break-words">
									{productName}
								</span>
							</CardTitle>

							{productCode ? (
								<p className="mt-1.5 line-clamp-1 max-w-full text-[10px] font-medium text-[#342312]/60 sm:mt-2 sm:text-[12px]">
									#{productCode}
								</p>
							) : null}
						</div>

						<div className="mt-auto pt-3 sm:pt-4">
							<button
								type="button"
								className="group/detail relative overflow-hidden rounded-xl bg-[#E7D0AF] px-3 py-1.5 text-[11px] font-medium text-[#342312] sm:rounded-2xl sm:px-4 sm:py-2 sm:text-sm"
							>
								<span className="relative z-10">
									{dictionary.product.viewDetail}
								</span>

								<span className="absolute inset-0 translate-x-[-100%] bg-[#A87E3C] transition-transform duration-300 ease-out group-hover/detail:translate-x-0" />
							</button>
						</div>
					</CardContent>
				</Card>
			</div>
		</LocaleLink>
	);
}

interface NotFoundProductDialogProps {
	locale: Locale;
}

function NotFoundProductDialog({ locale }: NotFoundProductDialogProps) {
	const dictionary = getDictionary(locale);

	return (
		<Card className="group cursor-pointer py-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
			<div className="flex aspect-square items-center justify-center overflow-hidden rounded-t-lg bg-[#F7F1E6] px-0">
				<p className="text-muted-foreground">
					{dictionary.products.notFound.title}
				</p>
			</div>

			<CardHeader>
				<CardTitle className="font-serif text-xl font-bold text-foreground">
					{dictionary.products.notFound.title}
				</CardTitle>
			</CardHeader>
		</Card>
	);
}