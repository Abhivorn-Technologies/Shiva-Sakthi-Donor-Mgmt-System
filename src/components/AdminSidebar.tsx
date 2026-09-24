/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
	LayoutDashboard, 
	Users, 
	UserCog, 
	ChevronLeft, 
	ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";

export function AdminSidebar({
	userName,
	role,
}: {
	userName: string;
	role: string;
}) {
	const pathname = usePathname();
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		const saved = localStorage.getItem("adminSidebarCollapsed");
		if (saved === "true") setIsCollapsed(true);
		setIsMounted(true);
	}, []);

	const toggleSidebar = () => {
		const newState = !isCollapsed;
		setIsCollapsed(newState);
		localStorage.setItem("adminSidebarCollapsed", String(newState));
	};

	const navItems = [
		{ name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
		{ name: "All Donors", href: "/admin/donors", icon: Users },
		{ name: "Coordinators", href: "/admin/coordinators", icon: UserCog },
	];



	return (
		<aside
			className={`bg-[#fdfdfd] border-r border-slate-200 flex flex-col justify-between hidden md:flex shrink-0 sticky top-0 h-screen z-30 shadow-sm transition-all duration-300 relative ${
				isMounted && isCollapsed ? "w-20" : "w-60"
			}`}
		>
			<button
				onClick={toggleSidebar}
				className="absolute -right-3.5 top-8 w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors shadow-sm z-50"
				title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
			>
				{isMounted && isCollapsed ? (
					<ChevronRight className="w-4 h-4" />
				) : (
					<ChevronLeft className="w-4 h-4" />
				)}
			</button>
			
			<div className="flex flex-col h-full">
				<div className={`p-5 flex items-center ${isMounted && isCollapsed ? "justify-center" : "gap-3"}`}>
					<div className="bg-blue-600 p-2 rounded-lg shrink-0 shadow-sm shadow-blue-200">
						<LayoutDashboard className="w-5 h-5 text-white" />
					</div>
					{(!isMounted || !isCollapsed) && (
						<div className="overflow-hidden transition-all">
							<div className="font-bold text-lg tracking-tight leading-tight text-slate-900 whitespace-nowrap">
								Admin Panel
							</div>
							<div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold whitespace-nowrap mt-0.5">
								Workspace
							</div>
						</div>
					)}
				</div>

				<div className="flex-1 overflow-y-auto px-3 py-2 space-y-8 scrollbar-hide">
					<div>
						{(!isMounted || !isCollapsed) && (
							<div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
								Main Menu
							</div>
						)}
						<nav className="space-y-1">
							{navItems.map((item) => {
								const isActive = pathname === item.href;
								return (
									<Link
										key={item.name}
										href={item.href}
										title={isMounted && isCollapsed ? item.name : undefined}
										className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
											isMounted && isCollapsed ? "justify-center" : "gap-3"
										} ${
											isActive
												? "bg-blue-600 text-white shadow-md shadow-blue-200"
												: "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
										}`}
									>
										<item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
										{(!isMounted || !isCollapsed) && (
											<span className="whitespace-nowrap transition-all">{item.name}</span>
										)}
									</Link>
								);
							})}
						</nav>
					</div>
				</div>


			</div>
		</aside>
	);
}
