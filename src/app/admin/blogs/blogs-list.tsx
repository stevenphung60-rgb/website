import { FormBoundaryProvider } from "src/components/form-state";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "src/components/ui/card";
import { BlogRow } from "./blog-row";

interface BlogsListProps {
	blogPostIds: string[];
}

/**
 * Display blog post list in the admin panel
 * @param props - Blogs list props
 * @returns Blog list card
 */
export function BlogsList({ blogPostIds }: BlogsListProps) {
	return (
		<Card className="border-[#E7D0AF] bg-white shadow-sm">
			<CardHeader className="border-b border-[#E7D0AF]/70">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<CardTitle className="font-serif text-xl text-[#342312]">
							Danh sách blog
						</CardTitle>

						<CardDescription className="mt-1 text-[#342312]/65">
							Hiện có {blogPostIds.length} blog trong hệ thống.
						</CardDescription>
					</div>
				</div>
			</CardHeader>

			<CardContent className="p-0">
				<div className="hidden border-b border-[#E7D0AF]/70 bg-[#FAF7F1] px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#342312]/70 lg:grid lg:grid-cols-[5rem_minmax(0,1.45fr)_minmax(0,0.8fr)_8rem_9rem_5rem] lg:gap-4">
					<div>Ảnh</div>
					<div>Blog</div>
					<div>Loại</div>
					<div>Trạng thái</div>
					<div>Ngày đăng</div>
					<div className="text-right">Thao tác</div>
				</div>

				<div className="divide-y divide-[#E7D0AF]/70">
					{blogPostIds.map((blogPostId) => (
						<FormBoundaryProvider key={blogPostId}>
							<BlogRow blogPostId={blogPostId} />
						</FormBoundaryProvider>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
