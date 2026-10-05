/* eslint-disable @typescript-eslint/no-explicit-any */
import connectToDatabase from "@/lib/db/connect";
import { User } from "@/models/User";
import { Donor } from "@/models/Donor";
import { Card } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import { CoordinatorRow } from "./CoordinatorRow";
import { AddCoordinatorModal } from "@/components/AddCoordinatorModal";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationPrevious,
	PaginationNext,
} from "@/components/ui/pagination";
import { CoordinatorFilters } from "./CoordinatorFilters";

export default async function AdminCoordinatorsPage(props: {
	searchParams: Promise<{ page?: string; query?: string; status?: string; joined?: string; sort?: string }>;
}) {
	const searchParams = await props.searchParams;
	await connectToDatabase();

	let page = parseInt(searchParams.page || "1", 10);
	if (isNaN(page) || page < 1) page = 1;
	if (page > 1000) page = 1000;
	const query = searchParams.query || "";
	const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").slice(0, 50);
	const limit = 10;
	const skip = (page - 1) * limit;

	let matchStage: any = { role: "COORDINATOR" };
	if (query) {
		matchStage = {
			...matchStage,
			$or: [
				{ fullName: { $regex: safeQuery, $options: "i" } },
				{ email: { $regex: safeQuery, $options: "i" } },
			],
		};
	}

	const status = searchParams.status || "all";
	if (status === "active") matchStage.isActive = true;
	if (status === "inactive") matchStage.isActive = false;

	const joined = searchParams.joined || "all";
	if (joined !== "all") {
		const now = new Date();
		let fromDate = new Date();
		if (joined === "last7") {
			fromDate.setDate(now.getDate() - 7);
		} else if (joined === "thismonth") {
			fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
		} else if (joined === "thisyear") {
			fromDate = new Date(now.getFullYear(), 0, 1);
		}
		matchStage.createdAt = { $gte: fromDate };
	}

	const sortParam = searchParams.sort || "newest";

	let pipeline: any[] = [
		{ $match: matchStage }
	];

	// If sorting by simple fields, paginate early to save DB work
	if (sortParam === "newest" || sortParam === "oldest") {
		pipeline.push({ $sort: { createdAt: sortParam === "newest" ? -1 : 1 } });
		pipeline.push({ $skip: skip });
		pipeline.push({ $limit: limit });
	}

	// Memory-efficient $lookup: groups donors in the DB instead of returning a massive array
	pipeline.push(
		{
			$lookup: {
				from: "donors",
				let: { coordinatorId: "$_id" },
				pipeline: [
					{ $match: { $expr: { $eq: ["$createdBy", "$$coordinatorId"] } } },
					{ $group: { _id: null, totalDonors: { $sum: 1 }, totalRevenue: { $sum: "$amount" } } }
				],
				as: "donorStats"
			}
		},
		{
			$addFields: {
				totalDonors: { $ifNull: [{ $arrayElemAt: ["$donorStats.totalDonors", 0] }, 0] },
				totalRevenue: { $ifNull: [{ $arrayElemAt: ["$donorStats.totalRevenue", 0] }, 0] }
			}
		},
		{
			$project: {
				donorStats: 0,
				passwordHash: 0
			}
		}
	);

	// If sorting by computed stats, we must sort after the lookup, then paginate
	if (sortParam === "revenue_desc" || sortParam === "donors_desc") {
		pipeline.push({ $sort: { [sortParam === "revenue_desc" ? "totalRevenue" : "totalDonors"]: -1 } });
		pipeline.push({ $skip: skip });
		pipeline.push({ $limit: limit });
	}

	const [coordinatorsRaw, total] = await Promise.all([
		User.aggregate(pipeline),
		User.countDocuments(matchStage),
	]);

	const coordinators = JSON.parse(JSON.stringify(coordinatorsRaw));
	const totalPages = Math.ceil(total / limit) || 1;

	const getPageUrl = (p: number) => {
		const params = new URLSearchParams();
		if (query) params.set("query", query);
		if (status !== "all") params.set("status", status);
		if (joined !== "all") params.set("joined", joined);
		if (sortParam !== "newest") params.set("sort", sortParam);
		params.set("page", p.toString());
		return `/admin/coordinators?${params.toString()}`;
	};

	return (
		<div className="space-y-6 pb-12">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-slate-900">
						Coordinators
					</h1>
					<p className="text-slate-500 mt-1">
						Manage platform coordinators and their access.
					</p>
				</div>
				<div className="flex flex-col sm:flex-row items-end gap-3 w-full sm:w-auto">
					<CoordinatorFilters />
					<AddCoordinatorModal />
				</div>
			</div>

			<Card className="border-slate-200 shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader className="bg-slate-50 border-b border-slate-200">
							<TableRow className="hover:bg-transparent">
								<TableHead className="font-semibold text-slate-700">
									Name
								</TableHead>
								<TableHead className="font-semibold text-slate-700">
									Email
								</TableHead>
								<TableHead className="font-semibold text-slate-700">
									Status
								</TableHead>
								<TableHead className="font-semibold text-slate-700">
									Joined
								</TableHead>
								<TableHead className="font-semibold text-slate-700">
									Total Donors
								</TableHead>
								<TableHead className="font-semibold text-slate-700">
									Revenue
								</TableHead>
								<TableHead className="w-[100px]"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{coordinators.map((coord: any) => (
								<CoordinatorRow key={coord._id.toString()} user={coord} />
							))}
							{coordinators.length === 0 && (
								<TableRow>
									<TableCell
										colSpan={7}
										className="h-24 text-center text-slate-500"
									>
										No coordinators found.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				{totalPages > 1 && (
					<div className="p-4 border-t border-slate-200">
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
