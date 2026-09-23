"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartHandshake, LogOut, ChevronLeft, ChevronRight, Home, Users } from "lucide-react";
import { useState, useEffect } from "react";

export function CoordinatorSidebar({
	userName,
	onLogout
}: {
	userName: string;
	onLogout: () => void;
}) {
	const pathname = usePathname();
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		const saved = localStorage.getItem("coordSidebarCollapsed");
		if (saved === "true") setIsCollapsed(true);
		setIsMounted(true);
	}, []);

	const toggleSidebar = () => {
		const newState = !isCollapsed;
		setIsCollapsed(newState);
		localStorage.setItem("coordSidebarCollapsed", String(newState));
	};

	const navItems = [
		{ name: "Dashboard", href: "/coordinator/dashboard", icon: Home, match: "/coordinator/dashboard" },
		{ name: "All Donors", href: "/coordinator/donors", icon: Users, match: "/coordinator/donors" },
	];

	return (
		<aside
			className={`bg-white border-r shadow-sm flex flex-col justify-between hidden md:flex shrink-0 sticky top-0 h-screen transition-all duration-300 relative z-30 ${
				isMounted && isCollapsed ? "w-20" : "w-64"
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
			
			<div>
				<div className={`p-6 flex items-center ${isMounted && isCollapsed ? "justify-center px-4" : "gap-3"}`}>
					<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
						<HeartHandshake className="w-6 h-6" />
					</div>
					{(!isMounted || !isCollapsed) && (
						<div className="overflow-hidden transition-all">
							<div className="font-bold text-lg tracking-tight text-slate-900 leading-tight whitespace-nowrap">
								Donor Mgmt
							</div>
							<div className="text-xs text-slate-500 font-medium whitespace-nowrap">
								People Make Change
							</div>
						</div>
					)}
				</div>
				<nav className="px-4 space-y-1 mt-2">
					{navItems.map((item) => {
						const isActive = pathname.startsWith(item.match);
						return (
							<Link
								key={item.href}
								href={item.href}
								title={isMounted && isCollapsed ? item.name : undefined}
								className={`flex items-center px-3 py-2.5 rounded-lg font-medium transition-colors ${
									isMounted && isCollapsed ? "justify-center" : "gap-3"
								} ${
									isActive
										? "bg-blue-50 text-blue-700"
										: "text-slate-600 hover:bg-slate-50"
								}`}
							>
								<item.icon className="w-5 h-5 shrink-0" />
								{(!isMounted || !isCollapsed) && (
									<span className="whitespace-nowrap transition-all">{item.name}</span>
								)}
							</Link>
						);
					})}
				</nav>
			</div>
			
			<div className="flex flex-col">
				<div className={`p-4 border-t ${isMounted && isCollapsed ? "flex flex-col items-center px-2" : ""}`}>
					{(!isMounted || !isCollapsed) ? (
						<div className="flex items-center gap-3 mb-6 px-2">
							<div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-white shrink-0">
								{userName ? userName[0].toUpperCase() : "S"}
							</div>
							<div className="overflow-hidden">
								<div className="text-sm font-bold text-slate-900 truncate">
									{userName || "Coordinator"}
								</div>
								<div className="text-xs text-slate-500 truncate">
									Coordinator
								</div>
							</div>
						</div>
					) : (
						<div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-white shrink-0 mb-6" title={userName}>
							{userName ? userName[0].toUpperCase() : "S"}
						</div>
					)}
					<form action={onLogout} className="w-full">
						<button
							className={`flex items-center px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors ${
								isMounted && isCollapsed ? "justify-center w-full" : "gap-3 w-full"
							}`}
							type="submit"
							title={isMounted && isCollapsed ? "Log out" : undefined}
						>
							<LogOut className="w-5 h-5 shrink-0" />
							{(!isMounted || !isCollapsed) && <span>Log out</span>}
						</button>
					</form>
				</div>
			</div>
		</aside>
	);
}
