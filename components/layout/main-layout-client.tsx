"use client";

import React, { ReactNode, useRef } from "react";
import Sidebar from "../common/sidebar";
import ScrollToTop from "./sroll-to-top";
import { getFilteredNavItems, NAV_ITEMS } from "@/lib/utils/navigation-config";
import { useStore } from "@/lib/store";

import dynamic from "next/dynamic";

const Header = dynamic(() => import("./header"), {
  ssr: false,
});

const MainLayoutClient = ({ children }: { children: ReactNode }) => {
  const scrollRef = useRef(null);
  const { user } = useStore((state) => state);

  return (
    <div className="h-screen flex overflow-hidden min-w-0">
      <ScrollToTop scrollRef={scrollRef} />
      <Sidebar navItems={getFilteredNavItems(NAV_ITEMS, user?.role)} />

      <section className="flex flex-col flex-1  min-w-0">
        <Header />
        <div
          ref={scrollRef}
          className="flex-1  min-w-0 overflow-y-auto relative"
        >
          {children}
        </div>
      </section>
    </div>
  );
};

export default MainLayoutClient;
