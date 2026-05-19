import { Badge } from "@/components/ui/badge";
import { BadgeStatus } from "@/lib/api/dashboard/dashboard.api type";
import { BADGE_CLASS_MAP } from "@/lib/utils/dashboard";

interface Props {
  status: BadgeStatus;
}

export function StatusBadge({ status }: Props) {
  const hasDot = status === "Missing" || status === "Overdue";

  return (
    <Badge
      variant="outline"
      className={`text-xs font-semibold px-2.5 py-0.5 ${
        BADGE_CLASS_MAP[status] ??
        "bg-slate-50 text-slate-600 border-slate-200"
      }`}
    >
      {hasDot && (
        <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 bg-rose-500" />
      )}
      {status}
    </Badge>
  );
}