import { CheckCircle2, CircleDot, Inbox, MessageSquareMore, PhoneCall } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { AdminEmptyState } from "src/components/admin/admin-empty-state";
import { AdminPageHeader } from "src/components/admin/admin-page-header";
import { Card, CardContent } from "src/components/ui/card";
import { getContactSubmissionListPage, getContactSubmissionMetrics } from "src/server/contact";
import { ContactSubmissionsList } from "./contact-submissions-list";
import { ContactSubmissionsPagination } from "./contact-submissions-pagination";

export const metadata: Metadata = {
	title: "Khách hàng liên hệ - Admin - Nghiệp Hưng",
	description: "Theo dõi khách hàng gửi thông tin liên hệ từ website.",
};

interface ContactSubmissionsPageProps {
	searchParams?: Promise<{
		[key: string]: string | string[] | undefined;
		page?: string | string[];
	}>;
}

const PAGE_SIZE = 20;

function getFirstSearchParam(value: string | string[] | undefined): string {
	return (Array.isArray(value) ? value[0] : value)?.trim() || "";
}

function parsePage(value: string | string[] | undefined): number {
	const page = Number.parseInt(getFirstSearchParam(value), 10);
	return Number.isFinite(page) && page > 0 ? page : 1;
}

/**
 * Admin inbox for contact form submissions.
 */
export default async function ContactSubmissionsPage({
	searchParams,
}: ContactSubmissionsPageProps) {
	await connection();

	const resolvedSearchParams = await searchParams;
	const requestedPage = parsePage(resolvedSearchParams?.page);
	const [listPage, metrics] = await Promise.all([
		getContactSubmissionListPage({
			page: requestedPage,
			pageSize: PAGE_SIZE,
		}),
		getContactSubmissionMetrics(),
	]);

	return (
		<div className="w-full min-w-0">
			<AdminPageHeader
				title="Khách hàng liên hệ"
				eyebrow="Quản trị khách hàng"
				description="Theo dõi và chăm sóc khách hàng đã gửi thông tin qua biểu mẫu liên hệ trên website."
				icon={Inbox}
			/>

			<section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<MetricCard
					label="Tổng khách hàng"
					value={metrics.total}
					icon={MessageSquareMore}
					tone="default"
				/>

				<MetricCard label="Mới" value={metrics.new} icon={CircleDot} tone="blue" />

				<MetricCard label="Đã liên hệ" value={metrics.contacted} icon={PhoneCall} tone="amber" />

				<MetricCard label="Đã xử lý" value={metrics.resolved} icon={CheckCircle2} tone="green" />
			</section>

			{listPage.items.length === 0 ? (
				<AdminEmptyState
					icon={<Inbox className="size-7" />}
					title="Chưa có khách hàng liên hệ"
					description="Khách hàng gửi thành công biểu mẫu liên hệ sẽ xuất hiện tại đây."
				/>
			) : (
				<>
					<ContactSubmissionsList items={listPage.items} total={listPage.total} />

					<ContactSubmissionsPagination
						currentPage={listPage.page}
						totalPages={listPage.totalPages}
					/>
				</>
			)}
		</div>
	);
}

function MetricCard({
	icon: Icon,
	label,
	tone,
	value,
}: {
	icon: typeof Inbox;
	label: string;
	tone: "default" | "blue" | "amber" | "green";
	value: number;
}) {
	const toneClasses = {
		default: {
			border: "border-[#E7D0AF]",
			icon: "bg-[#342312]/10 text-[#342312]",
			value: "text-[#342312]",
		},
		blue: {
			border: "border-blue-200",
			icon: "bg-blue-50 text-blue-700",
			value: "text-blue-700",
		},
		amber: {
			border: "border-amber-200",
			icon: "bg-amber-50 text-amber-700",
			value: "text-amber-700",
		},
		green: {
			border: "border-green-200",
			icon: "bg-green-50 text-green-700",
			value: "text-green-700",
		},
	}[tone];

	return (
		<Card className={`${toneClasses.border} bg-white`}>
			<CardContent className="px-5 py-5">
				<div className="flex items-center justify-between gap-4">
					<div className="min-w-0">
						<p className="text-sm font-medium text-[#342312]/65">{label}</p>
						<p className={`mt-2 text-3xl font-bold ${toneClasses.value}`}>{value}</p>
					</div>

					<div
						className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${toneClasses.icon}`}
					>
						<Icon className="size-6" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
