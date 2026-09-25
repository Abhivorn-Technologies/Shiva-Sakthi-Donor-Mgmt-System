/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import connectToDatabase from "@/lib/db/connect";
import { Donor } from "@/models/Donor";
import { User } from "@/models/User";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function GlobalSearchPage({
	searchParams,
}: {
	searchParams: Promise<{ query?: string }>;
}) {
	const { query } = await searchParams;
	await connectToDatabase();

	if (!query) {
		return (
			<div className="space-y-6 pb-12">
				<h1 className="text-3xl font-bold tracking-tight text-slate-900">
					Search Results
				</h1>
				<p className="text-slate-500">Please enter a search query.</p>
			</div>
		);
	}

	const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").slice(0, 50);

	const [donors, coordinators] = await Promise.all([
		Donor.find({
			$or: [
				{ fullName: { $regex: safeQuery, $options: "i" } },
				{ email: { $regex: safeQuery, $options: "i" } },
				{ whatsappNumber: { $regex: safeQuery, $options: "i" } },
			],
		})
			.populate("createdBy", "fullName")
			.limit(20)
			.lean(),
		User.find({
			role: "COORDINATOR",
			$or: [
				{ fullName: { $regex: safeQuery, $options: "i" } },
				{ email: { $regex: safeQuery, $options: "i" } },
			],
		})
			.limit(20)
			.lean(),
	]);

	const donorsList = JSON.parse(JSON.stringify(donors));
	const coordinatorsList = JSON.parse(JSON.stringify(coordinators));

	return (
		<div className="space-y-6 pb-12">
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-slate-900">
					Search Results
				</h1>
				<p className="text-slate-500 mt-1">
					Showing results for &quot;{query}&quot;
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				{/* Donors Results */}
				<Card className="border-slate-200 shadow-sm">
					<CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
						<CardTitle className="text-lg flex justify-between items-center">
							<span>Donors ({donorsList.length})</span>
							<Link
								href={`/admin/donors?query=${encodeURIComponent(query)}`}
								className="text-sm font-normal text-blue-600 hover:underline"
							>
								View All
							</Link>
						</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						{donorsList.length === 0 ? (
							<div className="p-6 text-center text-slate-500 text-sm">
								No donors found matching &quot;{query}&quot;
							</div>
						) : (
							<div className="divide-y divide-slate-100">
								{donorsList.map((donor: any) => (
									<div key={donor._id} className="p-4 hover:bg-slate-50">
										<div className="font-medium text-slate-900">{donor.fullName}</div>
										<div className="text-sm text-slate-500">{donor.email} • {donor.whatsappNumber}</div>
										<div className="text-xs text-emerald-600 font-medium mt-1">₹{donor.amount.toLocaleString("en-IN")} • {new Date(donor.donationDate).toLocaleDateString("en-GB")}</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Coordinators Results */}
				<Card className="border-slate-200 shadow-sm">
					<CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
						<CardTitle className="text-lg flex justify-between items-center">
							<span>Coordinators ({coordinatorsList.length})</span>
							<Link
								href={`/admin/coordinators?query=${encodeURIComponent(query)}`}
								className="text-sm font-normal text-blue-600 hover:underline"
							>
								View All
							</Link>
						</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						{coordinatorsList.length === 0 ? (
							<div className="p-6 text-center text-slate-500 text-sm">
								No coordinators found matching &quot;{query}&quot;
							</div>
						) : (
							<div className="divide-y divide-slate-100">
								{coordinatorsList.map((coord: any) => (
									<div key={coord._id} className="p-4 hover:bg-slate-50">
										<div className="font-medium text-slate-900">{coord.fullName}</div>
										<div className="text-sm text-slate-500">{coord.email}</div>
										<div className="text-xs text-slate-400 mt-1">Joined {new Date(coord.createdAt).toLocaleDateString("en-GB")}</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
