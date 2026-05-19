import React, { ReactNode } from "react";

const CustomCard = ({
  classname,
  children,
}: {
  children: ReactNode;
  classname?: string;
}) => {
  return (
    <div
      className={`bg-white/80 p-6 backdrop-blur-sm rounded-2xl border border-white/60 shadow-xl shadow-slate-200/50 overflow-hidden min-w-0 relative ${classname}`}
    >
      {children}
    </div>
  );
};

export default CustomCard;
