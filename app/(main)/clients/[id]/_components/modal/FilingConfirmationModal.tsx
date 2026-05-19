"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, FileCheck } from "lucide-react";
import { CustomInput } from "@/components/customInput";

interface FilingConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (acknowledgmentNumber?: string) => void;
  loading?: boolean;
  item?: {
    id: string;
    type: string;
    period: string;
    dueDate: string;
  } | null;
}

export const FilingConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  loading = false,
  item,
}: FilingConfirmationModalProps) => {
  const [ackNumber, setAckNumber] = useState("");

  useEffect(() => {
    if (!open) {
      setAckNumber("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <FileCheck className="h-6 w-6 text-emerald-600" />
          </div>

          <DialogTitle className="text-center text-xl font-bold text-slate-900">
            Filing confirmation
          </DialogTitle>

          <DialogDescription className="text-center text-sm text-slate-600">
            Mark this compliance filing as completed. Acknowledgment number is
            optional.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">
                {item?.type?.replaceAll("_", " ") || "Compliance Item"}
              </p>
              <p className="text-xs text-slate-500">{item?.period || "-"}</p>
              <p className="text-xs text-slate-500">
                Due date: {item?.dueDate || "-"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Acknowledgment Number
            </label>
            <CustomInput
              value={ackNumber}
              onChange={(e) => setAckNumber(e.target.value)}
              placeholder="ACK-123456789"
              className="h-11 rounded-xl"
            />
            <p className="text-xs text-slate-500">
              You can leave this empty if acknowledgment number is not
              available.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            This action will update filing status to completed.
          </div>
        </div>

        <DialogFooter className="mt-2 flex gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <Button
            onClick={() => onConfirm(ackNumber.trim() || undefined)}
            disabled={loading}
            className="gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            {loading ? "Saving..." : "Confirm filing"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
