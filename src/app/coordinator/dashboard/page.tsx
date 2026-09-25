/* eslint-disable react/no-unescaped-entities */
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

	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	const lastMonth = new Date(today);
	lastMonth.setDate(lastMonth.getDate() - 30);

	const [donors, totalStats, todayStats, prevMonthStats, yesterdayStats] = await Promise.all([
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
		Donor.aggregate([
			{ $match: { createdBy: userId, donationDate: { $lt: lastMonth } } },
			{
				$group: {
					_id: null,
					totalAmount: { $sum: "$amount" },
					count: { $sum: 1 },
				},
			},
		]),
		Donor.aggregate([
			{ $match: { createdBy: userId, donationDate: { $gte: yesterday, $lt: today } } },
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

	const prevMonthCount = prevMonthStats[0]?.count || 0;
	const prevMonthAmount = prevMonthStats[0]?.totalAmount || 0;
	const yesterdayCount = yesterdayStats[0]?.count || 0;
	const yesterdayAmount = yesterdayStats[0]?.totalAmount || 0;

	const calcGrowth = (current: number, previous: number) => {
		if (previous === 0) return current > 0 ? 100 : 0;
		return Number((((current - previous) / previous) * 100).toFixed(1));
	};

	const donorsGrowth = calcGrowth(totalCount, prevMonthCount);
	const amountGrowth = calcGrowth(totalAmount, prevMonthAmount);
	const todayDonorsGrowth = calcGrowth(todayCount, yesterdayCount);
	const todayAmountGrowth = calcGrowth(todayAmount, yesterdayAmount);

	const renderTrend = (value: number, label: string) => (
		<div className={`flex items-center text-xs font-semibold ${value >= 0 ? "text-green-600" : "text-red-600"}`}>
			<TrendingUp className={`w-3 h-3 mr-1 ${value < 0 ? "rotate-180" : ""}`} />
			{Math.abs(value)}%{" "}
			<span className="text-slate-400 font-medium ml-1">{label}</span>
		</div>
	);



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
						{renderTrend(donorsGrowth, "from last month")}
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
						{renderTrend(amountGrowth, "from last month")}
					</div>
				</div>

				{/* Card 3 */}
				<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-4">
					<div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
						<User className="w-7 h-7 text-orange-500" />
					</div>
					<div>
						<div className="text-sm font-semibold text-slate-600 mb-1">
							Today&apos;s Donors
						</div>
						<div className="text-2xl font-black text-orange-600 mb-2">
							{todayCount}
						</div>
						{renderTrend(todayDonorsGrowth, "from yesterday")}
					</div>
				</div>

				{/* Card 4 */}
				<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-4">
					<div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
						<HandHeart className="w-7 h-7 text-purple-500" />
					</div>
					<div>
						<div className="text-sm font-semibold text-slate-600 mb-1">
							Today&apos;s Donations
						</div>
						<div className="text-2xl font-black text-purple-600 mb-2">
							₹{todayAmount.toLocaleString("en-IN")}
						</div>
						{renderTrend(todayAmountGrowth, "from yesterday")}
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
