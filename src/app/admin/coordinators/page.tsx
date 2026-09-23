/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react/no-unescaped-entities */
import connectToDatabase from "@/lib/db/connect";
import { User } from "@/models/User";
import { Card } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { CoordinatorRow } from "./CoordinatorRow";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationPrevious,
	PaginationNext,
} from "@/components/ui/pagination";

export default async function AdminCoordinatorsPage(props: {
	searchParams: Promise<{ page?: string; query?: string }>;
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

	const [coordinatorsRaw, total] = await Promise.all([
		User.aggregate([
			{ $match: matchStage },
			{ $sort: { createdAt: -1 } },
			{ $skip: skip },
			{ $limit: limit },
			{
				$lookup: {
					from: "donors",
					localField: "_id",
					foreignField: "createdBy",
					as: "donorsList",
				},
			},
			{
				$addFields: {
					totalDonors: { $size: "$donorsList" },
					totalRevenue: { $sum: "$donorsList.amount" },
				},
			},
			{
				$project: {
					donorsList: 0,
				},
			},
		]),
		User.countDocuments(matchStage),
	]);

	const coordinators = JSON.parse(JSON.stringify(coordinatorsRaw));

	const totalPages = Math.ceil(total / limit) || 1;

	const getPageUrl = (p: number) => {
		const params = new URLSearchParams();
		if (query) params.set("query", query);
		params.set("page", p.toString());
		return `/admin/coordinators?${params.toString()}`;
	};

	return (
		<div className="space-y-6 pb-12">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-slate-900">
						Coordinators
					</h1>
					<p className="text-slate-500 mt-1">
						Manage platform coordinators and their access.
					</p>
				</div>
				<Link
					href="/admin/coordinators/new"
					className={buttonVariants({
						variant: "default",
						className: "shadow-sm",
					})}
				>
					+ Add Coordinator
				</Link>
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
								<TableHead className="font-semibold text-slate-700 text-right">
									Total Donors
								</TableHead>
								<TableHead className="font-semibold text-slate-700 text-right">
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
