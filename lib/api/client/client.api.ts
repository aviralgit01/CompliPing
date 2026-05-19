import { api } from "../axios";

export const getClientsApi = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  id?: string;
  gst?: string;
  optIn?: string;
  type?: string;
}) => {
  return api.get("/client_management", {
    params,
  });
};

export const createClientApi = async (payload: any) => {
  return api.post("/client_management", payload);
};

export const updateClientApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: any;
}) => {
  return api.put("/client_management", payload, {
    params: { id },
  });
};

export const deleteClientApi = async (id: string) => {
  return api.delete("/client_management", {
    params: { id },
  });
};

export const messagelog = async (params?: {
  clientId?: string;
  complianceItemId?: string;
  page: number;
  limit: number;
  search?: string;
  sortOrder?: "asc" | "desc";
  from?: string;
  to?: string;
}) => {
  return api.get("/message-logs", {
    params,
  });
};

export const toggleReminderApi = async (payload: any) => {
  return api.patch("/reminders/toggle-pause", payload);
};

export const getComplianceItemsOptionsApi = async (params?: {
  clientId?: string;
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return api.get("/compliance/options", {
    params,
  });
};

export const sendReminderManuallyApi = async (payload: any) => {
  return api.post("/reminders/send-manual", payload);
};

export const filingConfirmationApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: any;
}) => {
  return api.put(`/compliance?id=${id}`, payload);
};
