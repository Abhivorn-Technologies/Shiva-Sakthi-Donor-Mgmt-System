"use server";

import connectToDatabase from "@/lib/db/connect";
import { User } from "@/models/User";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function deactivateCoordinator(id: string, isActive: boolean) {
	const session = await auth();
	if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

	await connectToDatabase();
	await User.findByIdAndUpdate(id, { isActive });
	revalidatePath("/admin/coordinators");
}

export async function createCoordinator(prevState: any, formData: FormData) {
	try {
		const session = await auth();
		if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

		const fullName = formData.get("fullName") as string;
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		if (!fullName || !email || !password || password.length < 6) {
			return { error: "Invalid input" };
		}

		await connectToDatabase();

		const existingUser = await User.findOne({ email: email.toLowerCase() });
		if (existingUser) {
			return { error: "User with this email already exists." };
		}

		const passwordHash = await bcrypt.hash(password, 10);

		const newCoord = new User({
			fullName,
			email: email.toLowerCase(),
			passwordHash,
			role: "COORDINATOR",
			isActive: true,
		});

		await newCoord.save();
	} catch (error: any) {
		return { error: "Internal server error" };
	}

	revalidatePath("/admin/coordinators");
	redirect("/admin/coordinators");
}

export async function deleteCoordinator(id: string) {
	const session = await auth();
	if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

	await connectToDatabase();
	await User.findByIdAndDelete(id);
	revalidatePath("/admin/coordinators");
}

export async function resetCoordinatorPassword(
	id: string,
	newPassword: string,
) {
	const session = await auth();
	if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");
	if (!newPassword || newPassword.length < 6)
		throw new Error("Password must be at least 6 characters");

	await connectToDatabase();
	const passwordHash = await bcrypt.hash(newPassword, 10);
	await User.findByIdAndUpdate(id, { passwordHash });
}
