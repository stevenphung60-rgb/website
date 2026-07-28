/**
 * Contact information server operations
 * Exports all contact-related database operations
 */

export type {
	ContactSubmissionDocument,
	ContactSubmissionInput,
	ContactSubmissionStatus,
} from "./contact-submission.type";
export { createContactSubmission } from "./create-contact-submission.mutation";
export { getContactInfo } from "./get-contact-info.query";
export {
	type ContactSubmissionListPage,
	type GetContactSubmissionListPageInput,
	getContactSubmissionListPage,
} from "./get-contact-submission-list-page.query";
export {
	type ContactSubmissionMetrics,
	getContactSubmissionMetrics,
} from "./get-contact-submission-metrics.query";
export { updateContactInfo } from "./update-contact-info.mutation";
export {
	type UpdateContactSubmissionStatusInput,
	updateContactSubmissionStatus,
} from "./update-contact-submission-status.mutation";
