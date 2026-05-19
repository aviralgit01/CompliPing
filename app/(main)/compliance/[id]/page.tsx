// import React from "react";
// import { FilingHeader } from "./_components/FilingHeader";
// import { FilingMetaCards } from "./_components/FilingMetaCards";
// import { DocumentVault } from "./_components/DocumentVault";
// import { InternalAuditNotes } from "./_components/InternalAuditNotes";
// import { ClientCard } from "./_components/ClientCard";
// import { ItemLifecycle } from "./_components/ItemLifecycle";

// const FilingDetailPage = () => {
//   return (
//     <div className="filing-page">
//       {/* Breadcrumb */}
//       <nav className="breadcrumb">
//         <span>Clients</span>
//         <span className="sep">›</span>
//         <span>Being Human</span>
//         <span className="sep">›</span>
//         <span className="active">Filing Detail</span>
//       </nav>

//       {/* Status badge + ref */}
//       <div className="ref-row">
//         <span className="status-badge pending">{dummyData.status}</span>
//         <span className="ref-code">Ref: {dummyData.refCode}</span>
//       </div>

//       {/* Header */}
//       <FilingHeader
//         title="Corporate Income Tax"
//         dueDate={dummyData.dueDate}
//         frequency={dummyData.frequency}
//         isRemindersPaused={dummyData.isRemindersPaused}
//       />

//       {/* Main layout */}
//       <div className="main-layout">
//         {/* Left Column */}
//         <div className="left-col">
//           <FilingMetaCards
//             filingPeriod={dummyData.filingPeriod}
//             frequency={dummyData.frequency}
//             daysRemaining={dummyData.daysRemaining}
//             nextCycle={dummyData.nextCycle}
//           />
//           <DocumentVault documents={dummyData.documents} />
//           <InternalAuditNotes note={dummyData.notes} updatedAt={dummyData.updatedAt} />
//         </div>

//         {/* Right Column */}
//         <div className="right-col">
//           <ClientCard client={dummyData.client} />
//           <ItemLifecycle lifecycle={dummyData.lifecycle} />
//           {/* <ExportSummary /> */}
//         </div>
//       </div>

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

//         * { box-sizing: border-box; margin: 0; padding: 0; }

//         .filing-page {
//           font-family: 'DM Sans', sans-serif;
//           background: #f5f6fa;
//           min-height: 100vh;
//           padding: 28px 32px;
//           color: #1a1d23;
//         }

//         .breadcrumb {
//           font-size: 12px;
//           color: #8a8fa8;
//           margin-bottom: 8px;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           font-weight: 500;
//           letter-spacing: 0.02em;
//           text-transform: uppercase;
//         }
//         .breadcrumb .sep { color: #c8cad6; }
//         .breadcrumb .active { color: #5b6180; }

//         .ref-row {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           margin-bottom: 6px;
//         }

//         .status-badge {
//           font-size: 11px;
//           font-weight: 600;
//           letter-spacing: 0.08em;
//           text-transform: uppercase;
//           padding: 3px 10px;
//           border-radius: 4px;
//           background: #fff3e0;
//           color: #e07b00;
//           border: 1px solid #ffd08a;
//         }

//         .ref-code {
//           font-size: 12px;
//           color: #8a8fa8;
//           font-family: 'DM Mono', monospace;
//         }

//         .main-layout {
//           display: grid;
//           grid-template-columns: 1fr 280px;
//           gap: 20px;
//           margin-top: 20px;
//           align-items: start;
//         }

//         .left-col { display: flex; flex-direction: column; gap: 16px; }
//         .right-col { display: flex; flex-direction: column; gap: 16px; }
//       `}</style>
//     </div>
//   );
// };

// export default FilingDetailPage;

// import React from "react";
// import { FilingHeader } from "./_components/FilingHeader";
// import { FilingMetaCards } from "./_components/FilingMetaCards";
// import { DocumentVault } from "./_components/DocumentVault";
// import { InternalAuditNotes } from "./_components/InternalAuditNotes";
// import { ClientCard } from "./_components/ClientCard";
// import { ItemLifecycle } from "./_components/ItemLifecycle";

