import { auth } from "@/auth";
import connectToDatabase from "@/lib/db/connect";
import { Donor } from "@/models/Donor";
import { AddDonorForm } from "@/components/AddDonorForm";
import { DonorList } from "@/components/DonorList";
import { Users, IndianRupee, User, HandHeart, TrendingUp } from "lucide-react";

export default async function CoordinatorDashboard() {
	const session = await auth();
	if (!session?.user?.id) return null;

	await connectToDatabase();

	const mongoose = (await import("mongoose")).default;
	const userId = new mongoose.Types.ObjectId(session.user.id);

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const [donors, totalStats, todayStats] = await Promise.all([
		Donor.find({ createdBy: userId })
			.sort({ donationDate: -1 })
			.limit(50)
			.lean(),
		Donor.aggregate([
			{ $match: { createdBy: userId } },
			{
				$group: {
					_id: null,
					totalAmount: { $sum: "$amount" },
					count: { $sum: 1 },
				},
			},
		]),
		Donor.aggregate([
			{ $match: { createdBy: userId, donationDate: { $gte: today } } },
			{
				$group: {
					_id: null,
					totalAmount: { $sum: "$amount" },
					count: { $sum: 1 },
				},
			},
		]),
	]);

	const totalCount = totalStats[0]?.count || 0;
	const totalAmount = totalStats[0]?.totalAmount || 0;
	const todayCount = todayStats[0]?.count || 0;
	const todayAmount = todayStats[0]?.totalAmount || 0;

	return (
		<div className="space-y-8 max-w-7xl mx-auto">
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
				<div>
					<h1 className="text-[28px] font-black tracking-tight text-slate-900 mb-1">
						Dashboard Overview
					</h1>
					<p className="text-slate-500 font-medium">
						Manage your donors, track donations and make a bigger impact.
					</p>
				</div>
				<div className="text-slate-400 italic text-sm font-medium">
					"Small acts, when multiplied by millions, can transform the world."
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{/* Card 1 */}
				<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-4">
					<div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
						<Users className="w-7 h-7 text-blue-500" />
					</div>
					<div>
						<div className="text-sm font-semibold text-slate-600 mb-1">
							My Donors
						</div>
						<div className="text-2xl font-black text-slate-900 mb-2">
							{totalCount}
						</div>
						<div className="flex items-center text-xs font-semibold text-green-600">
							<TrendingUp className="w-3 h-3 mr-1" />
							0%{" "}
							<span className="text-slate-400 font-medium ml-1">
								from last month
							</span>
						</div>
					</div>
				</div>

				{/* Card 2 */}
				<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-4">
					<div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center shrink-0">
						<IndianRupee className="w-7 h-7 text-green-500" />
					</div>
					<div>
						<div className="text-sm font-semibold text-slate-600 mb-1">
							My Donations
						</div>
						<div className="text-2xl font-black text-green-500 mb-2">
							₹{totalAmount.toLocaleString("en-IN")}
						</div>
						<div className="flex items-center text-xs font-semibold text-green-600">
							<TrendingUp className="w-3 h-3 mr-1" />
							0%{" "}
							<span className="text-slate-400 font-medium ml-1">
								from last month
							</span>
						</div>
					</div>
				</div>

				{/* Card 3 */}
				<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-4">
					<div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
						<User className="w-7 h-7 text-orange-500" />
					</div>
					<div>
						<div className="text-sm font-semibold text-slate-600 mb-1">
							Today's Donors
						</div>
						<div className="text-2xl font-black text-orange-600 mb-2">
							{todayCount}
						</div>
						<div className="flex items-center text-xs font-semibold text-green-600">
							<TrendingUp className="w-3 h-3 mr-1" />
							0%{" "}
							<span className="text-slate-400 font-medium ml-1">
								from yesterday
							</span>
						</div>
					</div>
				</div>

				{/* Card 4 */}
				<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-4">
					<div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
						<HandHeart className="w-7 h-7 text-purple-500" />
					</div>
					<div>
						<div className="text-sm font-semibold text-slate-600 mb-1">
							Today's Donations
						</div>
						<div className="text-2xl font-black text-purple-600 mb-2">
							₹{todayAmount.toLocaleString("en-IN")}
						</div>
						<div className="flex items-center text-xs font-semibold text-green-600">
							<TrendingUp className="w-3 h-3 mr-1" />
							0%{" "}
							<span className="text-slate-400 font-medium ml-1">
								from yesterday
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-2 items-start">
				<AddDonorForm />
				<DonorList donors={JSON.parse(JSON.stringify(donors))} />
			</div>

			{/* Bottom Banner */}
			<div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl p-6 flex items-center justify-between border border-blue-100">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
						<HandHeart className="w-6 h-6 text-blue-600" />
					</div>
					<div>
						<div className="font-bold text-blue-700 text-lg">
							Together we can make a difference
						</div>
						<div className="text-blue-600/80 text-sm font-medium">
							Track. Support. Empower.
						</div>
					</div>
				</div>
				<div className="text-right hidden sm:block">
					<div className="text-blue-600 text-sm font-semibold">
						More Kindness
					</div>
					<div className="text-blue-500/80 text-sm font-medium">
						A Brighter Tomorrow
					</div>
				</div>
			</div>
		</div>
	);
}
