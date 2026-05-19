import React, { use } from "react";
import {
  Calendar,
  Repeat,
  Edit,
  PauseCircle,
  PlayCircle,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { on } from "events";

interface FilingHeaderProps {
  title: string;
  status: string;
  dueDate: string;
  frequency: string;
  isRemindersPaused: boolean;
  toggleReminders: () => void;
  onFilingConfirmation?: () => void;
  id: string;
}

export const FilingHeader: React.FC<FilingHeaderProps> = ({
  title,
  status,
  dueDate,
  frequency,
  isRemindersPaused,
  toggleReminders,
  onFilingConfirmation,
  id,
}) => {
  const formatted = new Date(dueDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const router = useRouter();

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      {/* Left */}
      <div>
        <h1 className="mb-2.5 text-[28px] font-bold leading-[1.2] tracking-[-0.5px] text-[#1a1d23]">
          {title}
        </h1>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-[13px] font-medium text-[#5b6180]">
            <Calendar size={14} />
            Due {formatted}
          </span>

          <span className="flex items-center gap-1 text-[13px] font-medium text-[#5b6180]">
            <Repeat size={14} />
            {frequency.charAt(0) + frequency.slice(1).toLowerCase()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          className="flex items-center gap-1.5 rounded-lg border border-[#e2e4ec] bg-white px-3.5 py-2 text-[13px] font-semibold text-[#3d4260] transition hover:bg-[#f5f6fa] hover:border-[#c8cad6] cursor-pointer"
          onClick={() => {
            router.push(`edit/${id}`);
          }}
        >
          <Edit size={14} />
          Edit
        </button>

        <button
          className="flex items-center gap-1.5 rounded-lg border border-[#e2e4ec] bg-white px-3.5 py-2 text-[13px] font-semibold text-[#3d4260] transition hover:bg-[#f5f6fa] hover:border-[#c8cad6]"
          onClick={toggleReminders}
        >
          {isRemindersPaused ? (
            <PlayCircle size={14} />
          ) : (
            <PauseCircle size={14} />
          )}
          {isRemindersPaused ? "Resume Reminders" : "Pause Reminders"}
        </button>

        <button
          className={`flex items-center gap-1.5 rounded-lg bg-brand-primary px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-indigo-600 hover:cursor-pointer ${
            status === "COMPLETED" ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={status === "COMPLETED"}
          onClick={onFilingConfirmation}
        >
          <Check size={14} strokeWidth={2.5} />
          {status === "COMPLETED" ? "Completed" : "Mark as Complete"}
        </button>
      </div>
    </div>
  );
};
