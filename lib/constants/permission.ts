// permissions.ts

export const PERMISSIONS = {
  // CLIENT
  CLIENT_VIEW: "client:view",
  CLIENT_CREATE: "client:create",
  CLIENT_EDIT: "client:edit",
  CLIENT_DEACTIVATE: "client:deactivate",
  CLIENT_DELETE: "client:delete",

  // COMPLIANCE
  COMPLIANCE_VIEW: "compliance:view",
  COMPLIANCE_CREATE: "compliance:create",
  COMPLIANCE_EDIT: "compliance:edit",
  COMPLIANCE_DELETE: "compliance:delete",
  COMPLIANCE_COMPLETE: "compliance:complete",
  COMPLIANCE_PAUSE: "compliance:pause",

  // DOCUMENTS
  DOCUMENT_UPLOAD: "document:upload",
  DOCUMENT_VIEW: "document:view",
  DOCUMENT_DOWNLOAD: "document:download",
  DOCUMENT_REQUEST: "document:request",

  // REMINDERS / MESSAGING
  REMINDER_TRIGGER: "reminder:trigger",
  REMINDER_PAUSE: "reminder:pause",
  REMINDER_RESUME: "reminder:resume",

  // TEAM MANAGEMENT
  TEAM_VIEW: "team:view",
  TEAM_INVITE: "team:invite",
  TEAM_EDIT_ROLE: "team:edit_role",
  TEAM_REMOVE: "team:remove",

  // BILLING
  BILLING_VIEW: "billing:view",
  BILLING_MANAGE: "billing:manage",

  // AUDIT
  AUDIT_VIEW: "audit:view",
  AUDIT_EXPORT: "audit:export",

  // WHATSAPP
  WHATSAPP_CONNECT: "whatsapp:connect",
  WHATSAPP_DISCONNECT: "whatsapp:disconnect",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
