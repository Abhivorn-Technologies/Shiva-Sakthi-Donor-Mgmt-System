import { auth, signOut } from "@/auth";
import { CoordinatorHeader } from "@/components/CoordinatorHeader";
import { TopBar } from "@/components/TopBar";
import { CoordinatorSidebar } from "@/components/CoordinatorSidebar";

import { redirect } from "next/navigation";

export default async function CoordinatorLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	if (!session?.user || session.user.role !== "COORDINATOR") redirect("/login");

	return (
		<div className="min-h-screen flex flex-col md:flex-row bg-[#F8F9FB]">
			{/* Mobile Header */}
			<CoordinatorHeader 
				userName={session?.user?.name || ""} 
				onLogout={async () => {
					"use server";
					await signOut({ redirectTo: "/login" });
				}}
			/>

			<CoordinatorSidebar
				userName={session?.user?.name || ""}
				onLogout={async () => {
					"use server";
					await signOut({ redirectTo: "/login" });
				}}
			/>

			{/* Main Content */}
			<main className="flex-1 flex flex-col h-screen overflow-hidden">
				{/* Desktop TopBar */}
				<TopBar />
				<div className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</div>
			</main>
		</div>
	);
}
