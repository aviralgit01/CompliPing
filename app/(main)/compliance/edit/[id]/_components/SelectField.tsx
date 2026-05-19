
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const SelectField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}> = ({ label, value, onChange, options, className }) => (
  <div className={cn("flex flex-col gap-1", className)}>
    <label className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-neutral-300 bg-white px-3 py-2.5 pr-9 text-sm text-neutral-800 shadow-none focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 transition"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
      />
    </div>
  </div>
);

export default SelectField;
