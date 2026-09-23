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
import { Eye, EyeOff, UserPlus } from "lucide-react";

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<Button 
			className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg mt-6 h-11 text-base font-medium" 
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
			<CardHeader className="pb-6 pt-8">
				<div className="flex justify-center mb-4">
					<div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100 shadow-sm">
						<UserPlus className="w-6 h-6 text-blue-600" />
					</div>
				</div>
				<CardTitle className="text-center text-2xl font-bold text-slate-900">
					Create Coordinator
				</CardTitle>
				<CardDescription className="text-center text-slate-500">
					Enter details to add a new coordinator to the system.
				</CardDescription>
			</CardHeader>
			<CardContent className="px-6 sm:px-8 pb-8">
				<form action={formAction} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="fullName">
							Full Name <span className="text-rose-500">*</span>
						</Label>
						<Input id="fullName" name="fullName" required minLength={2} />
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">
							Email <span className="text-rose-500">*</span>
						</Label>
						<Input id="email" name="email" type="email" required />
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">
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
									className="pr-10"
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
							>
								Auto-generate
							</Button>
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
