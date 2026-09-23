/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react/no-unescaped-entities */

import connectToDatabase from "@/lib/db/connect";
import { Donor } from "@/models/Donor";
import { User } from "@/models/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Calendar,
	Users,
	IndianRupee,
	UserPlus,
	Shield,
	ChevronRight,
	BarChart3,
	Sparkles,
	UserCog,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function AdminDashboard(props: {
	searchParams: Promise<{ days?: string }>;
}) {
	const searchParams = await props.searchParams;
	await connectToDatabase();

	let daysCount = parseInt(searchParams.days || "7", 10);
	if (![7, 14, 30].includes(daysCount)) daysCount = 7;

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const startDate = new Date();
	startDate.setDate(today.getDate() - (daysCount - 1));
	startDate.setHours(0, 0, 0, 0);

	const [
		totalDonors,
		totalDonationAmount,
		todayDonors,
		coordinators,
		dailyChartData,
	] = await Promise.all([
		Donor.countDocuments(),
		Donor.aggregate([
			{ $group: { _id: null, totalAmount: { $sum: "$amount" } } },
		]),
		Donor.countDocuments({ donationDate: { $gte: today } }),
		User.countDocuments({ role: "COORDINATOR" }),
		Donor.aggregate([
			{ $match: { donationDate: { $gte: startDate } } },
			{
				$group: {
					_id: { $dateToString: { format: "%Y-%m-%d", date: "$donationDate" } },
					amount: { $sum: "$amount" },
				},
			},
			{ $sort: { _id: 1 } },
		]),
	]);

	const totalAmount = totalDonationAmount[0]?.totalAmount || 0;

	// Format chart data
	const chartData = [];
	for (let i = 0; i < daysCount; i++) {
		const d = new Date(startDate);
		d.setDate(d.getDate() + i);
		
		// Get date string in local timezone
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		const dateString = `${year}-${month}-${day}`;
		
		// The aggregation $dateToString format="%Y-%m-%d" works on UTC dates in MongoDB
		// We should match it by converting our local date to UTC date string
		const utcDateString = d.toISOString().split("T")[0];
		
		const match = dailyChartData.find((item) => item._id === utcDateString || item._id === dateString);
		chartData.push({
			name: daysCount > 14 
				? d.toLocaleDateString("en-US", { day: "numeric", month: "short" })
				: d.toLocaleDateString("en-US", { weekday: "short" }),
			amount: match ? match.amount : 0,
		});
	}

	// Format current date nicely
	const formattedDate = new Date().toLocaleDateString("en-GB", {
		weekday: "long",
		day: "numeric",
		month: "short",
		year: "numeric",
	});

	return (
		<div className="space-y-4 pb-6">
			{/* Header Area */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-slate-900">
						Admin Overview
					</h1>
					<p className="text-slate-500 mt-1">
						Here&apos;s what's happening with your platform today.
					</p>
				</div>
				<div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-sm font-medium text-slate-600">
					<Calendar className="w-4 h-4 text-slate-400" />
					{formattedDate}
				</div>
			</div>

			{/* 4 Custom Style Cards */}
			<div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
				<Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 shadow-sm">
					<CardContent className="p-4 relative overflow-hidden">
						<div className="flex justify-between items-start">
							<div className="space-y-2">
								<div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">
									<Users className="w-4 h-4 text-blue-600" />
								</div>
								<div>
									<p className="text-xs font-medium text-slate-600">
										Total Donors
									</p>
									<h3 className="text-2xl font-bold text-slate-900 mt-0.5">
										{totalDonors}
									</h3>
								</div>
							</div>
							<BarChart3 className="w-10 h-10 text-blue-50 opacity-50 absolute -right-2 -bottom-2" />
						</div>
						<div className="mt-2 flex items-center text-[10px] font-medium text-green-600">
							<span className="flex items-center">↑ 0%</span>
							<span className="text-slate-500 ml-1 font-normal">
								from last week
							</span>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100 shadow-sm">
					<CardContent className="p-4 relative overflow-hidden">
						<div className="flex justify-between items-start">
							<div className="space-y-2">
								<div className="bg-emerald-100 w-8 h-8 rounded-full flex items-center justify-center">
									<IndianRupee className="w-4 h-4 text-emerald-600" />
								</div>
								<div>
									<p className="text-xs font-medium text-slate-600">
										Total Revenue
									</p>
									<h3 className="text-2xl font-bold text-slate-900 mt-0.5">
										₹{totalAmount.toLocaleString("en-IN")}
									</h3>
								</div>
							</div>
							<BarChart3 className="w-10 h-10 text-emerald-50 opacity-50 absolute -right-2 -bottom-2" />
						</div>
						<div className="mt-2 flex items-center text-[10px] font-medium text-green-600">
							<span className="flex items-center">↑ 0%</span>
							<span className="text-slate-500 ml-1 font-normal">
								from last week
							</span>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-orange-50 to-white border-orange-100 shadow-sm">
					<CardContent className="p-4 relative overflow-hidden">
						<div className="flex justify-between items-start">
							<div className="space-y-2">
								<div className="bg-orange-100 w-8 h-8 rounded-full flex items-center justify-center">
									<UserPlus className="w-4 h-4 text-orange-600" />
								</div>
								<div>
									<p className="text-xs font-medium text-slate-600">
										Today&apos;s Donors
									</p>
									<h3 className="text-2xl font-bold text-slate-900 mt-0.5">
										{todayDonors}
									</h3>
								</div>
							</div>
							<BarChart3 className="w-10 h-10 text-orange-50 opacity-50 absolute -right-2 -bottom-2" />
						</div>
						<div className="mt-2 flex items-center text-[10px] font-medium text-green-600">
							<span className="flex items-center">↑ 0%</span>
							<span className="text-slate-500 ml-1 font-normal">
								from yesterday
							</span>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100 shadow-sm">
					<CardContent className="p-4 relative overflow-hidden">
						<div className="flex justify-between items-start">
							<div className="space-y-2">
								<div className="bg-purple-100 w-8 h-8 rounded-full flex items-center justify-center">
									<Shield className="w-4 h-4 text-purple-600" />
								</div>
								<div>
									<p className="text-xs font-medium text-slate-600">
										Coordinators
									</p>
									<h3 className="text-2xl font-bold text-slate-900 mt-0.5">
										{coordinators}
									</h3>
								</div>
							</div>
							<BarChart3 className="w-10 h-10 text-purple-50 opacity-50 absolute -right-2 -bottom-2" />
						</div>
						<div className="mt-2 flex items-center text-[10px] font-medium text-green-600">
							<span className="flex items-center">↑ 0%</span>
							<span className="text-slate-500 ml-1 font-normal">
								from last week
							</span>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 lg:grid-cols-3">
				{/* Main Chart Area */}
				<div className="lg:col-span-2 space-y-4">
					<Card className="shadow-sm border-slate-200">
						<CardHeader className="flex flex-row items-center justify-between pb-4">
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<div className="bg-blue-100 p-1.5 rounded-md">
										<BarChart3 className="w-4 h-4 text-blue-600" />
									</div>
									<CardTitle className="text-lg">Last {daysCount} Days Revenue</CardTitle>
								</div>
								<p className="text-sm text-slate-500">
									Daily revenue collected over the past {daysCount} days
								</p>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger
									render={
										<Button
											variant="outline"
											size="sm"
											className="h-8 gap-2 font-normal text-slate-600 bg-white cursor-pointer"
										>
											<Calendar className="w-3.5 h-3.5" />
											Last {daysCount} Days
											<span className="ml-1 text-[10px]">▼</span>
										</Button>
									}
								/>
								<DropdownMenuContent align="end">
									<DropdownMenuItem render={<Link href="?days=7" className="w-full cursor-pointer" />}>
										Last 7 Days
									</DropdownMenuItem>
									<DropdownMenuItem render={<Link href="?days=14" className="w-full cursor-pointer" />}>
										Last 14 Days
									</DropdownMenuItem>
									<DropdownMenuItem render={<Link href="?days=30" className="w-full cursor-pointer" />}>
										Last 30 Days
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</CardHeader>
						<CardContent>
							<AnalyticsChart data={chartData} />
						</CardContent>
					</Card>

					{/* Bottom Banner */}
					<div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3 shadow-sm relative overflow-hidden">
						<div
							className="absolute inset-0 opacity-[0.03]"
							style={{
								backgroundImage:
									"radial-gradient(circle at 2px 2px, black 1px, transparent 0)",
								backgroundSize: "24px 24px",
							}}
						></div>
						<div className="bg-blue-600 p-2 rounded-lg shrink-0 relative z-10">
							<Sparkles className="w-5 h-5 text-white" />
						</div>
						<div className="relative z-10">
							<h4 className="font-semibold text-blue-900">
								Small contributions make a big impact.
							</h4>
							<p className="text-sm text-blue-700/80 mt-1">
								Keep managing, keep growing, keep making a difference.
							</p>
						</div>
					</div>
				</div>

				{/* Right Side Widgets */}
				<div className="space-y-4">
					<Card className="shadow-sm border-slate-200">
						<CardHeader className="pb-3 border-b border-slate-100">
							<div className="flex items-center gap-2">
								<div className="bg-blue-50 p-1.5 rounded-md">
									<span className="text-blue-600 font-bold text-lg leading-none">
										⚡
									</span>
								</div>
								<div>
									<CardTitle className="text-base">Quick Actions</CardTitle>
									<p className="text-xs text-slate-500">
										Common tasks and shortcuts
									</p>
								</div>
							</div>
						</CardHeader>
						<CardContent className="p-4 grid gap-3">
							<Link
								href="/admin/donors"
								className="group flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
							>
								<div className="flex items-center gap-3">
									<div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
										<Users className="w-5 h-5" />
									</div>
									<div>
										<h5 className="font-medium text-sm text-slate-900 group-hover:text-blue-700">
											View All Donors
										</h5>
										<p className="text-xs text-slate-500">
											Browse and manage donor details
										</p>
									</div>
								</div>
								<ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
							</Link>

							<Link
								href="/admin/coordinators"
								className="group flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-green-300 hover:bg-green-50 transition-all"
							>
								<div className="flex items-center gap-3">
									<div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center text-green-600 group-hover:bg-green-200 transition-colors">
										<UserCog className="w-5 h-5" />
									</div>
									<div>
										<h5 className="font-medium text-sm text-slate-900 group-hover:text-green-700">
											Manage Coordinators
										</h5>
										<p className="text-xs text-slate-500">
											Add, edit or view coordinators
										</p>
									</div>
								</div>
								<ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-green-500" />
							</Link>
						</CardContent>
					</Card>

					<Card className="shadow-sm border-slate-200">
						<CardHeader className="pb-3 border-b border-slate-100">
							<div className="flex items-center gap-2">
								<div className="bg-blue-50 p-1.5 rounded-md">
									<span className="text-blue-600 font-bold text-lg leading-none">
										📄
									</span>
								</div>
								<div>
									<CardTitle className="text-base">Platform Summary</CardTitle>
									<p className="text-xs text-slate-500">
										Key information at a glance
									</p>
								</div>
							</div>
						</CardHeader>
						<CardContent className="p-4 space-y-3">
							<div className="flex justify-between items-center text-sm">
								<span className="text-slate-600">Total Donors</span>
								<span className="font-bold text-slate-900">{totalDonors}</span>
							</div>
							<div className="h-px bg-slate-100 w-full" />
							<div className="flex justify-between items-center text-sm">
								<span className="text-slate-600">Today&apos;s Donors</span>
								<span className="font-bold text-slate-900">{todayDonors}</span>
							</div>
							<div className="h-px bg-slate-100 w-full" />
							<div className="flex justify-between items-center text-sm">
								<span className="text-slate-600">Total Revenue</span>
								<span className="font-bold text-emerald-600">
									₹{totalAmount.toLocaleString("en-IN")}
								</span>
							</div>
							<div className="h-px bg-slate-100 w-full" />
							<div className="flex justify-between items-center text-sm">
								<span className="text-slate-600">Coordinators</span>
								<span className="font-bold text-blue-600">{coordinators}</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
