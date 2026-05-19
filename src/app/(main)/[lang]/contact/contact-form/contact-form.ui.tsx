"use client";

import { ArrowRight } from "lucide-react";
import {
	FieldError,
	FormField,
	FormInput,
	FormLabel,
} from "src/components/form-field";
import { Form, FormErrorDisplay, SubmitButton } from "src/components/form-state";
import { Textarea } from "src/components/ui/textarea";
import type { Locale } from "src/lib/i18n/config";
import { getDictionary } from "src/lib/i18n/dictionaries";
import { handleContactFormSubmission } from "./contact-form.actions";

interface ContactFormProps {
	locale: Locale;
}

export function ContactForm({ locale }: ContactFormProps) {
	const dictionary = getDictionary(locale);

	return (
		<Form action={handleContactFormSubmission}>
			<FormErrorDisplay />

			<div className="space-y-5 sm:space-y-6">
				<div className="grid gap-5 sm:gap-6 md:grid-cols-2">
					<FormField fieldId="name" name="name" required>
						<FormLabel>{dictionary.contact.form.fields.name.label}</FormLabel>

						<FormInput
							type="text"
							placeholder={dictionary.contact.form.fields.name.placeholder}
						/>

						<FieldError />
					</FormField>

					<FormField
						fieldId="phone"
						name="phone"
						required
						pattern="[0-9+\-\s()]+"
						title={dictionary.contact.form.fields.phone.validation}
					>
						<FormLabel>{dictionary.contact.form.fields.phone.label}</FormLabel>

						<FormInput
							type="tel"
							placeholder={dictionary.contact.form.fields.phone.placeholder}
						/>

						<FieldError />
					</FormField>
				</div>

				<FormField fieldId="email" name="email" required>
					<FormLabel>{dictionary.contact.form.fields.email.label}</FormLabel>

					<FormInput
						type="email"
						placeholder={dictionary.contact.form.fields.email.placeholder}
					/>

					<FieldError />
				</FormField>

				<FormField fieldId="subject" name="subject">
					<FormLabel>{dictionary.contact.form.fields.subject.label}</FormLabel>

					<FormInput
						type="text"
						placeholder={dictionary.contact.form.fields.subject.placeholder}
					/>

					<FieldError />
				</FormField>

				<FormField fieldId="message" name="message" required>
					<FormLabel>{dictionary.contact.form.fields.message.label}</FormLabel>

					<Textarea
						placeholder={dictionary.contact.form.fields.message.placeholder}
						rows={6}
						className="
							min-h-[130px] w-full resize-y rounded-sm border border-[#E7D0AF]
							bg-[#FAF7F0] px-4 py-3
							text-[14px] leading-7 text-[#342312]
							shadow-none transition-colors duration-300
							placeholder:text-[#342312]/40
							hover:border-[#A87E3C]
							focus:border-[#A87E3C] focus:bg-[#F7F1E6]
							focus:ring-2 focus:ring-[#A87E3C]/20
							sm:min-h-[150px] sm:text-[15px]
						"
					/>

					<FieldError />
				</FormField>

				<SubmitButton
					className="
						group relative mt-2 inline-flex h-12 w-full items-center justify-center
						overflow-hidden rounded-sm border border-[#342312]
						bg-[#342312] px-5
						text-center text-[12px] font-semibold uppercase tracking-[0.16em]
						text-[#E7D0AF]
						transition-all duration-500 ease-out
						hover:-translate-y-0.5
						hover:shadow-[0_18px_45px_rgba(52,35,18,0.22)]
						focus-visible:outline-none focus-visible:ring-2
						focus-visible:ring-[#A87E3C]/50 focus-visible:ring-offset-2
						disabled:pointer-events-none disabled:opacity-60
						sm:h-14 sm:px-8 sm:text-sm sm:tracking-[0.18em]
					"
				>
					<span className="absolute inset-0 origin-left scale-x-0 bg-[#A87E3C] transition-transform duration-500 ease-out group-hover:scale-x-100" />

					<span className="relative z-10 flex min-w-0 items-center justify-center gap-3">
						<span className="min-w-0 break-words">
							{dictionary.contact.form.submit}
						</span>

						<ArrowRight className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
					</span>
				</SubmitButton>
			</div>
		</Form>
	);
}