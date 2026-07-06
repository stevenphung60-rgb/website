"use client";

import { Check, Upload, X } from "lucide-react";
import Image from "next/image";
import { memo, useEffect, useRef } from "react";
import { Form, FormPendingMessage, FormSubmitMessage } from "src/components/form-state";
import { ImageUploadArea, ImageUploadError, ImageUploadRoot } from "src/components/image-upload";
import { Button } from "src/components/ui/button";
import { DialogClose } from "src/components/ui/dialog";
import { cn } from "src/lib/utils";
import { updateServiceImages } from "./image-management.actions";
import {
	useExistingImages,
	useMainImageSelection,
	useNewImages,
	useUnifiedImages,
} from "./image-management-dialog.state";
import type { UnifiedImage } from "./image-management-dialog.type";

interface ServiceImageManagementContentProps {
	serviceId: string;
}

interface ImagesSectionProps {
	serviceId: string;
}

interface UnifiedImageItemProps {
	image: UnifiedImage;
}

interface FormDataInputsProps {
	serviceId: string;
}

/**
 * Main content component for service image management
 * @param props - Service image management content props
 * @returns Service image management form
 */
export function ServiceImageManagementContent({
	serviceId,
}: ServiceImageManagementContentProps) {
	return (
		<Form action={updateServiceImages}>
			<div className="space-y-6">
				<ImagesSection serviceId={serviceId} />
				<ImageManagementActions />
			</div>
		</Form>
	);
}

/**
 * Display and manage existing and new service images
 * @param props - Images section props
 * @returns Images management section
 */
