// store/slices/sidebarSlice.ts
import { StateCreator } from "zustand";

export interface SidebarSlice {
  isExpand: boolean;
  menuExpand: {
    dashboard: boolean;
    user: boolean;
  };
  isExpired: boolean;

  setInitialState: () => void;
  setExpand: () => void;
  setMenuExpand: (
    section: keyof SidebarSlice["menuExpand"],
    value: boolean,
  ) => void;
  setIsExpired: (value: boolean) => void;
}

const initialState = {
  isExpand: true,
  menuExpand: {
    dashboard: false,
    user: false,
  },
  isExpired: false,
};

export const createSidebarSlice: StateCreator<SidebarSlice> = (set) => ({
  ...initialState,

  setInitialState: () =>
    set(() => ({
      ...initialState,
    })),

  setExpand: () =>
    set((state) => ({
      isExpand: !state.isExpand,
    })),

  setMenuExpand: (section, value) =>
    set((state) => ({
      menuExpand: {
        ...state.menuExpand,
        [section]: value,
      },
    })),

  setIsExpired: (value) =>
    set(() => ({
      isExpired: value,
    })),
});
