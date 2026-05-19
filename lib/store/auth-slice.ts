// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// type User = {
//   id: string;
//   name: string;
//   email: string;
// };

// type AuthState = {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;

//   login: (user: User, token: string) => void;
//   logout: () => void;
// };

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       token: null,
//       isAuthenticated: false,

//       login: (user, token) =>
//         set({
//           user,
//           token,
//           isAuthenticated: true,
//         }),

//       logout: () =>
//         set({
//           user: null,
//           token: null,
//           isAuthenticated: false,
//         }),
//     }),
//     {
//       name: "auth-storage",
//     },
//   ),
// );

import { StateCreator } from "zustand";

export interface AuthSlice {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (user: any, token: string) => void;
  logout: () => void;
  toggleLoading: (loading: boolean) => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    }),

  toggleLoading: (loading) =>
    set((state) => ({
      isLoading: loading,
    })),
});
