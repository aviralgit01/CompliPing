"use client";

import {
  useGetClientById,
  useToggleReminder,
  useSendReminderManually,
} from "@/lib/hooks/api/useClients";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Phone,
  MapPin,
  Mail,
  CalendarDays,
  MessageSquare,
  FileText,
  Download,
  AlertTriangle,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  BellRing,
} from "lucide-react";
import DocStatusBadge from "./_components/DocStatusBadge";
import { ClientDetailSkeleton } from "./_components/Clientdetailskeleton ";
import { useMemo, useState } from "react";
import { ReminderConfirmModal } from "./_components/modal/reminder_confirm";
import { ComplianceTable } from "./_components/complianceTable";
import { ConfirmSendManualModal } from "./_components/modal/confirm-send-manully";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ReminderTargetType = "CLIENT" | "TASK";
type ReminderStatusOption = "ACTIVE" | "PAUSED";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface PendingReminderState {
  targetId: string;
  targetType: ReminderTargetType;
  action: "pause" | "resume";
  log: {
    id?: string;
    type?: string;
    taskType?: string;
    title?: string;
    isReminderEnabled?: boolean;
    targetType?: ReminderTargetType;
  } | null;
}

const ClientDetailPage = () => {
  const params = useParams();
  const clientId = params?.id as string;
  const { data, isLoading, refetch } = useGetClientById(clientId);

  const client = data?.data;
  const router = useRouter();
  const now = new Date();

  const isClientReminderPaused = client?.isClientPaused || false;
  const complianceItems = client?.formattedComplianceItems || [];

  const [confirmState, setConfirmState] = useState<PendingReminderState | null>(
    null,
  );
  const [
    selectedComplianceIdForManualSend,
    setSelectedComplianceIdForManualSend,
  ] = useState<string | null>(null);
  const [isManualSendModalOpen, setIsManualSendModalOpen] = useState(false);

  const counts = {
    overdue: complianceItems.filter(
      (c: any) =>
        new Date(c.dueDate) < now &&
        c.status !== "COMPLETED" &&
        c.status !== "CANCELLED",
    ).length,
    pending: complianceItems.filter(
      (c: any) =>
        new Date(c.dueDate) >= now &&
        c.status !== "COMPLETED" &&
        c.status !== "CANCELLED",
    ).length,
    completed: complianceItems.filter((c: any) => c.status === "COMPLETED")
      .length,
    cancelled: complianceItems.filter((c: any) => c.status === "CANCELLED")
      .length,
  };

  const total = complianceItems.length;

  const { mutate: toggleReminder, isPending: isTogglingReminder } =
    useToggleReminder();

  const { mutate: sendReminderManually, isPending: isSendingReminder } =
    useSendReminderManually();

  const selectedComplianceItemForManualSend = useMemo(() => {
    return complianceItems.find(
      (item: any) => item.id === selectedComplianceIdForManualSend,
    );
  }, [complianceItems, selectedComplianceIdForManualSend]);

  const clientReminderStatus: ReminderStatusOption = isClientReminderPaused
    ? "PAUSED"
    : "ACTIVE";

  const selectedComplianceReminderStatus: ReminderStatusOption =
    selectedComplianceItemForManualSend?.isRemindersPaused
      ? "PAUSED"
      : "ACTIVE";

  const manualSendBlockedReason = isClientReminderPaused
    ? "Client reminder is paused, so manual reminder cannot be sent."
    : selectedComplianceItemForManualSend?.isRemindersPaused
      ? "This compliance reminder is paused, so manual reminder cannot be sent."
      : "";

  const canConfirmManualSend =
    !!selectedComplianceItemForManualSend &&
    !isClientReminderPaused &&
    !selectedComplianceItemForManualSend?.isRemindersPaused;

  const handleDownload = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const openReminderConfirm = (payload: PendingReminderState) => {
    if (!payload.targetId) return;
    setConfirmState(payload);
  };

  const closeReminderConfirm = () => {
    setConfirmState(null);
  };

  const handleConfirmReminderToggle = () => {
    if (!confirmState) return;

    const nextPausedState = confirmState.action === "pause";

    toggleReminder(
      {
        targetId: confirmState.targetId,
        targetType: confirmState.targetType,
        isPaused: nextPausedState,
      },
      {
        onSuccess: async () => {
          await refetch();
          closeReminderConfirm();
        },
        onError: async () => {
          await refetch();
          closeReminderConfirm();
        },
      },
    );
  };

  const handleClientReminderStatusChange = (value: ReminderStatusOption) => {
    const nextPausedState = value === "PAUSED";

    if (nextPausedState === !!client?.isClientPaused) return;

    openReminderConfirm({
      targetId: clientId,
      targetType: "CLIENT",
      action: nextPausedState ? "pause" : "resume",
      log: {
        id: clientId,
        title: client?.name,
        isReminderEnabled: !nextPausedState,
        targetType: "CLIENT",
      },
    });
  };

  const handleToggleComplianceReminder = (complianceItemId: string) => {
    const selectedItem = complianceItems.find(
      (item: any) => item.id === complianceItemId,
    );

    if (!selectedItem) return;

    const nextPausedState = !selectedItem.isRemindersPaused;

    openReminderConfirm({
      targetId: complianceItemId,
      targetType: "TASK",
      action: nextPausedState ? "pause" : "resume",
      log: {
        id: complianceItemId,
        type: "TASK",
        title: selectedItem.type,
        taskType: selectedItem.type,
        targetType: "TASK",
        isReminderEnabled: !nextPausedState,
      },
    });
  };

  const handleComplianceReminderStatusChange = (
    complianceItemId: string,
    status: ReminderStatusOption,
  ) => {
    const selectedItem = complianceItems.find(
      (item: any) => item.id === complianceItemId,
    );

    if (!selectedItem) return;

    const nextPausedState = status === "PAUSED";

    if (nextPausedState === selectedItem.isRemindersPaused) return;

    openReminderConfirm({
      targetId: complianceItemId,
      targetType: "TASK",
      action: nextPausedState ? "pause" : "resume",
      log: {
        id: complianceItemId,
        type: "TASK",
        title: selectedItem.type,
        taskType: selectedItem.type,
        targetType: "TASK",
        isReminderEnabled: !nextPausedState,
      },
    });
  };

  const handleSendManually = (complianceItemId: string) => {
    setSelectedComplianceIdForManualSend(complianceItemId);
    setIsManualSendModalOpen(true);
  };

  const handleConfirmManualSend = () => {
    if (!selectedComplianceItemForManualSend || !canConfirmManualSend) return;

    sendReminderManually(
      {
        complianceItemId: selectedComplianceItemForManualSend.id,
      },
      {
        onSuccess: async () => {
          await refetch();
          setIsManualSendModalOpen(false);
          setSelectedComplianceIdForManualSend(null);
        },
        onError: () => {
          setIsManualSendModalOpen(false);
          setSelectedComplianceIdForManualSend(null);
        },
      },
    );
  };

  const handleViewCompliance = (complianceItemId: string) => {
    router.push(`/compliance/${complianceItemId}`);
  };

  const handleEditCompliance = (complianceItemId: string) => {
    router.push(`/compliance/edit/${complianceItemId}`);
  };

  const handleRefresh = async () => {
    await refetch();
  };

  if (isLoading || !client) return <ClientDetailSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50/60 space-y-5 font-sans">
      <Card className="shadow-sm border border-gray-200 bg-white">
        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="w-20 h-20 rounded-xl border-2 border-gray-100 shrink-0">
            <AvatarImage src="/avatar-placeholder.jpg" alt={client.name} />
            <AvatarFallback className="rounded-xl text-xl font-bold bg-indigo-100 text-brand-primary">
              {client.name
                .split(" ")
                .map((n: any) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {client.name}
              </h1>
              {client.isPremium && (
                <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 text-xs font-semibold uppercase tracking-wide">
                  Premium Client
                </Badge>
              )}
            </div>

            <p className="text-sm text-gray-500 mb-3">{client.businessName}</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> {client.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> {client.state}, India
              </span>
              {client.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {client.email}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <Button
              className="bg-brand-primary hover:bg-indigo-700 text-white gap-2 text-sm"
              onClick={() => {
                router.push(`/compliance/create?clientId=${clientId}`);
              }}
            >
              <PlusCircle className="w-4 h-4" />
              Add Compliance
            </Button>

            <div className="min-w-70 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <BellRing className="h-4 w-4 text-violet-600" />
                        <p className="text-sm font-semibold text-slate-900">
                          Client reminder
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        Update reminder status
                      </p>
                    </div>

                    <div className="shrink-0">
                      <Select
                        value={clientReminderStatus}
                        onValueChange={(value: ReminderStatusOption) =>
                          handleClientReminderStatusChange(value)
                        }
                        disabled={isTogglingReminder || !clientId}
                      >
                        <SelectTrigger
                          className={`h-10 rounded-xl border px-3 text-sm font-medium shadow-none ${
                            clientReminderStatus === "ACTIVE"
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="rounded-xl border bg-card shadow-sm h-full flex flex-col">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold">
              Filing Status
            </CardTitle>
          </CardHeader>

          <CardContent className="px-4 pb-4 flex flex-col flex-1">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-red-500/10">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-sm flex-1">Overdue</span>
                <span className="text-xs font-semibold text-red-500">
                  {counts.overdue}
                </span>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-lg bg-yellow-500/10">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="text-sm flex-1">Pending</span>
                <span className="text-xs font-semibold text-yellow-500">
                  {counts.pending}
                </span>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-lg bg-green-500/10">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-sm flex-1">Completed</span>
                <span className="text-xs font-semibold text-green-500">
                  {counts.completed}
                </span>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-500/10">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-500" />
                <span className="text-sm flex-1">Cancelled</span>
                <span className="text-xs font-semibold text-gray-500">
                  {counts.cancelled}
                </span>
              </div>

              <div className="pt-2 border-t flex justify-between text-xs text-muted-foreground">
                <span>Total</span>
                <span className="font-semibold text-foreground">{total}</span>
              </div>
            </div>

            <div className="mt-auto pt-4">
              <Button
                variant="outline"
                className="w-full text-sm text-brand-primary hover:text-indigo-700 border-indigo-200 hover:bg-indigo-50 gap-1"
                onClick={() => {
                  router.push("/compliance");
                }}
              >
                View Full Calendar
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-gray-200 bg-white">
          <CardHeader className="pb-3 pt-5 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-800">
                WhatsApp Reminders
              </CardTitle>
              <MessageSquare className="w-4 h-4 text-green-500" />
            </div>
          </CardHeader>

          <CardContent className="px-5 pb-5 flex flex-col">
            {!client?.whatsappReminders?.lastActivity &&
            (!client?.whatsappReminders?.logs ||
              client.whatsappReminders.logs.length === 0) ? (
              <div className="flex flex-col items-center justify-center text-center py-10 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                </div>

                <p className="text-sm font-semibold text-gray-800">
                  No reminders yet
                </p>

                <p className="text-xs text-gray-500 mt-1 max-w-55">
                  No WhatsApp reminders have been sent or scheduled for this
                  client.
                </p>
              </div>
            ) : (
              <div className="space-y-4 flex flex-col flex-1">
                {client?.whatsappReminders?.lastActivity && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                      Recent Activity
                    </p>

                    <p className="text-sm font-medium text-gray-800">
                      {formatDate(client.whatsappReminders.lastActivity.sentAt)}
                    </p>

                    <p className="text-xs text-gray-400 mt-0.5">
                      Status:{" "}
                      <span className="text-green-600 font-medium">
                        {client.whatsappReminders.lastActivity.status}
                      </span>
                    </p>
                  </div>
                )}

                {client?.whatsappReminders?.logs?.length > 0 && (
                  <div className="space-y-3">
                    {client.whatsappReminders.logs.map((item: any) => (
                      <div key={item.id} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {item.message}
                          </p>

                          <div className="flex gap-1 items-center mt-0.5 text-[12px]">
                            <span className="text-xs text-gray-400">
                              {formatDate(item.sentAt)}
                            </span>
                            <span className="text-green-600">
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-auto pt-4">
                  <Button
                    variant="ghost"
                    className="w-full text-sm text-brand-primary hover:bg-indigo-50 gap-1 hover:text-indigo-700"
                    onClick={() => {
                      router.push(`/clients/message-logs?clientId=${clientId}`);
                    }}
                  >
                    View All Reminder Logs
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="shadow-sm border border-gray-200 bg-white lg:col-span-2">
          <CardHeader className="pb-3 pt-5 px-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <CardTitle className="text-base font-semibold text-gray-800">
                  Document Vault
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100">
                  <TableHead className="text-xs font-semibold text-gray-400 text-center uppercase tracking-wide w-32">
                    File Name
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 text-center uppercase tracking-wide">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 text-center uppercase tracking-wide">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {client.clientDocuments.map((doc: any) => (
                  <TableRow
                    key={doc.id}
                    className="border-gray-100 hover:bg-gray-50/50"
                  >
                    <TableCell className="text-sm text-center font-medium text-gray-700">
                      {doc.file_name}
                    </TableCell>
                    <TableCell className="text-center">
                      <DocStatusBadge status={doc.downloadUrl ? true : false} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-brand-primary hover:bg-indigo-50"
                        onClick={() =>
                          handleDownload(doc.downloadUrl, doc.file_name)
                        }
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {client.clientDocuments.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-sm text-gray-400"
                    >
                      No documents uploaded yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-md border border-gray-200 bg-white text-gray-900">
          <CardHeader className="pb-2 pt-5 px-5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <CardTitle className="text-base font-semibold text-gray-900">
                Action Required
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="px-5 pb-5">
            {!client?.actionRequired || client.actionRequired.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-10 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>

                <p className="text-sm font-semibold text-gray-900">
                  No action required
                </p>

                <p className="text-xs text-gray-500 mt-1 max-w-55">
                  Everything is up to date. You're not missing any compliance or
                  tasks.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {client.actionRequired.map((item: any, index: number) => {
                  const priorityColor =
                    item.priority === "HIGH"
                      ? "bg-red-100 text-red-600"
                      : item.priority === "MEDIUM"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600";

                  return (
                    <div
                      key={item.id}
                      className="flex gap-3 items-start bg-gray-50 rounded-lg p-3 border border-gray-100 hover:shadow-sm transition"
                    >
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-900 leading-tight">
                            {item.title}
                          </p>

                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${priorityColor}`}
                          >
                            {item.priority}
                          </span>
                        </div>

                        <p className="text-[11px] text-gray-400 mt-0.5 uppercase tracking-wide">
                          {item.type}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {item.description}
                        </p>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="mt-2 h-7 px-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 flex items-center gap-1"
                          onClick={() => {
                            if (item.ctaLink) {
                              router.push(item.ctaLink);
                            }
                          }}
                        >
                          {item.cta.replaceAll("_", " ")}
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border border-gray-200 bg-white">
        <CardHeader className="pb-3 pt-5 px-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-gray-500" />
              <CardTitle className="text-base font-semibold text-gray-800">
                Compliance Items
              </CardTitle>
            </div>
            <Button
              className="bg-brand-primary hover:bg-indigo-700 text-white gap-2 text-sm h-8 px-3"
              onClick={() => {
                router.push(`/compliance/create?clientId=${clientId}`);
              }}
            >
              <PlusCircle className="w-4 h-4" />
              Add Compliance
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-5">
          <ComplianceTable
            data={complianceItems}
            onView={(id) => handleViewCompliance(id)}
            onEdit={(id) => handleEditCompliance(id)}
            onRefresh={handleRefresh}
            onToggleReminder={(id) => handleToggleComplianceReminder(id)}
            onStatusChange={(id, status) =>
              handleComplianceReminderStatusChange(id, status)
            }
            onSendManually={(id) => handleSendManually(id)}
          />
        </CardContent>
      </Card>

      <ReminderConfirmModal
        open={!!confirmState}
        onClose={closeReminderConfirm}
        onConfirm={handleConfirmReminderToggle}
        action={confirmState?.action || "pause"}
        log={confirmState?.log || null}
        loading={isTogglingReminder}
      />

      <ConfirmSendManualModal
        open={isManualSendModalOpen}
        onClose={() => {
          setIsManualSendModalOpen(false);
          setSelectedComplianceIdForManualSend(null);
        }}
        onConfirm={handleConfirmManualSend}
        loading={isSendingReminder}
        canConfirm={canConfirmManualSend}
        reason={manualSendBlockedReason}
        clientStatus={clientReminderStatus}
        complianceStatus={selectedComplianceReminderStatus}
        complianceTitle={selectedComplianceItemForManualSend?.type}
      />
    </div>
  );
};

export default ClientDetailPage;