function ImagesSection({ serviceId }: ImagesSectionProps) {
	const { images } = useUnifiedImages();

	return (
		<div className="space-y-5">
			<div className="rounded-2xl border border-[#E7D0AF] bg-white p-4 sm:p-5">
				<div className="mb-4">
					<h3 className="text-base font-semibold text-[#342312]">
						Hình ảnh dịch vụ
					</h3>

					<p className="mt-1 text-sm italic leading-6 text-[#342312]/65">
						Bấm vào một ảnh để chọn làm ảnh đại diện. Bấm dấu X để xóa ảnh không dùng.
						Ảnh mới sẽ chỉ được lưu sau khi bấm nút “Lưu thay đổi”.
					</p>
				</div>

				<NewImageUpload />

				<FormDataInputs serviceId={serviceId} />

				{images.length > 0 ? (
					<div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
						{images.map((image) => (
							<UnifiedImageItem key={image.id} image={image} />
						))}
					</div>
				) : (
					<div className="mt-5 rounded-xl border border-dashed border-[#E7D0AF] bg-[#FAF7F1] px-4 py-8 text-center">
						<p className="text-sm font-medium text-[#342312]">
							Chưa có ảnh dịch vụ
						</p>

						<p className="mt-1 text-xs italic leading-5 text-[#342312]/65">
							Tải ít nhất một ảnh để dịch vụ hiển thị tốt hơn trên website.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

/**
 * Form actions for service image management
 * @returns Service image management action buttons
 */
function ImageManagementActions() {
	return (
		<div className="sticky bottom-0 z-20 -mx-5 border-t border-[#E7D0AF] bg-[#FAF7F1]/95 px-5 py-4 backdrop-blur sm:-mx-6 sm:px-6">
			<div className="flex flex-col gap-3 rounded-2xl border border-[#E7D0AF] bg-white px-4 py-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
				<div className="min-w-0">
					<p className="text-sm font-medium text-[#342312]">
						Lưu thay đổi hình ảnh
					</p>

					<p className="mt-1 text-xs italic leading-5 text-[#342312]/65">
						Kiểm tra ảnh đại diện và danh sách ảnh trước khi lưu.
					</p>
				</div>

				<div className="flex shrink-0 flex-col-reverse gap-2 sm:flex-row">
					<DialogClose asChild>
						<Button variant="outline" className="border-[#E7D0AF] bg-white text-[#342312]">
							Đóng
						</Button>
					</DialogClose>

					<Button type="submit" className="bg-[#342312] text-[#E7D0AF] hover:bg-[#23160B]">
						<FormSubmitMessage>Lưu thay đổi</FormSubmitMessage>
						<FormPendingMessage>Đang lưu...</FormPendingMessage>
					</Button>
				</div>
			</div>
		</div>
	);
}

/**
 * Image upload area for adding new service images
 * @returns New image upload component
 */
const NewImageUpload = memo(function NewImageUpload() {
	const { addNewImagesFromUpload } = useNewImages();

	return (
		<ImageUploadRoot
			maxFiles={20}
			acceptedTypes={["image/*"]}
			maxFileSize={10 * 1024 * 1024}
			onChange={addNewImagesFromUpload}
		>
			<ImageUploadArea className="rounded-xl border-2 border-dashed border-[#E7D0AF] bg-[#FAF7F1] p-8">
				<div className="space-y-4 text-center text-[#342312]/70">
					<div className="flex flex-col items-center gap-3">
						<div className="flex size-16 items-center justify-center rounded-full bg-white">
							<Upload className="size-8 text-[#342312]" />
						</div>

						<div className="space-y-1">
							<h3 className="text-sm font-semibold text-[#342312]">
								Thêm ảnh mới
							</h3>

							<p className="text-xs italic leading-5 text-[#342312]/65">
								Bấm vào đây hoặc kéo thả ảnh vào khu vực này. Ảnh mới sẽ được đánh dấu
								“Ảnh mới”.
							</p>
						</div>
					</div>
				</div>
			</ImageUploadArea>

			<ImageUploadError />
		</ImageUploadRoot>
	);
});

/**
 * Unified image item for existing and new images
 * @param props - Unified image item props
 * @returns Service image item
 */
function UnifiedImageItem({ image }: UnifiedImageItemProps) {
	const { selectedMainImageId, setMainImage } = useMainImageSelection();
	const { removeExistingImage } = useExistingImages();
	const { removeNewImage } = useNewImages();

	const isMainImage = selectedMainImageId === image.id;

	const handleSelectMain = () => {
		setMainImage(image.id);
	};

	const handleRemove = () => {
		if (image.type === "existing") {
			removeExistingImage(image.id);
			return;
		}

		removeNewImage(image.id);
	};

	return (
		<div className="group relative">
			<button
				type="button"
				className={cn(
					"relative aspect-square w-full overflow-hidden rounded-xl border-2 bg-[#FAF7F1] transition-colors",
					isMainImage
						? "border-[#342312] ring-2 ring-[#342312]/20"
						: "border-[#E7D0AF] hover:border-[#342312]/60",
				)}
				onClick={handleSelectMain}
				onKeyDown={(event) => {
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();
						handleSelectMain();
					}
				}}
			>
				<Image
					src={image.url}
					alt={image.name}
					fill
					className="object-cover"
					sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
				/>

				{isMainImage ? (
					<div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-[#342312] px-2 py-1 text-xs font-semibold text-[#E7D0AF] shadow-lg">
						<Check className="size-3.5" />
						Ảnh đại diện
					</div>
				) : null}

				{image.type === "new" ? (
					<div className="absolute bottom-2 left-2 rounded-full bg-green-600 px-2 py-1 text-xs font-semibold text-white shadow-lg">
						Ảnh mới
					</div>
				) : null}
			</button>

			<button
				type="button"
				aria-label="Xóa ảnh"
				className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground opacity-100 shadow-lg transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
				onClick={(event) => {
					event.stopPropagation();
					handleRemove();
				}}
			>
				<X className="size-4" />
			</button>
		</div>
	);
}

/**
 * Hidden file input used to submit new images from state
 * @returns Hidden file input
 */
function HiddenFileInput() {
	const { newImages } = useNewImages();
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!fileInputRef.current || newImages.length === 0) {
			return;
		}

		const dataTransfer = new DataTransfer();

		newImages.forEach((image) => {
			dataTransfer.items.add(image.file);
		});

		fileInputRef.current.files = dataTransfer.files;
	}, [newImages]);

	return (
		<input
			ref={fileInputRef}
			type="file"
			name="newImages"
			multiple
			accept="image/*"
			className="hidden"
		/>
	);
}

/**
 * Hidden form inputs for service image updates
 * @param props - Form data inputs props
 * @returns Hidden inputs needed by service image update action
 */
function FormDataInputs({ serviceId }: FormDataInputsProps) {
	const { deletedImages } = useExistingImages();
	const { selectedMainImageId } = useMainImageSelection();
	const { images } = useUnifiedImages();

	const deletedImagesJson = JSON.stringify(
		deletedImages.map((image) => ({
			id: image.id,
			name: image.name,
		})),
	);

	const getMainImageIndex = () => {
		if (!selectedMainImageId || images.length === 0) {
			return "";
		}

		const selectedIndex = images.findIndex((image) => image.id === selectedMainImageId);
		return selectedIndex === -1 ? "" : selectedIndex.toString();
	};

	return (
		<>
			<HiddenFileInput />
			<input type="hidden" name="serviceId" value={serviceId} />
			<input type="hidden" name="deletedImages" value={deletedImagesJson} />
			<input type="hidden" name="mainImageIndex" value={getMainImageIndex()} />
		</>
	);
}