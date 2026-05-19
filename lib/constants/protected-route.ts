import { ROLES, Role } from "./role";

export const PROTECTED_ROUTES: Record<string, Role[]> = {
  // Dashboard
  "/dashboard": [ROLES.PARTNER, ROLES.MANAGER, ROLES.JUNIOR, ROLES.SUPER_ADMIN],

  // profile
  "/profile": [ROLES.PARTNER, ROLES.MANAGER, ROLES.JUNIOR, ROLES.SUPER_ADMIN],

  // plans
  "/super-admin/plan": [ROLES.SUPER_ADMIN],

  // billing
  "/billing/subscription/upgrade": [ROLES.PARTNER, ROLES.MANAGER],
  "/billing/payment-success": [ROLES.PARTNER, ROLES.MANAGER],

  // CLIENT MANAGEMENT
  "/clients": [ROLES.PARTNER, ROLES.MANAGER, ROLES.JUNIOR],
  "/clients/create": [ROLES.PARTNER, ROLES.MANAGER],
  "/clients/edit": [ROLES.PARTNER, ROLES.MANAGER],

  // COMPLIANCE
  "/compliance": [ROLES.PARTNER, ROLES.MANAGER, ROLES.JUNIOR],
  "/compliance/create": [ROLES.PARTNER, ROLES.MANAGER],
  "/compliance/edit": [ROLES.PARTNER, ROLES.MANAGER],

  // DOCUMENTS
  "/documents": [ROLES.PARTNER, ROLES.MANAGER, ROLES.JUNIOR],

  // TEAM MANAGEMENT
  "/team": [ROLES.PARTNER],

  // BILLING
  "/billing": [ROLES.PARTNER],

  // AUDIT LOGS
  "/audit": [ROLES.PARTNER],

  // SETTINGS (WhatsApp)
  "/settings": [ROLES.PARTNER, ROLES.SUPER_ADMIN],
} as const;

export const PUBLIC_ROUTES = ["/", "/about"];

export type ProtectedRoute = keyof typeof PROTECTED_ROUTES;
