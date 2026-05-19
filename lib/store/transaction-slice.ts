import { StateCreator } from "zustand";

export interface TransactionSlice {
  transactions: any[];
  setTransactions: (transactions: any[]) => void;
}

export const createTransactionSlice: StateCreator<TransactionSlice> = (
  set,
) => ({
  transactions: [],

  setTransactions: (transactions) =>
    set({
      transactions,
    }),
});
