"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users } from "lucide-react";

export function CoordinatorNav() {
	const pathname = usePathname();

	return (
		<nav className="px-4 space-y-1 mt-2">
			<Link
				href="/coordinator/dashboard"
				className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
					pathname === "/coordinator/dashboard"
						? "bg-blue-50 text-blue-700"
						: "text-slate-600 hover:bg-slate-50"
				}`}
			>
				<Home className="w-5 h-5" />
				Dashboard
			</Link>
			<Link
				href="/coordinator/donors"
				className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
					pathname.startsWith("/coordinator/donors")
						? "bg-blue-50 text-blue-700"
						: "text-slate-600 hover:bg-slate-50"
				}`}
			>
				<Users className="w-5 h-5" />
				All Donors
			</Link>
		</nav>
	);
}
