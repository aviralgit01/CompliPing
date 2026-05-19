"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  Phone,
  MapPin,
  BadgeCheck,
  CircleXIcon,
  MinusCircle,
  Building,
  Calendar,
  AlertCircle,
  BadgeMinusIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { TablePagination } from "@/components/common/table-pagination";
import DeleteModal from "@/components/common/modal/delete-modal";
import EditClient from "./edit-client";

interface client {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  businessType: string;
  isGstRegistered: boolean | null;
  optInStatus: string;
  addressOne: string;
  addressTwo: string;
  district: string;
  pinCode: string;
  state: string;
}

interface ClientTableProps {
  data: client[];
  onEdit: () => void;
  onDelete: (id: string) => void;
  onView?: (id: string) => void;
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  totalPages?: number;
  totalCount?: number;
  loading: { delete: boolean };
}

export const ClientTable: React.FC<ClientTableProps> = ({
  data,
  onEdit,
  onDelete,
  onView,
  currentPage = 1,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  totalPages = 1,
  totalCount = 0,
  loading,
}) => {
  const pathName = usePathname();
  const route = useRouter();
  const getGstStatusColor = (status?: boolean | null) => {
    switch (status) {
      case true:
        return "text-green-600 border-green-200 bg-green-50";
      case false:
        return "text-red-600 border-red-200 bg-red-50";
      default:
        return "text-gray-500 border-gray-200 bg-gray-50";
    }
  };

  const getGstStatusIcon = (status?: boolean | null) => {
    switch (status) {
      case true:
        return <BadgeCheck className="w-3 h-3" />;
      case false:
        return <CircleXIcon className="w-3 h-3" />;
      default:
        return <MinusCircle className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string = "active") => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "inactive":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getStatusIcon = (status: string = "active") => {
    switch (status) {
      case "active":
        return <BadgeCheck className="w-3 h-3" />;
      case "inactive":
        return <BadgeMinusIcon className="w-3 h-3" />;
      case "pending":
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <BadgeCheck className="w-3 h-3" />;
    }
  };

  const [clientToBeEdited, setClientToBeEdited] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<client | null>(null);

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "NA"
    );
  };

  const handleLimitChange = (newLimit: string) => {
    const limit = parseInt(newLimit);
    onItemsPerPageChange?.(limit);
  };

  return (
    <div className="w-full overflow-hidden">
      <DeleteModal
        headerText="Delete Client"
        isOpen={isDeleteModalOpen}
        loading={loading.delete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedClient(null);
        }}
        onConfirm={() => {
          onDelete(selectedClient?.id || "");
          setIsDeleteModalOpen(false);
        }}
      >
        Are you sure you want to delete this client?
      </DeleteModal>

      <EditClient
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setClientToBeEdited("");
        }}
        clientId={clientToBeEdited}
        onEdit={onEdit}
      />

      {/* <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        clientId={selectedClient?.id}
      /> */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-linear-to-r from-slate-50 to-slate-100/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-[20%]">
                  Client Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-[10%]">
                  Business Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-[10%]">
                  Contact
                </th>
                {/* FIXED: SAME condition in header AND body */}
                {pathName !== "/admin" && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-[10%]">
                    Business Type
                  </th>
                )}
                {pathName !== "/admin" && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-[10%]">
                    GST Registered
                  </th>
                )}

                {pathName !== "/admin" && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-[10%]">
                    Client Status
                  </th>
                )}

                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider w-[10%]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-slate-200/60">
              {data?.map((client, index) => (
                <tr
                  key={`${client?.id}-${index}`}
                  className="hover:bg-slate-50/80 transition-colors duration-200 cursor-pointer"
                >
                  {/* Client Info */}
                  <td className="px-6 py-4 wrap-break-word">
                    <div
                      className="flex items-center gap-3"
                      onClick={() => {
                        route.push(`clients/${client.id}`);
                      }}
                    >
                      <div className="shrink-0 h-10 w-10">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-medium text-sm shadow-sm">
                          {getInitials(client?.name || "")}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">
                          {client?.name || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Business Name */}
                  <td className="px-6 py-4 whitespace-nowrap wrap-break-word">
                    <div className="flex items-center text-sm text-slate-900">
                      <Building className="w-3 h-3 mr-2 shrink-0" />
                      <span
                        className="truncate block max-w-35 cursor-pointer"
                        title={client?.businessName}
                      >
                        {client?.businessName || "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center min-w-0">
                      <Phone className="w-3 h-3 mr-2 shrink-0" />
                      <span
                        className="truncate block max-w-27.5 text-sm cursor-pointer"
                        title={client?.phone}
                      >
                        {client?.phone || "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* Business Type */}
                  {pathName !== "/admin" && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 capitalize">
                        {client?.businessType || "Not assigned"}
                      </div>
                    </td>
                  )}

                  {/* GST Status */}
                  {pathName !== "/admin" && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getGstStatusColor(client?.isGstRegistered)}`}
                      >
                        {getGstStatusIcon(client?.isGstRegistered)}
                        {client?.isGstRegistered == null
                          ? "Not assigned"
                          : client.isGstRegistered
                            ? "Yes"
                            : "No"}
                      </span>
                    </td>
                  )}

                  {/* Opt */}

                  {pathName !== "/admin" && (
                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(client?.optInStatus)}`}
                      >
                        {getStatusIcon(client?.optInStatus)}
                        {client?.optInStatus}
                      </span>
                    </td>
                  )}

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // setShowProfile(true);
                          // setSelectedClient(client.id ? client : null);
                          route.push(`clients/${client.id}`);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          console.log("clicked client id =>", client?.id);
                          setClientToBeEdited(client?.id || "");
                          setIsEditOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                        title="Edit Client"
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
                            onClick={() => {
                              // setShowProfile(true);
                              // setSelectedClient(client.id ? client : null);
                              route.push(`clients/${client.id}`);
                            }}
                            className="cursor-pointer"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setIsEditOpen(true);
                              setClientToBeEdited(client?.id || "");
                            }}
                            className="cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedClient(client);
                              setIsDeleteModalOpen(true);
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
              ))}
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

      {/* Mobile Cards - same as EmployeeTable */}
      <div className="md:hidden space-y-4 px-2">
        {data?.map((client, idx) => (
          <div
            key={`${client?.id}-${idx}`}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg shadow-slate-200/50 border border-white/60"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="shrink-0 h-10 w-10">
                  <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-medium text-sm shadow-sm">
                    {getInitials(client?.name || "")}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">
                    {client?.name || "N/A"}
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      // setShowProfile(true);
                      // setSelectedClient(client.id ? client : null);
                      route.push(`clients/${client.id}`);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setIsEditOpen(true);
                      setClientToBeEdited(client?.id || "");
                    }}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedClient(client);
                      setIsDeleteModalOpen(true);
                    }}
                    className="text-error! hover:bg-error-light"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-slate-600">
                <Building className="w-3 h-3 mr-2 text-slate-400" />
                {client?.businessName || "N/A"}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Phone className="w-3 h-3 mr-2 text-slate-400" />
                {client.phone}
              </div>
              {client?.businessType && (
                <div className="flex items-center text-sm text-slate-600">
                  <MapPin className="w-3 h-3 mr-2 text-slate-400" />
                  {client.businessType}
                </div>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200/60">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getGstStatusColor(client?.isGstRegistered)}`}
              >
                {getGstStatusIcon(client?.isGstRegistered)}
                {client?.isGstRegistered == null
                  ? "Not assigned"
                  : client.isGstRegistered
                    ? "Yes"
                    : "No"}
              </span>
            </div>
          </div>
        ))}

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
    </div>
  );
};
