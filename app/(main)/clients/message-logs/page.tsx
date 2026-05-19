"use client";

import React, { useCallback, useMemo, useState } from "react";
import { format, subMonths } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useSearchParams } from "next/navigation";
import { Calendar as CalendarIcon, Search, X, Filter } from "lucide-react";

import { MessageLogsTable } from "./_components/mesagelogTable";

import {
  useGetComplianceItemsOptions,
  useMessageLogs,
} from "@/lib/hooks/api/useClients";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/customInput";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Spinner } from "@/components/layout/spinner";
import { DropdownSearch } from "@/components/ui/searchableDropdown";
import { debounce } from "@/lib/validation/debounce";

type SortOrder = "asc" | "desc";
interface ComplianceOption {
  label: string;
  value: string;
}

interface FilterState {
  search: string;
  sortOrder: SortOrder;
  dateRange: DateRange | undefined;
  complianceItemId: string;
}

interface AppliedFilterState {
  search: string;
  sortOrder: SortOrder;
  from: string;
  to: string;
  complianceItemId: string;
}

const MessageLog = () => {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId") || "";

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [selectedComplianceItemId, setSelectedComplianceItemId] =
    useState<string>("");

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    sortOrder: "asc",
    dateRange: undefined,
    complianceItemId: "",
  });

  const [appliedFilters, setAppliedFilters] = useState<AppliedFilterState>({
    search: "",
    sortOrder: "asc",
    from: "",
    to: "",
    complianceItemId: "",
  });

  const activeComplianceItemId =
    selectedComplianceItemId || appliedFilters.complianceItemId || "";

  const {
    data: messageLogsData,
    isLoading,
    refetch,
  } = useMessageLogs({
    clientId,
    page,
    limit,
    search: appliedFilters.search,
    complianceItemId: activeComplianceItemId,
    sortOrder: appliedFilters.sortOrder,
    from: appliedFilters.from,
    to: appliedFilters.to,
  });

  const { data: complianceItemsOptionsData } = useGetComplianceItemsOptions({
    clientId,
    search: "",
    page: 1,
    limit: 100,
  });

  const clientName = messageLogsData?.data?.clientName || "Client";
  const isClientReminderPaused = messageLogsData?.data?.isClientPaused || false;
  const logs = messageLogsData?.data?.logs || [];
  const pagination = messageLogsData?.data?.pagination;

  const complianceOptions: ComplianceOption[] = useMemo(() => {
    return Array.isArray(complianceItemsOptionsData?.data)
      ? (complianceItemsOptionsData.data as ComplianceOption[])
      : [];
  }, [complianceItemsOptionsData]);

  const handleFilterComplianceSelect = (selected: string | string[]) => {
    const value = Array.isArray(selected) ? selected[0] || "" : selected;
    setFilters((prev) => ({
      ...prev,
      complianceItemId: value,
    }));
  };

  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      setAppliedFilters((prev) => ({
        ...prev,
        search: searchTerm,
      }));
      setPage(1);
    }, 500),
    [],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setFilters((prev) => ({
      ...prev,
      search: value,
    }));

    debouncedSearch(value);
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      search: filters.search,
      sortOrder: filters.sortOrder,
      from: filters.dateRange?.from
        ? format(filters.dateRange.from, "yyyy-MM-dd")
        : "",
      to: filters.dateRange?.to
        ? format(filters.dateRange.to, "yyyy-MM-dd")
        : "",
      complianceItemId: filters.complianceItemId,
    });

    setSelectedComplianceItemId("");
    setPage(1);
    setIsFiltersOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      sortOrder: "asc",
      dateRange: undefined,
      complianceItemId: "",
    });

    setAppliedFilters({
      search: "",
      sortOrder: "asc",
      from: "",
      to: "",
      complianceItemId: "",
    });

    setSelectedComplianceItemId("");
    setPage(1);
    setIsFiltersOpen(false);
  };

  const handleClearAppliedSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: "",
    }));
    setAppliedFilters((prev) => ({
      ...prev,
      search: "",
    }));
    setPage(1);
  };

  const handleClearAppliedSort = () => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: "asc",
    }));
    setAppliedFilters((prev) => ({
      ...prev,
      sortOrder: "asc",
    }));
    setPage(1);
  };

  const handleClearAppliedDateRange = () => {
    setFilters((prev) => ({
      ...prev,
      dateRange: undefined,
    }));
    setAppliedFilters((prev) => ({
      ...prev,
      from: "",
      to: "",
    }));
    setPage(1);
  };

  const handleClearAppliedCompliance = () => {
    setFilters((prev) => ({
      ...prev,
      complianceItemId: "",
    }));
    setAppliedFilters((prev) => ({
      ...prev,
      complianceItemId: "",
    }));
    setSelectedComplianceItemId("");
    setPage(1);
  };

  const hasActiveFilters =
    !!appliedFilters.search ||
    !!appliedFilters.from ||
    !!appliedFilters.to ||
    !!appliedFilters.complianceItemId ||
    appliedFilters.sortOrder === "desc";

  const activeFilterCount = [
    appliedFilters.search,
    appliedFilters.from || appliedFilters.to ? "dateRange" : "",
    appliedFilters.sortOrder === "desc" ? "sort" : "",
    appliedFilters.complianceItemId ? "compliance" : "",
  ].filter(Boolean).length;

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4 sm:p-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <h2 className="text-2xl font-bold text-brand-primary">
                  {clientName}
                </h2>
                <h2 className="text-2xl font-bold text-slate-900">
                  Message Logs
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Monitor sent reminders and delivery status
                </p>
              </div>
              <div className="flex items-center justify-center gap-10">
                <div className="w-full xl:max-w-xl">
                  <CustomInput
                    iconLeft={<Search className="h-4 w-4 text-slate-400" />}
                    type="text"
                    placeholder="Search by client name or task type..."
                    value={filters.search}
                    inputClassName="h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    onChange={handleSearchChange}
                  />
                </div>
                <div className="flex items-start">
                  <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`h-11 border-slate-200 px-4 ${
                          hasActiveFilters
                            ? "border-blue-500 bg-blue-50 text-blue-600"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                        {activeFilterCount > 0 && (
                          <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-semibold text-white">
                            {activeFilterCount}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-[92vw] max-w-80 p-0"
                      align="end"
                    >
                      <div className="border-b border-slate-100 p-4">
                        <h4 className="font-semibold text-slate-900">
                          Filter Options
                        </h4>
                        <p className="mt-1 text-sm text-slate-500">
                          Filter logs by search, compliance item, sort order,
                          and date range
                        </p>
                      </div>

                      <div className="space-y-4 p-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Compliance Item
                          </label>
                          <DropdownSearch
                            multiSelect={false}
                            label=""
                            placeholder="Filter by Compliance Item"
                            options={complianceOptions}
                            selected={filters.complianceItemId}
                            onChange={handleFilterComplianceSelect}
                            error=""
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Sort Order
                          </label>
                          <select
                            value={filters.sortOrder}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                sortOrder: e.target.value as SortOrder,
                              }))
                            }
                            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                          </select>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Custom Date Range
                          </label>

                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start rounded-md border-slate-200 text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {filters.dateRange?.from ? (
                                  filters.dateRange?.to ? (
                                    <>
                                      {format(
                                        filters.dateRange.from,
                                        "LLL dd, y",
                                      )}{" "}
                                      -{" "}
                                      {format(
                                        filters.dateRange.to,
                                        "LLL dd, y",
                                      )}
                                    </>
                                  ) : (
                                    format(filters.dateRange.from, "LLL dd, y")
                                  )
                                ) : (
                                  "Pick a date range"
                                )}
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <CalendarComponent
                                initialFocus
                                mode="range"
                                defaultMonth={
                                  filters.dateRange?.from ||
                                  subMonths(new Date(), 1)
                                }
                                selected={filters.dateRange}
                                onSelect={(range) =>
                                  setFilters((prev) => ({
                                    ...prev,
                                    dateRange: range,
                                  }))
                                }
                                numberOfMonths={2}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      <div className="flex gap-2 border-t border-slate-100 p-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleClearFilters}
                          className="h-8 flex-1 border-slate-200 text-slate-600"
                        >
                          Clear All
                        </Button>
                        <Button
                          onClick={handleApplyFilters}
                          size="sm"
                          className="h-8 flex-1"
                        >
                          Apply
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2">
                {appliedFilters.search && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                    <Search className="h-3 w-3" />
                    Search: {appliedFilters.search}
                    <button
                      type="button"
                      onClick={handleClearAppliedSearch}
                      className="ml-1 rounded p-0.5 hover:bg-blue-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {appliedFilters.complianceItemId && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                    Compliance:{" "}
                    {complianceOptions.find(
                      (item) => item.value === appliedFilters.complianceItemId,
                    )?.label || "Selected"}
                    <button
                      type="button"
                      onClick={handleClearAppliedCompliance}
                      className="ml-1 rounded p-0.5 hover:bg-amber-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {appliedFilters.sortOrder === "desc" && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                    Sort: Descending
                    <button
                      type="button"
                      onClick={handleClearAppliedSort}
                      className="ml-1 rounded p-0.5 hover:bg-green-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {(appliedFilters.from || appliedFilters.to) && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
                    <CalendarIcon className="h-3 w-3" />
                    {appliedFilters.from && appliedFilters.to
                      ? `${format(new Date(appliedFilters.from), "LLL dd, y")} - ${format(new Date(appliedFilters.to), "LLL dd, y")}`
                      : appliedFilters.from
                        ? format(new Date(appliedFilters.from), "LLL dd, y")
                        : "Date Range"}
                    <button
                      type="button"
                      onClick={handleClearAppliedDateRange}
                      className="ml-1 rounded p-0.5 hover:bg-purple-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="p-6">
            <Spinner />
          </div>
        ) : (
          <MessageLogsTable
            clientName={clientName}
            data={logs}
            currentPage={pagination?.page || page}
            totalPages={pagination?.totalPages || 1}
            totalCount={pagination?.total || 0}
            itemsPerPage={pagination?.limit || limit}
            onPageChange={(newPage: number) => setPage(newPage)}
            onItemsPerPageChange={(newLimit: number) => {
              setLimit(newLimit);
              setPage(1);
            }}
            isClientReminderPaused={isClientReminderPaused}
          />
        )}
      </div>
    </>
  );
};

export default MessageLog;
