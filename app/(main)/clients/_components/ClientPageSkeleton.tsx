function Sk({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 ${className}`}
      style={style}
    />
  );
}

export function ClientPageSkeleton() {
  return (
    <div className="min-h-screen overflow-hidden">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-xl shadow-slate-200/50 overflow-hidden">
        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="p-6 border-b border-slate-200/60 bg-linear-to-r from-white/90 to-slate-50/90">
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-6 gap-4 flex-wrap">
            {/* Title block */}
            <div className="space-y-2">
              <Sk className="h-7 w-48" />
              <Sk className="h-4 w-56" />
            </div>

            {/* Search + actions */}
            <div className="flex items-center justify-between flex-wrap md:flex-nowrap xl:justify-end xl:gap-4 flex-1 gap-4 w-full">
              {/* Search input */}
              <Sk className="h-10 w-full xl:max-w-80 rounded-lg" />

              {/* Filter + Create buttons */}
              <div className="flex gap-3">
                <Sk className="h-10 w-24 rounded-lg" />
                <Sk className="h-10 w-28 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Table ────────────────────────────────────────────────── */}
        <div className="p-4">
          {/* Table header row */}
          <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-100">
            <Sk className="h-3 w-3 rounded" />
            <Sk className="h-3 w-28" />
            <Sk className="h-3 w-24 ml-auto" />
            <Sk className="h-3 w-20" />
            <Sk className="h-3 w-20" />
            <Sk className="h-3 w-16" />
            <Sk className="h-3 w-12" />
          </div>

          {/* Table body rows */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-4 py-4 border-b border-slate-50 last:border-0"
            >
              {/* Checkbox */}
              <Sk className="h-4 w-4 rounded shrink-0" />

              {/* Avatar + name + email */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Sk className="h-9 w-9 rounded-full shrink-0" />
                <div className="space-y-1.5 min-w-0">
                  <Sk className="h-3.5 w-32" />
                  <Sk className="h-3 w-40" />
                </div>
              </div>

              {/* Phone */}
              <Sk className="h-3.5 w-28 shrink-0" />

              {/* Type badge */}
              <Sk className="h-5 w-20 rounded-full shrink-0" />

              {/* GST badge */}
              <Sk className="h-5 w-12 rounded-full shrink-0" />

              {/* Opt-in badge */}
              <Sk className="h-5 w-16 rounded-full shrink-0" />

              {/* Action menu */}
              <Sk className="h-7 w-7 rounded-md shrink-0" />
            </div>
          ))}
        </div>

        {/* ── Pagination ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <Sk className="h-4 w-40" />
          <div className="flex items-center gap-2">
            <Sk className="h-8 w-8 rounded-md" />
            <Sk className="h-8 w-8 rounded-md" />
            <Sk className="h-8 w-8 rounded-md" />
            <Sk className="h-8 w-8 rounded-md" />
            <Sk className="h-8 w-8 rounded-md" />
          </div>
          <Sk className="h-8 w-28 rounded-md" />
        </div>
      </div>
    </div>
  );
}
