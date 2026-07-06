import { FolderOpen } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { AdminEmptyState } from "src/components/admin/admin-empty-state";
import { AdminPageHeader } from "src/components/admin/admin-page-header";
import { Card, CardContent } from "src/components/ui/card";
import {
	getProjectCounts,
	getProjectIds,
	ProjectVisibilityStatus,
} from "src/server/projects";
import { CreateProjectDialog } from "./create-project-dialog";
import { ProjectsList } from "./projects-list";

export const metadata: Metadata = {
	title: "Projects Management - Admin - Nghiệp Hưng",
	description: "Manage and showcase completed projects and portfolio in the admin panel",
};

/**
 * Projects management page
 * @returns Projects admin page
 */
export default async function ProjectsPage() {
	await connection();

	const [projectIds, projectCounts] = await Promise.all([getProjectIds(), getProjectCounts()]);
	const hasProjects = projectIds.length > 0;

	return (
		<div className="w-full">
			<AdminPageHeader
				title="Dự án"
				eyebrow="Quản trị nội dung"
				description="Quản lý dự án hiển thị trên website."
				icon={FolderOpen}
				actions={<CreateProjectDialog />}
			/>

			<div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
				<Card className="border-[#E7D0AF] bg-white">
					<CardContent className="px-5 py-5">
						<div className="flex items-center justify-between gap-4">
							<div>
								<p className="text-sm font-medium text-[#342312]/65">
									Tổng dự án
								</p>

								<p className="mt-2 text-3xl font-bold text-[#342312]">
									{projectCounts.total}
								</p>
							</div>

							<div className="flex size-12 items-center justify-center rounded-xl bg-[#342312]/10">
								<FolderOpen className="size-6 text-[#342312]" />
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
									{projectCounts.visibility[ProjectVisibilityStatus.Active]}
								</p>
							</div>

							<div className="flex size-12 items-center justify-center rounded-xl bg-green-50">
								<FolderOpen className="size-6 text-green-700" />
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
									{projectCounts.visibility[ProjectVisibilityStatus.Draft]}
								</p>
							</div>

							<div className="flex size-12 items-center justify-center rounded-xl bg-yellow-50">
								<FolderOpen className="size-6 text-yellow-700" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{hasProjects ? (
				<ProjectsList projectIds={projectIds} />
			) : (
				<AdminEmptyState
					icon={<FolderOpen className="size-7" />}
					title="Chưa có dự án nào"
					description="Thêm dự án đầu tiên để hiển thị trên website."
					action={<CreateProjectDialog />}
				/>
			)}
		</div>
	);
}