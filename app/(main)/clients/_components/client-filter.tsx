"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { DropdownSearch } from "@/components/ui/searchableDropdown";

interface Option {
  label: string;
  value: string;
}
type OptInStatus = "all" | "active" | "inactive" | "pending";
interface ClientFiltersProps {
  selectedGst: "all" | "yes" | "no";
  selectedOptIn: string;
  selectedType: Option | null;
  onGstChange: (value: "all" | "yes" | "no") => void;
  onOptInChange: (value: OptInStatus) => void;
  onTypeChange: (obj: Option | null) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  hasActiveFilters?: boolean;
  activeFilterCount: number;
}

const typeOptions: Option[] = [
  { label: "Pvt Ltd", value: "pvt_ltd" },
  { label: "Partnership", value: "partnership" },
  { label: "Proprietorship", value: "proprietorship" },
  { label: "LLP", value: "llp" },
];

export const ClientFilters: React.FC<ClientFiltersProps> = ({
  selectedGst,
  selectedOptIn,
  selectedType,
  onGstChange,
  onOptInChange,
  onTypeChange,
  onApplyFilters,
  onClearFilters,
  isOpen,
  onOpenChange,
  hasActiveFilters,
  activeFilterCount,
}) => {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-10 px-3 border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-lg font-medium transition-all duration-200 ${
            hasActiveFilters
              ? "border-blue-500 bg-blue-50/50 text-blue-600"
              : "text-slate-600"
          }`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-4 h-4 text-xs font-medium bg-blue-500 text-white rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0 max-h-100 overflow-auto" align="end">
        <div className="p-4 border-b border-slate-100">
          <h4 className="font-semibold text-slate-900">Filter Options</h4>
          <p className="text-sm text-slate-500 mt-1">Filter your client data</p>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              GST
            </label>
            <Select
              value={selectedGst}
              onValueChange={(value) =>
                onGstChange(value as "all" | "yes" | "no")
              }
            >
              <SelectTrigger className="h-9 w-full border-slate-200 focus:border-blue-500">
                <SelectValue placeholder="All GST" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Opt In Status
            </label>
            <Select value={selectedOptIn} onValueChange={onOptInChange}>
              <SelectTrigger className="h-9 w-full border-slate-200 focus:border-blue-500">
                <SelectValue placeholder="All Opt In Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    Active
                  </div>
                </SelectItem>
                <SelectItem value="inactive">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-rose-500 rounded-full" />
                    Inactive
                  </div>
                </SelectItem>
                <SelectItem value="pending">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    Pending
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Type
            </label>
            <DropdownSearch
              multiSelect={false}
              placeholder="Select Type"
              options={typeOptions}
              selected={selectedType?.value}
              onChangeV1={(obj) => {
                if (Array.isArray(obj)) {
                  onTypeChange(obj[0] ?? null);
                  return;
                }
                onTypeChange(obj ?? null);
              }}
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="flex-1 h-8 text-slate-600 border-slate-200 hover:bg-slate-50"
          >
            Clear All
          </Button>
          <Button onClick={onApplyFilters} size="sm" className="flex-1 h-8">
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
