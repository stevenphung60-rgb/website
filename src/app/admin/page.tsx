import type { ComponentType } from "react";
import {
	ArrowRight,
	Building2,
	ExternalLink,
	FolderOpen,
	Home,
	ImageIcon,
	LayoutDashboard,
	Package,
	Phone,
	Settings,
	Tags,
	Wrench,
} from "lucide-react";
import Link from "next/link";
import { AdminPageHeader } from "src/components/admin/admin-page-header";
import { Button } from "src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { getProductCategoryCount } from "src/server/productcategories";
import { getProductCounts, getProductIds, ProductStatus } from "src/server/products";
import { getProjectCategoryCount } from "src/server/projectcategories";
import {
	getProjectCounts,
	getProjectIds,
	ProjectVisibilityStatus,
} from "src/server/projects";
import { getServiceCounts, getServiceIds, ServiceStatus } from "src/server/services";

interface MetricCardProps {
	title: string;
	value: number | string;
	description: string;
	icon: ComponentType<{ className?: string }>;
}

interface MainTaskProps {
	title: string;
	description: string;
	href: string;
	icon: ComponentType<{ className?: string }>;
	countLabel: string;
	metaLabel: string;
}

interface PublishStatusProps {
	title: string;
	total: number;
	active: number;
	draft: number;
	href: string;
	icon: ComponentType<{ className?: string }>;
}

interface ContentLinkProps {
	title: string;
	description: string;
	href: string;
	icon: ComponentType<{ className?: string }>;
}

/**
 * Admin dashboard page
 * @returns Admin overview page
 */
