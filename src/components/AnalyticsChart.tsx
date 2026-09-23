"use client";

import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

export function AnalyticsChart({ data }: { data: any[] }) {
	return (
		<div className="h-[300px] w-full mt-4">
			<ResponsiveContainer width="100%" height="100%">
				<LineChart
					data={data}
					margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
				>
					<CartesianGrid
						strokeDasharray="3 3"
						vertical={true}
						stroke="#f1f5f9"
					/>
					<XAxis
						dataKey="name"
						axisLine={false}
						tickLine={false}
						tick={{ fill: "#64748b", fontSize: 12 }}
						dy={10}
					/>
					<YAxis
						tickFormatter={(value) => `₹${value}`}
						axisLine={false}
						tickLine={false}
						tick={{ fill: "#64748b", fontSize: 12 }}
					/>
					<Tooltip
						formatter={(value: any) => [
							`₹${Number(value).toLocaleString("en-IN")}`,
							"Revenue",
						]}
						contentStyle={{
							borderRadius: "8px",
							border: "none",
							boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
						}}
						cursor={{
							stroke: "#cbd5e1",
							strokeWidth: 1,
							strokeDasharray: "4 4",
						}}
					/>
					<Line
						type="monotone"
						dataKey="amount"
						stroke="#3b82f6"
						strokeWidth={3}
						dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#ffffff" }}
						activeDot={{
							r: 6,
							fill: "#3b82f6",
							strokeWidth: 2,
							stroke: "#ffffff",
						}}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
