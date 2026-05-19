import { ChevronLeft, ChevronRight } from "lucide-react";
import {
	convertToGalleryImages,
	GalleryBackButton,
	GalleryImage,
	GalleryNextButton,
	GalleryRoot,
	GalleryThumbnails,
} from "src/components/image-gallery/image-gallery";
import { DialogContent, DialogHeader, DialogTitle } from "src/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { getProductCategoryById } from "src/server/productcategories";
import { getProductById } from "src/server/products";

interface ProductPreviewDialogContentProps {
	productId: string;
}

export async function ProductPreviewDialogContent({ productId }: ProductPreviewDialogContentProps) {
	const product = await getProductById(productId);

	if (!product) {
		return <NotFoundProductPreviewDialogContent />;
	}

	const productCategory = product.categoryId
		? await getProductCategoryById(product.categoryId)
		: null;

	const galleryImages = product.gallery;
	const convertedImages = convertToGalleryImages(
		galleryImages.map((image, index) => ({
			src: image.url,
			alt: `${product.name.en} - ${index + 1}`,
		})),
	);

	return (
		<DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] overflow-y-auto p-0">
			<Tabs defaultValue="en" className="w-full">
				<DialogHeader className="p-6 pb-0 sticky top-0 bg-background z-10">
					<TabsList className="grid w-full grid-cols-2 mb-4">
						<TabsTrigger value="en">English</TabsTrigger>
						<TabsTrigger value="vi">Tiếng Việt</TabsTrigger>
					</TabsList>

					<TabsContent value="en" className="mt-0">
						<DialogTitle className="text-2xl font-serif font-bold text-foreground pr-8">
							{product.name.en}
						</DialogTitle>

						{product.code && (
							<p className="mt-1 text-sm font-medium text-muted-foreground">
								Code: {product.code}
							</p>
						)}

						{productCategory && (
							<p className="mt-1 text-sm font-medium text-muted-foreground">
								Category: {productCategory.name.en} - {productCategory.name.vi}
							</p>
						)}
					</TabsContent>

					<TabsContent value="vi" className="mt-0">
						<DialogTitle className="text-2xl font-serif font-bold text-foreground pr-8">
							{product.name.vi}
						</DialogTitle>

						{product.code && (
							<p className="mt-1 text-sm font-medium text-muted-foreground">
								Mã sản phẩm: {product.code}
							</p>
						)}

						{productCategory && (
							<p className="mt-1 text-sm font-medium text-muted-foreground">
								Nhóm sản phẩm: {productCategory.name.en} - {productCategory.name.vi}
							</p>
						)}
					</TabsContent>
				</DialogHeader>

				<div className="px-6 pb-6">
					<GalleryRoot images={convertedImages}>
						<div className="relative">
							<GalleryImage className="mb-6" />
							<GalleryBackButton className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white">
								<ChevronLeft className="h-4 w-4" />
							</GalleryBackButton>
							<GalleryNextButton className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white">
								<ChevronRight className="h-4 w-4" />
							</GalleryNextButton>
						</div>
						<GalleryThumbnails />
					</GalleryRoot>

					<TabsContent value="en">
						<p className="text-muted-foreground leading-relaxed text-lg">
							{product.description.en}
						</p>
					</TabsContent>
					<TabsContent value="vi">
						<p className="text-muted-foreground leading-relaxed text-lg">
							{product.description.vi}
						</p>
					</TabsContent>
				</div>
			</Tabs>
		</DialogContent>
	);
}

function NotFoundProductPreviewDialogContent() {
	return (
		<DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] overflow-y-auto p-0">
			<DialogHeader className="p-6 pb-0">
				<DialogTitle>Product Not Found</DialogTitle>
			</DialogHeader>
			<div className="p-6">
				<p className="text-muted-foreground">The requested product could not be found.</p>
			</div>
		</DialogContent>
	);
}