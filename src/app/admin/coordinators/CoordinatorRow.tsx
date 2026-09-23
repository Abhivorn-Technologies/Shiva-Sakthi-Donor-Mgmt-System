"use client";

import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import {
	MoreHorizontal,
	KeyRound,
	UserX,
	UserCheck,
	Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	deactivateCoordinator,
	deleteCoordinator,
	resetCoordinatorPassword,
} from "./actions";

export function CoordinatorRow({ user }: { user: any }) {
	const [resetDialogOpen, setResetDialogOpen] = useState(false);
	const [newPassword, setNewPassword] = useState("");
	const [isResetting, setIsResetting] = useState(false);

	const handleResetPassword = async () => {
		if (newPassword.length < 6) return alert("Password too short");
		setIsResetting(true);
		try {
			await resetCoordinatorPassword(user._id.toString(), newPassword);
			setResetDialogOpen(false);
			setNewPassword("");
			alert("Password reset successfully");
		} catch (e) {
			alert("Failed to reset password");
		}
		setIsResetting(false);
	};

	return (
		<>
			<TableRow className="hover:bg-slate-50 transition-colors">
				<TableCell className="font-medium text-slate-900">
					{user.fullName}
				</TableCell>
				<TableCell className="text-slate-600">{user.email}</TableCell>
				<TableCell>
					<span
						className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
							user.isActive
								? "bg-emerald-100 text-emerald-800 border border-emerald-200"
								: "bg-rose-100 text-rose-800 border border-rose-200"
						}`}
					>
						{user.isActive ? "Active" : "Inactive"}
					</span>
				</TableCell>
				<TableCell className="text-slate-500">
					{new Date(user.createdAt || Date.now()).toLocaleDateString("en-GB")}
				</TableCell>
				<TableCell>
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									variant="ghost"
									className="h-8 w-8 p-0 hover:bg-slate-100"
								/>
							}
						>
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4 text-slate-500" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48">
							<form
								action={deactivateCoordinator.bind(
									null,
									user._id.toString(),
									!user.isActive,
								)}
							>
								<button type="submit" className="w-full text-left">
									<DropdownMenuItem className="cursor-pointer">
										{user.isActive ? (
											<>
												<UserX className="mr-2 h-4 w-4" /> Deactivate
											</>
										) : (
											<>
												<UserCheck className="mr-2 h-4 w-4" /> Activate
											</>
										)}
									</DropdownMenuItem>
								</button>
							</form>

							<DropdownMenuItem
								className="cursor-pointer"
								onClick={() => setResetDialogOpen(true)}
							>
								<KeyRound className="mr-2 h-4 w-4" />
								Reset Password
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							<form action={deleteCoordinator.bind(null, user._id.toString())}>
								<button type="submit" className="w-full text-left">
									<DropdownMenuItem className="text-rose-600 focus:text-rose-700 cursor-pointer">
										<Trash2 className="mr-2 h-4 w-4" />
										Delete Account
									</DropdownMenuItem>
								</button>
							</form>
						</DropdownMenuContent>
					</DropdownMenu>
				</TableCell>
			</TableRow>

			<Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Reset Password</DialogTitle>
						<DialogDescription>
							Enter a new password for {user.fullName}. Must be at least 6
							characters.
						</DialogDescription>
					</DialogHeader>
					<div className="flex items-center space-x-2 py-4">
						<Input
							id="password"
							type="password"
							placeholder="New password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
						/>
					</div>
					<DialogFooter className="sm:justify-end">
						<Button
							type="button"
							variant="secondary"
							onClick={() => setResetDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button
							type="button"
							onClick={handleResetPassword}
							disabled={isResetting || newPassword.length < 6}
						>
							{isResetting ? "Saving..." : "Save Password"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
