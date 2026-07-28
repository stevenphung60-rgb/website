import type { Filter } from "mongodb";
import { getDatabase } from "src/lib/database";
import type { ContactSubmissionDocument, ContactSubmissionStatus } from "./contact-submission.type";

const CONTACT_SUBMISSIONS_COLLECTION = "contactSubmissions";
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export interface GetContactSubmissionListPageInput {
	page?: number;
	search?: string;
	status?: ContactSubmissionStatus | null;
	pageSize?: number;
}

export interface ContactSubmissionListPage {
	items: ContactSubmissionDocument[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

function normalizePositiveInteger(value: number | undefined, fallback: number): number {
	if (!value || !Number.isFinite(value)) {
		return fallback;
	}

	return Math.max(1, Math.floor(value));
}

function escapeRegex(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createContactSubmissionFilter(
	input: GetContactSubmissionListPageInput,
): Filter<ContactSubmissionDocument> {
	const filter: Filter<ContactSubmissionDocument> = {};

	if (input.status) {
		filter.status = input.status;
	}

	const search = input.search?.trim();

	if (search) {
		const escapedSearch = escapeRegex(search);
		const stringSearch = {
			$regex: escapedSearch,
			$options: "i",
		};

		filter.$or = [
			{ name: stringSearch },
			{ email: stringSearch },
			{ phone: stringSearch },
			{ subject: stringSearch },
			{ message: stringSearch },
		];
	}

	return filter;
}

/**
 * Get one uncached, filtered page of contact submissions for the admin inbox.
 */
export async function getContactSubmissionListPage(
	input: GetContactSubmissionListPageInput = {},
): Promise<ContactSubmissionListPage> {
	const requestedPage = normalizePositiveInteger(input.page, 1);
	const pageSize = Math.min(
		normalizePositiveInteger(input.pageSize, DEFAULT_PAGE_SIZE),
		MAX_PAGE_SIZE,
	);
	const filter = createContactSubmissionFilter(input);
	const db = await getDatabase();
	const collection = db.collection<ContactSubmissionDocument>(CONTACT_SUBMISSIONS_COLLECTION);
	const total = await collection.countDocuments(filter);
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const page = Math.min(requestedPage, totalPages);
	const items = await collection
		.find(filter, { projection: { _id: 0 } })
		.sort({ createdAt: -1, id: -1 })
		.skip((page - 1) * pageSize)
		.limit(pageSize)
		.toArray();

	return {
		items,
		total,
		page,
		pageSize,
		totalPages,
	};
}
