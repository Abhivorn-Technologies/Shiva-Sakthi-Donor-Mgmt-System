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
	if (!session?.user) redirect("/login");

	return (
		<div className="min-h-screen bg-[#f8fafc]">
			<div className="fixed inset-y-0 left-0 z-50">
				<AdminSidebar
					userName={session.user.name || "System Admin"}
					role="Administrator"
				/>
			</div>
			<div className="flex flex-col min-h-screen md:pl-64">
				<AdminHeader
					userName={session.user.name || "System Admin"}
					role="Administrator"
				/>
				<main className="flex-1 p-4 md:p-8">
					<div className="max-w-[1200px] mx-auto">{children}</div>
				</main>
			</div>
		</div>
	);
}
