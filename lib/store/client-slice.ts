import { StateCreator } from "zustand";

export interface ClientSlice {
  clients: any[];
  setClients: (clients: any[]) => void;
}

export const createClientSlice: StateCreator<ClientSlice> = (set) => ({
  clients: [],

  setClients: (clients) =>
    set({
      clients,
    }),
});
