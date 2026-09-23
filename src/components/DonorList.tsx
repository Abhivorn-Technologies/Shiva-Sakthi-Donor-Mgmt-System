/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react/no-unescaped-entities */
"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Clock, ArrowRight, ClipboardList, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DonorList({ donors }: { donors: any[] }) {
	return (
		<div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full flex flex-col">
			<div className="p-6 border-b border-slate-100 flex items-center justify-between">
				<div className="flex gap-4 items-center">
					<div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
						<Clock className="w-6 h-6 text-blue-600" />
					</div>
					<div>
						<h2 className="text-lg font-bold text-slate-900">Recent Donors</h2>
						<p className="text-sm text-slate-500">
							Latest donors added to the system.
						</p>
					</div>
				</div>
				<Button
					variant="outline"
					className="text-blue-600 border-slate-200 hover:bg-slate-50 rounded-full px-4 h-9 font-semibold text-xs"
				>
					View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
				</Button>
			</div>

			<div className="p-6 flex-1 flex flex-col">
				{donors.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center text-center py-12">
						<div className="relative mb-6">
							<div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center">
								<ClipboardList className="w-10 h-10 text-slate-400" />
							</div>
							<div className="absolute top-1/2 -translate-y-1/2 -left-6 w-3 h-1 bg-slate-200 rounded-full" />
							<div className="absolute top-1/2 -translate-y-1/2 -right-6 w-3 h-1 bg-slate-200 rounded-full" />
							<div className="absolute left-1/2 -translate-x-1/2 -top-6 w-1 h-3 bg-slate-200 rounded-full" />
							<div className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-1 h-3 bg-slate-200 rounded-full" />
							<div className="absolute top-0 -left-2 w-2 h-2 bg-slate-200 rounded-full" />
							<div className="absolute top-0 -right-2 w-2 h-2 bg-slate-200 rounded-full" />
						</div>

						<h3 className="text-[17px] font-bold text-slate-700 mb-2">
							You haven't added any donors yet.
						</h3>
						<p className="text-slate-500 text-sm mb-6 max-w-[280px]">
							Once you add donors, they will appear here with their details.
						</p>
						<Button className="bg-blue-600 hover:bg-blue-700 font-semibold h-11 px-6 rounded-full">
							<UserPlus className="w-4 h-4 mr-2" /> Add Your First Donor
						</Button>
					</div>
				) : (
					<div className="rounded-xl border border-slate-100 overflow-x-auto">
						<Table>
							<TableHeader className="bg-slate-50 border-b border-slate-100">
								<TableRow className="hover:bg-transparent">
									<TableHead className="whitespace-nowrap font-semibold text-slate-600">
										Name
									</TableHead>
									<TableHead className="whitespace-nowrap font-semibold text-slate-600">
										Contact
									</TableHead>
									<TableHead className="whitespace-nowrap font-semibold text-slate-600">
										Amount
									</TableHead>
									<TableHead className="whitespace-nowrap font-semibold text-slate-600">
										Mode
									</TableHead>
									<TableHead className="whitespace-nowrap font-semibold text-slate-600">
										Date
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{donors.map((donor) => (
									<TableRow
										key={donor._id}
										className="border-b border-slate-50"
									>
										<TableCell className="font-bold text-slate-700 whitespace-nowrap">
											{donor.fullName}
										</TableCell>
										<TableCell className="whitespace-nowrap">
											<div className="text-sm font-medium text-slate-700">
												{donor.email}
											</div>
											<div className="text-xs font-medium text-slate-500">
												{donor.whatsappNumber}
											</div>
										</TableCell>
										<TableCell className="font-black text-blue-600 whitespace-nowrap">
											₹{donor.amount.toLocaleString("en-IN")}
										</TableCell>
										<TableCell className="whitespace-nowrap font-medium text-slate-600">
											<span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs">
												{donor.paymentMode}
											</span>
										</TableCell>
										<TableCell className="text-sm font-medium whitespace-nowrap text-slate-500">
											{new Date(donor.donationDate).toLocaleDateString(
												"en-IN",
												{
													day: "numeric",
													month: "short",
													year: "numeric",
												},
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</div>
		</div>
	);
}
