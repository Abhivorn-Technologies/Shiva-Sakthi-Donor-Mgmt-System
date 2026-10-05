"use client";

import { Search, Calendar } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react";

export function TopBar() {
	const currentDate = new Date().toLocaleDateString("en-GB", {
		weekday: "long",
		day: "numeric",
		month: "short",
		year: "numeric",
	});

	const searchParams = useSearchParams();
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

	const handleSearchChange = (query: string) => {
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}
		
		debounceTimerRef.current = setTimeout(() => {
			const params = new URLSearchParams(searchParams.toString());
			if (query) {
				params.set("query", query);
			} else {
				params.delete("query");
			}
			params.delete("page");
			
			startTransition(() => {
				router.push(`/coordinator/donors?${params.toString()}`);
			});
		}, 400);
	};

	const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const query = (e.currentTarget.elements.namedItem("search") as HTMLInputElement).value;
		handleSearchChange(query);
	};

	return (
		<div className="hidden md:flex h-16 border-b bg-white items-center justify-between px-8 shrink-0">
			<div className="relative w-96">
				<form onSubmit={handleSearchSubmit}>
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
					<input
						name="search"
						type="text"
						defaultValue={searchParams.get("query") || ""}
						onChange={(e) => handleSearchChange(e.target.value)}
						placeholder="Search donors, email, phone..."
						className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
					/>
				</form>
			</div>

			<div className="flex items-center gap-6">
				<div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-sm font-medium text-slate-700">
					<Calendar className="w-4 h-4 text-slate-500" />
					{currentDate}
				</div>
			</div>
		</div>
	);
}
