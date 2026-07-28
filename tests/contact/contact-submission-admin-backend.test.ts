import {
	getContactSubmissionListPage,
	getContactSubmissionMetrics,
	updateContactSubmissionStatus,
} from "src/server/contact";
import type { ContactSubmissionDocument } from "src/server/contact/contact-submission.type";
import { beforeEach, describe, expect, it, vi } from "vitest";

const databaseMocks = vi.hoisted(() => ({
	collection: vi.fn(),
	countDocuments: vi.fn(),
	find: vi.fn(),
	findOneAndUpdate: vi.fn(),
	limit: vi.fn(),
	skip: vi.fn(),
	sort: vi.fn(),
	toArray: vi.fn(),
}));

vi.mock("src/lib/database", () => ({
	getDatabase: vi.fn(async () => ({
		collection: databaseMocks.collection,
	})),
}));

function createSubmission(
	overrides: Partial<ContactSubmissionDocument> = {},
): ContactSubmissionDocument {
	const createdAt = new Date("2026-07-28T08:00:00.000Z");

	return {
		id: "submission-1",
		name: "Nguyễn Văn An",
		phone: "0901 234 567",
		email: "customer@example.com",
		subject: "Tư vấn hệ thống ống gió",
		message: "Tôi cần tư vấn cho nhà xưởng mới.",
		locale: "vi",
		status: "new",
		createdAt,
		updatedAt: createdAt,
		...overrides,
	};
}

describe("contact submission admin backend", () => {
	beforeEach(() => {
		vi.clearAllMocks();

		databaseMocks.collection.mockReturnValue({
			countDocuments: databaseMocks.countDocuments,
			find: databaseMocks.find,
			findOneAndUpdate: databaseMocks.findOneAndUpdate,
		});
		databaseMocks.find.mockReturnValue({
			sort: databaseMocks.sort,
		});
		databaseMocks.sort.mockReturnValue({
			skip: databaseMocks.skip,
		});
		databaseMocks.skip.mockReturnValue({
			limit: databaseMocks.limit,
		});
		databaseMocks.limit.mockReturnValue({
			toArray: databaseMocks.toArray,
		});
	});

	it("returns a clamped page sorted newest first without MongoDB _id", async () => {
		const item = createSubmission({ id: "submission-5" });
		databaseMocks.countDocuments.mockResolvedValue(5);
		databaseMocks.toArray.mockResolvedValue([item]);

		const result = await getContactSubmissionListPage({
			page: 99,
			pageSize: 2,
			status: "new",
		});

		expect(databaseMocks.collection).toHaveBeenCalledWith("contactSubmissions");
		expect(databaseMocks.countDocuments).toHaveBeenCalledWith({ status: "new" });
		expect(databaseMocks.find).toHaveBeenCalledWith({ status: "new" }, { projection: { _id: 0 } });
		expect(databaseMocks.sort).toHaveBeenCalledWith({
			createdAt: -1,
			id: -1,
		});
		expect(databaseMocks.skip).toHaveBeenCalledWith(4);
		expect(databaseMocks.limit).toHaveBeenCalledWith(2);
		expect(result).toEqual({
			items: [item],
			total: 5,
			page: 3,
			pageSize: 2,
			totalPages: 3,
		});
	});

	it("escapes regex syntax and searches all supported text fields", async () => {
		databaseMocks.countDocuments.mockResolvedValue(0);
		databaseMocks.toArray.mockResolvedValue([]);

		const result = await getContactSubmissionListPage({
			search: "  An.*(test)  ",
		});

		const expectedStringSearch = {
			$regex: "An\\.\\*\\(test\\)",
			$options: "i",
		};
		const expectedFilter = {
			$or: [
				{ name: expectedStringSearch },
				{ email: expectedStringSearch },
				{ phone: expectedStringSearch },
				{ subject: expectedStringSearch },
				{ message: expectedStringSearch },
			],
		};

		expect(databaseMocks.countDocuments).toHaveBeenCalledWith(expectedFilter);
		expect(databaseMocks.find).toHaveBeenCalledWith(expectedFilter, {
			projection: { _id: 0 },
		});
		expect(databaseMocks.limit).toHaveBeenCalledWith(20);
		expect(result.pageSize).toBe(20);
	});

	it("returns live metrics for all workflow statuses", async () => {
		databaseMocks.countDocuments.mockImplementation(async (filter: { status?: string }) => {
			if (!filter.status) return 12;
			if (filter.status === "new") return 5;
			if (filter.status === "contacted") return 4;
			return 3;
		});

		const metrics = await getContactSubmissionMetrics();

		expect(databaseMocks.countDocuments).toHaveBeenCalledTimes(4);
		expect(metrics).toEqual({
			total: 12,
			new: 5,
			contacted: 4,
			resolved: 3,
		});
	});

	it("updates the status and returns the updated document", async () => {
		const updatedDocument = createSubmission({
			status: "contacted",
			updatedAt: new Date("2026-07-28T09:00:00.000Z"),
		});
		databaseMocks.findOneAndUpdate.mockResolvedValue(updatedDocument);

		const result = await updateContactSubmissionStatus({
			id: "submission-1",
			status: "contacted",
		});

		expect(databaseMocks.findOneAndUpdate).toHaveBeenCalledWith(
			{ id: "submission-1" },
			{
				$set: {
					status: "contacted",
					updatedAt: expect.any(Date),
				},
			},
			{
				projection: { _id: 0 },
				returnDocument: "after",
			},
		);
		expect(result).toEqual(updatedDocument);
	});

	it("returns null when the submission no longer exists", async () => {
		databaseMocks.findOneAndUpdate.mockResolvedValue(null);

		await expect(
			updateContactSubmissionStatus({
				id: "missing-submission",
				status: "resolved",
			}),
		).resolves.toBeNull();
	});
});
