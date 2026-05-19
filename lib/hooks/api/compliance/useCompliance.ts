import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getComplianceApi,
  createComplianceApi,
  updateComplianceApi,
  deleteComplianceApi,
  getComplianceByIdApi,
} from "@/lib/api/compliance/compliance";
import { toast } from "sonner";

// GET (list)
export const useCompliance = (params?: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ["compliance", params],
    queryFn: () => getComplianceApi(params),
  });
};

export const useComplianceById = (taskId?: string) => {
  return useQuery({
    queryKey: ["compliance", taskId],
    queryFn: () => getComplianceByIdApi(taskId!),
    enabled: !!taskId,
  });
};

// CREATE
export const useCreateCompliance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComplianceApi,

    onSuccess: (data) => {
      toast.success(data?.message || "Compliance created");

      // refresh list
      queryClient.invalidateQueries({ queryKey: ["compliance"] });
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to create compliance";

      toast.error(message);
    },
  });
};

// UPDATE
export const useUpdateCompliance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateComplianceApi(id, data),

    onSuccess: (data) => {
      toast.success(data?.message || "Compliance updated");

      queryClient.invalidateQueries({ queryKey: ["compliance"] });
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to update compliance";

      toast.error(message);
    },
  });
};

// DELETE
export const useDeleteCompliance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteComplianceApi(id),

    onSuccess: (data) => {
      toast.success(data?.message || "Compliance deleted");

      queryClient.invalidateQueries({ queryKey: ["compliance"] });
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to delete compliance";

      toast.error(message);
    },
  });
};
