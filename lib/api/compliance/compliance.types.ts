export type ComplianceFrequency =
  | "ONE_TIME"
  | "MONTHLY"
  | "QUARTERLY"
  | "ANNUALLY";

export type ComplianceStatus =
  | "PENDING"
  | "COMPLETED"
  | "OVERDUE"
  | "CANCELLED";

export interface Filing {
  id: string;
  type: string;
  dueDate: string;

  description: string;
  documentsRequired: string;

  status: ComplianceStatus;
  frequency: ComplianceFrequency;
  period: string;

  assignedTo: string;
  notes: string | null;

  completedAt: string | null;

  isRemindersPaused: boolean;
  isDeleted: boolean;

  clientId: string;
  tenantId: string;

  createdAt: string;
  updatedAt: string;

  client: {
    name: string;
    businessName: string;
    phone: string;
  };
}

export interface ComplianceData {
  calendarData: Record<string, Filing[]>;
  recurringData: Record<string, Filing[]>;
}

export interface ComplianceResponse {
  success: boolean;
  message: string;
  data: ComplianceData;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// export interface ComplianceItem {
//   id: string;
//   type: string;
//   dueDate: string;
//   description: string;
//   documentsRequired: string;
//   status: ComplianceStatus;
//   frequency: ComplianceFrequency;
//   period: string;
//   assignedTo: string;
//   notes: string;
//   completedAt: string | null;
//   isRemindersPaused: boolean;
//   isDeleted: boolean;
//   clientId: string;
//   tenantId: string;
//   createdAt: string;
//   updatedAt: string;
//   client: Client;
// }

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
  addressTwo: string;
  optInStatus: string;
  isRemindersPaused: boolean;
  isDeleted: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;

  // NEW
  initials?: string;
  entityType?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  description: string;
  status: "REQUIRED" | "RECEIVED" | "OPTIONAL";
  fileName: string | null;
}

export interface LifecycleItem {
  id: string;
  label: string;
  detail: string;
  timestamp: string;
  isActive: boolean;
}
export interface ComplianceItem {
  id: string;
  type: string;
  dueDate: string;

  description: string;
  documentsRequired: string;

  status: ComplianceStatus;
  frequency: ComplianceFrequency;

  period: string;
  filingPeriod: string;

  assignedTo: string;
  notes: string;

  completedAt: string | null;

  isRemindersPaused: boolean;
  isDeleted: boolean;

  clientId: string;
  tenantId: string;

  createdAt: string;
  updatedAt: string;

  // NEW
  refCode: string;
  daysRemaining: number;
  nextCycle: string;
  client: Client;

  documents: DocumentItem[];
  lifecycle: LifecycleItem[];
}