// const dummyData = {
//   id: "c5db4c98-3881-46af-8cab-015f56d05187",
//   type: "corporate_income_tax",
//   dueDate: "2026-04-29T00:00:00.000Z",
//   description: "Corporate Income Tax Filing for Q3-Q4 2023",
//   documentsRequired:
//     "Profit & Loss Statement,Balance Sheet (Audited),Transaction Ledger",
//   status: "PENDING",
//   frequency: "QUARTERLY",
//   period: "Q3 – Q4 2023",
//   assignedTo: "ee8a8fc3-04bd-4219-8761-ea2753be2486",
//   notes: "Internal audit notes regarding Q3–Q4 period",
//   completedAt: null,
//   isRemindersPaused: false,
//   clientId: "b7d607d5-a229-40e3-b3ad-ffa72ad8c7a7",
//   tenantId: "ff05b85d-c264-4ec2-aaea-a54d8d0e53fa",
//   createdAt: "2026-04-23T11:25:31.195Z",
//   updatedAt: "2026-04-23T11:25:31.195Z",
//   refCode: "CIT-2026-BH-Q3",
//   daysRemaining: 736,
//   nextCycle: "Jan 2026",
//   filingPeriod: "Q3 – Q4 2023",
//   client: {
//     name: "Salman Khan",
//     businessName: "Being Human",
//     entityType: "Corporate Entity",
//     phone: "9498787324",
//     initials: "BH",
//   },
//   documents: [
//     {
//       id: "doc-1",
//       name: "Profit & Loss Statement",
//       description: "Awaiting PDF or Excel format",
//       status: "REQUIRED",
//       fileName: null,
//     },
//     {
//       id: "doc-2",
//       name: "Balance Sheet (Audited)",
//       description: "Final certified version",
//       status: "REQUIRED",
//       fileName: null,
//     },
//     {
//       id: "doc-3",
//       name: "Transaction Ledger",
//       description: "ledger_export_q3_final.csv",
//       status: "RECEIVED",
//       fileName: "ledger_export_q3_final.csv",
//     },
//   ],
//   lifecycle: [
//     {
//       id: "lc-1",
//       label: "Current State",
//       detail: "Pending Documentation",
//       timestamp: "Updated 3h ago",
//       isActive: true,
//     },
//     {
//       id: "lc-2",
//       label: "Created At",
//       detail: "April 23, 2026",
//       timestamp: "System Generated",
//       isActive: false,
//     },
//   ],
// };

// const FilingDetailPage = () => {
//   return (
//     <div className="min-h-screen text-[#1a1d23] font-sans">

//       {/* Breadcrumb */}
//       <nav className="mb-2 flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-wide text-[#8a8fa8]">
//         <span>Clients</span>
//         <span className="text-[#c8cad6]">›</span>
//         <span>{dummyData.client.businessName}</span>
//         <span className="text-[#c8cad6]">›</span>
//         <span className="text-[#5b6180]">Filing Detail</span>
//       </nav>

//       {/* Status + Ref */}
//       <div className="mb-1 flex items-center gap-2.5">
//         <span className="rounded border border-[#ffd08a] bg-[#fff3e0] px-2.5 py-0.75 text-[11px] font-semibold uppercase tracking-widest text-[#e07b00]">
//           {dummyData.status}
//         </span>
//         <span className="font-mono text-[12px] text-[#8a8fa8]">
//           Ref: {dummyData.refCode}
//         </span>
//       </div>

//       {/* Header */}
//       <FilingHeader
//         title="Corporate Income Tax"
//         dueDate={dummyData.dueDate}
//         frequency={dummyData.frequency}
//         isRemindersPaused={dummyData.isRemindersPaused}
//       />

//       {/* Layout */}
//       <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px] items-start">

