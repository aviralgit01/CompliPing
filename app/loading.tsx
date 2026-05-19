"use client";
import Loader from "@/components/common/loader";
import { Spinner } from "@/components/layout/spinner";

export default function GlobalLoading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <Spinner size="large" />
    </div>
  );
}
