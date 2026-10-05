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
	MapPin,
	Home,
	Target,
	Calendar as CalendarIcon,
	History,
	MessageSquare,
	RefreshCw,
} from "lucide-react";
import { ToWords } from "to-words";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
		placeOfLiving?: string;
		nativePlace?: string;
		towards?: string;
		donationType?: string;
		followingShivashakthiSince?: string;
		comments?: string;
	};
} = {}) {
	const [state, formAction] = useActionState(createDonor, undefined);
	const [paymentMode, setPaymentMode] = useState<string>("");
	const [donationType, setDonationType] = useState<string>(defaultValues?.donationType || "");
	const [success, setSuccess] = useState(false);
	
	const [amountStr, setAmountStr] = useState<string>("");
	const [amountWords, setAmountWords] = useState<string>("");
	const [donationDateVal, setDonationDateVal] = useState<Date>(new Date());

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
			setDonationType("");
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
				<form action={formAction} className="space-y-6">
					<div className="grid grid-cols-2 gap-3">
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
							className="font-semibold text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis"
						>
							WhatsApp No.
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
							htmlFor="placeOfLiving"
							className="font-semibold text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis"
						>
							Current City
						</Label>
						<div className="relative">
							<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
							<Input
								id="placeOfLiving"
								name="placeOfLiving"
								placeholder="Enter place of living"
								className="pl-10"
								defaultValue={defaultValues?.placeOfLiving}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label
							htmlFor="nativePlace"
							className="font-semibold text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis"
						>
							Native City
						</Label>
						<div className="relative">
							<Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
							<Input
								id="nativePlace"
								name="nativePlace"
								placeholder="Enter native place"
								className="pl-10"
								defaultValue={defaultValues?.nativePlace}
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
						<Label htmlFor="donationDate" className="font-semibold text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis">
							Date <span className="text-red-500">*</span>
						</Label>
						<div className="relative">
							<input type="hidden" name="donationDate" value={format(donationDateVal, "yyyy-MM-dd")} />
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant={"outline"}
										className={cn(
											"w-full justify-start text-left font-normal pl-10 h-10 border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
											!donationDateVal && "text-muted-foreground"
										)}
									>
										<CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
										{donationDateVal ? format(donationDateVal, "dd/MM/yyyy") : <span>Pick a date</span>}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar
										mode="single"
										selected={donationDateVal}
										onSelect={(date) => date && setDonationDateVal(date)}
										initialFocus
										captionLayout="dropdown"
										fromYear={2000}
										toYear={2050}
									/>
								</PopoverContent>
							</Popover>
						</div>
					</div>

					<div className="space-y-2">
						<Label
							htmlFor="paymentMode"
							className="font-semibold text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis"
						>
							Pay Mode <span className="text-red-500">*</span>
						</Label>
						<div className="relative">
							<CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
							<input type="hidden" name="paymentMode" value={paymentMode} />
							<Select
								required
								onValueChange={(val) => setPaymentMode(val || "")}
								value={paymentMode}
							>
								<SelectTrigger className="pl-10 [&>span]:truncate [&>span]:max-w-[70px] sm:[&>span]:max-w-full">
									<SelectValue placeholder="Select mode" />
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

					<div className="space-y-2">
						<Label
							htmlFor="towards"
							className="font-semibold text-slate-700"
						>
							Towards
						</Label>
						<div className="relative">
							<Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
							<Input
								id="towards"
								name="towards"
								placeholder="Purpose of donation"
								className="pl-10"
								defaultValue={defaultValues?.towards}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label
							htmlFor="donationType"
							className="font-semibold text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis"
						>
							Frequency
						</Label>
						<div className="relative">
							<RefreshCw className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
							<input type="hidden" name="donationType" value={donationType} />
							<Select
								onValueChange={(val) => setDonationType(val || "")}
								value={donationType}
							>
								<SelectTrigger className="pl-10 [&>span]:truncate [&>span]:max-w-[70px] sm:[&>span]:max-w-full">
									<SelectValue placeholder="Select type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Monthly">Monthly</SelectItem>
									<SelectItem value="Quarterly">Quarterly</SelectItem>
									<SelectItem value="Yearly">Yearly</SelectItem>
									<SelectItem value="Occasional">Occasional</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label
							htmlFor="followingShivashakthiSince"
							className="font-semibold text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis"
						>
							Following Since
						</Label>
						<div className="relative">
							<History className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
							<Input
								id="followingShivashakthiSince"
								name="followingShivashakthiSince"
								placeholder="e.g. 2010"
								className="pl-10"
								defaultValue={defaultValues?.followingShivashakthiSince}
							/>
						</div>
					</div>

					<div className="space-y-2 col-span-2">
						<Label
							htmlFor="comments"
							className="font-semibold text-slate-700"
						>
							Comments
						</Label>
						<div className="relative">
							<MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
							<textarea
								id="comments"
								name="comments"
								placeholder="Any additional comments..."
								className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
								defaultValue={defaultValues?.comments}
							/>
						</div>
					</div>
					</div>

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
