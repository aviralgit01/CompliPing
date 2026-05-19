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
import { TriangleAlert, ToggleLeft, ToggleRight } from "lucide-react";

interface ReminderConfirmLog {
  id?: string;
  type?: "1_DAY" | "3_DAY" | "7_DAY" | "30_DAY" | string;
  content?: string;
  status?: "READ" | "DELIVERED" | "FAILED" | "SENT" | string;
  date?: string;
  taskType?: string;
  errorMessage?: string | null;
  isReminderEnabled?: boolean;
  title?: string;
  targetType?: "CLIENT" | "TASK" | string;
}

interface ReminderConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: "pause" | "resume";
  log: ReminderConfirmLog | null;
  loading?: boolean;
}

export const ReminderConfirmModal: React.FC<ReminderConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  action,
  log,
  loading = false,
}) => {
  const isPause = action === "pause";
  const isClient = log?.targetType === "CLIENT";

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <TriangleAlert className="h-6 w-6 text-amber-600" />
          </div>

          <DialogTitle className="text-center text-xl font-bold text-slate-900">
            {isPause ? "Pause reminder?" : "Resume reminder?"}
          </DialogTitle>

          <DialogDescription className="text-center text-sm text-slate-600">
            {isClient
              ? isPause
                ? "This will pause reminder notifications for this client."
                : "This will resume reminder notifications for this client."
              : isPause
                ? "This will pause reminder notifications for this task."
                : "This will resume reminder notifications for this task."}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="space-y-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <span className="text-slate-500">Reminder target</span>
              <span className="font-medium text-slate-900 text-right">
                {isClient ? "Client" : "Compliance task"}
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="text-slate-500">
                {isClient ? "Client name" : "Task type"}
              </span>
              <span className="font-medium text-slate-900 text-right">
                {log?.title || log?.taskType?.replaceAll("_", " ") || "N/A"}
              </span>
            </div>

            {!isClient && (
              <div className="flex items-start justify-between gap-3">
                <span className="text-slate-500">Reminder type</span>
                <span className="font-medium text-slate-900 text-right">
                  {log?.type?.replaceAll("_", " ") || "N/A"}
                </span>
              </div>
            )}

            <div className="flex items-start justify-between gap-3">
              <span className="text-slate-500">Current mode</span>
              <span className="font-medium text-slate-900 text-right">
                {log?.isReminderEnabled ? "Paused" : "Active"}
              </span>
            </div>

            <div className="pt-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
                {isPause ? (
                  <>
                    <ToggleLeft className="h-4 w-4 text-amber-600" />
                    Change to paused
                  </>
                ) : (
                  <>
                    <ToggleRight className="h-4 w-4 text-emerald-600" />
                    Change to active
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button className="flex-1" onClick={onConfirm} disabled={loading}>
            {loading
              ? "Updating..."
              : isPause
                ? "Confirm pause"
                : "Confirm resume"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
