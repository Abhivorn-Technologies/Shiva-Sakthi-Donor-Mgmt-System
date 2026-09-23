"use client";

import { useActionState, useState } from "react";
import { loginAction } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useFormStatus } from "react-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<Button
			className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-xl transition-all shadow-md shadow-blue-500/20 group flex items-center justify-center gap-2 h-12"
			type="submit"
			disabled={pending}
		>
			{pending ? "Signing in..." : "Sign In"}
			{!pending && (
				<ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
			)}
		</Button>
	);
}

export function LoginForm() {
	const [state, formAction] = useActionState(loginAction, undefined);
	const [showPassword, setShowPassword] = useState(false);

	return (
		<Card className="w-full shadow-2xl border-0 rounded-3xl p-4 bg-white/95 backdrop-blur-sm">
			<CardHeader className="space-y-2 mb-2">
				<CardTitle className="text-3xl font-bold tracking-tight text-center text-slate-800">
					Welcome Back
				</CardTitle>
				<CardDescription className="text-center text-slate-500 font-medium">
					Log in to your Donor Management account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form action={formAction} className="space-y-6">
					<div className="space-y-2 relative">
						<Label
							htmlFor="email"
							className="text-slate-700 font-semibold ml-1"
						>
							Email Address
						</Label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
								<Mail className="h-5 w-5 text-slate-400" />
							</div>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="Enter your email address"
								required
								className="pl-11 h-12 rounded-xl border-slate-200 focus-visible:ring-blue-500 focus-visible:border-blue-500 bg-slate-50/50"
							/>
						</div>
					</div>

					<div className="space-y-2 relative">
						<Label
							htmlFor="password"
							className="text-slate-700 font-semibold ml-1"
						>
							Password
						</Label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
								<Lock className="h-5 w-5 text-slate-400" />
							</div>
							<Input
								id="password"
								name="password"
								type={showPassword ? "text" : "password"}
								placeholder="Enter your password"
								required
								className="pl-11 pr-11 h-12 rounded-xl border-slate-200 focus-visible:ring-blue-500 focus-visible:border-blue-500 bg-slate-50/50"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
							>
								{showPassword ? (
									<EyeOff className="h-5 w-5" />
								) : (
									<Eye className="h-5 w-5" />
								)}
							</button>
						</div>
					</div>

					<div className="flex items-center justify-between mt-2">
						<div className="flex items-center space-x-2">
							<input
								type="checkbox"
								id="remember"
								name="remember"
								className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
							/>
							<Label
								htmlFor="remember"
								className="text-sm font-medium text-slate-700 cursor-pointer"
							>
								Remember me
							</Label>
						</div>
						<Link
							href="#"
							className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline"
						>
							Forgot password?
						</Link>
					</div>

					{state?.error && (
						<div className="text-sm text-red-500 text-center font-medium bg-red-50 p-3 rounded-lg">
							{state.error}
						</div>
					)}

					<div className="pt-2">
						<SubmitButton />
					</div>
				</form>
			</CardContent>

			<div className="flex flex-col space-y-6 pt-4 pb-6 mt-4">
				<div className="relative w-full flex items-center justify-center">
					<div className="absolute w-full border-t border-slate-200"></div>
					<div className="relative px-4 bg-white text-sm text-slate-400 font-medium">
						or
					</div>
				</div>

				<div className="text-center text-sm font-medium text-slate-600">
					New here?{" "}
					<Link
						href="#"
						className="text-blue-600 hover:text-blue-500 hover:underline"
					>
						Contact your administrator
					</Link>
				</div>
			</div>
		</Card>
	);
}
