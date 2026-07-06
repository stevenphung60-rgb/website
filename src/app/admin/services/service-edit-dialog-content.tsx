import { Edit } from "lucide-react";
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "src/components/ui/dialog";
import type { Service } from "src/server/services";
import { EditServiceForm } from "./edit-service-dialog/edit-service-form";

interface ServiceEditDialogContentProps {
	service: Service;
}

/**
 * Service edit dialog content
 * @param props - Service edit dialog content props
 * @returns Edit service dialog content
 */
export function ServiceEditDialogContent({ service }: ServiceEditDialogContentProps) {
	const serviceName = service.name.vi || service.name.en || "Dịch vụ";

	return (
		<DialogContent className="max-h-[95vh] w-[95vw] max-w-5xl overflow-y-auto bg-[#FAF7F1] p-0">
			<DialogHeader className="sticky top-0 z-10 border-b border-[#E7D0AF] bg-white px-5 py-5 sm:px-6">
				<div className="flex items-start gap-4">
					<div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#342312]/10 text-[#342312]">
						<Edit className="size-5" />
					</div>

					<div className="min-w-0">
						<DialogTitle className="break-words font-serif text-2xl font-bold text-[#342312]">
							Sửa dịch vụ
						</DialogTitle>

						<DialogDescription className="mt-2 break-words text-sm leading-6 text-[#342312]/70">
							Đang chỉnh sửa:{" "}
							<span className="font-semibold text-[#342312]">{serviceName}</span>.
						</DialogDescription>
					</div>
				</div>
			</DialogHeader>

			<div className="px-5 py-6 sm:px-6">
				<EditServiceForm service={service} />
			</div>
		</DialogContent>
	);
}