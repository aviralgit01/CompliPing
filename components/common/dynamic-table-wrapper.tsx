"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabNavigation } from "@/components/common/tab";
import { Search, Filter, X, Plus } from "lucide-react";

type Tab = {
  id: string;
  label: string;
};

type FilterItem = {
  label: string;
  value: string;
  colorClass: string;
  onRemove?: () => void;
};

type TableHeaderProps = {
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;

  title: string;
  description?: string;

  showSearch?: boolean;
  searchValue?: string;
  onChangeSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  showFilter?: boolean;
  onClickFilter?: () => void;
  filterCount?: number;

  filterItems?: FilterItem[];
  onClearAllFilter?: () => void;

  actionButton?: {
    label: string;
    onClick: () => void;
  };

  children?: React.ReactNode;
};

const DynamicTableWrapper = ({
  tabs,
  activeTab,
  onTabChange,
  title,
  description,
  showSearch = false,
  searchValue,
  onChangeSearch,
  showFilter = false,
  onClickFilter,
  filterCount = 0,
  filterItems = [],
  onClearAllFilter,
  actionButton,
  children,
}: TableHeaderProps) => {
  return (
    <div className="relative w-full min-w-0">
      {/* Tabs */}
      {tabs && (
        <div className="px-6 mb-6 bg-linear-to-r from-white/90 to-slate-50/90">
          <TabNavigation
            className="border-b border-slate-200/60"
            tabs={tabs}
            activeTab={activeTab!}
            onTabChange={onTabChange!}
          />
        </div>
      )}

      {/* Header */}
      <div className="p-6 border-b border-slate-200/60 bg-linear-to-r from-white/90 to-slate-50/90">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          {/* Left */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {description && (
              <p className="text-sm text-slate-600 mt-1">{description}</p>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            {showSearch && (
              <div className="w-full md:w-80">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    value={searchValue}
                    onChange={onChangeSearch}
                    placeholder="Search..."
                    className="pl-9 h-10 bg-white border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            )}

            {/* Filter */}
            {showFilter && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClickFilter}
                className={`h-10 px-3 border-slate-200 rounded-lg ${
                  filterCount > 0
                    ? "border-blue-500 bg-blue-50/50 text-blue-600"
                    : "text-slate-600"
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {filterCount > 0 && (
                  <span className="ml-2 w-4 h-4 text-xs bg-blue-500 text-white rounded-full flex items-center justify-center">
                    {filterCount}
                  </span>
                )}
              </Button>
            )}

            {/* Clear All */}
            {filterItems.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAllFilter}
                className="h-10 px-3 text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            {/* Action */}
            {actionButton && (
              <Button
                variant={"default"}
                onClick={actionButton.onClick}
                className="h-10 px-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                {actionButton.label}
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {filterItems.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
            {filterItems.map((item, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${item.colorClass}`}
              >
                {item.label}: {item.value}
                <button
                  onClick={item.onRemove}
                  className="ml-1 hover:bg-black/10 rounded p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 👇 Extra Content (third div) */}
      {children && <div className="relative w-full">{children}</div>}
    </div>
  );
};

export default DynamicTableWrapper;
