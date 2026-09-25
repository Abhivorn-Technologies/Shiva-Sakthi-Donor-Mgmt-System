"use client";

import { useActionState, useEffect, useState } from "react";
import { createDonor } from "@/app/coordinator/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useFormStatus } from "react-dom";
import {
	UserPlus,
	User,
	Mail,
	Phone,
	Briefcase,
	IndianRupee,
	CreditCard,
} from "lucide-react";
import { ToWords } from "to-words";

const toWords = new ToWords({
	localeCode: "en-IN",
	converterOptions: {
		currency: true,
		ignoreDecimal: false,
		ignoreZeroCurrency: false,
		doNotAddOnly: false,
	},
});

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<Button
			className="w-full bg-blue-600 hover:bg-blue-700 font-semibold"
			type="submit"
			disabled={pending}
		>
			{pending ? "Adding Donor..." : "+ Add Donor"}
		</Button>
	);
}

export function AddDonorForm({
	defaultValues,
}: {
	defaultValues?: {
		fullName: string;
		email: string;
		whatsappNumber: string;
		occupation: string;
	};
} = {}) {
	const [state, formAction] = useActionState(createDonor, undefined);
	const [paymentMode, setPaymentMode] = useState<string>("");
	const [success, setSuccess] = useState(false);
	
	const [amountStr, setAmountStr] = useState<string>("");
	const [amountWords, setAmountWords] = useState<string>("");

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value.replace(/\D/g, "");
		if (!rawValue) {
			setAmountStr("");
			setAmountWords("");
			return;
		}

		const num = parseInt(rawValue, 10);
		setAmountStr(num.toLocaleString("en-IN"));
		try {
			setAmountWords(toWords.convert(num));
		} catch {
			setAmountWords("");
		}
	};

	useEffect(() => {
		if (state?.success) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setSuccess(true);
			setPaymentMode("");
			setAmountStr("");
			setAmountWords("");
		} else if (state && !state.success) {
			setSuccess(false);
		}
	}, [state]);

	if (success) {
		return (
			<div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center space-y-4">
				<div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
					<span className="text-green-600 text-2xl font-bold">✓</span>
				</div>
				<h3 className="text-xl font-bold tracking-tight text-slate-900">
					Donor added successfully
				</h3>
				<p className="text-sm text-slate-500 mb-6">{state?.message}</p>
				<Button
					onClick={() => setSuccess(false)}
					variant="outline"
					className="w-full font-medium"
				>
					Add Another Donor
				</Button>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
			<div className="p-6 border-b border-slate-100 flex gap-4 items-center">
				<div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
					<UserPlus className="w-6 h-6 text-blue-600" />
				</div>
				<div>
					<h2 className="text-lg font-bold text-slate-900">Add New Donor</h2>
					<p className="text-sm text-slate-500">
						Enter details to create a new donor record.
					</p>
				</div>
			</div>
			<div className="p-6">
				<form action={formAction} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="fullName" className="font-semibold text-slate-700">
							Full Name <span className="text-red-500">*</span>
						</Label>
						<div className="relative">
							<User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
							<Input
								id="fullName"
								name="fullName"
								required
								minLength={2}
								maxLength={100}
								placeholder="Enter full name"
								className="pl-10"
								defaultValue={defaultValues?.fullName}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email" className="font-semibold text-slate-700">
							Email ID <span className="text-red-500">*</span>
						</Label>
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
							<Input
								id="email"
								name="email"
								type="email"
								required
								placeholder="Enter email address"
								className="pl-10"
								defaultValue={defaultValues?.email}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label
							htmlFor="whatsappNumber"
							className="font-semibold text-slate-700"
						>
							WhatsApp Number
						</Label>
						<div className="relative">
							<Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
							<Input
								id="whatsappNumber"
								name="whatsappNumber"
								type="tel"
								required
								pattern="[0-9]{10}"
								maxLength={10}
								minLength={10}
								title="Phone number must be exactly 10 digits"
								placeholder="e.g. 9876543210"
								className="pl-10"
								defaultValue={defaultValues?.whatsappNumber}
								onInput={(e) => {
									e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').slice(0, 10);
								}}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label
							htmlFor="occupation"
							className="font-semibold text-slate-700"
						>
							Occupation
						</Label>
						<div className="relative">
							<Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
							<Input
								id="occupation"
								name="occupation"
								required
								placeholder="Enter occupation"
								className="pl-10"
								defaultValue={defaultValues?.occupation}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="amount_display" className="font-semibold text-slate-700">
							Amount (₹) <span className="text-red-500">*</span>
						</Label>
						<div className="relative">
							<IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
							<input type="hidden" name="amount" value={amountStr.replace(/,/g, "")} />
							<Input
								id="amount_display"
								type="text"
								required
								value={amountStr}
								onChange={handleAmountChange}
								placeholder="Enter donation amount"
								className="pl-10 font-medium"
							/>
						</div>
						{amountWords && (
							<p className="text-xs text-emerald-600 font-semibold px-1 mt-1">
								{amountWords}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label
							htmlFor="paymentMode"
							className="font-semibold text-slate-700"
						>
							Payment Mode <span className="text-red-500">*</span>
						</Label>
						<div className="relative">
							<CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
							<input type="hidden" name="paymentMode" value={paymentMode} />
							<Select
								required
								onValueChange={(val) => setPaymentMode(val || "")}
								value={paymentMode}
							>
								<SelectTrigger className="pl-10">
									<SelectValue placeholder="Select payment mode" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Cash">Cash</SelectItem>
									<SelectItem value="UPI">UPI</SelectItem>
									<SelectItem value="PhonePe">PhonePe</SelectItem>
									<SelectItem value="Google Pay">Google Pay</SelectItem>
									<SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
									<SelectItem value="Cheque">Cheque</SelectItem>
									<SelectItem value="Other">Other</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{paymentMode === "Other" && (
						<div className="space-y-2">
							<Label
								htmlFor="otherPaymentMode"
								className="font-semibold text-slate-700"
							>
								Specify Payment Mode <span className="text-red-500">*</span>
							</Label>
							<Input
								id="otherPaymentMode"
								name="otherPaymentMode"
								required
								placeholder="Enter custom payment mode"
							/>
						</div>
					)}

					{state?.error && (
						<div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">
							{state.error}
						</div>
					)}

					<div className="pt-2">
						<SubmitButton />
					</div>
				</form>
			</div>
		</div>
	);
}
