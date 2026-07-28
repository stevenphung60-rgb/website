import {
	CalendarClock,
	Eye,
	Globe2,
	Mail,
	MessageSquareText,
	Phone,
	UserRound,
} from "lucide-react";
import {
	Form,
	FormErrorDisplay,
	FormPendingMessage,
	FormSubmitMessage,
} from "src/components/form-state";
import { Button } from "src/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "src/components/ui/dialog";
import type { ContactSubmissionDocument, ContactSubmissionStatus } from "src/server/contact";
import { updateContactSubmissionStatusAction } from "./contact-submission.actions";

interface ContactSubmissionRowProps {
	submission: ContactSubmissionDocument;
}

const statusPresentation: Record<ContactSubmissionStatus, { label: string; className: string }> = {
	new: {
		label: "Mới",
		className: "border-blue-200 bg-blue-50 text-blue-700",
	},
	contacted: {
		label: "Đã liên hệ",
		className: "border-amber-200 bg-amber-50 text-amber-700",
	},
	resolved: {
		label: "Đã xử lý",
		className: "border-green-200 bg-green-50 text-green-700",
	},
};

function formatSubmissionDate(value: Date): string {
	return new Intl.DateTimeFormat("vi-VN", {
		day: "2-digit",
		hour: "2-digit",
		hourCycle: "h23",
		minute: "2-digit",
		month: "2-digit",
		timeZone: "Asia/Ho_Chi_Minh",
		year: "numeric",
	}).format(new Date(value));
}

function createTelephoneHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/**
 * Responsive inbox row with a scroll-safe detail dialog.
 */
