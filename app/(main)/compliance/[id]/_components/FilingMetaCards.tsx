import React from "react";
import { CalendarDays, Repeat, Timer } from "lucide-react";

interface FilingMetaCardsProps {
  filingPeriod: string;
  frequency: string;
  daysRemaining: number;
  nextCycle: string;
}

export const FilingMetaCards: React.FC<FilingMetaCardsProps> = ({
  filingPeriod,
  frequency,
  daysRemaining,
  nextCycle,
}) => {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      
      {/* Filing Period */}
      <div className="flex flex-col gap-1 rounded-xl border border-[#e8eaf0] bg-white px-4 py-4">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#9da3bd]">
          Filing Period
        </span>

        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-brand-primary" />
          <span className="text-[18px] font-bold text-[#1a1d23]">
            {filingPeriod}
          </span>
        </div>

        <div className="mt-1 h-0.75 w-8 rounded bg-brand-primary" />
      </div>

      {/* Frequency */}
      <div className="flex flex-col gap-1 rounded-xl border border-[#e8eaf0] bg-white px-4 py-4">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#9da3bd]">
          Tax Frequency
        </span>

        <div className="flex items-center gap-2">
          <Repeat size={16} className="text-yellow-500" />
          <span className="text-[16px] font-bold text-[#1a1d23]">
            {frequency.charAt(0) + frequency.slice(1).toLowerCase()}
          </span>
        </div>

        <span className="mt-1 text-[11px] font-medium text-[#9da3bd]">
          Next cycle: {nextCycle}
        </span>
      </div>

      {/* Days Remaining */}
      <div className="flex flex-col gap-1 rounded-xl border border-[#e8eaf0] bg-white px-4 py-4">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#9da3bd]">
          Days Remaining
        </span>

        <div className="flex items-center gap-2">
          <Timer size={16} className="text-brand-primary" />
          <span className="text-[16px] font-bold text-brand-primary">
            {daysRemaining} Days
          </span>
        </div>

        <span className="mt-1 text-[11px] font-medium text-[#b0b5cc]">
          Extended timeframe
        </span>
      </div>

    </div>
  );
};