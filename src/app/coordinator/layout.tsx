import { auth, signOut } from "@/auth";
import { CoordinatorHeader } from "@/components/CoordinatorHeader";
import { TopBar } from "@/components/TopBar";
import { CoordinatorNav } from "@/components/CoordinatorNav";
import { HeartHandshake, LogOut } from "lucide-react";

export default async function CoordinatorLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	return (
		<div className="min-h-screen flex flex-col md:flex-row bg-[#F8F9FB]">
			{/* Mobile Header */}
			<CoordinatorHeader userName={session?.user?.name || ""} />

			{/* Desktop Sidebar */}
			<aside className="hidden md:flex w-64 bg-white border-r shadow-sm flex-col justify-between shrink-0 sticky top-0 h-screen">
				<div>
					<div className="p-6 flex items-center gap-3">
						<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
							<HeartHandshake className="w-6 h-6" />
						</div>
						<div>
							<div className="font-bold text-lg tracking-tight text-slate-900 leading-tight">
								Donor Mgmt
							</div>
							<div className="text-xs text-slate-500 font-medium">
								People Make Change
							</div>
						</div>
					</div>
					<CoordinatorNav />
				</div>
				<div className="p-4 border-t">
					<div className="flex items-center gap-3 mb-6 px-2">
						<div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-white shrink-0">
							{session?.user?.name ? session.user.name[0].toUpperCase() : "S"}
						</div>
						<div className="overflow-hidden">
							<div className="text-sm font-bold text-slate-900 truncate">
								{session?.user?.name || "System Admin"}
							</div>
							<div className="text-xs text-slate-500 truncate">
								Administrator
							</div>
						</div>
					</div>
					<form
						action={async () => {
							"use server";
							await signOut({ redirectTo: "/login" });
						}}
					>
						<button
							className="flex w-full items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
							type="submit"
						>
							<LogOut className="w-5 h-5" />
							Log out
						</button>
					</form>
				</div>
			</aside>

			{/* Main Content */}
			<main className="flex-1 flex flex-col h-screen overflow-hidden">
				{/* Desktop TopBar */}
				<TopBar />
				<div className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</div>
			</main>
		</div>
	);
}
