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

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function CoordinatorHeader({ 
	userName,
	onLogout 
}: { 
	userName?: string;
	onLogout: () => void;
}) {
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
									Donor Management
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


					</SheetContent>
				</Sheet>

				<div className="font-bold text-lg tracking-tight text-blue-600">
					Donor Management
				</div>
			</div>

			<div className="flex items-center">
				<DropdownMenu>
					<DropdownMenuTrigger className="focus:outline-none">
						<div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700 shadow-sm transition-transform hover:scale-105">
							{userName ? userName[0].toUpperCase() : "C"}
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<DropdownMenuGroup>
							<DropdownMenuLabel>{userName || "Coordinator"}</DropdownMenuLabel>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<form action={onLogout} className="w-full">
							<DropdownMenuItem
								className="w-full cursor-pointer text-red-600"
								onClick={(e) => {
									e.currentTarget.closest("form")?.requestSubmit();
								}}
							>
								<LogOut className="w-4 h-4 mr-2" />
								Log out
							</DropdownMenuItem>
						</form>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
