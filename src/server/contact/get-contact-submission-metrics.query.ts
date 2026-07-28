import { getDatabase } from "src/lib/database";
import type { ContactSubmissionDocument } from "./contact-submission.type";

const CONTACT_SUBMISSIONS_COLLECTION = "contactSubmissions";

export interface ContactSubmissionMetrics {
	total: number;
	new: number;
	contacted: number;
	resolved: number;
}

/**
 * Get uncached totals for each contact submission workflow status.
 */
export async function getContactSubmissionMetrics(): Promise<ContactSubmissionMetrics> {
	const db = await getDatabase();
	const collection = db.collection<ContactSubmissionDocument>(CONTACT_SUBMISSIONS_COLLECTION);
	const [total, newCount, contacted, resolved] = await Promise.all([
		collection.countDocuments({}),
		collection.countDocuments({ status: "new" }),
		collection.countDocuments({ status: "contacted" }),
		collection.countDocuments({ status: "resolved" }),
	]);

	return {
		total,
		new: newCount,
		contacted,
		resolved,
	};
}
