"use server";

import connectToDatabase from "@/lib/db/connect";
import { Donor } from "@/models/Donor";
import { auth } from "@/auth";
import { donorSchema } from "@/lib/validation/donor";
import { revalidatePath } from "next/cache";

export async function createDonor(prevState: any, formData: FormData) {
	try {
		const session = await auth();
		if (!session?.user || session.user.role !== "COORDINATOR") {
			return { success: false, error: "Unauthorized" };
		}

		const data = Object.fromEntries(formData.entries());

		const result = donorSchema.safeParse(data);
		if (!result.success) {
			const errorMessages = result.error.errors
				.map((e) => e.message)
				.join(", ");
			return { success: false, error: "Validation failed: " + errorMessages };
		}

		const validData = result.data;
		const normalizedEmail = validData.email;
		const normalizedWhatsappNumber = validData.whatsappNumber.replace(
			/\D/g,
			"",
		);

		await connectToDatabase();

		const newDonor = new Donor({
			...validData,
			normalizedEmail,
			normalizedWhatsappNumber,
			createdBy: session.user.id,
		});

		await newDonor.save();

		revalidatePath("/coordinator/dashboard");
		return { success: true, message: "Donor added successfully." };
	} catch (error: any) {
		if (error.code === 11000) {
			return {
				success: false,
				error:
					"Donor already exists. This donor appears to already be registered in the system. Please verify the contact details or contact the administrator if you believe this is incorrect.",
			};
		}
		return { success: false, error: "Internal server error" };
	}
}
