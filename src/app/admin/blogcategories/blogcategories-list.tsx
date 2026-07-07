import { FormBoundaryProvider } from "src/components/form-state";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "src/components/ui/card";
import { BlogCategoryRow } from "./blogcategory-row";

interface BlogCategoriesListProps {
	blogCategoryIds: string[];
}

/**
 * Display blog category list in the admin panel
 * @param props - Blog categories list props
 * @returns Blog category list card
 */
export function BlogCategoriesList({ blogCategoryIds }: BlogCategoriesListProps) {
	return (
		<Card className="border-[#E7D0AF] bg-white shadow-sm">
			<CardHeader className="border-b border-[#E7D0AF]/70">
				<CardTitle className="font-serif text-xl text-[#342312]">
					Danh sách loại blog
				</CardTitle>

				<CardDescription className="mt-1 text-[#342312]/65">
					Hiện có {blogCategoryIds.length} loại blog trong hệ thống.
				</CardDescription>
			</CardHeader>

			<CardContent className="p-0">
				<div className="hidden border-b border-[#E7D0AF]/70 bg-[#FAF7F1] px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/70 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_10rem_5rem] lg:gap-4">
					<div>Tên tiếng Việt</div>
					<div>Tên tiếng Anh</div>
					<div>Cập nhật</div>
					<div className="text-right">Thao tác</div>
				</div>

				<div className="divide-y divide-[#E7D0AF]/70">
					{blogCategoryIds.map((blogCategoryId) => (
						<FormBoundaryProvider key={blogCategoryId}>
							<BlogCategoryRow blogCategoryId={blogCategoryId} />
						</FormBoundaryProvider>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
