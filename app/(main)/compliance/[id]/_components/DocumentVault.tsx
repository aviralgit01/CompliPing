import React from "react";
import { Check, FileText, Eye, Upload, Lock, Clock } from "lucide-react";

interface Document {
  id: string;
  name: string;
  description: string;
  status: "REQUIRED" | "RECEIVED" | "PENDING";
  fileName: string | null;
}

interface DocumentVaultProps {
  documents: Document[];
}

const DocIcon = ({ status }: { status: string }) => {
  if (status === "RECEIVED") {
    return (
      <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-[#e6f9f0] text-[#22c069]">
        <Check size={16} strokeWidth={2.5} />
      </div>
    );
  }

  return (
    <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-[#f0f2f7] text-[#8a8fa8]">
      <FileText size={16} />
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const isRequired = status === "REQUIRED";

  return (
    <span
      className={`rounded px-2 py-0.75 text-[10px] font-bold uppercase tracking-[0.06em] ${
        isRequired
          ? "border border-[#ffd08a] bg-[#fff3e0] text-[#e07b00]"
          : "border border-[#a8eece] bg-[#e6f9f0] text-[#22c069]"
      }`}
    >
      {status}
    </span>
  );
};

export const DocumentVault = ({ documents }: any) => {
  return (
    <div className="rounded-xl border border-[#e8eaf0] bg-white px-5 py-4.5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[15px] font-bold text-[#1a1d23]">
          <Lock size={18} />
          Document Vault
        </div>

        {/* <button className="text-[12px] font-semibold text-[#4a6cf7] hover:underline">
          Upload All
        </button> */}
      </div>

      {/* List */}
      <div className="flex flex-col">
        {documents.map((doc: any, index: number) => (
          <div
            key={doc.id}
            className={`flex items-center gap-3 py-3 ${
              index !== documents.length - 1 ? "border-b border-[#f0f2f7]" : ""
            }`}
          >
            <DocIcon status={doc.status} />

            {/* Info */}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[13.5px] font-semibold text-[#1a1d23]">
                {doc.name}
              </span>
              <span className="truncate text-[11.5px] text-[#9da3bd]">
                {doc.description}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <StatusBadge status={doc.status} />

              {doc.status === "RECEIVED" ? (
                <button className="flex h-7 w-7 items-center justify-center rounded-md border border-[#e8eaf0] text-[#5b6180] transition hover:border-[#c8cad6] hover:bg-[#f5f6fa]">
                  <Eye size={14} />
                </button>
              ) : (
                <button className="flex h-7 w-7 items-center justify-center rounded-md border border-[#e8eaf0] text-[#5b6180] transition hover:border-[#c8cad6] hover:bg-[#f5f6fa]">
                  <Clock size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
