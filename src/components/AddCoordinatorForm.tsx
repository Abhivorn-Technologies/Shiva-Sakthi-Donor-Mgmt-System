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
import { Eye, EyeOff } from "lucide-react";

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<Button className="w-full" type="submit" disabled={pending}>
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
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle>Create Coordinator</CardTitle>
				<CardDescription>Add a new coordinator to the system.</CardDescription>
			</CardHeader>
			<CardContent>
				<form action={formAction} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="fullName">Full Name</Label>
						<Input id="fullName" name="fullName" required minLength={2} />
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" name="email" type="email" required />
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
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
