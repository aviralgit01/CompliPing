"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LineLoaderProps {
  lineClassname?: string;
  height?: string;
  className?: string;
}

export const LineLoader = ({
  lineClassname,

  className,
}: LineLoaderProps) => {
  return (
    <div className="absolute top-0 h-full w-full z-[999] flex">
      <div className={cn("w-full overflow-hidden h-1", className)}>
        <div
          className={cn(
            "h-full w-1/4 animate-lineLoader rounded-full bg-blue-500",
            lineClassname,
          )}
        />
      </div>
    </div>
  );
};
