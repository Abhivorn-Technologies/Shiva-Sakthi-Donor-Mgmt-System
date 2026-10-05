"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useCallback, useRef, useState, useEffect } from "react";
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

export function DonorFilters() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

	const [startDateVal, setStartDateVal] = useState<Date | undefined>();
	const [endDateVal, setEndDateVal] = useState<Date | undefined>();
	
	useEffect(() => {
		const start = searchParams.get("startDate");
		const end = searchParams.get("endDate");
		if (start) setStartDateVal(new Date(start));
		if (end) setEndDateVal(new Date(end));
	}, [searchParams]);

	const updateParams = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			if (value) {
				params.set(name, value);
			} else {
				params.delete(name);
			}
			// Reset to page 1 when filtering
			params.set("page", "1");
			
			router.push(`/coordinator/donors?${params.toString()}`);
		},
		[router, searchParams]
	);

	const handleSearchChange = (value: string) => {
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}
		debounceTimerRef.current = setTimeout(() => {
			updateParams("query", value);
		}, 300); // 300ms debounce
	};

	return (
		<div className="flex flex-col sm:flex-row gap-3">
			<div className="flex gap-2 items-center">
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant={"outline"}
							className={cn(
								"w-[140px] justify-start text-left font-normal text-sm h-10 bg-white shadow-sm",
								!startDateVal && "text-muted-foreground"
							)}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{startDateVal ? format(startDateVal, "dd/MM/yyyy") : <span>Start Date</span>}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<Calendar
							mode="single"
							selected={startDateVal}
							onSelect={(date) => {
								setStartDateVal(date);
								updateParams("startDate", date ? format(date, "yyyy-MM-dd") : "");
							}}
							initialFocus
							captionLayout="dropdown"
							fromYear={2000}
							toYear={2050}
						/>
					</PopoverContent>
				</Popover>
				
				<span className="text-slate-400 text-sm">to</span>
				
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant={"outline"}
							className={cn(
								"w-[140px] justify-start text-left font-normal text-sm h-10 bg-white shadow-sm",
								!endDateVal && "text-muted-foreground"
							)}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{endDateVal ? format(endDateVal, "dd/MM/yyyy") : <span>End Date</span>}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<Calendar
							mode="single"
							selected={endDateVal}
							onSelect={(date) => {
								setEndDateVal(date);
								updateParams("endDate", date ? format(date, "yyyy-MM-dd") : "");
							}}
							initialFocus
							captionLayout="dropdown"
							fromYear={2000}
							toYear={2050}
						/>
					</PopoverContent>
				</Popover>
			</div>
			<div className="flex gap-2">
				<Input
					type="search"
					placeholder="Search donors..."
					defaultValue={searchParams.get("query") ?? ""}
					onChange={(e) => handleSearchChange(e.target.value)}
					className="w-full sm:w-64 shadow-sm bg-white"
				/>
			</div>
		</div>
	);
}
