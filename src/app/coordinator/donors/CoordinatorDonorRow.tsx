"use client";

import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddDonationModal } from "@/components/AddDonationModal";

export function CoordinatorDonorRow({ donor }: { donor: any }) {
  const [open, setOpen] = useState(false);

  const handleRowClick = (e: React.MouseEvent) => {
    // Prevent opening details if clicking on the Add Donation button/modal
    const target = e.target as Element;
    if (target.closest && target.closest('button, [role="dialog"]')) {
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <TableRow
        onClick={handleRowClick}
        className="hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <TableCell className="font-medium whitespace-nowrap text-slate-900">
          {donor.fullName}
        </TableCell>
        <TableCell className="whitespace-nowrap">
          <div className="text-sm text-slate-700">{donor.email}</div>
          <div className="text-xs text-slate-500">{donor.whatsappNumber}</div>
        </TableCell>
        <TableCell className="font-bold text-emerald-600 whitespace-nowrap">
          ₹{donor.amount.toLocaleString("en-IN")}
        </TableCell>
        <TableCell className="whitespace-nowrap text-slate-600">
          {donor.paymentMode}
        </TableCell>
        <TableCell className="text-sm text-slate-600 whitespace-nowrap">
          {new Date(donor.donationDate).toLocaleDateString("en-GB")}
        </TableCell>
        <TableCell className="text-right whitespace-nowrap">
          <AddDonationModal
            donor={{
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
        </TableCell>
      </TableRow>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Donor Details</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <DetailItem label="Full Name" value={donor.fullName} />
            <DetailItem label="Amount" value={`₹${donor.amount.toLocaleString("en-IN")}`} />
            <DetailItem label="Email" value={donor.email} />
            <DetailItem label="WhatsApp Number" value={donor.whatsappNumber} />
            <DetailItem label="Donation Date" value={new Date(donor.donationDate).toLocaleDateString("en-GB")} />
            <DetailItem label="Payment Mode" value={donor.paymentMode === "Other" ? `${donor.paymentMode} (${donor.otherPaymentMode})` : donor.paymentMode} />
            
            {donor.occupation && <DetailItem label="Occupation" value={donor.occupation} />}
            {donor.placeOfLiving && <DetailItem label="Place of Living" value={donor.placeOfLiving} />}
            {donor.nativePlace && <DetailItem label="Native Place" value={donor.nativePlace} />}
            {donor.towards && <DetailItem label="Towards" value={donor.towards} />}
            {donor.donationType && <DetailItem label="Donation Type" value={donor.donationType} />}
            {donor.followingShivashakthiSince && <DetailItem label="Following Since" value={donor.followingShivashakthiSince} />}
          </div>
          {donor.comments && (
            <div className="mt-4">
              <span className="text-xs text-slate-500 font-semibold block mb-1">Comments</span>
              <p className="text-sm text-slate-900 bg-slate-50 p-3 rounded-md border border-slate-100">{donor.comments}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <span className="text-xs text-slate-500 font-semibold block">{label}</span>
      <span className="text-sm text-slate-900 font-medium">{value}</span>
    </div>
  );
}
