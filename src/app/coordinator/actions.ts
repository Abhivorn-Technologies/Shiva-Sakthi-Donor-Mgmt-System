/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react/no-unescaped-entities */
"use server";

import connectToDatabase from "@/lib/db/connect";
import { Donor } from "@/models/Donor";
import { User } from "@/models/User";
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
		if (normalizedWhatsappNumber.length < 10) {
			return { success: false, error: "Validation failed: Phone number too short after cleaning" };
		}

		await connectToDatabase();

		const existingDonor = await Donor.findOne({
			$or: [{ normalizedEmail }, { normalizedWhatsappNumber }],
		});

		if (
			existingDonor &&
			existingDonor.createdBy.toString() !== session.user.id
		) {
			const originalCoordinator = await User.findById(existingDonor.createdBy);
			
			// If the original coordinator is still active, block it.
			// Otherwise (deleted or deactivated), allow the new coordinator to claim the donor.
			if (originalCoordinator && originalCoordinator.isActive) {
				return {
					success: false,
					error: "This donor is already registered with another active coordinator.",
				};
			}
		}

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
			const field = Object.keys(error.keyPattern || {})[0];
			return { success: false, error: `A donor with this ${field || "contact info"} already exists.` };
		}
		return { success: false, error: "Internal server error" };
	}
}
