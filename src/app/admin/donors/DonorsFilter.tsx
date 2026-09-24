"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useRef } from "react";

export function DonorsFilter({
	coordinatorsList,
	defaultCoordinatorId,
	defaultQuery,
	defaultFromDate,
	defaultToDate,
}: {
	coordinatorsList: { _id: string; fullName: string }[];
	defaultCoordinatorId?: string;
	defaultQuery?: string;
	defaultFromDate?: string;
	defaultToDate?: string;
}) {
	const router = useRouter();
	const debounceTimer = useRef<NodeJS.Timeout | null>(null);

	const updateUrl = (coordinatorId: string, query: string, fromDate: string, toDate: string) => {
		const params = new URLSearchParams();
		if (query) params.set("query", query);
		if (coordinatorId && coordinatorId !== "all") {
			params.set("coordinatorId", coordinatorId);
		}
		if (fromDate) params.set("fromDate", fromDate);
		if (toDate) params.set("toDate", toDate);
		
		router.push(`/admin/donors?${params.toString()}`);
	};

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
		const form = e.target.form;
		if (!form) return;
		const coordinatorId = (form.elements.namedItem("coordinatorId") as HTMLSelectElement).value;
		const fromDate = (form.elements.namedItem("fromDate") as HTMLInputElement).value;
		const toDate = (form.elements.namedItem("toDate") as HTMLInputElement).value;
		const query = (form.elements.namedItem("query") as HTMLInputElement).value;
		
		if (e.target.name === "query") {
			if (debounceTimer.current) clearTimeout(debounceTimer.current);
			debounceTimer.current = setTimeout(() => {
				updateUrl(coordinatorId, query, fromDate, toDate);
			}, 400);
		} else {
			updateUrl(coordinatorId, query, fromDate, toDate);
		}
	};

	return (
		<form 
			method="GET" 
			action="/admin/donors" 
			className="flex flex-col sm:flex-row gap-2 items-center flex-1 w-full"
			onSubmit={(e) => {
				e.preventDefault();
				const form = e.currentTarget;
				const coordinatorId = (form.elements.namedItem("coordinatorId") as HTMLSelectElement).value;
				const fromDate = (form.elements.namedItem("fromDate") as HTMLInputElement).value;
				const toDate = (form.elements.namedItem("toDate") as HTMLInputElement).value;
				const query = (form.elements.namedItem("query") as HTMLInputElement).value;
				updateUrl(coordinatorId, query, fromDate, toDate);
			}}
		>
			<div className="flex items-center gap-1 w-full sm:w-auto">
				<Input
					type="date"
					name="fromDate"
					defaultValue={defaultFromDate || ""}
					onChange={handleChange}
					className="h-9 w-full sm:w-36 shadow-sm bg-white text-xs"
					title="From Date"
				/>
				<span className="text-slate-400 text-xs">-</span>
				<Input
					type="date"
					name="toDate"
					defaultValue={defaultToDate || ""}
					onChange={handleChange}
					className="h-9 w-full sm:w-36 shadow-sm bg-white text-xs"
					title="To Date"
				/>
			</div>
			
			<select
				name="coordinatorId"
				defaultValue={defaultCoordinatorId || "all"}
				onChange={handleChange}
				className="h-9 w-full sm:w-44 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
				defaultValue={defaultQuery || ""}
				onChange={handleChange}
				className="w-full sm:flex-1 shadow-sm bg-white h-9 min-w-[150px]"
			/>
			<button type="submit" className="sr-only">
				Filter
			</button>
		</form>
	);
}
