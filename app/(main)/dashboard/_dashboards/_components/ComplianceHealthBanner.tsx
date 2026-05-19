import { ComplianceHealth } from "@/lib/api/dashboard/dashboard.api type";
import { StatusBadge } from "./StatusBadge";

interface ComplianceHealthBannerProps extends ComplianceHealth {}

function ComplianceHealthBanner({
  dueThisWeek,
  completed,
  activeItems,
  totalOverdue,
}: ComplianceHealthBannerProps) {
  const metrics = [
    {
      label: "Due This Week",
      value: dueThisWeek,
      icon: "📅",
      variant: "neutral" as const,
    },
    {
      label: "Completed",
      value: completed,
      icon: "✅",
      variant: "success" as const,
    },
    {
      label: "Active Items",
      value: activeItems,
      icon: "⚡",
      variant: "neutral" as const,
    },
    {
      label: "Total Overdue",
      value: totalOverdue,
      icon: "🚨",
      variant:
        totalOverdue > 5
          ? ("danger" as const)
          : totalOverdue > 0
          ? ("warning" as const)
          : ("neutral" as const),
      badge: totalOverdue > 0,
    },
  ];

  const variantStyles = {
    neutral: {
      card: "bg-slate-50 border-slate-200",
      value: "text-slate-900",
      label: "text-slate-500",
      icon: "bg-slate-100 text-slate-700",
    },
    success: {
      card: "bg-green-50 border-green-200",
      value: "text-green-700",
      label: "text-green-600",
      icon: "bg-green-100 text-green-700",
    },
    warning: {
      card: "bg-amber-50 border-amber-200",
      value: "text-amber-700",
      label: "text-amber-600",
      icon: "bg-amber-100 text-amber-700",
    },
    danger: {
      card: "bg-rose-50 border-rose-200",
      value: "text-rose-700",
      label: "text-rose-600",
      icon: "bg-rose-100 text-rose-700",
    },
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 text-lg select-none">
          🛡️
        </div>
        <div>
          <h2 className="text-gray-900 font-semibold text-base leading-tight">
            Compliance Health
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">
            Real-time overview
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 sm:p-5">
        {metrics.map((m) => {
          const styles = variantStyles[m.variant];

          return (
            <div
              key={m.label}
              className={`relative rounded-xl border p-4 sm:p-5 flex flex-col gap-2 
              transition-all hover:shadow-md hover:-translate-y-px ${styles.card}`}
            >
              {/* Icon */}
              <span
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-base select-none shadow-sm ${styles.icon}`}
                aria-hidden="true"
              >
                {m.icon}
              </span>

              {/* Value + Badge */}
              <div className="flex items-end gap-2 flex-wrap">
                <span
                  className={`text-2xl sm:text-3xl font-black font-mono leading-none tabular-nums ${styles.value}`}
                >
                  {String(m.value).padStart(2, "0")}
                </span>

                {m.badge && (
                  <span className="mb-0.5">
                    <StatusBadge status="URGENT" />
                  </span>
                )}
              </div>

              {/* Label */}
              <p
                className={`text-[10px] font-semibold tracking-[0.08em] uppercase ${styles.label}`}
              >
                {m.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ComplianceHealthBanner;