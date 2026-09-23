"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserCog, LogOut, Grid } from "lucide-react";
import { Button } from "./ui/button";
import { logoutAction } from "@/app/admin/logout-action";

export function AdminSidebar({
	userName,
	role,
}: {
	userName: string;
	role: string;
}) {
	const pathname = usePathname();

	const navItems = [
		{ name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
		{ name: "All Donors", href: "/admin/donors", icon: Users },
		{ name: "Coordinators", href: "/admin/coordinators", icon: UserCog },
	];

	return (
		<aside className="w-64 bg-[#0B1120] text-white flex flex-col justify-between hidden md:flex shrink-0 min-h-screen relative z-10 shadow-xl">
			<div>
				<div className="p-6 flex items-center gap-3">
					<div className="bg-blue-600 p-2 rounded-lg">
						<LayoutDashboard className="w-5 h-5 text-white" />
					</div>
					<div>
						<div className="font-bold text-lg tracking-tight leading-tight">
							Admin Panel
						</div>
						<div className="text-xs text-slate-400 font-medium">
							Manage • Monitor • Grow
						</div>
					</div>
				</div>

				<nav className="mt-2 px-3 space-y-1">
					{navItems.map((item) => {
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href}
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

			<div className="p-4 mb-4">
				{/* Placeholder for future sidebar footer content */}
			</div>
		</aside>
	);
}
