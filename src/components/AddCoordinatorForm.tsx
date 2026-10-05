"use client";

import { useActionState, useState } from "react";
import { createCoordinator } from "@/app/admin/coordinators/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { useFormStatus } from "react-dom";
import { Eye, EyeOff, UserPlus, Phone, MapPin } from "lucide-react";

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<Button 
			className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg mt-4 h-10 text-sm font-medium" 
			type="submit" 
			disabled={pending}
		>
			{pending ? "Creating..." : "Create Account"}
		</Button>
	);
}

export function AddCoordinatorForm() {
	const [state, formAction] = useActionState(createCoordinator, undefined);
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const generatePassword = () => {
		const chars =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
		let pwd = "";
		for (let i = 0; i < 12; i++) {
			pwd += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		setPassword(pwd);
		setShowPassword(true);
	};

	return (
		<Card className="w-full border-slate-200/60 shadow-xl overflow-hidden bg-white/80 backdrop-blur-sm">
			<div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
			<CardHeader className="pb-2 pt-6">
				<div className="flex justify-center mb-2">
					<div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100 shadow-sm">
						<UserPlus className="w-5 h-5 text-blue-600" />
					</div>
				</div>
				<CardTitle className="text-center text-xl font-bold text-slate-900">
					Create Coordinator
				</CardTitle>
				<CardDescription className="text-center text-xs text-slate-500">
					Enter details to add a new coordinator to the system.
				</CardDescription>
			</CardHeader>
			<CardContent className="px-4 sm:px-6 pb-6">
				<form action={formAction} className="space-y-3">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div className="space-y-1">
							<Label htmlFor="fullName" className="text-xs">
								Full Name <span className="text-rose-500">*</span>
							</Label>
							<Input id="fullName" name="fullName" required minLength={2} className="h-9" />
						</div>
						<div className="space-y-1">
							<Label htmlFor="email" className="text-xs">
								Email <span className="text-rose-500">*</span>
							</Label>
							<Input id="email" name="email" type="email" required className="h-9" />
						</div>
					</div>
					<div className="space-y-1">
						<Label htmlFor="password" className="text-xs">
							Password <span className="text-rose-500">*</span>
						</Label>
						<div className="flex gap-2">
							<div className="relative flex-1">
								<Input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									required
									minLength={6}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="pr-10 h-9"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
								>
									{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
								</button>
							</div>
							<Button
								type="button"
								variant="outline"
								onClick={generatePassword}
								className="h-9"
							>
								Auto-generate
							</Button>
						</div>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div className="space-y-1">
							<Label htmlFor="phoneNumber" className="text-xs">Phone Number (Optional)</Label>
							<div className="relative">
								<Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
								<Input
									id="phoneNumber"
									name="phoneNumber"
									type="tel"
									placeholder="e.g. 9876543210"
									className="pl-10 h-9"
								/>
							</div>
						</div>

						<div className="space-y-1">
							<Label htmlFor="location" className="text-xs">Location (Optional)</Label>
							<div className="relative">
								<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
								<Input
									id="location"
									name="location"
									placeholder="e.g. Hyderabad"
									className="pl-10 h-9"
								/>
							</div>
						</div>
					</div>

					{state?.error && (
						<div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">
							{state.error}
						</div>
					)}

					<SubmitButton />
				</form>
			</CardContent>
		</Card>
	);
}
