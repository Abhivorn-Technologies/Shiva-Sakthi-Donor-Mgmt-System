"use client";

import { Menu, LogOut, LayoutDashboard, Users } from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetHeader,
	SheetTitle,
} from "./ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

export function CoordinatorHeader({ userName }: { userName?: string }) {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);

	return (
		<header className="h-16 bg-white border-b flex items-center justify-between px-4 md:hidden sticky top-0 z-20 shadow-sm">
			<div className="flex items-center gap-4">
				<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger className="text-slate-500 hover:text-slate-700">
						<Menu className="w-5 h-5" />
					</SheetTrigger>
					<SheetContent
						side="left"
						className="w-[280px] bg-white border-slate-200 p-0 flex flex-col justify-between"
					>
						<div>
							<SheetHeader className="p-6 text-left border-b">
								<SheetTitle className="font-bold text-xl tracking-tight text-blue-600">
									Donor Mgmt
								</SheetTitle>
							</SheetHeader>
							<nav className="px-4 py-4 space-y-2">
								<Link
									href="/coordinator/dashboard"
									onClick={() => setOpen(false)}
									className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
										pathname === "/coordinator/dashboard"
											? "bg-blue-50 text-blue-700"
											: "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
									}`}
								>
									<LayoutDashboard className="w-4 h-4" />
									Dashboard
								</Link>
								<Link
									href="/coordinator/donors"
									onClick={() => setOpen(false)}
									className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
										pathname.startsWith("/coordinator/donors")
											? "bg-blue-50 text-blue-700"
											: "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
									}`}
								>
									<Users className="w-4 h-4" />
									All Donors
								</Link>
							</nav>
						</div>

						<div className="p-4 border-t">
							<div className="text-sm font-medium mb-4 truncate text-slate-600">
								{userName || "Coordinator"}
							</div>
							<form action="/api/auth/signout" method="POST">
								<Button variant="outline" className="w-full" type="submit">
									<LogOut className="w-4 h-4 mr-2" />
									Log out
								</Button>
							</form>
						</div>
					</SheetContent>
				</Sheet>

				<div className="font-bold text-lg tracking-tight text-blue-600">
					Donor Mgmt
				</div>
			</div>

			<div className="flex items-center">
				<div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700 shadow-sm">
					{userName ? userName[0].toUpperCase() : "C"}
				</div>
			</div>
		</header>
	);
}
