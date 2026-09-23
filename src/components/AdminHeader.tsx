"use client";

import {
	Search,
	Menu,
	ChevronDown,
	LogOut,
	LayoutDashboard,
	Users,
	UserCog,
} from "lucide-react";
import { Input } from "./ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetHeader,
	SheetTitle,
} from "./ui/sheet";
import { logoutAction } from "@/app/admin/logout-action";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function AdminHeader({
	userName,
	role,
}: {
	userName?: string;
	role?: string;
}) {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);

	const navItems = [
		{ name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
		{ name: "All Donors", href: "/admin/donors", icon: Users },
		{ name: "Coordinators", href: "/admin/coordinators", icon: UserCog },
	];

	return (
		<header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 shadow-sm">
			<div className="flex items-center gap-4 flex-1">
				<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger className="md:hidden text-slate-500 hover:text-slate-700">
						<Menu className="w-5 h-5" />
					</SheetTrigger>
					<SheetContent
						side="left"
						className="w-[280px] bg-[#0B1120] text-white border-slate-800 p-0"
					>
						<div className="flex flex-col h-full">
							<SheetHeader className="p-6 text-left">
								<SheetTitle className="flex items-center gap-3">
									<div className="bg-blue-600 p-2 rounded-lg">
										<LayoutDashboard className="w-5 h-5 text-white" />
									</div>
									<div>
										<div className="font-bold text-lg tracking-tight leading-tight text-white">
											Admin Panel
										</div>
										<div className="text-xs text-slate-400 font-medium">
											Manage • Monitor • Grow
										</div>
									</div>
								</SheetTitle>
							</SheetHeader>
							<nav className="flex-1 px-3 space-y-1 mt-2">
								{navItems.map((item) => {
									const isActive = pathname === item.href;
									return (
										<Link
											key={item.href}
											href={item.href}
											onClick={() => setOpen(false)}
											className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
												isActive
													? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
													: "text-slate-400 hover:bg-slate-800/50 hover:text-white"
											}`}
										>
											<item.icon className="w-4 h-4" />
											{item.name}
										</Link>
									);
								})}
							</nav>
						</div>
					</SheetContent>
				</Sheet>

				<div className="relative w-full max-w-md hidden sm:block">
					<Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
					<Input
						placeholder="Search donors, coordinators..."
						className="pl-9 bg-slate-50 border-slate-200 h-10 rounded-lg text-sm focus-visible:ring-1 focus-visible:ring-blue-500 transition-shadow w-full"
					/>
				</div>
			</div>
			<div className="flex items-center gap-6">
				{userName && (
					<DropdownMenu>
						<DropdownMenuTrigger className="flex items-center gap-3 cursor-pointer pl-4 border-l border-slate-200 hover:opacity-80 transition-opacity outline-none">
							<div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-white shadow-sm">
								{userName[0].toUpperCase()}
							</div>
							<div className="hidden md:block text-sm text-left">
								<div className="font-medium text-slate-900 leading-tight">
									{userName}
								</div>
								<div className="text-xs text-slate-500">{role}</div>
							</div>
							<ChevronDown className="w-4 h-4 text-slate-400 hidden md:block ml-1" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56 mt-2">
							<div className="px-2 py-1.5 md:hidden">
								<div className="font-medium text-slate-900">{userName}</div>
								<div className="text-xs text-slate-500">{role}</div>
							</div>
							<DropdownMenuSeparator className="md:hidden" />
							<form action={logoutAction}>
								<button type="submit" className="w-full text-left">
									<DropdownMenuItem className="text-red-600 cursor-pointer">
										<LogOut className="mr-2 h-4 w-4" />
										<span>Log out</span>
									</DropdownMenuItem>
								</button>
							</form>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</header>
	);
}