export default async function AdminPage() {
	const [
		productIds,
		productCounts,
		productCategoryCount,
		serviceIds,
		serviceCounts,
		projectIds,
		projectCounts,
		projectCategoryCount,
	] = await Promise.all([
		getProductIds(),
		getProductCounts(),
		getProductCategoryCount(),
		getServiceIds(),
		getServiceCounts(),
		getProjectIds(),
		getProjectCounts(),
		getProjectCategoryCount(),
	]);

	const activeProducts = productCounts[ProductStatus.Active] ?? 0;
	const draftProducts = productCounts[ProductStatus.Draft] ?? 0;

	const activeServices = serviceCounts[ServiceStatus.Active] ?? 0;
	const draftServices = serviceCounts[ServiceStatus.Draft] ?? 0;

	const activeProjects =
		projectCounts.visibility[ProjectVisibilityStatus.Active] ?? 0;
	const draftProjects =
		projectCounts.visibility[ProjectVisibilityStatus.Draft] ?? 0;

	const totalCategories = productCategoryCount + projectCategoryCount;

	return (
		<div className="w-full space-y-6">
			<AdminPageHeader
				title="Tổng quan"
				eyebrow="NH - DUCT Admin"
				description="Theo dõi nhanh dữ liệu chính và đi tới khu vực cần quản trị."
				icon={LayoutDashboard}
				actions={
					<Button
						asChild
						className="bg-[#342312] text-[#E7D0AF] hover:bg-[#23160B]"
					>
						<Link href="/">
							<ExternalLink className="mr-2 size-4" />
							Xem website
						</Link>
					</Button>
				}
			/>

			<section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
				<MetricCard
					title="Sản phẩm"
					value={productIds.length}
					description={`${activeProducts} đang hiển thị, ${draftProducts} bản nháp`}
					icon={Package}
				/>

				<MetricCard
					title="Dịch vụ"
					value={serviceIds.length}
					description={`${activeServices} đang hiển thị, ${draftServices} bản nháp`}
					icon={Wrench}
				/>

				<MetricCard
					title="Dự án"
					value={projectIds.length}
					description={`${activeProjects} đang hiển thị, ${draftProjects} bản nháp`}
					icon={FolderOpen}
				/>

				<MetricCard
					title="Danh mục"
					value={totalCategories}
					description={`${productCategoryCount} loại sản phẩm, ${projectCategoryCount} loại dự án`}
					icon={Tags}
				/>
			</section>

			<section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
				<Card className="border-[#E7D0AF] bg-white shadow-sm">
					<CardHeader className="border-b border-[#E7D0AF]/70 px-5 py-5">
						<div className="flex items-start gap-3">
							<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#342312]/10 text-[#342312]">
								<Settings className="size-5" />
							</div>

							<div>
								<CardTitle className="font-serif text-xl text-[#342312]">
									Quản trị nội dung chính
								</CardTitle>

								<p className="mt-1 text-sm leading-6 text-[#342312]/65">
									Các khu vực thường xuyên cần cập nhật.
								</p>
							</div>
						</div>
					</CardHeader>

					<CardContent className="p-0">
						<div className="divide-y divide-[#E7D0AF]/70">
							<MainTask
								title="Sản phẩm"
								description="Thêm, sửa thông tin, hình ảnh và trạng thái sản phẩm."
								href="/admin/products"
								icon={Package}
								countLabel={`${productIds.length} sản phẩm`}
								metaLabel={`${activeProducts} hiển thị · ${draftProducts} nháp`}
							/>

							<MainTask
								title="Dịch vụ"
								description="Quản lý các dịch vụ đang giới thiệu trên website."
								href="/admin/services"
								icon={Wrench}
								countLabel={`${serviceIds.length} dịch vụ`}
								metaLabel={`${activeServices} hiển thị · ${draftServices} nháp`}
							/>

							<MainTask
								title="Dự án"
								description="Quản lý công trình, hình ảnh, tiến độ và loại dự án."
								href="/admin/projects"
								icon={FolderOpen}
								countLabel={`${projectIds.length} dự án`}
								metaLabel={`${activeProjects} hiển thị · ${draftProjects} nháp`}
							/>

							<MainTask
								title="Liên hệ"
								description="Cập nhật số điện thoại, email, giờ làm việc và mạng xã hội."
								href="/admin/contact"
								icon={Phone}
								countLabel="Thông tin liên hệ"
								metaLabel="Header · Footer · Trang liên hệ"
							/>
						</div>
					</CardContent>
				</Card>

				<Card className="border-[#E7D0AF] bg-white shadow-sm">
					<CardHeader className="border-b border-[#E7D0AF]/70 px-5 py-5">
						<CardTitle className="font-serif text-xl text-[#342312]">
							Trạng thái xuất bản
						</CardTitle>

						<p className="mt-1 text-sm leading-6 text-[#342312]/65">
							Tỷ lệ nội dung đang hiển thị ngoài website.
						</p>
					</CardHeader>

					<CardContent className="space-y-4 px-5 py-5">
						<PublishStatus
							title="Sản phẩm"
							total={productIds.length}
							active={activeProducts}
							draft={draftProducts}
							href="/admin/products"
							icon={Package}
						/>

						<PublishStatus
							title="Dịch vụ"
							total={serviceIds.length}
							active={activeServices}
							draft={draftServices}
							href="/admin/services"
							icon={Wrench}
						/>

						<PublishStatus
							title="Dự án"
							total={projectIds.length}
							active={activeProjects}
							draft={draftProjects}
							href="/admin/projects"
							icon={FolderOpen}
						/>
					</CardContent>
				</Card>
			</section>

			<section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
				<Card className="border-[#E7D0AF] bg-white shadow-sm">
					<CardHeader className="border-b border-[#E7D0AF]/70 px-5 py-5">
						<CardTitle className="font-serif text-xl text-[#342312]">
							Nhận diện & trang chính
						</CardTitle>

						<p className="mt-1 text-sm leading-6 text-[#342312]/65">
							Các nội dung cố định của website.
						</p>
					</CardHeader>

					<CardContent className="space-y-3 px-5 py-5">
						<ContentLink
							title="Logo & tên công ty"
							description="Logo và tên công ty ở header."
							href="/admin/herobrand"
							icon={Building2}
						/>

						<ContentLink
							title="Trang chủ"
							description="Banner và nội dung chính ở trang chủ."
							href="/admin/hero"
							icon={Home}
						/>

						<ContentLink
							title="Giới thiệu"
							description="Nội dung trang giới thiệu."
							href="/admin/heroabout"
							icon={ImageIcon}
						/>
					</CardContent>
				</Card>

				<Card className="border-[#E7D0AF] bg-white shadow-sm">
					<CardHeader className="border-b border-[#E7D0AF]/70 px-5 py-5">
						<CardTitle className="font-serif text-xl text-[#342312]">
							Banner các trang
						</CardTitle>

						<p className="mt-1 text-sm leading-6 text-[#342312]/65">
							Ảnh và nội dung đầu trang.
						</p>
					</CardHeader>

					<CardContent className="space-y-3 px-5 py-5">
						<ContentLink
							title="Banner dịch vụ"
							description="Banner đầu trang dịch vụ."
							href="/admin/heroservice"
							icon={Wrench}
						/>

						<ContentLink
							title="Banner dự án"
							description="Banner đầu trang dự án."
							href="/admin/heroproject"
							icon={FolderOpen}
						/>

						<ContentLink
							title="Banner liên hệ"
							description="Banner đầu trang liên hệ."
							href="/admin/herocontact"
							icon={Phone}
						/>
					</CardContent>
				</Card>

				<Card className="border-[#E7D0AF] bg-white shadow-sm">
					<CardHeader className="border-b border-[#E7D0AF]/70 px-5 py-5">
						<CardTitle className="font-serif text-xl text-[#342312]">
							Phân loại nội dung
						</CardTitle>

						<p className="mt-1 text-sm leading-6 text-[#342312]/65">
							Danh mục dùng để nhóm sản phẩm và dự án.
						</p>
					</CardHeader>

					<CardContent className="space-y-3 px-5 py-5">
						<ContentLink
							title="Loại sản phẩm"
							description={`${productCategoryCount} loại sản phẩm trong hệ thống.`}
							href="/admin/productcategories"
							icon={Tags}
						/>

						<ContentLink
							title="Loại dự án"
							description={`${projectCategoryCount} loại dự án trong hệ thống.`}
							href="/admin/projectcategories"
							icon={Tags}
						/>

						<ContentLink
							title="Thông tin liên hệ"
							description="Số điện thoại, email, footer và mạng xã hội."
							href="/admin/contact"
							icon={Phone}
						/>
					</CardContent>
				</Card>
			</section>
		</div>
	);
}

