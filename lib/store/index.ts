import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createAuthSlice, AuthSlice } from "./auth-slice";
import { createSidebarSlice, SidebarSlice } from "./sidebar-slice";
import { ClientSlice, createClientSlice } from "./client-slice";
import { createPlanSlice, PlanSlice } from "./plan-slice";
import { createTransactionSlice, TransactionSlice } from "./transaction-slice";

// type Store = AuthSlice & UserSlice & PostSlice & ChatSlice;
type Store = AuthSlice &
  SidebarSlice &
  ClientSlice &
  PlanSlice &
  TransactionSlice;

export const useStore = create<Store>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createSidebarSlice(...a),
      ...createClientSlice(...a),
      ...createPlanSlice(...a),
      ...createTransactionSlice(...a),
      //   ...createPostSlice(...a),
      //   ...createChatSlice(...a),
    }),
    {
      name: "app-storage",

      // ⚠️ Persist only what you need
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
