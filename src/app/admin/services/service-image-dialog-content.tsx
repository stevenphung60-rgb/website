import { ImageIcon } from "lucide-react";
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "src/components/ui/dialog";
import type { Service } from "src/server/services";
import { ServiceImageManagementProvider } from "./edit-service-images/image-management-dialog.state";
import type { ExistingImage } from "./edit-service-images/image-management-dialog.type";
import { ServiceImageManagementContent } from "./edit-service-images/image-management-dialog.ui";

interface ServiceImageDialogContentProps {
	service: Service;
}

/**
 * Service image management dialog content
 * @param props - Service image dialog props
 * @returns Image management dialog content for a service
 */
export function ServiceImageDialogContent({ service }: ServiceImageDialogContentProps) {
	const serviceName = service.name.vi || service.name.en || "Dịch vụ";

	const existingImages: ExistingImage[] = service.gallery.map((image, index) => ({
		id: image.key,
		type: "existing" as const,
		url: image.url,
		name: `${serviceName} - ảnh ${index + 1}`,
	}));

	const mainImage = service.gallery.find((image) => image.isMain);
	const mainImageId = mainImage ? mainImage.key : existingImages[0]?.id || null;

	return (
		<DialogContent className="max-h-[95vh] w-[95vw] max-w-5xl overflow-y-auto bg-[#FAF7F1] p-0">
			<DialogHeader className="sticky top-0 z-10 border-b border-[#E7D0AF] bg-white px-5 py-5 sm:px-6">
				<div className="flex items-start gap-4">
					<div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#342312]/10 text-[#342312]">
						<ImageIcon className="size-5" />
					</div>

					<div className="min-w-0">
						<DialogTitle className="break-words font-serif text-2xl font-bold text-[#342312]">
							Quản lý ảnh dịch vụ
						</DialogTitle>

						<DialogDescription className="mt-2 break-words text-sm leading-6 text-[#342312]/70">
							Đang chỉnh ảnh cho:{" "}
							<span className="font-semibold text-[#342312]">{serviceName}</span>.
							Anh có thể thêm ảnh mới, xóa ảnh không dùng và chọn ảnh đại diện cho dịch vụ.
						</DialogDescription>
					</div>
				</div>
			</DialogHeader>

			<div className="px-5 py-6 sm:px-6">
				<ServiceImageManagementProvider
					existingImages={existingImages}
					mainImageId={mainImageId}
				>
					<ServiceImageManagementContent serviceId={service.id} />
				</ServiceImageManagementProvider>
			</div>
		</DialogContent>
	);
}