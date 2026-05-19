"use client";

import CustomCard from "@/components/common/custom-card";
import DataTable from "@/components/common/dynamic-table";
import DynamicTableWrapper from "@/components/common/dynamic-table-wrapper";
import { Button } from "@/components/ui/button";
import { getUserInitials } from "@/lib/utils/greetings";
import { Eye, MoreVertical } from "lucide-react";
import React, { useEffect, useState } from "react";
import InviteMember from "./modal/invite-member";
import { useTeam } from "@/lib/hooks/api/useTeam";
import { toast } from "sonner";
import { useDebounce } from "@/lib/hooks/client/debounce-hook";

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

  const tabs = [
    { id: "members", label: "Members" },
    { id: "pending_invites", label: "Pending Invites" },
  ];

  const [activeTab, setActiveTab] = useState("members");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 300);

  const { getMember, inviteMember, inviteLoading } = useTeam({
    page,
    limit,
    status: activeTab === "members" ? null : "INACTIVE",
    search: debounceSearch,
  });
  const { data: memberData, isError, error, isLoading, isFetching } = getMember;

  const columns = [
    {
      key: "Member",
      header: "Member",
      render: (row: any) => (
        <div className="flex items-center gap-3 ">
          {row?.avatarUrl ? (
            <img
              src={row.user.avatarUrl}
              className="h-10 w-10 rounded-xl object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white">
              {getUserInitials(row?.name)}
            </div>
          )}

          <div>
            <div className="font-semibold text-sm">{row?.name}</div>
            <div className="text-xs text-slate-500">{row?.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role Access",
      header: "Role Access",
      render: (row: any) => (
        <div className="flex">
          <div className={getRoleStyle(row?.role)}>
            {row?.role ?? row?.role ?? "Not assigned"}
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

  useEffect(() => {
    if (isError) {
      const err = error as any;

      toast.error(
        err?.response?.data?.message || "Failed to fetch team members",
      );
    }
  }, [isError, error]);

  return (
    <CustomCard classname="px-0! relative">
      <InviteMember
        isOpen={isInviteOpen}
        onClose={() => {
          setIsInviteOpen(false);
        }}
        onInvite={(data) => handleInviteMember(data)}
        isLoading={inviteLoading}
      />
      <DynamicTableWrapper
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setPage(1);
          setLimit(10);
        }}
        title={activeTab === "members" ? "Team Members" : "Invited Members"}
        description="Manage and review all members"
        showSearch
        onChangeSearch={(e) => {
          setSearch(e.target.value.trim());
          setPage(1);
        }}
        // showFilter
        // onClickFilter={() => console.log("open filter")}
        // filterCount={2}
        // onClearAllFilter={() => console.log("clear all")}
        // filterItems={[
        //   {
        //     label: "Status",
        //     value: "Approved",
        //     colorClass: "bg-purple-50 text-purple-700",
        //   },
        //   {
        //     label: "Duration",
        //     value: "Full Day",
        //     colorClass: "bg-emerald-50 text-emerald-700",
        //   },
        // ]}
        actionButton={{
          label: "Add Member",
          onClick: () => setIsInviteOpen(true),
        }}
      >
        <DataTable
          isLoading={isFetching}
          totalCount={memberData?.data?.pagination?.total}
          currentPage={page}
          limit={limit}
          totalPages={memberData?.data?.pagination?.totalPages}
          onLimitChange={(limit) => setLimit(limit)}
          onPageChange={(newPage) => {
            const total = memberData?.data?.pagination?.totalPages ?? 1;
            if (newPage >= 1 && newPage <= total) {
              setPage(newPage);
            }
          }}
          data={memberData?.data?.data}
          columns={columns}
          // mobileRender={(row: any) => (
          //   <div className="space-y-3">
          //     <div className="font-semibold">{row?.user?.name}</div>
          //     <div className="text-sm text-slate-600">{row?.user?.role}</div>
          //   </div>
          // )}
          mobileRender={(row, index) => (
            <div className="space-y-4 p-4">
              {/* 👤 User Info */}
              <div className="flex items-center gap-3">
                {row?.avatarUrl ? (
                  <img
                    src={row.user.avatarUrl}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-sm font-semibold">
                    {getUserInitials(row?.name)}
                  </div>
                )}

                <div className="flex-1">
                  <div className="font-semibold text-sm">{row?.name}</div>
                  <div className="text-xs text-slate-500">{row?.email}</div>
                </div>

                {/* Status Dot */}
                {row?.status && (
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: getStatusStyle(row?.status) }}
                  />
                )}
              </div>

              {/* 🏷 Role + Status */}
              <div className="flex items-center justify-between">
                <div className={getRoleStyle(row?.role)}>
                  {row?.role ?? "Not assigned"}
                </div>

                {row?.status ? (
                  <div
                    className="text-xs font-medium"
                    style={{ color: getStatusStyle(row?.status) }}
                  >
                    {row?.status}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">N/A</span>
                )}
              </div>

              {/* ⚡ Actions */}
              <div
                className={`flex justify-end gap-2 pb-2 ${index === memberData?.data?.data.length - 1 ? "border-none" : "border-b"}`}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {}}
                  className="text-xs"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>

                <Button variant="ghost" size="icon" onClick={() => {}}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        />
      </DynamicTableWrapper>
    </CustomCard>
  );
};

export default TeamTableSection;
