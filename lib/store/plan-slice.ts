import { StateCreator } from "zustand";

export interface PlanSlice {
  plans: any[];
  setPlans: (plans: any[]) => void;
}

export const createPlanSlice: StateCreator<PlanSlice> = (set) => ({
  plans: [],

  setPlans: (plans) =>
    set({
      plans,
    }),
});
