/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react/no-unescaped-entities */
import connectToDatabase from "@/lib/db/connect";
import { Types } from "mongoose";
import { Donor } from "@/models/Donor";
import { User } from "@/models/User";
import { Card } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationPrevious,
	PaginationNext,
} from "@/components/ui/pagination";

export default async function AdminDonorsPage({
	searchParams,
}: {
	searchParams: Promise<{ query?: string; page?: string; coordinatorId?: string }>;
}) {
	const { query, page: pageStr, coordinatorId } = await searchParams;
	await connectToDatabase();

	let page = parseInt(pageStr || "1", 10);
	if (isNaN(page) || page < 1) page = 1;
	if (page > 1000) page = 1000;
	const limit = 10;
	const skip = (page - 1) * limit;

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
		matchStage.createdBy = coordinatorId;
	}

	const [donors, total, coordinatorsList] = await Promise.all([
		Donor.find(matchStage)
			.populate("createdBy", "fullName")
			.sort({ donationDate: -1 })
			.skip(skip)
			.limit(limit)
			.lean(),
		Donor.countDocuments(matchStage),
		User.find({ role: "COORDINATOR" }).select("fullName").lean(),
	]);

	const totalPages = Math.ceil(total / limit) || 1;

	const getPageUrl = (p: number) => {
		const params = new URLSearchParams();
		if (query) params.set("query", query);
		if (coordinatorId && coordinatorId !== "all") params.set("coordinatorId", coordinatorId);
		params.set("page", p.toString());
		return `/admin/donors?${params.toString()}`;
	};

	return (
		<div className="space-y-6 pb-12">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-slate-900">
						All Donors
					</h1>
					<p className="text-slate-500 mt-1">
						Browse and search the entire donor database.
					</p>
				</div>
				<div className="w-full sm:w-auto">
					<form className="flex flex-col sm:flex-row gap-2 items-center">
						<select
							name="coordinatorId"
							defaultValue={coordinatorId || "all"}
							className="h-9 w-full sm:w-48 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						>
							<option value="all">All Coordinators</option>
							{coordinatorsList.map((c: any) => (
								<option key={c._id.toString()} value={c._id.toString()}>
									{c.fullName}
								</option>
							))}
						</select>
						<Input
							type="search"
							name="query"
							placeholder="Search donors..."
							defaultValue={query}
							className="w-full sm:w-72 shadow-sm bg-white h-9"
						/>
						<button type="submit" className="h-9 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow hover:bg-blue-700 transition-colors">
							Filter
						</button>
					</form>
				</div>
			</div>

			<Card className="border-slate-200 shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader className="bg-slate-50 border-b border-slate-200">
							<TableRow className="hover:bg-transparent">
								<TableHead className="font-semibold text-slate-700">
									Donor Name
								</TableHead>
								<TableHead className="font-semibold text-slate-700">
									Contact Info
								</TableHead>
								<TableHead className="font-semibold text-slate-700">
									Amount
								</TableHead>
								<TableHead className="font-semibold text-slate-700">
									Payment Mode
								</TableHead>
								<TableHead className="font-semibold text-slate-700">
									Date
								</TableHead>
								<TableHead className="font-semibold text-slate-700">
									Coordinator
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{donors.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={6}
										className="text-center py-8 text-slate-500"
									>
										No donors found.
									</TableCell>
								</TableRow>
							) : (
								donors.map((donor: any) => (
									<TableRow
										key={donor._id.toString()}
										className="hover:bg-slate-50 transition-colors"
									>
										<TableCell className="font-medium whitespace-nowrap text-slate-900">
											{donor.fullName}
										</TableCell>
										<TableCell className="whitespace-nowrap">
											<div className="text-sm text-slate-700">
												{donor.email}
											</div>
											<div className="text-xs text-slate-500">
												{donor.whatsappNumber}
											</div>
										</TableCell>
										<TableCell className="font-bold text-emerald-600 whitespace-nowrap">
											₹{donor.amount.toLocaleString("en-IN")}
										</TableCell>
										<TableCell className="whitespace-nowrap text-slate-600">
											{donor.paymentMode}
										</TableCell>
										<TableCell className="text-sm text-slate-600 whitespace-nowrap">
											{new Date(donor.donationDate).toLocaleDateString("en-GB")}
										</TableCell>
										<TableCell className="whitespace-nowrap">
											<span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
												{donor.createdBy?.fullName || "Unknown"}
											</span>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
				{totalPages > 1 && (
					<div className="p-4 border-t border-slate-200 bg-slate-50/50">
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										href={getPageUrl(page - 1)}
										className={
											page <= 1 ? "pointer-events-none opacity-50" : ""
										}
									/>
								</PaginationItem>
								<PaginationItem>
									<span className="text-sm text-slate-500 px-4">
										Page {page} of {totalPages}
									</span>
								</PaginationItem>
								<PaginationItem>
									<PaginationNext
										href={getPageUrl(page + 1)}
										className={
											page >= totalPages ? "pointer-events-none opacity-50" : ""
										}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
				)}
			</Card>
		</div>
	);
}
