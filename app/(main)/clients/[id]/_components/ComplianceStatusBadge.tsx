const statusConfig: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  OVERDUE: {
    label: "Overdue",
    color: "text-red-500",
    dot: "bg-red-500",
  },
  UPCOMING: {
    label: "Upcoming",
    color: "text-blue-500",
    dot: "bg-blue-400",
  },
  COMPLETED: {
    label: "Completed",
    color: "text-green-500",
    dot: "bg-green-500",
  },
};

function ComplianceStatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? statusConfig["UPCOMING"];
  return (
    <span
      className={`flex items-center gap-1.5 text-sm font-medium ${cfg.color}`}
    >
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export default ComplianceStatusBadge;
