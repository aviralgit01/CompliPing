// export type ActivityStatus = "SENT" | "DELIVERED" | "FAILED";
// export interface TodaysSnapshot {
//   messagesSent: number;
//   documentsReceived: number;
//   filingsCompleted: number;
// }

// export interface ThisWeeksSnapshot {
//   itemsDue: number;
//   itemsCompleted: number;
//   itemsOverdue: number;
// }
// export interface RecentActivityItem {
//   id: string;
//   clientName: string;

//   action: string; 

//   time: string; 

//   status: ActivityStatus;
// }

// export interface DashboardData {
//   todaysSnapshot: TodaysSnapshot;
//   thisWeeksSnapshot: ThisWeeksSnapshot;
//   recentActivity: RecentActivityItem[];
// }




export type ActivityStatus = "SENT" | "DELIVERED";
export type DocumentStatus = "Missing" | "Overdue" | "Completed";
export type BadgeStatus = DocumentStatus | ActivityStatus | "URGENT";
export type ActivityTabFilter = "ALL" | ActivityStatus;

export interface TodaysSnapshot {
  messagesSent: number;
  documentsReceived: number;
  filingsCompleted: number;
  newClientOptins?: number;
}

export interface WeeksSnapshot {
  itemsDue: number;
  itemsCompleted: number;
  itemsOverdue: number;
}

export interface ComplianceHealth {
  dueThisWeek: number;
  completed: number;
  activeItems: number;
  totalOverdue: number;
}

export interface ComplianceItem {
  id: string;
  client: string;
  complianceType: string;
  documentStatus: DocumentStatus;
  action: string;
}

export interface ActivityItem {
  id: string;
  clientName: string;
  action: string;
  time: string;
  status: ActivityStatus;
}

export interface DashboardData {
  todaysSnapshot: TodaysSnapshot;
  thisWeeksSnapshot: WeeksSnapshot;
  complianceHealth?: ComplianceHealth;
  itemsDueToday: ComplianceItem[];
  recentActivity: ActivityItem[];
}

export interface GetDashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}