import { auth } from "@/auth";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { redirect } from "next/navigation";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

	return (
		<div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc]">
			<AdminSidebar
				userName={session.user.name || "System Admin"}
				role="Administrator"
			/>
			<div className="flex-1 flex flex-col h-screen overflow-hidden">
				<AdminHeader
					userName={session.user.name || "System Admin"}
					role="Administrator"
				/>
				<main className="flex-1 p-4 md:p-8 overflow-y-auto">
					<div className="max-w-[1200px] mx-auto">{children}</div>
				</main>
			</div>
		</div>
	);
}
