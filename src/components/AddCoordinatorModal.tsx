"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AddCoordinatorForm } from "./AddCoordinatorForm";

export function AddCoordinatorModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="shadow-sm" />}>
        + Add Coordinator
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-0 border-none bg-transparent shadow-none">
        <AddCoordinatorForm />
      </DialogContent>
    </Dialog>
  );
}
