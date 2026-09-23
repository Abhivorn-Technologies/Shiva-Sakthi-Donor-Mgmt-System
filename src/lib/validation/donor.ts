import { z } from "zod";

export const donorSchema = z
	.object({
		fullName: z
			.string()
			.min(2, "Name must be at least 2 characters")
			.max(100, "Name is too long")
			.trim(),
		email: z.string().email("Invalid email address").trim().toLowerCase(),
		whatsappNumber: z
			.string()
			.regex(/^\+?[0-9\s\-()]{10,20}$/, "Invalid phone number format")
			.trim(),
		occupation: z.string().min(2, "Occupation is required").trim(),
		paymentMode: z.enum([
			"Cash",
			"UPI",
			"PhonePe",
			"Google Pay",
			"Bank Transfer",
			"Cheque",
			"Other",
		]),
		otherPaymentMode: z.string().trim().optional(),
		amount: z.coerce.number().min(1, "Amount must be greater than 0"),
	})
	.superRefine((data, ctx) => {
		if (
			data.paymentMode === "Other" &&
			(!data.otherPaymentMode || data.otherPaymentMode.length < 2)
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Please specify the payment mode",
				path: ["otherPaymentMode"],
			});
		}
	});

export type DonorFormValues = z.infer<typeof donorSchema>;
