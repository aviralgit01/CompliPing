"use client";
import { Loader2 } from "lucide-react";
import React from "react";

type LoaderProps = {
  size?: number;
  textSize?: "xs" | "sm" | "md" | "lg";
};

const config = {
  xs: {
    text: "text-xs",
    dot: "w-1 h-1",
  },
  sm: {
    text: "text-sm",
    dot: "w-1 h-1",
  },
  md: {
    text: "text-base",
    dot: "w-1.5 h-1.5",
  },
  lg: {
    text: "text-lg",
    dot: "w-2 h-2",
  },
};

const Loader = ({ size = 20, textSize = "sm" }: LoaderProps) => {
  const { text, dot } = config[textSize];

  return (
    <div className="w-full flex flex-col justify-center items-center gap-2 py-6">
      {/* Spinner */}
      <Loader2 size={size} className="animate-spin text-brand-primary" />

      {/* Loading Text */}
      <div className={`flex items-center gap-1 text-gray-500 ${text}`}>
        <span>Loading</span>

        <span className="flex gap-1 ml-1 mt-1">
          <span
            className={`${dot} bg-brand-primary rounded-full animate-bounce [animation-delay:-0.3s]`}
          />
          <span
            className={`${dot} bg-brand-primary rounded-full animate-bounce [animation-delay:-0.15s]`}
          />
          <span
            className={`${dot} bg-brand-primary rounded-full animate-bounce`}
          />
        </span>
      </div>
    </div>
  );
};

export default Loader;
