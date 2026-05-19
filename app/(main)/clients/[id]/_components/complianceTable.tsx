"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Eye,
  FileText,
  CalendarDays,
  MoreHorizontal,
  Trash2,
  Edit3,
  MoreVertical,
  Bell,
  Send,
  PauseCircle,
  PlayCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import ComplianceStatusBadge from "./ComplianceStatusBadge";
import { useDeleteCompliance } from "@/lib/hooks/api/compliance/useCompliance";
import DeleteModal from "@/components/common/modal/delete-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilingConfirmationModal } from "../_components/modal/FilingConfirmationModal";
import { useFileFilingConfirmation } from "@/lib/hooks/api/useClients";

type ReminderStatusOption = "ACTIVE" | "PAUSED";

interface ComplianceItem {
  id: string;
  type: string;
  period: string;
  status: string;
  frequency: string;
  dueDate: string;
  isRemindersPaused: boolean;
}

interface ComplianceTableProps {
  data: ComplianceItem[];
  onView?: (complianceItemId: string, row: ComplianceItem) => void;
  onEdit?: (complianceItemId: string, row: ComplianceItem) => void;
  onRefresh?: () => void | Promise<void>;
  onToggleReminder?: (complianceItemId: string, row: ComplianceItem) => void;
  onStatusChange?: (
    complianceItemId: string,
    status: ReminderStatusOption,
    row: ComplianceItem,
  ) => void;
  onSendManually?: (complianceItemId: string, row: ComplianceItem) => void;
}

