import React from "react";
import { List, Clock } from "lucide-react";

interface InternalAuditNotesProps {
  note: string;
  updatedAt: string;
}

export const InternalAuditNotes: React.FC<InternalAuditNotesProps> = ({
  note,
  updatedAt,
}) => {
  const timeAgo = "2 hours ago";

  return (
    <div className="rounded-xl border border-[#e8eaf0] bg-white px-5 py-4.5">
      
      {/* Header */}
      <div className="mb-3.5 flex items-center gap-2 text-[15px] font-bold text-[#1a1d23]">
        <List size={16} />
        Internal Audit Notes
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2.5 rounded-lg border border-[#eceef4] bg-[#f9fafc] px-4 py-3.5">
        
        <p className="text-[13.5px] italic leading-[1.55] text-[#3d4260]">
          "{note}"
        </p>

        <span className="flex items-center gap-1 text-[11.5px] font-medium text-[#9da3bd]">
          <Clock size={12} />
          Last updated by Senior Auditor, {timeAgo}
        </span>

      </div>
    </div>
  );
};