const getWorkloadColor = (workload: number) => {
  if (workload < 50) return "bg-emerald-500";
  if (workload < 75) return "bg-yellow-500";
  return "bg-red-500";
};

const getWorkloadBg = (workload: number) => {
  if (workload < 50) return "bg-emerald-50 border-emerald-200";
  if (workload < 75) return "bg-yellow-50 border-yellow-200";
  return "bg-red-50 border-red-200";
};

const AuditorAvailability: React.FC<{
  name: string;
  workload: number;
  active: boolean;
}> = ({ name, workload, active }) => (
  <div
    className={`mt-3 rounded-xl border p-4 shadow-sm ${getWorkloadBg(
      workload
    )}`}
  >
    <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2">
      Auditor Availability
    </p>

    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-semibold text-neutral-800">
        {name}
      </span>

      {active && (
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
          Active
        </span>
      )}
    </div>

    <p className="text-[11px] text-neutral-600 mb-2">
      Current Workload: <span className="font-semibold">{workload}%</span>
    </p>

    <div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${getWorkloadColor(
          workload
        )}`}
        style={{ width: `${workload}%` }}
      />
    </div>
  </div>
);

export default AuditorAvailability;