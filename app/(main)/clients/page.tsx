"use client";
import { CustomInput } from "@/components/customInput";
import { Button } from "@/components/ui/button";
import { SearchIcon, Plus, Users, X, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useMemo, useCallback } from "react";
import CreateClient from "./_components/modals/createClient";
import { ClientTable } from "./_components/clientTable";
import { useDeleteClient, useGetClients } from "@/lib/hooks/api/useClients";
import Loader from "@/components/common/loader";
import { debounce } from "@/lib/validation/debounce";
import { ClientFilters } from "./_components/client-filter";
import { Spinner } from "@/components/layout/spinner";
import { ClientPageSkeleton } from "./_components/ClientPageSkeleton";

interface FilterState {
  gst: "all" | "yes" | "no";
  optIn: "all" | "active" | "inactive" | "pending";
  type: { label: string; value: string } | null;
}

function Client() {
  const router = useRouter();

  const [isClientCreateModalOpen, setIsClientCreateModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const defaultFilters: FilterState = {
    gst: "all",
    optIn: "all",
    type: null,
  };

  const [tempFilters, setTempFilters] = useState<FilterState>(defaultFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<FilterState>(defaultFilters);

  const handleApplyFilters = () => {
    setAppliedFilters(tempFilters);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleClearFilter = (key: keyof FilterState) => {
    const updated: FilterState = {
      ...appliedFilters,
      [key]: key === "gst" ? "all" : key === "optIn" ? "all" : null,
    };
    setAppliedFilters(updated);
    setTempFilters(updated);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setTempFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setCurrentPage(1);
  };

  const appliedFilterCount = useMemo(() => {
    let count = 0;
    if (appliedFilters.gst !== "all") count++;
    if (appliedFilters.optIn !== "all") count++;
    if (appliedFilters.type) count++;
    return count;
  }, [appliedFilters]);

  const hasActiveFilters = appliedFilterCount > 0;

  const optInLabelMap: Record<FilterState["optIn"], string> = {
    all: "All",
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
  };

  const { data, isLoading, refetch } = useGetClients({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedTerm,
    gst:
      appliedFilters.gst === "yes"
        ? "true"
        : appliedFilters.gst === "no"
          ? "false"
          : "",
    optIn: appliedFilters.optIn === "all" ? "" : appliedFilters.optIn,
    type: appliedFilters.type?.value || "",
  });

  const clients = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const totalCount =
    data?.pagination?.totalCount || data?.pagination?.total || 0;

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedTerm(value);
      setCurrentPage(1);
    }, 800),
    [],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const { mutate: deleteClient, isPending: isDeleting } = useDeleteClient();

  const handleDeleteClient = async (id: string) => {
    if (isDeleting) return;
    deleteClient(id);
  };

  const handleClientCreated = useCallback(() => {
    refetch();
    setIsClientCreateModal(false);
  }, [refetch]);

  const handleEditRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // if (isLoading && clients.length === 0) {
  //   return (
  //     <div className="p-6 bg-linear-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 min-h-screen">
  //       <div className="p-12 flex justify-center">
  //         <Loader textSize="lg" size={24} />
  //       </div>
  //     </div>
  //   );
  // }
  if (isLoading && clients.length === 0) {
    return <ClientPageSkeleton />
  }
  return (
    <div className=" min-h-screen overflow-hidden">
      <CreateClient
        isOpen={isClientCreateModalOpen}
        onClose={() => setIsClientCreateModal(false)}
        onAddClient={handleClientCreated}
      />

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-6 border-b border-slate-200/60 bg-linear-to-r from-white/90 to-slate-50/90">
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-6 gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Client Management
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Manage your clients information
              </p>
            </div>

            <div className="flex items-center justify-between flex-wrap md:flex-nowrap xl:justify-end xl:gap-4 flex-1 gap-4 w-full">
              <div className="w-full xl:max-w-80">
                <CustomInput
                  iconLeft={<SearchIcon className="w-4 h-4 text-slate-400" />}
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  inputClassName="h-10 bg-white border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex gap-3">
                {/* Filter Code */}
                <ClientFilters
                  selectedGst={tempFilters.gst}
                  selectedOptIn={tempFilters.optIn}
                  selectedType={tempFilters.type}
                  onGstChange={(value) =>
                    setTempFilters((prev) => ({ ...prev, gst: value }))
                  }
                  onOptInChange={(value) =>
                    setTempFilters((prev) => ({ ...prev, optIn: value }))
                  }
                  onTypeChange={(value) =>
                    setTempFilters((prev) => ({ ...prev, type: value }))
                  }
                  onApplyFilters={handleApplyFilters}
                  onClearFilters={clearAllFilters}
                  isOpen={isFilterOpen}
                  onOpenChange={setIsFilterOpen}
                  hasActiveFilters={hasActiveFilters}
                  activeFilterCount={appliedFilterCount}
                />

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-10 px-3 text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 rounded-lg transition-all duration-200"
                    title="Clear all filters"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}

                <div>
                  <Button
                    className="w-full h-10 px-4 justify-center"
                    onClick={() => setIsClientCreateModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              {appliedFilters.gst !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                  GST: {appliedFilters.gst === "yes" ? "Yes" : "No"}
                  <button
                    onClick={() => handleClearFilter("gst")}
                    className="ml-1 rounded p-0.5 hover:bg-emerald-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {appliedFilters.optIn !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
                  Opt In: {appliedFilters.optIn}
                  <button
                    onClick={() => handleClearFilter("optIn")}
                    className="ml-1 rounded p-0.5 hover:bg-purple-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {appliedFilters.type && (
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                  Type: {appliedFilters.type.label}
                  <button
                    onClick={() => handleClearFilter("type")}
                    className="ml-1 rounded p-0.5 hover:bg-blue-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        <div>
          {isLoading ? (
            <div className="p-12 flex justify-center">
              <Spinner size="small" />
            </div>
          ) : clients?.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-linear-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {searchTerm ? "No clients found" : "No clients yet"}
              </h3>
              <p className="text-slate-500 mb-6">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Get started by adding your first client"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setIsClientCreateModal(true)}
                  className="font-medium"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Client
                </Button>
              )}
            </div>
          ) : (
            <ClientTable
              data={clients}
              loading={{ delete: isDeleting }}
              onDelete={handleDeleteClient}
              onView={(id) => router.push(`/client/${id}`)}
              onEdit={handleEditRefresh}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              onPageChange={setCurrentPage}
              totalPages={totalPages}
              totalCount={totalCount}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Client;
