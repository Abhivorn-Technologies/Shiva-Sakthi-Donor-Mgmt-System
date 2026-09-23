"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function loginAction(prevState: any, formData: FormData) {
	try {
		const credentials = Object.fromEntries(formData.entries());
		await signIn("credentials", credentials);
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
