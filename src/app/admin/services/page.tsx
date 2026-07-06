import { Wrench } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { AdminEmptyState } from "src/components/admin/admin-empty-state";
import { AdminPageHeader } from "src/components/admin/admin-page-header";
import { Card, CardContent } from "src/components/ui/card";
import { getServiceCounts, getServiceIds, ServiceStatus } from "src/server/services";
import CreateServiceDialog from "./create-service-dialog/create-service-dialog";
import { ServicesList } from "./services-list";

export const metadata: Metadata = {
	title: "Services Management - Admin - Nghiệp Hưng",
	description: "Manage company services and offerings in the admin panel",
};

/**
 * Services management page
 * @returns Services admin page
 */
export default async function ServicesPage() {
	await connection();

	const [serviceIds, serviceCounts] = await Promise.all([getServiceIds(), getServiceCounts()]);
	const hasServices = serviceIds.length > 0;

	return (
		<div className="w-full">
			<AdminPageHeader
				title="Dịch vụ"
				eyebrow="Quản trị nội dung"
				description="Quản lý dịch vụ hiển thị trên website."
				icon={Wrench}
				actions={<CreateServiceDialog />}
			/>

			<div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
				<Card className="border-[#E7D0AF] bg-white">
					<CardContent className="px-5 py-5">
						<div className="flex items-center justify-between gap-4">
							<div>
								<p className="text-sm font-medium text-[#342312]/65">
									Tổng dịch vụ
								</p>

								<p className="mt-2 text-3xl font-bold text-[#342312]">
									{serviceIds.length}
								</p>
							</div>

							<div className="flex size-12 items-center justify-center rounded-xl bg-[#342312]/10">
								<Wrench className="size-6 text-[#342312]" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-green-200 bg-white">
					<CardContent className="px-5 py-5">
						<div className="flex items-center justify-between gap-4">
							<div>
								<p className="text-sm font-medium text-[#342312]/65">
									Đang hiển thị
								</p>

								<p className="mt-2 text-3xl font-bold text-green-700">
									{serviceCounts[ServiceStatus.Active]}
								</p>
							</div>

							<div className="flex size-12 items-center justify-center rounded-xl bg-green-50">
								<Wrench className="size-6 text-green-700" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-yellow-200 bg-white">
					<CardContent className="px-5 py-5">
						<div className="flex items-center justify-between gap-4">
							<div>
								<p className="text-sm font-medium text-[#342312]/65">
									Bản nháp
								</p>

								<p className="mt-2 text-3xl font-bold text-yellow-700">
									{serviceCounts[ServiceStatus.Draft]}
								</p>
							</div>

							<div className="flex size-12 items-center justify-center rounded-xl bg-yellow-50">
								<Wrench className="size-6 text-yellow-700" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{hasServices ? (
				<ServicesList serviceIds={serviceIds} />
			) : (
				<AdminEmptyState
					icon={<Wrench className="size-7" />}
					title="Chưa có dịch vụ nào"
					description="Thêm dịch vụ đầu tiên để hiển thị trên website."
					action={<CreateServiceDialog />}
				/>
			)}
		</div>
	);
}