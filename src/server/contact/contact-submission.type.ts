import type { Locale } from "src/lib/i18n/config";

export type ContactSubmissionStatus = "new" | "contacted" | "resolved";

export interface ContactSubmissionInput {
	name: string;
	phone: string;
	email: string;
	subject: string;
	message: string;
	locale: Locale;
}

export interface ContactSubmissionDocument extends ContactSubmissionInput {
	id: string;
	status: ContactSubmissionStatus;
	createdAt: Date;
	updatedAt: Date;
}