//         {/* Left */}
//         <div className="flex flex-col gap-4">
//           <FilingMetaCards
//             filingPeriod={dummyData.filingPeriod}
//             frequency={dummyData.frequency}
//             daysRemaining={dummyData.daysRemaining}
//             nextCycle={dummyData.nextCycle}
//           />
//           <DocumentVault documents={dummyData.documents} />
//           <InternalAuditNotes
//             note={dummyData.notes}
//             updatedAt={dummyData.updatedAt}
//           />
//         </div>

//         {/* Right */}
//         <div className="flex flex-col gap-4">
//           <ClientCard client={dummyData.client} />
//           <ItemLifecycle lifecycle={dummyData.lifecycle} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FilingDetailPage;

"use client";
import React, { useState } from "react";
import { FilingHeader } from "./_components/FilingHeader";
import { FilingMetaCards } from "./_components/FilingMetaCards";
import { DocumentVault } from "./_components/DocumentVault";
import { InternalAuditNotes } from "./_components/InternalAuditNotes";
import { ClientCard } from "./_components/ClientCard";
import { ItemLifecycle } from "./_components/ItemLifecycle";

import { useParams } from "next/navigation";
import { useComplianceById } from "@/lib/hooks/api/compliance/useCompliance";
import {
  useFileFilingConfirmation,
  useToggleReminder,
} from "@/lib/hooks/api/useClients";
import { ReminderConfirmModal } from "../../clients/[id]/_components/modal/reminder_confirm";
import { FilingConfirmationModal } from "../../clients/[id]/_components/modal/FilingConfirmationModal";

type ReminderTargetType = "CLIENT" | "TASK";

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

