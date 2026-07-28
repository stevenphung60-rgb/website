import { getDatabase } from "src/lib/database";
import type { ContactSubmissionDocument, ContactSubmissionStatus } from "./contact-submission.type";

const CONTACT_SUBMISSIONS_COLLECTION = "contactSubmissions";

export interface UpdateContactSubmissionStatusInput {
	id: string;
	status: ContactSubmissionStatus;
}

/**
 * Update a contact submission workflow status and return the updated document.
 */
export async function updateContactSubmissionStatus(
	input: UpdateContactSubmissionStatusInput,
): Promise<ContactSubmissionDocument | null> {
	const db = await getDatabase();
	const updatedDocument = await db
		.collection<ContactSubmissionDocument>(CONTACT_SUBMISSIONS_COLLECTION)
		.findOneAndUpdate(
			{ id: input.id },
			{
				$set: {
					status: input.status,
					updatedAt: new Date(),
				},
			},
			{
				projection: { _id: 0 },
				returnDocument: "after",
			},
		);

	return updatedDocument;
}
