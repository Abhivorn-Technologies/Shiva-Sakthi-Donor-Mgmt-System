import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/db/connect";
import { Donor } from "@/models/Donor";
import { Types } from "mongoose";

export async function GET(request: Request) {
	try {
		const session = await auth();
		if (!session || session.user?.role !== "ADMIN") {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const query = searchParams.get("query");
		const coordinatorId = searchParams.get("coordinatorId");
		const fromDate = searchParams.get("fromDate");
		const toDate = searchParams.get("toDate");

		await connectToDatabase();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let matchStage: any = {};
		if (query) {
			const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").slice(0, 50);
			matchStage = {
				$or: [
					{ fullName: { $regex: safeQuery, $options: "i" } },
					{ email: { $regex: safeQuery, $options: "i" } },
					{ whatsappNumber: { $regex: safeQuery, $options: "i" } },
				],
			};
		}
		if (coordinatorId && coordinatorId !== "all" && Types.ObjectId.isValid(coordinatorId)) {
			matchStage.createdBy = new Types.ObjectId(coordinatorId);
		}

		if (fromDate || toDate) {
			matchStage.donationDate = {};
			if (fromDate) matchStage.donationDate.$gte = new Date(fromDate);
			if (toDate) {
				const to = new Date(toDate);
				to.setHours(23, 59, 59, 999);
				matchStage.donationDate.$lte = to;
			}
		}

		const donors = await Donor.find(matchStage)
			.populate("createdBy", "fullName email")
			.sort({ donationDate: -1 })
			.lean();

		const headers = [
			"Date",
			"Donor Name",
			"Email",
			"WhatsApp Number",
			"Occupation",
			"Amount",
			"Payment Mode",
			"Coordinator Name",
		].join(",");

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const rows = donors.map((d: any) => {
			const date = new Date(d.donationDate).toLocaleDateString("en-GB");
			const name = `"${(d.fullName || "").replace(/"/g, '""')}"`;
			const email = `"${(d.email || "").replace(/"/g, '""')}"`;
			const whatsapp = `"${(d.whatsappNumber || "")}"`;
			const occupation = `"${(d.occupation || "").replace(/"/g, '""')}"`;
			const amount = d.amount;
			const mode = `"${(d.paymentMode || "")}"`;
			const coordinator = `"${(d.createdBy?.fullName || "Unknown").replace(/"/g, '""')}"`;

			return [date, name, email, whatsapp, occupation, amount, mode, coordinator].join(",");
		});

		const csvContent = [headers, ...rows].join("\n");

		return new NextResponse(csvContent, {
			headers: {
				"Content-Type": "text/csv",
				"Content-Disposition": `attachment; filename="donors_export_${new Date().toISOString().split("T")[0]}.csv"`,
			},
		});
	} catch (error) {
		console.error("CSV Export Error:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
