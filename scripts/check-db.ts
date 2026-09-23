import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config();

async function check() {
	const uri = process.env.MONGODB_URI;
	console.log(
		"Connecting to:",
		uri ? uri.substring(0, 20) + "..." : "undefined",
	);
	await mongoose.connect(uri as string);

	const UserSchema = new mongoose.Schema(
		{
			email: String,
			passwordHash: String,
			isActive: Boolean,
			role: String,
		},
		{ strict: false },
	);
	const User = mongoose.models.User || mongoose.model("User", UserSchema);

	const users = await User.find();
	console.log("Users found:", users.length);

	const admin = await User.findOne({ email: "admin@example.com" });
	if (admin) {
		console.log(
			"Admin found:",
			admin.email,
			"isActive:",
			admin.isActive,
			"role:",
			admin.role,
		);
		const match = await bcrypt.compare("admin123", admin.passwordHash);
		console.log("Password matches:", match);
	} else {
		console.log("Admin NOT found!");
	}

	await mongoose.disconnect();
}

check().catch(console.error);