export const ComplianceTable: React.FC<ComplianceTableProps> = ({
  data,
  onView,
  onEdit,
  onRefresh,
  onToggleReminder,
  onStatusChange,
  onSendManually,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFilingId, setSelectedFilingId] = useState<string | null>(null);

  const { mutate: deleteCompliance, isPending: loading } =
    useDeleteCompliance();

  const [isFilingConfirmOpen, setIsFilingConfirmOpen] = useState(false);
  const [selectedFilingItem, setSelectedFilingItem] =
    useState<ComplianceItem | null>(null);

  const { mutate: filingConfirmation, isPending: isFilingConfirmationLoading } =
    useFileFilingConfirmation();

  const handleFilingConfirmation = (acknowledgmentNumber?: string) => {
    if (!selectedFilingItem?.id) return;

    const payload: {
      status: "COMPLETED";
      acknowledgmentNumber?: string;
    } = {
      status: "COMPLETED",
    };

    if (acknowledgmentNumber) {
      payload.acknowledgmentNumber = acknowledgmentNumber;
    }

    filingConfirmation(
      {
        id: selectedFilingItem.id,
        payload,
      },
      {
        onSuccess: async () => {
          setIsFilingConfirmOpen(false);
          setSelectedFilingItem(null);
          await onRefresh?.();
        },
      },
    );
  };

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-linear-to-r from-slate-50 to-slate-100/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Reminder Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-white/50 divide-y divide-slate-200/60">
              {data?.length ? (
                data.map((item, index) => (
                  <tr
                    key={`${item.id}-${index}`}
                    className="hover:bg-slate-50/80 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border">
                        <p className="text-xs capitalize mt-1">
                          {item.type?.replaceAll("_", " ") || "N/A"}
                        </p>
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.period}
                    </td>

                    <td className="px-6 py-4 max-w-70">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {item.frequency.replace("_", " ").toLowerCase()}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CalendarDays className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-gray-400">
                          {formatDate(item.dueDate)}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <ComplianceStatusBadge status={item.status} />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Select
                          value={item.isRemindersPaused ? "PAUSED" : "ACTIVE"}
                          onValueChange={(value) =>
                            onStatusChange?.(
                              item.id,
                              value as "ACTIVE" | "PAUSED",
                              item,
                            )
                          }
                        >
                          <SelectTrigger
                            className={`h-10 rounded-xl border px-3 text-sm font-medium shadow-none ${
                              item.isRemindersPaused === false
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-amber-200 bg-amber-50 text-amber-700"
                            }`}
                          >
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>

                          <SelectContent className="rounded-xl border border-slate-200 shadow-lg">
                            <SelectItem value="ACTIVE">
                              <div className="flex items-center gap-2">
                                <PlayCircle className="h-4 w-4 text-emerald-600" />
                                <span>Active</span>
                              </div>
                            </SelectItem>

                            <SelectItem value="PAUSED">
                              <div className="flex items-center gap-2">
                                <PauseCircle className="h-4 w-4 text-amber-600" />
                                <span>Paused</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          onClick={() => onView?.(item.id, item)}
                          variant="ghost"
                          size="sm"
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        <Button
                          onClick={() => onEdit?.(item.id, item)}
                          variant="ghost"
                          size="sm"
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                          title="Edit Compliance"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all duration-200"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => onToggleReminder?.(item.id, item)}
                              className="cursor-pointer"
                            >
                              <Bell className="w-4 h-4 mr-2" />
                              Toggle Reminder
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => onSendManually?.(item.id, item)}
                              className="cursor-pointer"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Send manually
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedFilingItem(item);
                                setIsFilingConfirmOpen(true);
                              }}
                              className="cursor-pointer"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Filing Confirmation
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => {
                                setIsDeleteModalOpen(true);
                                setSelectedFilingId(item.id);
                              }}
                              className="cursor-pointer text-error! hover:bg-error-light"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      <FileText className="w-8 h-8 text-slate-300" />
                      <p className="text-sm font-medium">
                        No message logs found
                      </p>
                      <p className="text-xs text-slate-400">
                        Logs will appear here once reminders are sent
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-4 px-2">
        {data?.length ? (
          data.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg shadow-slate-200/50 border border-white/60"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-xs capitalize mt-1">
                    {item.type?.replaceAll("_", " ") || "N/A"}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => onView?.(item.id, item)}
                      className="cursor-pointer"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => onEdit?.(item.id, item)}
                      className="cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Compliance
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => onToggleReminder?.(item.id, item)}
                      className="cursor-pointer"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Toggle Reminder
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => onSendManually?.(item.id, item)}
                      className="cursor-pointer"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send manually
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedFilingItem(item);
                        setIsFilingConfirmOpen(true);
                      }}
                      className="cursor-pointer"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Filing Confirmation
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => {
                        setIsDeleteModalOpen(true);
                        setSelectedFilingId(item.id);
                      }}
                      className="cursor-pointer text-error! hover:bg-error-light"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2 text-sm text-slate-700">
                  {item.period}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CalendarDays className="w-4 h-4 text-slate-400" />
                    <span>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {item.frequency.replace("_", " ").toLowerCase()}
                      </Badge>
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium">
                    <ComplianceStatusBadge status={item.status} />
                  </span>
                </div>

                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 overflow-hidden wrap-break-word">
                  {formatDate(item.dueDate)}
                </div>

                <div className="w-full">
                  <Select
                    value={item.isRemindersPaused ? "PAUSED" : "ACTIVE"}
                    onValueChange={(value) =>
                      onStatusChange?.(
                        item.id,
                        value as "ACTIVE" | "PAUSED",
                        item,
                      )
                    }
                  >
                    <SelectTrigger
                      className={`h-10 rounded-xl border px-3 text-sm font-medium shadow-none w-full ${
                        item.isRemindersPaused === false
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>

                    <SelectContent className="rounded-xl border border-slate-200 shadow-lg w-full">
                      <SelectItem value="ACTIVE">
                        <div className="flex items-center gap-2">
                          <PlayCircle className="h-4 w-4 text-emerald-600" />
                          <span>Active</span>
                        </div>
                      </SelectItem>

                      <SelectItem value="PAUSED">
                        <div className="flex items-center gap-2">
                          <PauseCircle className="h-4 w-4 text-amber-600" />
                          <span>Paused</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-white/60 text-center">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">
              No ComplianceItems found
            </p>
          </div>
        )}

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
              onSuccess: async () => {
                setIsDeleteModalOpen(false);
                setSelectedFilingId(null);
                await onRefresh?.();
              },
            });
          }}
        >
          Are you sure you want to delete this Compliance Filing?
        </DeleteModal>

        <FilingConfirmationModal
          open={isFilingConfirmOpen}
          onClose={() => {
            setIsFilingConfirmOpen(false);
            setSelectedFilingItem(null);
          }}
          onConfirm={handleFilingConfirmation}
          loading={isFilingConfirmationLoading}
          item={
            selectedFilingItem
              ? {
                  id: selectedFilingItem.id,
                  type: selectedFilingItem.type,
                  period: selectedFilingItem.period,
                  dueDate: formatDate(selectedFilingItem.dueDate),
                }
              : null
          }
        />
      </div>
    </div>
  );
};
