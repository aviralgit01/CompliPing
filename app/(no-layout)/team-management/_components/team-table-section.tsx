"use client";

import CustomCard from "@/components/common/custom-card";
import DataTable from "@/components/common/dynamic-table";
import DynamicTableWrapper from "@/components/common/dynamic-table-wrapper";
import { TabNavigation } from "@/components/common/tab";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserInitials } from "@/lib/utils/greetings";
import { format } from "date-fns";
import {
  Search,
  Filter,
  Plus,
  X,
  Calendar,
  Edit,
  Eye,
  Edit2,
  MoreVertical,
} from "lucide-react";
import React, { useState } from "react";
import InviteMember from "./modal/invite-member";
import { useTeam } from "@/lib/hooks/api/useTeam";
import { toast } from "sonner";

export const data = [
  {
    reference_id: "REF001",
    status: "INVITED",
    user: {
      name: "Amit Sharma",
      avatarUrl: "",
      role: "PARTNER",
      email: "abc@gmail.com",
    },
  },
  {
    reference_id: "REF002",
    status: "INVITED",
    user: {
      name: "Amit Sharma",
      avatarUrl: "",
      role: "MANAGER",
      email: "abc@gmail.com",
    },
  },
  {
    reference_id: "REF003",
    status: "INVITED",
    user: {
      name: "Amit Sharma",
      avatarUrl: "",
      role: "JUNIOR",
      email: "abc@gmail.com",
    },
  },
];

const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "inactive":
      return "#9CA3AF";

    case "active":
      return "#15803D";

    case "invited":
      return "#CA8A04";

    default:
      return "#2563EB";
  }
};

const getRoleStyle = (role: string) => {
  switch (role?.toLowerCase()) {
    case "partner":
      return "bg-violet-100 text-violet-800 px-4.5 py-1.5 rounded-full w-fit text-xs";

    case "junior":
      return "bg-blue-50 text-black px-4.5 py-1.5 rounded-full w-fit text-xs";

    case "manager":
      return "bg-blue-100 text-black px-4.5 py-1.5 rounded-full w-fit text-xs";

    default:
      return "bg-violet-100 text-violet-800 px-4.5 py-1.5 rounded-full w-fit text-xs";
  }
};
const TeamTableSection = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const { inviteMember } = useTeam();
  const tabs = [
    { id: "members", label: "Members" },
    { id: "pending_invites", label: "Pending Invites" },
  ];

  const [activeTab, setActiveTab] = useState("members");

  const columns = [
    {
      key: "Member",
      header: "Member",
      render: (row: any) => (
        <div className="flex items-center gap-3 ">
          {row?.user?.avatarUrl ? (
            <img
              src={row.user.avatarUrl}
              className="h-10 w-10 rounded-xl object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white">
              {getUserInitials(row?.user?.name)}
            </div>
          )}

          <div>
            <div className="font-semibold text-sm">{row?.user?.name}</div>
            <div className="text-xs text-slate-500">{row?.user?.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role Access",
      header: "Role Access",
      render: (row: any) => (
        <div className="flex">
          <div className={getRoleStyle(row?.user?.role)}>
            {row?.user?.role ?? row?.user?.role ?? "Not assigned"}
          </div>
        </div>
      ),
    },
    {
      key: "account status",
      header: "Account Status",
      render: (row: any) =>
        row?.status ? (
          <div
            className="flex items-center gap-2"
            style={{ color: getStatusStyle(row?.status) }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: getStatusStyle(row?.status) }}
            />
            <span>{row?.status}</span>
          </div>
        ) : (
          "N/A"
        ),
    },

    {
      key: "actions",
      header: "Actions",
      render: (row: any) => (
        <div className="flex gap-2 justify-end">
          <Button
            variant={"ghost"}
            onClick={() => {}}
            className="rounded-full h-10 w-10 p-0"
          >
            <Eye />
          </Button>
          <Button
            variant={"ghost"}
            onClick={() => {}}
            className="rounded-full h-10 w-10 p-0"
          >
            <MoreVertical />
          </Button>
        </div>
      ),
    },
  ];

  const handleInviteMember = async (data: { email: string; role: string }) => {
    inviteMember(data, {
      onSuccess: (res) => {
        toast.success("Invite send successfully");
        setIsInviteOpen(false);
      },
      onError: (err) => {},
    });
  };

  return (
    <CustomCard classname="px-0! relative">
      <InviteMember
        isOpen={isInviteOpen}
        onClose={() => {
          setIsInviteOpen(false);
        }}
        onInvite={(data) => handleInviteMember(data)}
      />
      <DynamicTableWrapper
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        title={activeTab === "members" ? "Team Members" : "Invited Members"}
        description="Manage and review all members"
        showSearch
        onChangeSearch={(e) => console.log(e.target.value)}
        showFilter
        onClickFilter={() => console.log("open filter")}
        filterCount={2}
        onClearAllFilter={() => console.log("clear all")}
        filterItems={[
          {
            label: "Status",
            value: "Approved",
            colorClass: "bg-purple-50 text-purple-700",
          },
          {
            label: "Duration",
            value: "Full Day",
            colorClass: "bg-emerald-50 text-emerald-700",
          },
        ]}
        actionButton={{
          label: "Add Member",
          onClick: () => setIsInviteOpen(true),
        }}
      >
        <DataTable
          data={data}
          columns={columns}
          mobileRender={(row: any) => (
            <div className="space-y-3">
              <div className="font-semibold">{row?.user?.name}</div>
              <div className="text-sm text-slate-600">{row?.user?.role}</div>
            </div>
          )}
        />
      </DynamicTableWrapper>
    </CustomCard>
  );
};

export default TeamTableSection;
