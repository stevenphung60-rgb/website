import { DialogContent, DialogHeader, DialogTitle } from "src/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { getProjectCategoryById } from "src/server/projectcategories";

interface ProjectCategoryPreviewDialogContentProps {
	projectCategoryId: string;
}

export async function ProjectCategoryPreviewDialogContent({
	projectCategoryId,
}: ProjectCategoryPreviewDialogContentProps) {
	const projectCategory = await getProjectCategoryById(projectCategoryId);

	if (!projectCategory) {
		return <NotFoundProjectCategoryPreviewDialogContent />;
	}

	return (
		<DialogContent className="max-w-2xl w-[95vw] max-h-[95vh] overflow-y-auto p-0 bg-white">
			<Tabs defaultValue="en" className="w-full">
				<DialogHeader className="p-6 pb-0 sticky top-0 bg-background z-10">
					<TabsList className="grid w-full grid-cols-2 mb-4">
						<TabsTrigger value="en">English</TabsTrigger>
						<TabsTrigger value="vi">Tiếng Việt</TabsTrigger>
					</TabsList>

					<TabsContent value="en" className="mt-0">
						<DialogTitle className="text-2xl font-serif font-bold text-foreground pr-8">
							{projectCategory.name.en}
						</DialogTitle>
					</TabsContent>

					<TabsContent value="vi" className="mt-0">
						<DialogTitle className="text-2xl font-serif font-bold text-foreground pr-8">
							{projectCategory.name.vi}
						</DialogTitle>
					</TabsContent>
				</DialogHeader>

				<div className="px-6 pb-6">
					<div className="rounded-lg border bg-muted/50 p-4">
						<p className="text-sm text-muted-foreground">
							Category ID: {projectCategory.id}
						</p>
					</div>
				</div>
			</Tabs>
		</DialogContent>
	);
}

function NotFoundProjectCategoryPreviewDialogContent() {
	return (
		<DialogContent className="max-w-2xl w-[95vw] max-h-[95vh] overflow-y-auto p-0 bg-white">
			<DialogHeader className="p-6 pb-0">
				<DialogTitle>Project Category Not Found</DialogTitle>
			</DialogHeader>
			<div className="p-6">
				<p className="text-muted-foreground">The requested project category could not be found.</p>
			</div>
		</DialogContent>
	);
}