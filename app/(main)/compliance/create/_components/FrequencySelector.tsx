import { cn } from "@/lib/utils";
export type Frequency = "ONE_TIME" | "MONTHLY" | "QUARTERLY" | "ANNUALLY";

const FrequencySelector: React.FC<{
  value: Frequency;
  onChange: (v: Frequency) => void;
}> = ({ value, onChange }) => {
  const options: Frequency[] = ["ONE_TIME", "MONTHLY", "QUARTERLY", "ANNUALLY"];
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
        Frequency
      </label>
      <div className="flex rounded-lg border border-neutral-300 overflow-hidden">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "flex-1 py-2 text-xs font-semibold transition-all duration-150 focus:outline-none",
              value === opt
                ? "bg-brand-primary text-white shadow-inner"
                : "bg-white text-neutral-500 hover:bg-neutral-50",
              "border-r border-neutral-200 last:border-r-0",
            )}
          >
            {opt.replace("_", " ")}
          </button>
        ))}
      </div>
    </div>
  );
};



export default FrequencySelector;