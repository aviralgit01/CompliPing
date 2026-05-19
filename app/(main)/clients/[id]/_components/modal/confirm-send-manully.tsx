"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TriangleAlert, Send, ShieldCheck } from "lucide-react";

interface ConfirmSendManualModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  canConfirm: boolean;
  reason?: string;
  clientStatus: "ACTIVE" | "PAUSED";
  complianceStatus: "ACTIVE" | "PAUSED";
  complianceTitle?: string;
}

export const ConfirmSendManualModal: React.FC<ConfirmSendManualModalProps> = ({
  open,
  onClose,
  onConfirm,
  loading = false,
  canConfirm,
  reason,
  clientStatus,
  complianceStatus,
  complianceTitle,
}) => {
  const isBlocked = !canConfirm;

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl border border-slate-200 p-0 overflow-hidden">
        <div className="bg-linear-to-r from-slate-50 via-white to-slate-50 px-6 pt-6 pb-4 border-b border-slate-100">
          <DialogHeader>
            <div
              className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${
                isBlocked ? "bg-amber-100" : "bg-emerald-100"
              }`}
            >
              {isBlocked ? (
                <TriangleAlert className="h-6 w-6 text-amber-600" />
              ) : (
                <Send className="h-6 w-6 text-emerald-600" />
              )}
            </div>

            <DialogTitle className="text-center text-xl font-bold text-slate-900">
              {isBlocked ? "Manual send blocked" : "Send manual reminder?"}
            </DialogTitle>

            <DialogDescription className="text-center text-sm text-slate-600">
              {isBlocked
                ? reason || "Manual reminder cannot be sent right now."
                : `This will send a manual reminder${
                    complianceTitle ? ` for ${complianceTitle}` : ""
                  }.`}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-slate-500" />
              <p className="text-sm font-semibold text-slate-900">
                Reminder status check
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="text-slate-500">Client reminder</span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    clientStatus === "PAUSED"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {clientStatus === "PAUSED" ? "Paused" : "Active"}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <span className="text-slate-500">Compliance reminder</span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    complianceStatus === "PAUSED"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {complianceStatus === "PAUSED" ? "Paused" : "Active"}
                </span>
              </div>

              {complianceTitle && (
                <div className="flex items-start justify-between gap-3">
                  <span className="text-slate-500">Task</span>
                  <span className="font-medium text-slate-900 text-right">
                    {complianceTitle.replaceAll("_", " ")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {isBlocked ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              {reason}
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              Both reminder states are active. You can continue.
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              className="flex-1"
              onClick={onConfirm}
              disabled={loading || !canConfirm}
            >
              {loading ? "Sending..." : "Confirm send"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
