"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useCallback, useRef } from "react";

export function DonorFilters() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

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
				<Input
					type="date"
					defaultValue={searchParams.get("startDate") ?? ""}
					onChange={(e) => updateParams("startDate", e.target.value)}
					className="w-full sm:w-[140px] shadow-sm bg-white text-sm"
					title="Start Date"
				/>
				<span className="text-slate-400 text-sm">to</span>
				<Input
					type="date"
					defaultValue={searchParams.get("endDate") ?? ""}
					onChange={(e) => updateParams("endDate", e.target.value)}
					className="w-full sm:w-[140px] shadow-sm bg-white text-sm"
					title="End Date"
				/>
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
