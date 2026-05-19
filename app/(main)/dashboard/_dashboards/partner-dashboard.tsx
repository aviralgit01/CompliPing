"use client";

import {
  ComplianceHealth,
  DashboardData,
} from "@/lib/api/dashboard/dashboard.api type";
import { useDashboard } from "@/lib/hooks/api/dashboard/useDashboard";
import {
  MessageSquare,
  FileUp,
  CheckCircle2,
  UserPlus,
  Filter,
} from "lucide-react";
import DashboardHeader from "./_components/DashboardHeader";
import StatCard from "@/components/common/stat-card";
import ComplianceHealthBanner from "./_components/ComplianceHealthBanner";
import QuickActions from "./_components/QuickActions";
import WeeklyComplianceStatus from "./_components/WeeklyComplianceStatus";
import ActivityFeed from "./_components/ActivityFeed";
import AuditGuideWidget from "./_components/AuditGuideWidget";
import SupportWidget from "./_components/SupportWidget";
import { useRouter } from "next/navigation";
import DashboardSkeleton from "./_components/DashboardSkeleton";
import { useStore } from "@/lib/store";

export default function PartnerDashboard() {
  const user = useStore((state) => state.user);
  const { data, isLoading } = useDashboard();
  const router = useRouter();
  console.log(user?.onBoardingCompleted, "user");

  if (isLoading)
    return (
      <div>
        <DashboardSkeleton />
      </div>
    );
  const {
    todaysSnapshot,
    thisWeeksSnapshot,
    complianceHealth,
    itemsDueToday,
    recentActivity,
  } = data?.data as DashboardData;

  // Stat Cards config
  const statCards = [
    {
      icon: MessageSquare,
      label: "WhatsApp Messages Sent",
      value: todaysSnapshot.messagesSent,
    },
    {
      icon: FileUp,
      label: "Documents Received",
      value: todaysSnapshot.documentsReceived,
    },
    {
      icon: CheckCircle2,
      label: "Items Completed",
      value: todaysSnapshot.filingsCompleted,
    },
    {
      icon: UserPlus,
      label: "New Client Opt-ins",
      value: todaysSnapshot.newClientOptins ?? 0,
    },
  ];

  // Compliance Health fallback logic
  const health: ComplianceHealth = {
    dueThisWeek: complianceHealth?.dueThisWeek ?? thisWeeksSnapshot.itemsDue,
    completed: complianceHealth?.completed ?? thisWeeksSnapshot.itemsCompleted,
    activeItems: complianceHealth?.activeItems ?? 0,
    totalOverdue:
      complianceHealth?.totalOverdue ?? thisWeeksSnapshot.itemsOverdue,
  };

  return (
    <div className="min-h-screen bg-slate-50 p-7">
      <div className=" mx-auto flex flex-col gap-6">
        {/* Header */}
        <DashboardHeader
          month={new Date().toLocaleString("default", { month: "long" })}
          year={new Date().getFullYear()}
          onExport={() => alert("Export Report")}
          onNewFiling={() => router.push("/compliance/create")}
          onBoardingCompleted={user?.onBoardingCompleted}
          onNavigateOnboard={() => router.push("/onboarding")}
        />

        {/* Today's Snapshot */}
        {/* <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <StatCard
              key={card.label}
              icon={<card.icon />}
              title={card?.label}
              value={card?.value}
            />
          ))}
        </div> */}

        {/* Health + Actions */}
        <div className="flex gap-5 flex-col md:flex-row lg:flex-nowrap ">
          <ComplianceHealthBanner {...health} />
          <QuickActions
            overdueCount={thisWeeksSnapshot.itemsOverdue}
            onAddClient={() => router.push("/clients")}
            onAddCompliance={() => router.push("/compliance/create")}
            onCompliance={() => router.push("/compliance")}
            onViewOverdue={() => alert("View Overdue Items")}
          />
        </div>

        {/* Main Content */}
        <div className="flex gap-5 flex-wrap items-start">
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            {/* <WeeklyComplianceStatus
              itemsDue={thisWeeksSnapshot.itemsDue}
              itemsCompleted={thisWeeksSnapshot.itemsCompleted}
              itemsOverdue={thisWeeksSnapshot.itemsOverdue}
              items={itemsDueToday}
              onAction={(client, action) => alert(`${action}: ${client}`)}
            /> */}

            <ActivityFeed activities={recentActivity} />
          </div>

          {/* Sidebar */}
          {/* <div className="w-72 shrink-0 flex flex-col gap-4">
            <AuditGuideWidget />
            <SupportWidget />
          </div> */}
        </div>
      </div>
    </div>
  );
}
