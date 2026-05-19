"use client";
import { FilingsByDate } from "./types";
import { cn } from "@/lib/utils";
import {
  MoreVertical,
  AlertTriangle,
  CalendarDays,
  FileText,
  CalendarX,
  CheckCircle,
  XCircle,
  Eye,
  Edit3,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ComplianceStatus } from "@/lib/generated/prisma";
import { Filing } from "@/lib/api/compliance/compliance.types";
import DeleteModal from "@/components/common/modal/delete-modal";
import { useState } from "react";
import { deleteComplianceApi } from "@/lib/api/compliance/compliance";
import { useDeleteCompliance } from "@/lib/hooks/api/compliance/useCompliance";

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function parseDateLabel(dateKey: string): string {
  const [, m, d] = dateKey.split("-");
  return `${SHORT_MONTHS[parseInt(m) - 1]} ${parseInt(d)}`;
}

const STATUS_CONFIG: Record<
  ComplianceStatus,
  {
    tag: string;
    badgeClass: string;
    iconBg: string;
    Icon: React.ElementType;
    iconColor: string;
  }
> = {
  OVERDUE: {
    tag: "OVERDUE • ACTION REQUIRED",
    badgeClass: "bg-red-100 text-red-700",
    iconBg: "bg-red-500/10",
    Icon: AlertTriangle,
    iconColor: "text-red-500",
  },

  PENDING: {
    tag: "UPCOMING • PENDING",
    badgeClass: "bg-yellow-100 text-yellow-700",
    iconBg: "bg-yellow-500/10",
    Icon: CalendarDays,
    iconColor: "text-yellow-500",
  },

  COMPLETED: {
    tag: "COMPLETED",
    badgeClass: "bg-green-100 text-green-700",
    iconBg: "bg-green-500/10",
    Icon: CheckCircle,
    iconColor: "text-green-500",
  },

  CANCELLED: {
    tag: "CANCELLED",
    badgeClass: "bg-gray-100 text-gray-600",
    iconBg: "bg-gray-400/10",
    Icon: XCircle,
    iconColor: "text-gray-500",
  },
};

interface AgendaItemProps {
  filing: Filing;
}

function AgendaItem({ filing }: AgendaItemProps) {
  const cfg = STATUS_CONFIG[filing.status];
  const { Icon } = cfg;
  const scheduleLabel = filing.type === "planned" ? "Schedule" : "Deadline";
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFilingId, setSelectedFilingId] = useState<string | null>(null);
  const { mutate: deleteCompliance, isPending: loading } =
    useDeleteCompliance();
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-border/60 last:border-0 last:pb-0">
      <DeleteModal
        headerText="Delete Compliance Filing"
        isOpen={isDeleteModalOpen}
        loading={loading}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedFilingId(null);
        }}
        onConfirm={() => {
          if (!selectedFilingId) return;

          deleteCompliance(selectedFilingId, {
            onSuccess: () => {
              setIsDeleteModalOpen(false);
              setSelectedFilingId(null);
            },
          });
        }}
      >
        Are you sure you want to delete this Compliance Filing?
      </DeleteModal>
      {/* Icon */}
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
          cfg.iconBg,
        )}
      >
        <Icon className={cn("w-4 h-4", cfg.iconColor)} />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <p
          className={cn("text-[10px] font-semibold tracking-wide mb-0.5", {
            "text-red-500": filing.type === "overdue",
            "text-amber-500": filing.type === "due",
            "text-gray-400": filing.type === "planned",
          })}
        >
          {cfg.tag}
        </p>
        <p className="text-[14px] font-medium text-foreground leading-tight">
          {filing?.client?.name}
        </p>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          {filing.frequency}
        </p>
      </div>

      {/* Right */}
      <div className="text-right shrink-0">
        <p className="text-[10px] text-muted-foreground mb-0.5">
          {scheduleLabel}
        </p>
        <p className="text-[12px] font-medium text-foreground mb-1">
          {new Date(filing.dueDate).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
        <span
          className={cn(
            "inline-block px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide",
            cfg.badgeClass,
          )}
        >
          {filing.status ?? cfg.tag}
        </span>
      </div>

      {/* Kebab */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 cursor-pointer text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all duration-200"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => {
              router.push(`compliance/${filing.id}`);
            }}
            className="cursor-pointer"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              router.push(`compliance/edit/${filing.id}`);
            }}
            className="cursor-pointer"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setIsDeleteModalOpen(true);
              setSelectedFilingId(filing.id);
            }}
            className="cursor-pointer text-error! hover:bg-error-light"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

interface DailyAgendaProps {
  selectedDate: string;
  filings: FilingsByDate;
}

export function DailyAgenda({ selectedDate, filings }: DailyAgendaProps) {
  const items = filings[selectedDate] ?? [];
  const label = parseDateLabel(selectedDate);
  const navigate = useRouter();

  return (
    <div className="px-5 py-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[15px] font-medium text-foreground">
          Daily Agenda: {label}
        </h3>
        <Button
          size="sm"
          className="text-white text-[12px] h-8 rounded-lg gap-1.5 bg-brand-primary/80 hover:bg-brand-primary/90"
          onClick={() =>
            navigate.push(`/compliance/create?date=${selectedDate}`)
          }
        >
          + New Filing
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col w-full items-center justify-center py-2 text-center">
          <CalendarX className="h-8 w-8 mb-2 opacity-80 text-purple-700" />

          <p className="text-[13px] text-muted-foreground">
            No filings scheduled for this day.
          </p>
        </div>
      ) : (
        items.map((filing) => <AgendaItem key={filing.id} filing={filing} />)
      )}
    </div>
  );
}
