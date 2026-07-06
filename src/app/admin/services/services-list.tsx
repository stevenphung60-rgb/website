import { FormBoundaryProvider } from "src/components/form-state";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "src/components/ui/card";
import { ServiceRow } from "./service-row";
import { ServiceRowProvider } from "./service-row-context.state";

interface ServicesListProps {
	serviceIds: string[];
}

/**
 * Display service list in the admin panel
 * @param props - Services list props
 * @returns Service list card
 */
export function ServicesList({ serviceIds }: ServicesListProps) {
	return (
		<Card className="border-[#E7D0AF] bg-white shadow-sm">
			<CardHeader className="border-b border-[#E7D0AF]/70">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<CardTitle className="font-serif text-xl text-[#342312]">
							Danh sách dịch vụ
						</CardTitle>

						<CardDescription className="mt-1 text-[#342312]/65">
							Hiện có {serviceIds.length} dịch vụ trong hệ thống.
						</CardDescription>
					</div>
				</div>
			</CardHeader>

			<CardContent className="p-0">
				<div className="hidden border-b border-[#E7D0AF]/70 bg-[#FAF7F1] px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/70 lg:grid lg:grid-cols-[5rem_minmax(0,1.5fr)_minmax(0,1fr)_8rem_5rem] lg:gap-4">
					<div>Ảnh</div>
					<div>Dịch vụ</div>
					<div>Mô tả</div>
					<div>Trạng thái</div>
					<div className="text-right">Thao tác</div>
				</div>

				<div className="divide-y divide-[#E7D0AF]/70">
					{serviceIds.map((serviceId) => (
						<FormBoundaryProvider key={serviceId}>
							<ServiceRowProvider>
								<ServiceRow serviceId={serviceId} />
							</ServiceRowProvider>
						</FormBoundaryProvider>
					))}
				</div>
			</CardContent>
		</Card>
	);
}