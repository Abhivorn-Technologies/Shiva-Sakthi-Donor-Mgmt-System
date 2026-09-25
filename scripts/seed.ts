/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config(); // Load .env file

const MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://localhost:27017/donor-mgmt";

async function seed() {
	await mongoose.connect(MONGODB_URI);
	console.log("Connected to MongoDB.");

	const UserSchema = new mongoose.Schema(
		{
			fullName: String,
			email: { type: String, unique: true },
			passwordHash: String,
			role: String,
			isActive: Boolean,
		},
		{ timestamps: true },
	);

	const User = mongoose.models.User || mongoose.model("User", UserSchema);

	await User.deleteMany({});
	console.log("Cleared existing users.");

	const adminPasswordHash = await bcrypt.hash("admin123", 10);
	const coordPasswordHash = await bcrypt.hash("coord123", 10);

	const admin = await User.create({
		fullName: "System Admin",
		email: "admin@example.com",
		passwordHash: adminPasswordHash,
		role: "ADMIN",
		isActive: true,
	});

	const coord1 = await User.create({
		fullName: "Rahul Coordinator",
		email: "rahul@example.com",
		passwordHash: coordPasswordHash,
		role: "COORDINATOR",
		isActive: true,
	});

	const coord2 = await User.create({
		fullName: "Priya Coordinator",
		email: "priya@example.com",
		passwordHash: coordPasswordHash,
		role: "COORDINATOR",
		isActive: true,
	});

	console.log("Seeded 1 Admin and 2 Coordinators.");
	console.log("Admin: admin@example.com / admin123");
	console.log("Coordinator: rahul@example.com / coord123");

	await mongoose.disconnect();
}

seed().catch(console.error);