export function ContactSubmissionRow({ submission }: ContactSubmissionRowProps) {
	const submittedAt = formatSubmissionDate(submission.createdAt);
	const localeLabel = submission.locale === "en" ? "Tiếng Anh" : "Tiếng Việt";

	return (
		<div className="min-w-0 bg-white px-4 py-4 transition-colors hover:bg-[#FAF7F1] sm:px-5">
			<div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.15fr)_minmax(0,1.35fr)_10rem_8rem_5rem] lg:items-center lg:gap-4">
				<div className="flex min-w-0 items-start gap-3">
					<div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#E7D0AF] bg-[#FAF7F1] text-[#342312]">
						<UserRound className="size-5" />
					</div>

					<div className="min-w-0">
						<p className="break-words text-sm font-semibold text-[#342312]">{submission.name}</p>

						<p className="mt-1 text-xs text-[#342312]/55 lg:hidden">{submittedAt}</p>

						<div className="mt-2 lg:hidden">
							<ContactSubmissionStatusBadge status={submission.status} />
						</div>
					</div>
				</div>

				<div className="min-w-0 space-y-1.5">
					<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55 lg:hidden">
						Liên hệ
					</p>

					<a
						href={createTelephoneHref(submission.phone)}
						className="flex min-w-0 items-center gap-2 text-sm text-[#342312]/75 hover:text-[#A87E3C]"
					>
						<Phone className="size-3.5 shrink-0" />
						<span className="break-all">{submission.phone}</span>
					</a>

					<a
						href={`mailto:${submission.email}`}
						className="flex min-w-0 items-center gap-2 text-sm text-[#342312]/75 hover:text-[#A87E3C]"
					>
						<Mail className="size-3.5 shrink-0" />
						<span className="break-all">{submission.email}</span>
					</a>
				</div>

				<div className="min-w-0">
					<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/55 lg:hidden">
						Chủ đề
					</p>

					<p className="mt-1 break-words text-sm font-medium text-[#342312] lg:mt-0 lg:truncate">
						{submission.subject || "Không có chủ đề"}
					</p>

					<p className="mt-1 line-clamp-2 break-words text-sm leading-6 text-[#342312]/60 lg:line-clamp-1">
						{submission.message}
					</p>
				</div>

				<div className="hidden min-w-0 lg:block">
					<p className="text-sm text-[#342312]/70">{submittedAt}</p>
				</div>

				<div className="hidden lg:block">
					<ContactSubmissionStatusBadge status={submission.status} />
				</div>

				<div className="flex items-center justify-end">
					<Dialog>
						<DialogTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="w-full text-[#342312] sm:w-auto lg:size-9 lg:px-0"
							>
								<Eye className="size-4" />
								<span className="lg:sr-only">Xem chi tiết</span>
							</Button>
						</DialogTrigger>

						<DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-3xl gap-0 overflow-y-auto bg-[#FAF7F1] p-0">
							<DialogHeader className="border-b border-[#E7D0AF] bg-white px-5 py-5 pr-14 text-left sm:px-6">
								<div className="flex min-w-0 items-start gap-3">
									<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#342312]/10 text-[#342312]">
										<MessageSquareText className="size-5" />
									</div>

									<div className="min-w-0">
										<DialogTitle className="break-words font-serif text-xl font-bold leading-tight text-[#342312] sm:text-2xl">
											{submission.subject || "Nội dung liên hệ"}
										</DialogTitle>

										<DialogDescription className="mt-1 break-words text-sm leading-6 text-[#342312]/65">
											Gửi bởi {submission.name} lúc {submittedAt}
										</DialogDescription>
									</div>
								</div>
							</DialogHeader>

							<div className="min-w-0 space-y-5 px-5 py-5 sm:px-6">
								<div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
									<DetailItem icon={<UserRound className="size-4" />} label="Khách hàng">
										{submission.name}
									</DetailItem>

									<DetailItem icon={<CalendarClock className="size-4" />} label="Thời gian gửi">
										{submittedAt}
									</DetailItem>

									<DetailItem icon={<Phone className="size-4" />} label="Điện thoại">
										<a
											href={createTelephoneHref(submission.phone)}
											className="break-all font-semibold text-[#342312] hover:text-[#A87E3C]"
										>
											{submission.phone}
										</a>
									</DetailItem>

									<DetailItem icon={<Mail className="size-4" />} label="Email">
										<a
											href={`mailto:${submission.email}`}
											className="break-all font-semibold text-[#342312] hover:text-[#A87E3C]"
										>
											{submission.email}
										</a>
									</DetailItem>

									<DetailItem icon={<Globe2 className="size-4" />} label="Ngôn ngữ">
										{localeLabel}
									</DetailItem>

									<DetailItem icon={<MessageSquareText className="size-4" />} label="Trạng thái">
										<ContactSubmissionStatusBadge status={submission.status} />
									</DetailItem>
								</div>

								<section className="min-w-0 rounded-xl border border-[#E7D0AF] bg-white p-4 sm:p-5">
									<p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#A87E3C]">
										Nội dung khách gửi
									</p>

									<p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-[#342312]/80">
										{submission.message}
									</p>
								</section>

								<Form action={updateContactSubmissionStatusAction}>
									<input type="hidden" name="id" value={submission.id} />

									<div className="rounded-xl border border-[#E7D0AF] bg-white p-4 sm:p-5">
										<label
											htmlFor={`status-${submission.id}`}
											className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/70"
										>
											Cập nhật trạng thái
										</label>

										<div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
											<select
												id={`status-${submission.id}`}
												name="status"
												defaultValue={submission.status}
												className="h-10 min-w-0 flex-1 rounded-lg border border-[#E7D0AF] bg-white px-3 text-sm text-[#342312] outline-none transition focus:border-[#342312] focus:ring-2 focus:ring-[#342312]/10"
											>
												<option value="new">Mới</option>
												<option value="contacted">Đã liên hệ</option>
												<option value="resolved">Đã xử lý</option>
											</select>

											<Button
												type="submit"
												className="bg-[#342312] text-[#E7D0AF] hover:bg-[#23160B]"
											>
												<FormSubmitMessage>Lưu trạng thái</FormSubmitMessage>
												<FormPendingMessage>Đang lưu...</FormPendingMessage>
											</Button>
										</div>

										<FormErrorDisplay className="mt-3" />
									</div>
								</Form>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</div>
	);
}

export function ContactSubmissionStatusBadge({ status }: { status: ContactSubmissionStatus }) {
	const presentation = statusPresentation[status];

	return (
		<span
			className={[
				"inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
				presentation.className,
			].join(" ")}
		>
			{presentation.label}
		</span>
	);
}

function DetailItem({
	children,
	icon,
	label,
}: {
	children: React.ReactNode;
	icon: React.ReactNode;
	label: string;
}) {
	return (
		<div className="min-w-0 rounded-xl border border-[#E7D0AF] bg-white p-4">
			<div className="flex items-center gap-2 text-[#A87E3C]">
				{icon}
				<p className="text-xs font-semibold uppercase tracking-[0.08em]">{label}</p>
			</div>

			<div className="mt-2 min-w-0 break-words text-sm text-[#342312]/80">{children}</div>
		</div>
	);
}
