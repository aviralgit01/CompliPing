import { cn } from "@/lib/utils";
import { CheckSquare, Square } from "lucide-react";

const DocCheckRow: React.FC<{
  label: string;
  checked: boolean;
  onToggle: () => void;
}> = ({ label, checked, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="flex items-center gap-2.5 w-full text-left py-1 group"
  >
    {checked ? (
      <CheckSquare size={16} className="text-brand-primary shrink-0" />
    ) : (
      <Square size={16} className="text-neutral-300 group-hover:text-neutral-400 shrink-0 transition" />
    )}
    <span
      className={cn(
        "text-sm transition-colors",
        checked ? "text-neutral-800 font-medium" : "text-neutral-400",
      )}
    >
      {label}
    </span>
  </button>
);


export default DocCheckRow;