// ---- enums ----

import { ComplianceItem } from "../compliance/compliance.types";

export type DocumentStatus =
  | "VERIFIED"
  | "PENDING"
  | "REJECTED"
  | "NEEDS_UPDATE";

export interface ClientDocument {
  id: string;

  category: string;
  name: string;

  updatedAt: string;

  status: DocumentStatus;
}

// ---- client ----
export interface Client {
  id: string;
  name: string;
  businessName: string;
  phone: string;

  businessType: string;
  isGstRegistered: boolean;

  state: string;
  district: string;
  pinCode: string;

  addressOne: string;
  addressTwo?: string;

  optInStatus: string;

  isRemindersPaused: boolean;
  isDeleted: boolean;

  tenantId: string;

  createdAt: string;
  updatedAt: string;

  complianceItems: ComplianceItem[];
  clientDocuments: ClientDocument[];
}

// ---- API response ----
export interface GetClientResponse {
  success: boolean;
  message: string;
  data: Client | Client[];
}
