import { LoginForm } from "@/components/LoginForm";
import { HeartHandshake, Users, BarChart3, Heart } from "lucide-react";

export default function LoginPage() {
	return (
		<div className="flex flex-1 w-full h-full bg-slate-50 overflow-hidden">
			{/* Left side - Branding & Info */}
			<div className="hidden lg:flex lg:w-1/2 xl:w-5/12 bg-blue-600 relative flex-col justify-between p-12 text-white overflow-hidden">
				{/* Abstract background shapes */}
				<div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
					<svg
						className="absolute w-full h-full"
						viewBox="0 0 100 100"
						preserveAspectRatio="none"
					>
						<path
							d="M0,0 C30,40 70,10 100,50 L100,100 L0,100 Z"
							fill="rgba(255,255,255,0.05)"
						/>
						<path
							d="M0,30 C40,80 80,40 100,80 L100,100 L0,100 Z"
							fill="rgba(0,0,0,0.1)"
						/>
						<path
							d="M-20,80 C20,120 60,60 120,100 L120,120 L-20,120 Z"
							fill="rgba(0,30,100,0.2)"
						/>
					</svg>
				</div>

				{/* Content */}
				<div className="relative z-10 flex flex-col h-full justify-between">
					{/* Logo */}
					<div className="flex flex-col items-center self-start">
						<HeartHandshake className="w-12 h-12 text-blue-300 mb-2" />
						<span className="text-2xl font-bold tracking-tight">
							Donor Mgmt
						</span>
						<span className="text-xs text-blue-200">People Make Change</span>
					</div>

					{/* Main Info */}
					<div className="mt-16 mb-12">
						<h1 className="text-4xl font-bold mb-2">Together</h1>
						<h2 className="text-4xl font-bold text-cyan-300 mb-6">
							We Create Impact
						</h2>
						<p className="text-blue-100 mb-12 max-w-sm text-lg">
							Manage donors, track contributions, and build a better tomorrow.
						</p>

						<div className="space-y-8">
							<div className="flex items-start gap-4">
								<div className="bg-blue-500/50 p-3 rounded-full flex-shrink-0">
									<Users className="w-6 h-6 text-white" />
								</div>
								<div>
									<h3 className="font-semibold text-lg text-white">
										Manage Donors
									</h3>
									<p className="text-blue-200 text-sm">
										Keep donor information organized
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="bg-emerald-500/50 p-3 rounded-full flex-shrink-0">
									<BarChart3 className="w-6 h-6 text-white" />
								</div>
								<div>
									<h3 className="font-semibold text-lg text-white">
										Track Donations
									</h3>
									<p className="text-blue-200 text-sm">
										Monitor contributions and growth
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="bg-purple-500/50 p-3 rounded-full flex-shrink-0">
									<Heart className="w-6 h-6 text-white" />
								</div>
								<div>
									<h3 className="font-semibold text-lg text-white">
										Create Impact
									</h3>
									<p className="text-blue-200 text-sm">
										Turn generosity into real change
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Quote */}
					<div className="mt-auto pt-8">
						<div className="w-12 h-1 bg-blue-400 mb-4 rounded-full"></div>
						<p className="text-blue-100 italic text-sm max-w-sm font-light">
							&quot;Small acts, when multiplied by millions, can transform the
							world.&quot;
						</p>
					</div>
				</div>
			</div>

			{/* Right side - Login Form */}
			<div className="flex-1 flex items-center justify-center p-6 relative">
				{/* Subtle background decoration */}
				<div className="absolute top-10 right-10 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-60"></div>
				<div className="absolute bottom-10 left-10 w-32 h-32 bg-indigo-100 rounded-full blur-2xl opacity-60"></div>

				<div className="w-full max-w-md relative z-10">
					<LoginForm />
				</div>
			</div>
		</div>
	);
}
