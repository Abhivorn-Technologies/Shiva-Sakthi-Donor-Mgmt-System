import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDonor extends Document {
	fullName: string;
	email: string;
	normalizedEmail: string;
	whatsappNumber: string;
	normalizedWhatsappNumber: string;
	occupation: string;
	placeOfLiving?: string;
	nativePlace?: string;
	paymentMode: string;
	otherPaymentMode?: string;
	amount: number;
	towards?: string;
	donationType?: string;
	followingShivashakthiSince?: string;
	comments?: string;
	donationDate: Date;
	createdBy: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const DonorSchema: Schema = new Schema(
	{
		fullName: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true, // The business rule from feedback: email is required
			trim: true,
		},
		normalizedEmail: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
		},
		whatsappNumber: {
			type: String,
			required: true,
			trim: true,
		},
		normalizedWhatsappNumber: {
			type: String,
			required: true,
			trim: true,
		},
		occupation: {
			type: String,
			required: true,
			trim: true,
		},
		placeOfLiving: {
			type: String,
			trim: true,
		},
		nativePlace: {
			type: String,
			trim: true,
		},
		paymentMode: {
			type: String,
			enum: [
				"Cash",
				"UPI",
				"PhonePe",
				"Google Pay",
				"Bank Transfer",
				"Cheque",
				"Other",
			],
			required: true,
		},
		otherPaymentMode: {
			type: String,
			trim: true,
			required: function (this: IDonor) {
				return this.paymentMode === "Other";
			},
		},
		amount: {
			type: Number,
			required: true,
			min: 1,
		},
		towards: {
			type: String,
			trim: true,
		},
		donationType: {
			type: String,
			enum: ["Monthly", "Quarterly", "Yearly", "Occasional"],
		},
		followingShivashakthiSince: {
			type: String,
			trim: true,
		},
		comments: {
			type: String,
			trim: true,
		},
		donationDate: {
			type: Date,
			default: Date.now,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

DonorSchema.index({ createdBy: 1, donationDate: -1 });
DonorSchema.index({ normalizedEmail: 1, createdBy: 1 });
DonorSchema.index({ normalizedWhatsappNumber: 1, createdBy: 1 });

// Prevent mongoose from compiling the model multiple times in Next.js development
export const Donor: Model<IDonor> =
	mongoose.models.Donor || mongoose.model<IDonor>("Donor", DonorSchema);
