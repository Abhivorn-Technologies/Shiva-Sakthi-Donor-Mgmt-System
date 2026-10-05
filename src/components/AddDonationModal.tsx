"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { AddDonorForm } from "@/components/AddDonorForm";
import { PlusCircle } from "lucide-react";

export function AddDonationModal({ donor }: { donor: { fullName: string; email: string; whatsappNumber: string; occupation: string; placeOfLiving?: string; nativePlace?: string; towards?: string; donationType?: string; followingShivashakthiSince?: string; comments?: string; } }) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					<Button
						variant="outline"
						size="sm"
						className="text-blue-600 border-blue-200 hover:bg-blue-50"
					/>
				}
			>
				<PlusCircle className="w-4 h-4 mr-1" />
				Add Donation
			</DialogTrigger>
			<DialogContent className="w-[95vw] max-w-[425px] max-h-[90vh] overflow-y-auto p-0 border-none bg-transparent shadow-none">
				<DialogHeader className="sr-only">
					<DialogTitle>Add Donation Again</DialogTitle>
					<DialogDescription>
						Add another donation for {donor.fullName}.
					</DialogDescription>
				</DialogHeader>
				<div className="bg-transparent rounded-2xl">
					<AddDonorForm
						defaultValues={{
							fullName: donor.fullName,
							email: donor.email,
							whatsappNumber: donor.whatsappNumber,
							occupation: donor.occupation,
							placeOfLiving: donor.placeOfLiving,
							nativePlace: donor.nativePlace,
							towards: donor.towards,
							donationType: donor.donationType,
							followingShivashakthiSince: donor.followingShivashakthiSince,
							comments: donor.comments,
						}}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
