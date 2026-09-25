/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import connectToDatabase from "@/lib/db/connect";
import { User } from "@/models/User";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { Types } from "mongoose";
import { z } from "zod";

const coordinatorSchema = z.object({
	fullName: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email").transform(v => v.trim().toLowerCase()),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function deactivateCoordinator(id: string, isActive: boolean) {
	const session = await auth();
	if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");
	if (!Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
	if (session.user.id === id) throw new Error("Cannot deactivate yourself");

	await connectToDatabase();
	await User.findOneAndUpdate(
		{ _id: id, role: "COORDINATOR" },
		{ isActive }
	);
	revalidatePath("/admin/coordinators");
}

export async function createCoordinator(prevState: any, formData: FormData) {
	try {
		const session = await auth();
		if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

		const result = coordinatorSchema.safeParse(Object.fromEntries(formData));
		if (!result.success) {
			return { error: result.error.errors[0].message };
		}
		const { fullName, email, password } = result.data;

		await connectToDatabase();
		const passwordHash = await bcrypt.hash(password, 10);

		const newCoord = new User({
			fullName,
			email,
			passwordHash,
			role: "COORDINATOR",
			isActive: true,
		});

		await newCoord.save();
	} catch (error: any) {
		if (error.code === 11000) {
			return { error: "User with this email already exists." };
		}
		return { error: "Internal server error" };
	}

	revalidatePath("/admin/coordinators");
	redirect("/admin/coordinators");
}

export async function deleteCoordinator(id: string) {
	const session = await auth();
	if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");
	if (!Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
	if (session.user.id === id) throw new Error("Cannot delete yourself");

	await connectToDatabase();
	await User.findOneAndDelete({ _id: id, role: "COORDINATOR" });
	revalidatePath("/admin/coordinators");
}

export async function resetCoordinatorPassword(
	id: string,
	newPassword: string,
) {
	const session = await auth();
	if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");
	if (!Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
	if (!newPassword || newPassword.length < 6)
		throw new Error("Password must be at least 6 characters");
	if (session.user.id === id) throw new Error("Cannot reset own password here");

	await connectToDatabase();
	const passwordHash = await bcrypt.hash(newPassword, 10);
	await User.findOneAndUpdate(
		{ _id: id, role: "COORDINATOR" },
		{ passwordHash }
	);
}
