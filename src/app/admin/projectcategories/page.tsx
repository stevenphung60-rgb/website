import { Tags } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { AdminEmptyState } from "src/components/admin/admin-empty-state";
import { AdminPageHeader } from "src/components/admin/admin-page-header";
import { Card, CardContent } from "src/components/ui/card";
import {
	getProjectCategoryCount,
	getProjectCategoryIds,
} from "src/server/projectcategories";
import CreateProjectCategoryDialog from "./create-projectcategory-dialog/create-projectcategory-dialog";
import { ProjectCategoriesList } from "./projectcategories-list";

export const metadata: Metadata = {
	title: "Project Categories Management - Admin - Nghiệp Hưng",
	description: "Manage project categories in the admin panel",
};

/**
 * Project categories management page
 * @returns Project categories admin page
 */
export default async function ProjectCategoriesPage() {
	await connection();

	const [projectCategoryIds, totalCount] = await Promise.all([
		getProjectCategoryIds(),
		getProjectCategoryCount(),
	]);

	const hasCategories = projectCategoryIds.length > 0;

	return (
		<div className="w-full">
			<AdminPageHeader
				title="Loại dự án"
				eyebrow="Quản trị nội dung"
				description="Quản lý loại dự án hiển thị trên website."
				icon={Tags}
				actions={<CreateProjectCategoryDialog />}
			/>

			<div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
				<Card className="border-[#E7D0AF] bg-white">
					<CardContent className="px-5 py-5">
						<div className="flex items-center justify-between gap-4">
							<div>
								<p className="text-sm font-medium text-[#342312]/65">
									Tổng loại dự án
								</p>

								<p className="mt-2 text-3xl font-bold text-[#342312]">
									{totalCount}
								</p>
							</div>

							<div className="flex size-12 items-center justify-center rounded-xl bg-[#342312]/10">
								<Tags className="size-6 text-[#342312]" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{hasCategories ? (
				<ProjectCategoriesList projectCategoryIds={projectCategoryIds} />
			) : (
				<AdminEmptyState
					icon={<Tags className="size-7" />}
					title="Chưa có loại dự án nào"
					description="Thêm loại dự án đầu tiên để phân nhóm dự án trên website."
					action={<CreateProjectCategoryDialog />}
				/>
			)}
		</div>
	);
}