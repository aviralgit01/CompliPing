import { ReactNode } from "react";
import MainLayoutClient from "@/components/layout/main-layout-client";

export default function MainLayout({
  children,
  stat,
}: {
  children: ReactNode;
  stat: ReactNode;
}) {
  return (
    <MainLayoutClient>
      <div className="max-w-360 mx-auto px-6 py-4 bg-linear-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 min-w-0">
        {children}
      </div>
    </MainLayoutClient>
  );
}
