import connectToDatabase from "@/lib/db/connect";
import { Donor } from "@/models/Donor";
import { Card } from "@/components/ui/card";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
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

export default async function CoordinatorDonorsPage({
	searchParams,
}: {
	searchParams: Promise<{ query?: string; page?: string }>;
}) {
	const session = await auth();
	
	if (!session?.user?.id) {
		redirect("/login");
	}

	const { query, page: pageStr } = await searchParams;
	await connectToDatabase();

	const page = parseInt(pageStr || "1", 10);
	const limit = 10;
	const skip = (page - 1) * limit;

	let matchStage: any = { createdBy: session.user.id };
	if (query) {
		matchStage = {
			...matchStage,
			$or: [
				{ fullName: { $regex: query, $options: "i" } },
				{ email: { $regex: query, $options: "i" } },
				{ whatsappNumber: { $regex: query, $options: "i" } },
			],
		};
	}

	const [donors, total] = await Promise.all([
		Donor.find(matchStage)
			.sort({ donationDate: -1 })
			.skip(skip)
			.limit(limit)
			.lean(),
		Donor.countDocuments(matchStage),
	]);

	const totalPages = Math.ceil(total / limit) || 1;

	const getPageUrl = (p: number) => {
		const params = new URLSearchParams();
		if (query) params.set("query", query);
		params.set("page", p.toString());
		return `/coordinator/donors?${params.toString()}`;
	};

	return (
		<div className="space-y-6 pb-12">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-slate-900">
						My Donors
					</h1>
					<p className="text-slate-500 mt-1">
						Browse and search the donors you have added.
					</p>
				</div>
				<div className="w-full sm:w-72">
					<form>
						<Input
							type="search"
							name="query"
							placeholder="Search donors..."
							defaultValue={query}
							className="w-full shadow-sm bg-white"
						/>
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
							</TableRow>
						</TableHeader>
						<TableBody>
							{donors.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={5}
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
