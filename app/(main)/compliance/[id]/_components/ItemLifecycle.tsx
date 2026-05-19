import { LifecycleItem } from "@/lib/api/compliance/compliance.types";
import React from "react";



interface ItemLifecycleProps {
  lifecycle: LifecycleItem[];
}

export const ItemLifecycle: React.FC<ItemLifecycleProps> = ({ lifecycle }) => {
  return (
    <div className="flex flex-col gap-3.5 rounded-xl border border-[#e8eaf0] bg-white px-5 py-4.5">
      
      {/* Title */}
      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-brand-primary">
        Item Lifecycle
      </span>

      {/* List */}
      <div className="flex flex-col">
        {lifecycle.map((item, index) => (
          <div key={item.id} className="flex gap-3">
            
            {/* Indicator */}
            <div className="flex w-4.5 flex-col items-center">
              
              {/* Dot */}
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                  item.isActive
                    ? "border-brand-primary bg-brand-primary"
                    : "border-[#e2e4ec] bg-white"
                }`}
              >
                {item.isActive && (
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </div>

              {/* Line */}
              {index < lifecycle.length - 1 && (
                <div className="my-1 w-0.5 flex-1 bg-[#e8eaf0]" />
              )}
            </div>

            {/* Content */}
            <div
              className={`flex flex-col gap-0.5 ${
                index !== lifecycle.length - 1 ? "pb-4" : ""
              }`}
            >
              <span className="text-[12px] font-semibold text-brand-primary">
                {item.label}
              </span>

              <span className="text-[12px] text-[#3d4260]">
                {item.detail}
              </span>

              <span className="mt-0.5 text-[10.5px] uppercase tracking-[0.05em] text-[#9da3bd]">
                {item.timestamp}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};