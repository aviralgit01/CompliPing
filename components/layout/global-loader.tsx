"use client";
import { useStore } from "@/lib/store";
import React, { ReactNode } from "react";
import { Spinner } from "./spinner";

const GlobalLoader = ({ children }: { children: ReactNode }) => {
  const { isLoading } = useStore();
  return isLoading ? <Spinner /> : children;
};

export default GlobalLoader;