/**
 * Metric card
 * @param props - Metric card props
 * @returns Metric card
 */
function MetricCard({ title, value, description, icon: Icon }: MetricCardProps) {
	return (
		<Card className="border-[#E7D0AF] bg-white shadow-sm">
			<CardContent className="px-5 py-5">
				<div className="flex items-start justify-between gap-4">
					<div className="min-w-0">
						<p className="text-sm font-semibold text-[#342312]/70">{title}</p>

						<p className="mt-3 text-3xl font-bold leading-none text-[#342312]">
							{value}
						</p>

						<p className="mt-3 text-xs leading-5 text-[#342312]/55">
							{description}
						</p>
					</div>

					<div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#342312]/10 text-[#342312]">
						<Icon className="size-5" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

/**
 * Main task row
 * @param props - Main task props
 * @returns Main task link row
 */
function MainTask({
	title,
	description,
	href,
	icon: Icon,
	countLabel,
	metaLabel,
}: MainTaskProps) {
	return (
		<Link
			href={href}
			className="group flex items-center gap-4 px-5 py-5 transition hover:bg-[#FAF7F1]"
		>
			<div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#342312]/10 text-[#342312]">
				<Icon className="size-5" />
			</div>

			<div className="min-w-0 flex-1">
				<p className="text-base font-semibold text-[#342312]">{title}</p>

				<p className="mt-1 text-sm leading-6 text-[#342312]/65">
					{description}
				</p>
			</div>

			<div className="hidden shrink-0 text-right md:block">
				<p className="text-sm font-semibold text-[#342312]">{countLabel}</p>

				<p className="mt-1 text-xs text-[#342312]/55">{metaLabel}</p>
			</div>

			<ArrowRight className="size-4 shrink-0 text-[#A87E3C] transition group-hover:translate-x-1" />
		</Link>
	);
}

/**
 * Publishing status block
 * @param props - Publish status props
 * @returns Publish status link
 */
function PublishStatus({
	title,
	total,
	active,
	draft,
	href,
	icon: Icon,
}: PublishStatusProps) {
	const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;

	return (
		<Link
			href={href}
			className="block rounded-2xl border border-[#E7D0AF] bg-[#FAF7F1] p-4 transition hover:bg-white hover:shadow-sm"
		>
			<div className="flex items-start justify-between gap-4">
				<div className="flex min-w-0 items-start gap-3">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#342312]">
						<Icon className="size-4" />
					</div>

					<div className="min-w-0">
						<p className="text-sm font-semibold text-[#342312]">{title}</p>

						<p className="mt-1 text-xs leading-5 text-[#342312]/60">
							{active} hiển thị · {draft} nháp
						</p>
					</div>
				</div>

				<p className="text-lg font-bold text-[#342312]">{total}</p>
			</div>

			<div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
				<div
					className="h-full rounded-full bg-[#A87E3C]"
					style={{ width: `${activePercent}%` }}
				/>
			</div>
		</Link>
	);
}

/**
 * Content management link
 * @param props - Content link props
 * @returns Content link
 */
function ContentLink({ title, description, href, icon: Icon }: ContentLinkProps) {
	return (
		<Link
			href={href}
			className="group block rounded-xl border border-[#E7D0AF] bg-[#FAF7F1] px-4 py-4 transition hover:bg-white hover:shadow-sm"
		>
			<div className="flex items-start gap-3">
				<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#342312]">
					<Icon className="size-4" />
				</div>

				<div className="min-w-0 flex-1">
					<p className="text-sm font-semibold text-[#342312]">{title}</p>

					<p className="mt-1 text-xs leading-5 text-[#342312]/60">
						{description}
					</p>
				</div>

				<ArrowRight className="mt-1 size-4 shrink-0 text-[#A87E3C] transition group-hover:translate-x-1" />
			</div>
		</Link>
	);
}