import { randomUUID } from "node:crypto";
import { getDatabase } from "src/lib/database";
import type { ContactSubmissionDocument, ContactSubmissionInput } from "./contact-submission.type";

const CONTACT_SUBMISSIONS_COLLECTION = "contactSubmissions";

export async function createContactSubmission(input: ContactSubmissionInput): Promise<string> {
	const db = await getDatabase();
	const now = new Date();
	const id = randomUUID();

	const document: ContactSubmissionDocument = {
		id,
		name: input.name,
		phone: input.phone,
		email: input.email,
		subject: input.subject,
		message: input.message,
		locale: input.locale,
		status: "new",
		createdAt: now,
		updatedAt: now,
	};

	const result = await db
		.collection<ContactSubmissionDocument>(CONTACT_SUBMISSIONS_COLLECTION)
		.insertOne(document);

	if (!result.acknowledged) {
		throw new Error("MongoDB did not acknowledge the contact submission");
	}

	return id;
}
