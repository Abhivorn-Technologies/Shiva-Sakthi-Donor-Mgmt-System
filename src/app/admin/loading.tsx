export default function Loading() {
	return (
		<div className="space-y-6 pb-12 w-full animate-pulse">
			{/* Header Skeleton */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
				<div className="space-y-2">
					<div className="h-8 w-48 bg-slate-200/60 rounded-md"></div>
					<div className="h-4 w-64 bg-slate-200/60 rounded-md"></div>
				</div>
				<div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
					<div className="h-10 w-full sm:w-[140px] bg-slate-200/60 rounded-lg"></div>
					<div className="h-10 w-full sm:w-[140px] bg-slate-200/60 rounded-lg"></div>
					<div className="h-10 w-full sm:w-64 bg-slate-200/60 rounded-lg"></div>
				</div>
			</div>

			{/* Content/Table Skeleton */}
			<div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
				<div className="border-b border-slate-100 bg-slate-50/50 p-4 flex gap-4">
					<div className="h-5 w-32 bg-slate-200/60 rounded"></div>
					<div className="h-5 w-40 bg-slate-200/60 rounded hidden sm:block"></div>
					<div className="h-5 w-24 bg-slate-200/60 rounded hidden sm:block"></div>
				</div>
				<div className="p-4 space-y-4">
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
							<div className="flex gap-4 w-full">
								<div className="h-4 w-1/4 bg-slate-200/60 rounded"></div>
								<div className="h-4 w-1/4 bg-slate-200/60 rounded hidden sm:block"></div>
								<div className="h-4 w-1/6 bg-slate-200/60 rounded"></div>
								<div className="h-4 w-1/6 bg-slate-200/60 rounded hidden md:block"></div>
							</div>
							<div className="h-8 w-24 bg-slate-200/60 rounded-md shrink-0"></div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
