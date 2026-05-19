// ComplianceCalendarSkeleton.tsx

import { cn } from "@/lib/utils";

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted/60",
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-linear-to-r from-transparent via-white/30 to-transparent" />
    </div>
  );
}

export function ComplianceCalendarSkeleton() {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // 5 weeks × 7 days = 35 cells
  const cells = Array.from({ length: 35 });

  // Sprinkle a few "dot" and "task" cells to mimic real data
  const dotCells = new Set([2, 9, 14, 23, 24, 29]);
  const taskCells = new Set([26, 27, 28, 29]);

  return (
    <div className="min-h-screen p-2">
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className="mx-auto grid md:grid-cols-[1fr_180px] lg:grid-cols-[1fr_260px] gap-5">
        {/* ── LEFT ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 min-w-0">

          {/* CALENDAR CARD */}
          <div className="overflow-hidden rounded-2xl border bg-background/80 shadow-sm">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                {/* Icon box */}
                <Shimmer className="h-9 w-9 rounded-lg" />
                <div className="flex flex-col gap-1.5">
                  <Shimmer className="h-7 w-36 rounded-md" />
                  <Shimmer className="h-3.5 w-28 rounded-sm" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shimmer className="h-8 w-8 rounded-lg" />
                <Shimmer className="h-8 w-16 rounded-lg" />
                <Shimmer className="h-8 w-8 rounded-lg" />
              </div>
            </div>

            {/* Grid */}
            <div className="p-4 pt-2 bg-muted/40 rounded-xl">
              {/* Day labels */}
              <div className="grid grid-cols-7 mb-2">
                {days.map((d) => (
                  <div key={d} className="flex justify-center py-2">
                    <Shimmer className="h-3 w-8 rounded-sm" />
                  </div>
                ))}
              </div>

              {/* Date cells */}
              <div className="grid grid-cols-7 gap-1">
                {cells.map((_, i) => (
                  <div
                    key={i}
                    className="relative flex flex-col items-start justify-start rounded-xl p-2 min-h-18 bg-background/60"
                  >
                    {/* Date number */}
                    <Shimmer className="h-5 w-5 rounded-md mb-1.5" />

                    {/* Dots row */}
                    {dotCells.has(i) && (
                      <div className="flex gap-1 mt-auto mb-1">
                        {Array.from({ length: i === 26 ? 4 : i === 27 ? 2 : 1 }).map((_, j) => (
                          <Shimmer key={j} className="h-2 w-2 rounded-full" />
                        ))}
                      </div>
                    )}

                    {/* Task badge */}
                    {taskCells.has(i) && i !== 26 && i !== 27 && (
                      <Shimmer className="h-4 w-14 rounded-md mt-1" />
                    )}
                    {(i === 26 || i === 27) && (
                      <Shimmer className="h-4 w-14 rounded-md" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AGENDA CARD */}
          <div className="rounded-2xl border bg-background/80 shadow-sm p-5">
            {/* Agenda header */}
            <div className="flex items-center justify-between mb-4">
              <Shimmer className="h-5 w-44 rounded-md" />
              <Shimmer className="h-8 w-24 rounded-lg" />
            </div>

            {/* Agenda items */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-4 border-b last:border-0"
              >
                <Shimmer className="h-10 w-10 rounded-xl shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <Shimmer className="h-3 w-32 rounded-sm" />
                  <Shimmer className="h-4 w-48 rounded-md" />
                  <Shimmer className="h-3 w-20 rounded-sm" />
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Shimmer className="h-3 w-16 rounded-sm" />
                  <Shimmer className="h-5 w-24 rounded-md" />
                  <Shimmer className="h-5 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ─────────────────────────────────────── */}
        <div className="flex flex-col gap-4">

          {/* Filing Status Panel */}
          <div className="rounded-xl border bg-muted/50 p-4 shadow-sm">
            <Shimmer className="h-4 w-24 rounded-md mb-4" />
            {["Overdue", "Pending", "Completed", "Cancelled"].map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5">
                <Shimmer className="h-3 w-3 rounded-full shrink-0" />
                <Shimmer className="h-3 flex-1 rounded-sm" />
                <Shimmer className="h-5 w-8 rounded-md" />
              </div>
            ))}
            <div className="mt-3 pt-3 border-t flex items-center justify-between">
              <Shimmer className="h-3 w-8 rounded-sm" />
              <Shimmer className="h-3 w-6 rounded-sm" />
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="rounded-xl border bg-muted/50 p-4 shadow-sm">
            <Shimmer className="h-4 w-20 rounded-md mb-4" />
            <Shimmer className="h-3 w-28 rounded-sm mb-3" />
            {/* Progress bar */}
            <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden mb-2">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-linear-to-r from-transparent via-white/40 to-transparent" />
            </div>
            <div className="flex justify-between mt-1">
              <Shimmer className="h-3 w-16 rounded-sm" />
              <Shimmer className="h-3 w-8 rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}