function FilingSkeleton() {
  return (
    <div className="min-h-screen font-sans animate-pulse">
      <div className="mx-auto">
        {/* Breadcrumb placeholder */}
        <div className="h-4 w-48 bg-neutral-200 rounded mb-4" />
        <div className="h-8 w-64 bg-neutral-200 rounded mb-2" />
        <div className="h-4 w-96 bg-neutral-200 rounded mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
          <div className="flex flex-col gap-5">
            {/* Primary Info card */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4">
              <div className="h-4 w-36 bg-neutral-200 rounded" />
              <div className="h-10 bg-neutral-100 rounded-xl" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-neutral-100 rounded-xl" />
                <div className="h-10 bg-neutral-100 rounded-xl" />
              </div>
              <div className="h-10 bg-neutral-100 rounded-xl" />
              <div className="h-20 bg-neutral-100 rounded-xl" />
            </div>

            {/* Context card */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4">
              <div className="h-4 w-36 bg-neutral-200 rounded" />
              <div className="h-16 bg-neutral-100 rounded-xl" />
              <div className="h-24 bg-neutral-100 rounded-xl" />
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-3">
              <div className="h-4 w-24 bg-neutral-200 rounded" />
              <div className="h-10 bg-neutral-100 rounded-xl" />
              <div className="h-6 bg-neutral-100 rounded" />
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-2">
              <div className="h-4 w-28 bg-neutral-200 rounded" />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 bg-neutral-100 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const FilingDetailPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const [confirmState, setConfirmState] = useState<PendingReminderState | null>(
    null,
  );
  const [isFilingConfirmOpen, setIsFilingConfirmOpen] = useState(false);

  const { data, isLoading, error, refetch } = useComplianceById(id);
  const complianceData = data?.data?.complianceItem;

  const { mutate: toggleReminders, isPending: isTogglingReminder } =
    useToggleReminder();

  const openReminderConfirm = (payload: PendingReminderState) => {
    if (!payload.targetId) return;
    setConfirmState(payload);
  };

  const closeReminderConfirm = () => {
    setConfirmState(null);
  };

  const handleRemindersToggle = () => {
    const nextPausedState = !complianceData?.isRemindersPaused;

    openReminderConfirm({
      targetId: id,
      targetType: "TASK",
      action: nextPausedState ? "pause" : "resume",
      log: {
        id,
        type: "TASK",
        taskType: complianceData?.type,
        title: complianceData?.type,
        isReminderEnabled: !nextPausedState,
        targetType: "TASK",
      },
    });
  };

  const handleConfirmReminderToggle = () => {
    if (!confirmState) return;

    const nextPausedState = confirmState.action === "pause";

    toggleReminders(
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

  const { mutate: filingConfirmation, isPending: isFilingConfirmationLoading } =
    useFileFilingConfirmation();

  const handleOpenFilingConfirmation = () => {
    setIsFilingConfirmOpen(true);
  };

  const handleCloseFilingConfirmation = () => {
    setIsFilingConfirmOpen(false);
  };

  const handleFilingConfirmation = (acknowledgmentNumber?: string) => {
    if (!complianceData?.id) return;

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
        id: complianceData.id,
        payload,
      },
      {
        onSuccess: async () => {
          setIsFilingConfirmOpen(false);
          await refetch();
        },
      },
    );
  };

  if (isLoading) return <FilingSkeleton />;
  if (error) return <div>Error</div>;

  if (!complianceData) return null;
  return (
    <div className="min-h-screen text-[#1a1d23] font-sans">
      <nav className="mb-2 flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-wide text-[#8a8fa8]">
        <span>Clients</span>
        <span className="text-[#c8cad6]">›</span>
        <span>{complianceData?.client?.businessName}</span>
        <span className="text-[#c8cad6]">›</span>
        <span className="text-[#5b6180]">Filing Detail</span>
      </nav>

      <div className="mb-1 flex items-center gap-2.5">
        <span className="rounded border border-[#ffd08a] bg-[#fff3e0] px-2.5 py-0.75 text-[11px] font-semibold uppercase tracking-widest text-[#e07b00]">
          {complianceData?.status}
        </span>
        <span className="font-mono text-[12px] text-[#8a8fa8]">
          Ref: {complianceData?.refCode}
        </span>
      </div>

      <FilingHeader
        title={complianceData?.type}
        status={complianceData?.status}
        dueDate={complianceData?.dueDate}
        frequency={complianceData?.frequency}
        isRemindersPaused={complianceData?.isRemindersPaused}
        toggleReminders={handleRemindersToggle}
        onFilingConfirmation={handleOpenFilingConfirmation}
        id={complianceData?.id}
      />

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px] items-start">
        <div className="flex flex-col gap-4">
          <FilingMetaCards
            filingPeriod={complianceData?.period}
            frequency={complianceData?.frequency}
            daysRemaining={complianceData?.daysRemaining}
            nextCycle={complianceData?.nextCycle}
          />
          <DocumentVault documents={complianceData?.documents} />
          <InternalAuditNotes
            note={complianceData?.notes}
            updatedAt={complianceData?.updatedAt}
          />
        </div>

        <div className="flex flex-col gap-4">
          {complianceData?.client && (
            <ClientCard client={complianceData.client} />
          )}
          {complianceData?.lifecycle && (
            <ItemLifecycle lifecycle={complianceData.lifecycle} />
          )}
        </div>
      </div>
      <ReminderConfirmModal
        open={!!confirmState}
        onClose={closeReminderConfirm}
        onConfirm={handleConfirmReminderToggle}
        action={confirmState?.action || "pause"}
        log={confirmState?.log || null}
        loading={isTogglingReminder}
      />

      <FilingConfirmationModal
        open={isFilingConfirmOpen}
        onClose={handleCloseFilingConfirmation}
        onConfirm={handleFilingConfirmation}
        loading={isFilingConfirmationLoading}
        item={
          complianceData
            ? {
                id: complianceData.id,
                type: complianceData.type,
                period: complianceData.period,
                dueDate: new Date(complianceData.dueDate).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  },
                ),
              }
            : null
        }
      />
    </div>
  );
};

export default FilingDetailPage;
