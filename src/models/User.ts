import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
	fullName: string;
	email: string;
	passwordHash: string;
	role: "ADMIN" | "COORDINATOR";
	isActive: boolean;
	phoneNumber?: string;
	location?: string;
	createdAt: Date;
	updatedAt: Date;
}

const UserSchema: Schema = new Schema(
	{
		fullName: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		passwordHash: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["ADMIN", "COORDINATOR"],
			required: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		phoneNumber: {
			type: String,
			trim: true,
		},
		location: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: true,
	},
);

// Prevent mongoose from compiling the model multiple times in Next.js development
export const User: Model<IUser> =
	mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
