"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/common/table-pagination";
import {
  Eye,
  AlertCircle,
  BadgeCheck,
  Clock3,
  CircleX,
  FileText,
  CalendarDays,
  MessageSquareWarning,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageLogDetailsModal } from "./modal/message-log-details";

interface MessageLog {
  id: string;
  type: "1_DAY" | "3_DAY" | "7_DAY" | "30_DAY" | string;
  content: string;
  status: "READ" | "DELIVERED" | "FAILED" | "SENT" | string;
  date: string;
  taskType: string;
  errorMessage: string | null;
}

interface MessageLogsTableProps {
  data: MessageLog[];
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  totalPages?: number;
  totalCount?: number;
  onView?: (log: MessageLog) => void;
  clientName?: string;
  isTogglingReminder?: boolean;
  isClientReminderPaused?: boolean;
}

export const MessageLogsTable: React.FC<MessageLogsTableProps> = ({
  data,
  currentPage = 1,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  totalPages = 1,
  totalCount = 0,
  onView,
  clientName,
  isClientReminderPaused = false,
}) => {
  const [selectedLog, setSelectedLog] = useState<MessageLog | null>(null);

  const getStatusColor = (status: string) => {
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
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "READ":
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

  const getReminderTypeColor = (type: string) => {
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

  const handleLimitChange = (newLimit: string) => {
    onItemsPerPageChange?.(parseInt(newLimit, 10));
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-linear-to-r from-slate-50 to-slate-100/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Task Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Reminder Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Error
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-white/50 divide-y divide-slate-200/60">
              {data?.length ? (
                data.map((log, index) => (
                  <tr
                    key={`${log.id}-${index}`}
                    className="hover:bg-slate-50/80 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700 capitalize">
                        {log.taskType?.replaceAll("_", " ") || "N/A"}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getReminderTypeColor(
                          log.type,
                        )}`}
                      >
                        {formatTypeLabel(log.type)}
                      </span>
                    </td>

                    <td className="px-6 py-4 max-w-70">
                      <div
                        className="text-sm text-slate-700 truncate"
                        title={log.content}
                      >
                        {log.content || "N/A"}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          log.status,
                        )}`}
                      >
                        {getStatusIcon(log.status)}
                        {log.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CalendarDays className="w-4 h-4 text-slate-400" />
                        {log.date || "N/A"}
                      </div>
                    </td>

                    <td className="px-6 py-4 max-w-50">
                      {log.errorMessage ? (
                        <div
                          className="text-xs text-rose-600 truncate"
                          title={log.errorMessage}
                        >
                          {log.errorMessage}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedLog(log);
                              onView?.(log);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          limit={itemsPerPage}
          onPageChange={onPageChange || (() => {})}
          onLimitChange={handleLimitChange}
        />
      </div>

      <div className="md:hidden space-y-4 px-2">
        {data?.length ? (
          data.map((log, index) => (
            <div
              key={`${log.id}-${index}`}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg shadow-slate-200/50 border border-white/60"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-xs text-slate-500 capitalize mt-1">
                    {log.taskType?.replaceAll("_", " ") || "N/A"}
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

                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedLog(log);
                        onView?.(log);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2 text-sm text-slate-700">
                  <MessageSquareWarning className="w-4 h-4 mt-0.5 text-slate-400" />
                  <span>{log.content || "N/A"}</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getReminderTypeColor(
                      log.type,
                    )}`}
                  >
                    {formatTypeLabel(log.type)}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      log.status,
                    )}`}
                  >
                    {getStatusIcon(log.status)}
                    {log.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CalendarDays className="w-4 h-4 text-slate-400" />
                  <span>{log.date || "N/A"}</span>
                </div>

                {log.errorMessage && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 overflow-hidden wrap-break-word">
                    {log.errorMessage}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-white/60 text-center">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">
              No message logs found
            </p>
          </div>
        )}

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-white/60">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            limit={itemsPerPage}
            onPageChange={onPageChange || (() => {})}
            onLimitChange={handleLimitChange}
          />
        </div>
      </div>

      <MessageLogDetailsModal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        log={selectedLog}
        clientName={clientName}
        isClientPaused={isClientReminderPaused}
      />
    </div>
  );
};
