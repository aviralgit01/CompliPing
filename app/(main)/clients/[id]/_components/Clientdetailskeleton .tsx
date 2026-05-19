import { Card, CardContent, CardHeader } from "@/components/ui/card";

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

function SkRow({ cols = 3 }: { cols?: number }) {
  return (
    <div className="flex gap-3 items-center">
      {Array.from({ length: cols }).map((_, i) => (
        <Sk key={i} className="h-4 flex-1" />
      ))}
    </div>
  );
}

export function ClientDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50/60 p-6 space-y-5 font-sans">
      {/* ── Header Profile Card ──────────────────────────────────────── */}
      <Card className="shadow-sm border border-gray-200 bg-white">
        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar */}
          <Sk className="w-20 h-20 rounded-xl shrink-0" />

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Sk className="h-7 w-48" />
              <Sk className="h-5 w-24 rounded-full" />
            </div>
            <Sk className="h-4 w-36" />
            <div className="flex flex-wrap gap-4">
              <Sk className="h-4 w-28" />
              <Sk className="h-4 w-28" />
              <Sk className="h-4 w-36" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 shrink-0">
            <Sk className="h-9 w-36 rounded-md" />
            <Sk className="h-9 w-36 rounded-md" />
          </div>
        </CardContent>
      </Card>

      {/* ── 3-Column Row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Filing Status */}
        <Card className="rounded-xl border bg-card shadow-sm">
          <CardHeader className="pb-2 pt-4 px-4">
            <Sk className="h-4 w-24" />
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            {["bg-red-100", "bg-yellow-100", "bg-green-100", "bg-gray-100"].map(
              (bg, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-2 rounded-lg ${bg}`}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300 animate-pulse" />
                  <Sk className="h-3.5 flex-1" />
                  <Sk className="h-3.5 w-5" />
                </div>
              ),
            )}
            <div className="pt-2 border-t flex justify-between">
              <Sk className="h-3 w-8" />
              <Sk className="h-3 w-6" />
            </div>
            <Sk className="h-9 w-full rounded-md" />
          </CardContent>
        </Card>

        {/* WhatsApp Reminders */}
        <Card className="shadow-sm border border-gray-200 bg-white">
          <CardHeader className="pb-3 pt-5 px-5">
            <div className="flex items-center justify-between">
              <Sk className="h-4 w-36" />
              <Sk className="h-4 w-4 rounded" />
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-4">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 space-y-2">
              <Sk className="h-2.5 w-24" />
              <Sk className="h-4 w-48" />
              <Sk className="h-3 w-32" />
            </div>
            <div className="space-y-3">
              {[0, 1].map((i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                  <div className="space-y-1 flex-1">
                    <Sk className="h-3.5 w-40" />
                    <Sk className="h-3 w-28" />
                  </div>
                </div>
              ))}
            </div>
            <Sk className="h-8 w-full rounded-md" />
          </CardContent>
        </Card>

        {/* Auditor Notes */}
        {/* <Card className="shadow-sm border border-gray-200 bg-white">
          <CardHeader className="pb-3 pt-5 px-5">
            <div className="flex items-center justify-between">
              <Sk className="h-4 w-28" />
              <Sk className="h-4 w-4 rounded" />
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-4">
            {[
              "border-l-indigo-200 bg-indigo-50/40",
              "border-l-gray-200 bg-gray-50",
            ].map((cls, i) => (
              <div
                key={i}
                className={`rounded-lg p-3 border-l-2 ${cls} space-y-2`}
              >
                <Sk className="h-3 w-full" />
                <Sk className="h-3 w-5/6" />
                <Sk className="h-3 w-3/4" />
                <div className="flex justify-between mt-1">
                  <Sk className="h-2.5 w-24" />
                  <Sk className="h-2.5 w-16" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card> */}
      </div>

      {/* ── Bottom Row ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-5">
        {/* Document Vault */}
        <Card className="shadow-sm border border-gray-200 bg-white lg:col-span-2">
          <CardHeader className="pb-3 pt-5 px-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sk className="h-4 w-4 rounded" />
                <Sk className="h-4 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {/* Table header */}
            <div className="flex gap-4 pb-3 border-b border-gray-100">
              <Sk className="h-3 w-28" />
              <Sk className="h-3 w-20" />
              <Sk className="h-3 w-16 ml-auto" />
            </div>
            {/* Table rows */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0"
              >
                <Sk className="h-4 flex-1" />
                <Sk className="h-5 w-20 rounded-full" />
                <Sk className="h-7 w-7 rounded-md ml-auto" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Required */}
        <Card className="shadow-md border border-gray-200 bg-white">
          <CardHeader className="pb-2 pt-5 px-5">
            <div className="flex items-center gap-2">
              <Sk className="h-4 w-4 rounded bg-gray-200" />
              <Sk className="h-4 w-32 bg-gray-200" />
            </div>
          </CardHeader>

          <CardContent className="px-5 pb-5 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-3 items-start bg-gray-50 rounded-lg p-3 border border-gray-100"
              >
                <Sk className="w-6 h-6 rounded-full bg-gray-200 shrink-0" />

                <div className="flex-1 space-y-2">
                  <Sk className="h-3.5 w-40 bg-gray-200" />
                  <Sk className="h-3 w-28 bg-gray-200" />
                  <Sk className="h-3 w-20 bg-gray-200 mt-1" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Compliance Items Table ────────────────────────────────────── */}
      <Card className="shadow-sm border border-gray-200 bg-white">
        <CardHeader className="pb-3 pt-5 px-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sk className="h-4 w-4 rounded" />
              <Sk className="h-4 w-44" />
            </div>
            <Sk className="h-8 w-36 rounded-md" />
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          {/* Table header */}
          <div className="flex gap-6 pb-3 border-b border-gray-100">
            {["w-24", "w-20", "w-20", "w-20", "w-16"].map((w, i) => (
              <Sk key={i} className={`h-3 ${w}`} />
            ))}
          </div>
          {/* Table rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-6 py-3 border-b border-gray-100 last:border-0"
            >
              <Sk className="h-4 w-24" />
              <Sk className="h-4 w-20" />
              <Sk className="h-5 w-20 rounded-full" />
              <Sk className="h-4 w-20" />
              <Sk className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
