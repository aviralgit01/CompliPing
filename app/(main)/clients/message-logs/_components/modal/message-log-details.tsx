import React from "react";
import { DynamicModal } from "@/components/common/modal/modal";
import {
  BadgeCheck,
  CircleX,
  Clock3,
  AlertCircle,
  CalendarDays,
  FileText,
  MessageSquareWarning,
  Building2,
  Type,
  Shield,
  Info,
  BellRing,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ComplianceItem {
  label: string;
  value: string;
  isTaskPaused: boolean;
}

interface MessageLog {
  id: string;
  type: "1_DAY" | "3_DAY" | "7_DAY" | "30_DAY" | string;
  content: string;
  status: "READ" | "DELIVERED" | "FAILED" | "SENT" | string;
  date: string;
  taskType: string;
  errorMessage: string | null;
}

interface MessageLogDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  log?: MessageLog | null;
  loading?: boolean;
  clientName?: string;
  isTaskPaused?: boolean;
  isClientPaused?: boolean;
  complianceItems?: ComplianceItem[];
}

const getStatusColor = (status: string = "SENT") => {
  switch (status) {
    case "READ":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "DELIVERED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "FAILED":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "SENT":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

const getStatusIcon = (status: string = "SENT") => {
  switch (status) {
    case "READ":
      return <BadgeCheck className="w-3 h-3" />;
    case "DELIVERED":
      return <BadgeCheck className="w-3 h-3" />;
    case "FAILED":
      return <CircleX className="w-3 h-3" />;
    case "SENT":
      return <Clock3 className="w-3 h-3" />;
    default:
      return <AlertCircle className="w-3 h-3" />;
  }
};

const getReminderTypeColor = (type: string = "") => {
  switch (type) {
    case "1_DAY":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "3_DAY":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";
    case "7_DAY":
      return "bg-violet-50 text-violet-700 border-violet-200";
    case "30_DAY":
      return "bg-orange-50 text-orange-700 border-orange-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const formatTypeLabel = (type: string) => type.replaceAll("_", " ");

const InfoCard = ({
  icon,
  label,
  value,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  className?: string;
  istaskPaused?: boolean;
}) => (
  <div
    className={`rounded-xl border border-neutral-200/70 bg-neutral-50/60 p-4 ${className}`}
  >
    <div className="flex items-center gap-2 mb-2 text-neutral-500">
      {icon}
      <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
    </div>
    <div className="text-sm font-semibold text-neutral-900 wrap-break-words">
      {value}
    </div>
  </div>
);

export function MessageLogDetailsModal({
  isOpen,
  onClose,
  log,
  loading = false,
  clientName,
  isClientPaused = false,
}: MessageLogDetailsModalProps) {
  return (
    <DynamicModal
      header={{
        title: (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg">
              <FileText size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 font-montserrat">
                Message Log Details
              </h2>
              <p className="text-sm text-neutral-600">
                Full delivery and reminder information
              </p>
            </div>
          </div>
        ),
      }}
      isOpen={isOpen}
      onClose={onClose}
      loading={loading}
      className="max-w-4xl"
    >
      <div className="space-y-6 max-h-[80vh] pr-2">
        {loading ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        ) : log ? (
          <>
            <div className="bg-linear-to-r from-white via-brand-muted to-white rounded-2xl p-6 border border-neutral-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg">
                  <MessageSquareWarning size={20} className="text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                    {clientName || "Client"}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className="flex items-center gap-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getReminderTypeColor(log.type)}`}
                      >
                        {formatTypeLabel(log.type)}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(log.status)}`}
                      >
                        {getStatusIcon(log.status)}
                        {log.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border  border-slate-200 ${isClientPaused ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}
                      >
                        <BellRing className="w-3 h-3" />
                        {isClientPaused
                          ? "Client Reminder Paused"
                          : "Client Reminder Active"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-neutral-900 mb-4">
                Log Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  icon={<Building2 className="w-4 h-4" />}
                  label="Task Type"
                  value={log.taskType?.replaceAll("_", " ") || "N/A"}
                />
                <InfoCard
                  icon={<CalendarDays className="w-4 h-4" />}
                  label="Sent Date"
                  value={log.date || "N/A"}
                />
                <InfoCard
                  icon={<Type className="w-4 h-4" />}
                  label="Reminder Type"
                  value={formatTypeLabel(log.type)}
                />
                <InfoCard
                  icon={<Shield className="w-4 h-4" />}
                  label="Reminder Status"
                  value={log.status || "N/A"}
                />
              </div>
            </div>

            <InfoCard
              icon={<FileText className="w-4 h-4" />}
              label="Content"
              value={log.content || "N/A"}
            />

            {log.errorMessage && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                <div className="">
                  <div className="flex items-center justify-start gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <h5 className="text-sm font-semibold text-rose-900 mb-1">
                      Error Message
                    </h5>
                  </div>
                  <div>
                    <p className="text-sm text-rose-700 leading-6 overflow-hidden wrap-break-word">
                      {log.errorMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10">
            <Info className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-600">No log selected.</p>
          </div>
        )}
      </div>
    </DynamicModal>
  );
}
