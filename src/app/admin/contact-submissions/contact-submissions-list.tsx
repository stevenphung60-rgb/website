import { FormBoundaryProvider } from "src/components/form-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import type { ContactSubmissionDocument } from "src/server/contact";
import { ContactSubmissionRow } from "./contact-submission-row";

interface ContactSubmissionsListProps {
	items: ContactSubmissionDocument[];
	total: number;
}

/**
 * Responsive contact submission list.
 */
export function ContactSubmissionsList({ items, total }: ContactSubmissionsListProps) {
	return (
		<Card className="min-w-0 border-[#E7D0AF] bg-white shadow-sm">
			<CardHeader className="border-b border-[#E7D0AF]/70">
				<CardTitle className="font-serif text-xl text-[#342312]">
					Danh sách khách hàng liên hệ
				</CardTitle>

				<CardDescription className="mt-1 text-[#342312]/65">
					Tìm thấy {total} khách hàng phù hợp.
				</CardDescription>
			</CardHeader>

			<CardContent className="min-w-0 p-0">
				<div className="hidden border-b border-[#E7D0AF]/70 bg-[#FAF7F1] px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/70 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.15fr)_minmax(0,1.35fr)_10rem_8rem_5rem] lg:gap-4">
					<div>Khách hàng</div>
					<div>Liên hệ</div>
					<div>Chủ đề</div>
					<div>Ngày gửi</div>
					<div>Trạng thái</div>
					<div className="text-right">Chi tiết</div>
				</div>

				<div className="min-w-0 divide-y divide-[#E7D0AF]/70">
					{items.map((submission) => (
						<FormBoundaryProvider key={submission.id}>
							<ContactSubmissionRow submission={submission} />
						</FormBoundaryProvider>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
