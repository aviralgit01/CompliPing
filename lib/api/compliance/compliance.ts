import { api } from "../axios";
import { handleApi } from "../handleApi";
import { ComplianceItem, ComplianceResponse } from "./compliance.types";

// GET
export const getComplianceApi = (params?: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}) => {
  return handleApi<ComplianceResponse>(api.get("/compliance", { params }));
};

// GET BY ID
export const getComplianceByIdApi = (taskId: string) => {
  return handleApi<{
    success: boolean;
    message: string;
    complianceItem: ComplianceItem;
  }>(api.get(`/compliance/${taskId}`));
};

// POST
export const createComplianceApi = (data: {
  type: string;
  dueDate: string;
  clientId: string;
  description?: string;
  documentsRequired?: string;
  frequency?: "ONE_TIME" | "MONTHLY" | "QUARTERLY" | "ANNUALLY";
  period?: string;
  assignedTo?: string;
  notes?: string;
}) => {
  return handleApi<{ success: boolean; message: string; data: ComplianceItem }>(
    api.post("/compliance", data),
  );
};

// PUT
export const updateComplianceApi = (
  id: string,
  data: Partial<ComplianceItem>,
) => {
  return handleApi<{ success: boolean; message: string; data: ComplianceItem }>(
    api.put("/compliance", data, {
      params: { id },
    }),
  );
};

// DELETE
export const deleteComplianceApi = (id: string) => {
  return handleApi<{ success: boolean; message: string }>(
    api.delete("/compliance", {
      params: { id },
    }),
  );
};
