"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

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

	const [fromDateVal, setFromDateVal] = useState<Date | undefined>(defaultFromDate ? new Date(defaultFromDate) : undefined);
	const [toDateVal, setToDateVal] = useState<Date | undefined>(defaultToDate ? new Date(defaultToDate) : undefined);
	const [coordinatorIdVal, setCoordinatorIdVal] = useState<string>(defaultCoordinatorId || "all");
	const [queryVal, setQueryVal] = useState<string>(defaultQuery || "");

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

	const handleChange = (e?: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
		if (e) {
			if (e.target.name === "query") {
				setQueryVal(e.target.value);
				if (debounceTimer.current) clearTimeout(debounceTimer.current);
				debounceTimer.current = setTimeout(() => {
					updateUrl(coordinatorIdVal, e.target.value, fromDateVal ? format(fromDateVal, "yyyy-MM-dd") : "", toDateVal ? format(toDateVal, "yyyy-MM-dd") : "");
				}, 400);
			} else if (e.target.name === "coordinatorId") {
				setCoordinatorIdVal(e.target.value);
				updateUrl(e.target.value, queryVal, fromDateVal ? format(fromDateVal, "yyyy-MM-dd") : "", toDateVal ? format(toDateVal, "yyyy-MM-dd") : "");
			}
		}
	};

	const handleDateChange = (type: "from" | "to", date: Date | undefined) => {
		if (type === "from") setFromDateVal(date);
		if (type === "to") setToDateVal(date);
		
		const newFrom = type === "from" ? date : fromDateVal;
		const newTo = type === "to" ? date : toDateVal;
		
		updateUrl(
			coordinatorIdVal, 
			queryVal, 
			newFrom ? format(newFrom, "yyyy-MM-dd") : "", 
			newTo ? format(newTo, "yyyy-MM-dd") : ""
		);
	};

	return (
		<form 
			method="GET" 
			action="/admin/donors" 
			className="flex flex-col sm:flex-row gap-2 items-center flex-1 w-full"
			onSubmit={(e) => {
				e.preventDefault();
				updateUrl(
					coordinatorIdVal, 
					queryVal, 
					fromDateVal ? format(fromDateVal, "yyyy-MM-dd") : "", 
					toDateVal ? format(toDateVal, "yyyy-MM-dd") : ""
				);
			}}
		>
			<div className="flex items-center gap-1 w-full sm:w-auto">
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant={"outline"}
							className={cn(
								"w-[140px] justify-start text-left font-normal text-xs h-9 bg-white shadow-sm",
								!fromDateVal && "text-muted-foreground"
							)}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{fromDateVal ? format(fromDateVal, "dd/MM/yyyy") : <span>From Date</span>}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<Calendar
							mode="single"
							selected={fromDateVal}
							onSelect={(date) => handleDateChange("from", date)}
							initialFocus
							captionLayout="dropdown"
							fromYear={2000}
							toYear={2050}
						/>
					</PopoverContent>
				</Popover>
				
				<span className="text-slate-400 text-xs">-</span>
				
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant={"outline"}
							className={cn(
								"w-[140px] justify-start text-left font-normal text-xs h-9 bg-white shadow-sm",
								!toDateVal && "text-muted-foreground"
							)}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{toDateVal ? format(toDateVal, "dd/MM/yyyy") : <span>To Date</span>}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<Calendar
							mode="single"
							selected={toDateVal}
							onSelect={(date) => handleDateChange("to", date)}
							initialFocus
							captionLayout="dropdown"
							fromYear={2000}
							toYear={2050}
						/>
					</PopoverContent>
				</Popover>
			</div>
			
			<select
				name="coordinatorId"
				value={coordinatorIdVal}
				onChange={handleChange}
				className="h-9 w-full sm:w-44 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
			>
				<option value="all">All Coordinators</option>
				{coordinatorsList.map((c: { _id: { toString: () => string }; fullName: string }) => (
					<option key={c._id.toString()} value={c._id.toString()}>
						{c.fullName}
					</option>
				))}
			</select>
			<Input
				type="search"
				name="query"
				placeholder="Search donors..."
				value={queryVal}
				onChange={handleChange}
				className="w-full sm:flex-1 shadow-sm bg-white h-9 min-w-[150px]"
			/>
			<button type="submit" className="sr-only">
				Filter
			</button>
		</form>
	);
}
