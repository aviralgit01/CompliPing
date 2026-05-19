"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { TablePagination } from "./table-pagination";
import Loader from "./loader";
import { Spinner } from "../layout/spinner";

type Column<T> = {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;

  width?: number;
  minWidth?: number;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  // optional
  mobileRender?: (row: T, index: number) => React.ReactNode;

  // pagination
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  isLoading?: boolean;
};

function DataTable<T>({
  data,
  columns,
  mobileRender,
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  limit = 10,
  onPageChange,
  onLimitChange,
  isLoading,
}: DataTableProps<T>) {
  return (
    <div className="w-full">
      {isLoading && <Spinner size="small" />}
      {!isLoading && data?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-slate-500">
            {totalCount === 0
              ? "No records available"
              : "No results found for your search"}
          </p>
        </div>
      )}
      {!isLoading && data?.length > 0 && (
        <div className="hidden md:block">
          {/* ================= DESKTOP TABLE ================= */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-linear-to-r from-slate-50 to-slate-100/80 border-b border-slate-200">
                <tr>
                  {columns.map((col, idx) => (
                    <th
                      key={col.key}
                      style={{
                        width: col.width,
                        minWidth: col.minWidth,
                      }}
                      className={`px-6 py-4 ${idx === columns.length - 1 ? "text-right" : "text-left"} text-xs font-semibold text-slate-700 uppercase tracking-wider`}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white/50 divide-y divide-slate-200/60">
                {data?.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`hover:bg-slate-50/80 transition-colors duration-200`}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-6 py-4 text-sm text-slate-900 "
                      >
                        {col.render
                          ? col.render(row, rowIndex)
                          : (row as any)[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MOBILE VIEW ================= */}
      {!isLoading && (
        <div className="md:hidden space-y-4">
          {data?.map((row, index) => (
            <div key={index} className="">
              {mobileRender ? (
                mobileRender(row, index)
              ) : (
                <div className="space-y-2">
                  {columns.map((col) => (
                    <div key={col.key} className="flex justify-between">
                      <span className="text-xs text-slate-500">
                        {col.header}
                      </span>
                      <span className="text-sm text-slate-900">
                        {col.render
                          ? col.render(row, index)
                          : (row as any)[col.key]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================= PAGINATION ================= */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        limit={limit}
        onPageChange={(page) => onPageChange && onPageChange(page)}
        onLimitChange={(limit) =>
          onLimitChange && onLimitChange(parseInt(limit))
        }
      />
    </div>
  );
}

export default DataTable;
