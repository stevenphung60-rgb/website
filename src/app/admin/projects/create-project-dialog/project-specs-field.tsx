"use client";

import { Plus, Trash2 } from "lucide-react";
import { FieldError, FormField, FormInput, FormLabel } from "src/components/form-field";
import { Button } from "src/components/ui/button";
import { useCreateProjectSpecs } from "./create-project-dialog.state";

/**
 * Project specifications field for create project form
 * @returns Project specifications input list
 */
export function ProjectSpecsField() {
	const { specs, addSpec, removeSpec, updateSpec } = useCreateProjectSpecs();

	const specsForSubmit = specs
		.map((spec) => ({
			vi: spec.vi.trim(),
			en: spec.en.trim(),
		}))
		.filter((spec) => spec.vi || spec.en);

	return (
		<div className="space-y-4">
			<input type="hidden" name="projectSpecs" value={JSON.stringify(specsForSubmit)} />

			<div className="rounded-xl border border-[#E7D0AF] bg-[#FAF7F1] p-4">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="min-w-0">
						<p className="text-sm font-semibold text-[#342312]">
							Danh sách thông số
						</p>

						<p className="mt-1 text-xs italic leading-5 text-[#342312]/65">
							Ví dụ: diện tích thi công, hạng mục thực hiện, vật liệu sử dụng hoặc quy mô dự án.
						</p>
					</div>

					<Button
						type="button"
						variant="outline"
						onClick={addSpec}
						className="shrink-0 border-[#E7D0AF] bg-white text-[#342312] hover:bg-[#FAF7F1]"
					>
						<Plus className="mr-2 size-4" />
						Thêm thông số
					</Button>
				</div>
			</div>

			{specs.length > 0 ? (
				<div className="space-y-4">
					{specs.map((spec, index) => (
						<div
							key={spec.id}
							className="rounded-xl border border-[#E7D0AF] bg-white p-4"
						>
							<div className="mb-4 flex items-center justify-between gap-3">
								<div>
									<p className="text-sm font-semibold text-[#342312]">
										Thông số {index + 1}
									</p>

									<p className="mt-1 text-xs italic text-[#342312]/60">
										Nhập tiếng Việt trước. Tiếng Anh có thể bổ sung sau.
									</p>
								</div>

								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => removeSpec(spec.id)}
									className="shrink-0 border-destructive/30 text-destructive hover:text-destructive"
								>
									<Trash2 className="size-4" />
								</Button>
							</div>

							<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
								<FormField
									fieldId={`projectSpecVi-${spec.id}`}
									name={`projectSpecVi-${spec.id}`}
									placeholder="Ví dụ: Thi công hệ thống ống gió nhà xưởng"
								>
									<FormLabel>Thông số tiếng Việt</FormLabel>

									<FormInput
										value={spec.vi}
										onChange={(event) =>
											updateSpec(spec.id, "vi", event.target.value)
										}
									/>

									<FieldError />
								</FormField>

								<FormField
									fieldId={`projectSpecEn-${spec.id}`}
									name={`projectSpecEn-${spec.id}`}
									placeholder="Example: Factory air duct installation"
								>
									<FormLabel>Thông số tiếng Anh</FormLabel>

									<FormInput
										value={spec.en}
										onChange={(event) =>
											updateSpec(spec.id, "en", event.target.value)
										}
									/>

									<FieldError />
								</FormField>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="rounded-xl border border-dashed border-[#E7D0AF] bg-white px-4 py-8 text-center">
					<p className="text-sm font-medium text-[#342312]">
						Chưa có thông số kỹ thuật
					</p>

					<p className="mt-1 text-xs italic leading-5 text-[#342312]/65">
						Phần này không bắt buộc. Bấm “Thêm thông số” nếu muốn bổ sung thông tin nổi bật cho dự án.
					</p>
				</div>
			)}
		</div>
	);
}