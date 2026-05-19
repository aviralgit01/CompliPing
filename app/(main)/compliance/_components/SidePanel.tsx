"use client";

import { FilingsByDate } from "./types";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface FilingStatusPanelProps {
  filings: FilingsByDate;
}

export function FilingStatusPanel({ filings }: FilingStatusPanelProps) {
  const counts = useMemo(() => {
    let overdue = 0;
    let pending = 0;
    let completed = 0;
    let cancelled = 0;

    Object.values(filings).flat().forEach((f) => {
      switch (f.status) {
        case "OVERDUE":
          overdue++;
          break;
        case "PENDING":
          pending++;
          break;
        case "COMPLETED":
          completed++;
          break;
        case "CANCELLED":
          cancelled++;
          break;
      }
    });

    return { overdue, pending, completed, cancelled };
  }, [filings]);

  const total =
    counts.overdue +
    counts.pending +
    counts.completed +
    counts.cancelled;

  return (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold">
          Filing Status
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 pb-4 space-y-3">

        {/* OVERDUE */}
        <div className="flex items-center gap-3 p-2 rounded-lg bg-red-500/10">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="text-sm flex-1">Overdue</span>
          <span className="text-xs font-semibold text-red-500">
            {counts.overdue}
          </span>
        </div>

        {/* PENDING */}
        <div className="flex items-center gap-3 p-2 rounded-lg bg-yellow-500/10">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span className="text-sm flex-1">Pending</span>
          <span className="text-xs font-semibold text-yellow-500">
            {counts.pending}
          </span>
        </div>

        {/* COMPLETED */}
        <div className="flex items-center gap-3 p-2 rounded-lg bg-green-500/10">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="text-sm flex-1">Completed</span>
          <span className="text-xs font-semibold text-green-500">
            {counts.completed}
          </span>
        </div>

        {/* CANCELLED */}
        <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-500/10">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-500" />
          <span className="text-sm flex-1">Cancelled</span>
          <span className="text-xs font-semibold text-gray-500">
            {counts.cancelled}
          </span>
        </div>

        {/* TOTAL */}
        <div className="pt-2 border-t flex justify-between text-xs text-muted-foreground">
          <span>Total</span>
          <span className="font-semibold text-foreground">{total}</span>
        </div>

      </CardContent>
    </Card>
  );
}

interface QuickStatsProps {
  completionRate?: number;
}

export function QuickStats({ completionRate = 72 }: QuickStatsProps) {
  return (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold">
          Quick Stats
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Completion Rate
        </p>

        <Progress
          value={completionRate}
          className="h-2 [&>div]:bg-brand-primary"
        />

        <div className="flex justify-between mt-2 text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-semibold text-brand-primary">
            {completionRate}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}