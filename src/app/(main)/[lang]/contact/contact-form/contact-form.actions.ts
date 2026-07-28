"use server";

import type { FormResult } from "src/components/form-state/form-state.type";
import type { Locale } from "src/lib/i18n/config";
import { createContactSubmission } from "src/server/contact";
import { z } from "zod";

export interface ContactFormData {
	name: string;
	phone: string;
	email: string;
	subject: string;
	message: string;
	locale: Locale;
	website: string;
}

const contactFormSchema = z.object({
	name: z.string().trim().min(1).max(120),
	phone: z
		.string()
		.trim()
		.min(6)
		.max(30)
		.regex(/^(?=.*\d)[0-9+\-\s()]+$/),
	email: z.string().trim().max(254).email(),
	subject: z.string().trim().min(1).max(200),
	message: z.string().trim().min(1).max(5000),
	locale: z.enum(["vi", "en"]),
	website: z.string().max(200),
});

const formMessages = {
	vi: {
		invalid: "Dữ liệu biểu mẫu chưa hợp lệ.",
		invalidEmail: "Quý khách vui lòng nhập đúng định dạng email.",
		invalidField: "Quý khách vui lòng kiểm tra lại trường dữ liệu trên.",
		invalidPhone: "Quý khách vui lòng nhập đúng định dạng số điện thoại.",
		failed: "Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.",
		required: "Quý khách vui lòng nhập trường dữ liệu trên nhé",
		success: "Yêu cầu của bạn đã được gửi thành công.",
	},
	en: {
		invalid: "The form data is invalid.",
		invalidEmail: "Please enter a valid email address.",
		invalidField: "Please check the field above.",
		invalidPhone: "Please enter a valid phone number.",
		failed: "We could not send your request right now. Please try again later.",
		required: "This field is required",
		success: "Your request has been sent successfully.",
	},
} as const;

function getString(formData: FormData, field: string): string {
	const value = formData.get(field);

	return typeof value === "string" ? value : "";
}

function getLocale(formData: FormData): Locale {
	return getString(formData, "locale") === "en" ? "en" : "vi";
}

const requiredContactFields = ["name", "phone", "email", "subject", "message"] as const;
const contactFieldNames = new Set<string>(requiredContactFields);

function getRequiredFieldErrors(data: ContactFormData, locale: Locale): Record<string, string> {
	const fieldErrors: Record<string, string> = {};

	for (const field of requiredContactFields) {
		if (!data[field].trim()) {
			fieldErrors[field] = formMessages[locale].required;
		}
	}

	return fieldErrors;
}

export async function handleContactFormSubmission(formData: FormData): Promise<FormResult> {
	const locale = getLocale(formData);
	const data: ContactFormData = {
		name: getString(formData, "name"),
		phone: getString(formData, "phone"),
		email: getString(formData, "email"),
		subject: getString(formData, "subject"),
		message: getString(formData, "message"),
		locale,
		website: getString(formData, "website"),
	};

	// Quietly accept honeypot submissions so automated bots do not retry.
	if (data.website.trim()) {
		return {
			success: true,
			refresh: true,
		};
	}

	const validationResult = contactFormSchema.safeParse(data);

	if (!validationResult.success) {
		const fieldErrors = getRequiredFieldErrors(data, locale);

		for (const issue of validationResult.error.issues) {
			const fieldName = issue.path[0];

			if (
				typeof fieldName !== "string" ||
				!contactFieldNames.has(fieldName) ||
				fieldErrors[fieldName]
			) {
				continue;
			}

			fieldErrors[fieldName] =
				fieldName === "email"
					? formMessages[locale].invalidEmail
					: fieldName === "phone"
						? formMessages[locale].invalidPhone
						: formMessages[locale].invalidField;
		}

		return {
			success: false,
			error: formMessages[locale].invalid,
			fieldErrors,
		};
	}

	const validatedData = validationResult.data;

	try {
		await createContactSubmission({
			name: validatedData.name,
			phone: validatedData.phone,
			email: validatedData.email.toLowerCase(),
			subject: validatedData.subject,
			message: validatedData.message,
			locale: validatedData.locale,
		});

		return {
			success: true,
			message: formMessages[locale].success,
			reset: true,
		};
	} catch (error) {
		console.error("Failed to persist contact submission:", error);

		return {
			success: false,
			error: formMessages[locale].failed,
		};
	}
}
