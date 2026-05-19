import {
  createClientApi,
  getClientsApi,
  updateClientApi,
  deleteClientApi,
  messagelog,
  toggleReminderApi,
  getComplianceItemsOptionsApi,
  sendReminderManuallyApi,
  filingConfirmationApi,
} from "@/lib/api/client/client.api";
import { useStore } from "@/lib/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetClients = ({
  page = 1,
  limit = 10,
  search = "",
  gst = "",
  optIn = "",
  type = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
  gst?: string;
  optIn?: string;
  type?: string;
} = {}) => {
  const { setClients } = useStore((state) => state);

  return useQuery({
    queryKey: ["Clients", page, limit, search, gst, optIn, type],
    queryFn: async () => {
      const res = await getClientsApi({
        page,
        limit,
        search,
        gst,
        optIn,
        type,
      });
      const data = res.data;

      setClients(data?.data || []);
      return data;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useGetClientById = (id?: string, enabled = true) => {
  return useQuery({
    queryKey: ["Client", id],
    queryFn: async () => {
      if (!id) throw new Error("Client id is required");
      const res = await getClientsApi({ id });
      return res.data;
    },
    enabled: !!id && enabled,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await createClientApi(payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Client created successfully");
      queryClient.invalidateQueries({ queryKey: ["Clients"] });
    },
    onError: (error: any) => {
      console.error("Create client failed", error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong";
      toast.error(message);
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const res = await updateClientApi({ id, payload });
      return res.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Client updated successfully");
      queryClient.invalidateQueries({ queryKey: ["Clients"] });
      queryClient.invalidateQueries({ queryKey: ["Client", variables.id] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong";
      toast.error(message);
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteClientApi(id);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Client deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["Clients"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong";
      toast.error(message);
    },
  });
};

export const useMessageLogs = (params?: {
  clientId?: string;
  complianceItemId?: string;
  page: number;
  limit: number;
  search?: string;
  sortOrder?: "asc" | "desc";
  from?: string;
  to?: string;
}) => {
  return useQuery({
    queryKey: ["MessageLogs", params],
    queryFn: async () => {
      const res = await messagelog(params);
      return res.data;
    },
  });
};

export const useToggleReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await toggleReminderApi(payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Reminder status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["MessageLogs"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong";
      toast.error(message);
    },
  });
};

export const useGetComplianceItemsOptions = (params?: {
  clientId?: string;
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["ComplianceItemsOptions", params],
    queryFn: async () => {
      const res = await getComplianceItemsOptionsApi(params);
      return res.data;
    },
  });
};

export const useSendReminderManually = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await sendReminderManuallyApi(payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Reminder sent successfully");
      queryClient.invalidateQueries({ queryKey: ["MessageLogs"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong";
      toast.error(message);
    },
  });
};

export const useFileFilingConfirmation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const res = await filingConfirmationApi({ id, payload });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Filing confirmation updated successfully");
      queryClient.invalidateQueries({ queryKey: ["MessageLogs"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong";
      toast.error(message);
    },
  });
};
