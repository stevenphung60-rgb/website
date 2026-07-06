interface AdminStatusBadgeProps {
	status: string;
	label?: string;
	className?: string;
}

const statusLabels: Record<string, string> = {
	active: "Đang hiển thị",
	draft: "Bản nháp",
	archived: "Đã lưu trữ",
	completed: "Đã hoàn thành",
	"in-progress": "Đang thực hiện",
	planning: "Đang lên kế hoạch",
};

const statusClassNames: Record<string, string> = {
	active: "border-green-200 bg-green-50 text-green-700",
	draft: "border-yellow-200 bg-yellow-50 text-yellow-700",
	archived: "border-slate-200 bg-slate-50 text-slate-600",
	completed: "border-green-200 bg-green-50 text-green-700",
	"in-progress": "border-blue-200 bg-blue-50 text-blue-700",
	planning: "border-purple-200 bg-purple-50 text-purple-700",
};

/**
 * Shared status badge for admin list pages
 * @param props - Admin status badge props
 * @returns Status badge with readable Vietnamese label
 */
export function AdminStatusBadge({
	status,
	label,
	className,
}: AdminStatusBadgeProps) {
	const displayLabel = label || statusLabels[status] || status;
	const variantClassName =
		statusClassNames[status] || "border-slate-200 bg-slate-50 text-slate-600";

	return (
		<span
			className={[
				"inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
				variantClassName,
				className,
			]
				.filter(Boolean)
				.join(" ")}
		>
			{displayLabel}
		</span>
	);
}