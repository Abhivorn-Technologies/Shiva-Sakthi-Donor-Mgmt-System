import { AddCoordinatorForm } from "@/components/AddCoordinatorForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddCoordinatorPage() {
	return (
		<div className="min-h-[80vh] flex flex-col space-y-6 pb-12 relative">
			{/* Decorative background */}
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white opacity-70 rounded-3xl" />
			
			<div className="flex items-center space-x-4">
				<Link
					href="/admin/coordinators"
					className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors text-slate-600 hover:text-blue-600"
				>
					<ArrowLeft className="w-5 h-5" />
				</Link>
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-slate-900">
						Add Coordinator
					</h1>
					<p className="text-sm text-slate-500 mt-1">
						Create a new coordinator account and generate their credentials.
					</p>
				</div>
			</div>
			
			<div className="flex-1 flex justify-center mt-8">
				<div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
					<AddCoordinatorForm />
				</div>
			</div>
		</div>
	);
}
