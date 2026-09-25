/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

import { z } from "zod";

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
	redirectTo: z.string().optional(),
});

export async function loginAction(prevState: any, formData: FormData) {
	try {
		const rawData = Object.fromEntries(formData.entries());
		const result = loginSchema.safeParse(rawData);
		if (!result.success) return { error: "Invalid input format." };
		
		await signIn("credentials", result.data);
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: "Invalid credentials or inactive account." };
				default:
					return { error: "Something went wrong." };
			}
		}
		throw error;
	}
}
