"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  Percent,
  IndianRupee,
  DollarSign,
} from "lucide-react";
import { format } from "date-fns";
import { TablePagination } from "@/components/common/table-pagination";
import { useState } from "react";
import { Spinner } from "@/components/layout/spinner";
import { Plan } from "./Plans";

interface PlanTableProps {
  data: Plan[];
  currentPage?: number;
  itemsPerPage?: number;
  totalPages?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (limit: number) => void;
  onView?: (plan: Plan) => void;
  onEdit?: (plan: Plan) => void;
  onDelete?: (plan: Plan) => void;
  loading?: boolean;
}

export const PlanTable: React.FC<PlanTableProps> = ({
  data,
  currentPage = 1,
  itemsPerPage = 10,
  totalPages = 1,
  totalCount = 0,
  onPageChange,
  onItemsPerPageChange,
  onView,
  onEdit,
  onDelete,
  loading,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const handleLimitChange = (newLimit: string) => {
    const limit = parseInt(newLimit);
    onItemsPerPageChange?.(limit);
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          {/* Desktop View*/}
          <table className="w-full">
            <thead className="bg-linear-to-r from-slate-50 to-slate-100/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Price
                </th>
                {/* <th className='px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider'>
                  Discount
                </th> */}
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Period Count
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-slate-200/60">
              {!loading &&
                data?.map((plan, idx) => (
                  <tr key={plan.id + idx} className="hover:bg-slate-50/80">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">
                          {plan.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {plan.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-1 text-slate-900">
                        {plan.currency == "USD" ? (
                          <DollarSign className="w-3 h-3" />
                        ) : (
                          <IndianRupee className="w-3 h-3" />
                        )}
                        {/* {(plan?.plan_data?.final_amount ?? 0).toFixed(2)}{' '} */}
                        {(plan?.price ?? 0).toFixed(2)} {plan?.currency}
                      </div>
                      {/* <div className='line-through text-xs text-slate-400'>
                        {plan.plan_data.original_amount} {plan.currency}
                      </div> */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                      {plan.status === "free"
                        ? "days"
                        : plan?.interval
                          ? plan?.interval
                          : "month"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {plan.status === "free"
                        ? plan.trailDays
                        : plan?.interval
                          ? plan?.interval_count
                          : 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {format(new Date(plan.createdAt), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-1">
                        {/* <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => onView?.(plan)}
                          className='p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg'
                        >
                          <Eye className='w-4 h-4' />
                        </Button> */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit?.(plan)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            {/* <DropdownMenuItem
                              onClick={() => onView?.(plan)}
                              className='cursor-pointer'
                            >
                              <Eye className='w-4 h-4 mr-2' />
                              View
                            </DropdownMenuItem> */}
                            <DropdownMenuItem
                              onClick={() => onEdit?.(plan)}
                              className="cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {plan.status !== "free" && (
                              <DropdownMenuItem
                                onClick={() => onDelete?.(plan)}
                                className="cursor-pointer text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {loading ? (
            <div className="flex h-[40vh] w-full items-center justify-center">
              <Spinner size="medium" message="Loading plans..." />
            </div>
          ) : null}
          {!loading && data?.length === 0 && (
            <div className="flex h-[20vh] w-full items-center justify-center text-slate-500 text-sm">
              No plans found.
            </div>
          )}
        </div>

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          limit={itemsPerPage}
          loading={loading}
          onPageChange={onPageChange || (() => {})}
          onLimitChange={handleLimitChange}
        />
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="flex h-[40vh] w-full items-center justify-center">
            <Spinner size="medium" message="Loading plans..." />
          </div>
        ) : null}
        {!loading && data?.length === 0 && (
          <div className="flex h-[20vh] w-full items-center justify-center text-slate-500 text-sm">
            No plans found.
          </div>
        )}
        {data?.map((plan, idx) => (
          <div
            key={plan?.id + idx}
            className="bg-white/70 rounded-2xl p-4 shadow border border-white/60"
          >
            <div className="flex justify-between items-center gap-5 ">
              <div>
                <div className="font-semibold text-slate-900 text-sm">
                  {plan?.name}
                </div>
                <div className="text-xs text-slate-500">
                  {plan?.description}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 text-slate-800 text-xs font-medium">
                  {plan.currency == "USD" ? (
                    <DollarSign className="w-3 h-3" />
                  ) : (
                    <IndianRupee className="w-3 h-3" />
                  )}
                  {(plan?.price ?? 0).toFixed(2)} {plan?.currency}
                </div>
                <div className="text-slate-800 text-xs font-semibold">
                  {plan.status === "free"
                    ? plan.trailDays
                    : plan?.interval
                      ? plan?.interval_count
                      : 1}{" "}
                  {plan.status === "free"
                    ? "days"
                    : plan?.interval
                      ? plan?.interval
                      : "month"}
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
                  {/* <DropdownMenuItem onClick={() => onView?.(plan)}>
                    <Eye className='w-4 h-4 mr-2' /> View
                  </DropdownMenuItem> */}
                  <DropdownMenuItem onClick={() => onEdit?.(plan)}>
                    <Edit3 className="w-4 h-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  {plan.status !== "free" && (
                    <DropdownMenuItem
                      onClick={() => onDelete?.(plan)}
                      className="text-red-600! hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}

        <div className="bg-white/70 rounded-2xl shadow border border-white/60">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            limit={itemsPerPage}
            loading={loading}
            onPageChange={onPageChange || (() => {})}
            onLimitChange={handleLimitChange}
          />
        </div>
      </div>
    </div>
  );
};
