import React from "react";

type StatCardProps = {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ReactNode;
  iconBgClass?: string;
};

const StatCard = ({
  title,
  value,
  description,
  icon,
  iconBgClass,
}: StatCardProps) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-md shadow-slate-200/50 border border-white/60 hover:shadow-lg transition-all duration-200 ">
      <div className="flex items-start justify-between gap-4">
        
        {/* Left Content */}
        <div className="flex flex-col gap-1.5">
          <p className="text-slate-500 text-xs font-semibold tracking-wide">
            {title}
          </p>

          <p className="text-3xl font-bold text-slate-900 leading-tight">
            {value ?? 0}
          </p>

          {description && (
            <p className="text-xs text-slate-400 leading-snug">
              {description}
            </p>
          )}
        </div>

        {/* Right Icon */}
        <div
          className={`shrink-0 p-3 rounded-xl bg-linear-to-br from-emerald-100 to-emerald-200 flex items-center justify-center ${iconBgClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;