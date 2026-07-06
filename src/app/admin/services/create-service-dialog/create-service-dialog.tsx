import { Plus, Wrench } from "lucide-react";
import { FormBoundaryProvider } from "src/components/form-state";
import { Button } from "src/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "src/components/ui/dialog";
import { ServiceImageSelectionProvider } from "./create-service-dialog.state";
import { CreateServiceForm } from "./create-service-form";

/**
 * Create service dialog server component
 * @returns Dialog for creating a new service
 */
export default function CreateServiceDialog() {
	return (
		<FormBoundaryProvider>
			<ServiceImageSelectionProvider>
				<Dialog>
					<DialogTrigger asChild>
						<Button className="bg-[#342312] text-[#E7D0AF] hover:bg-[#23160B]">
							<Plus className="mr-2 size-4" />
							Thêm dịch vụ
						</Button>
					</DialogTrigger>

					<DialogContent className="max-h-[95vh] w-[95vw] max-w-5xl overflow-y-auto bg-[#FAF7F1] p-0">
						<DialogHeader className="sticky top-0 z-10 border-b border-[#E7D0AF] bg-white px-5 py-5 sm:px-6">
							<div className="flex items-start gap-4">
								<div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#342312]/10 text-[#342312]">
									<Wrench className="size-5" />
								</div>

								<div className="min-w-0">
									<DialogTitle className="break-words font-serif text-2xl font-bold text-[#342312]">
										Thêm dịch vụ mới
									</DialogTitle>

									<DialogDescription className="mt-2 break-words text-sm leading-6 text-[#342312]/70">
										Nhập thông tin, hình ảnh và trạng thái dịch vụ.
									</DialogDescription>
								</div>
							</div>
						</DialogHeader>

						<div className="px-5 py-6 sm:px-6">
							<CreateServiceForm />
						</div>
					</DialogContent>
				</Dialog>
			</ServiceImageSelectionProvider>
		</FormBoundaryProvider>
	);
}