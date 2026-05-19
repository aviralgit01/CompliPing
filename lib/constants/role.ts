export const ROLES = {
  PARTNER: "PARTNER",
  MANAGER: "MANAGER",
  JUNIOR: "JUNIOR",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
