import {
  createSuperAdminPlan,
  deleteSuperAdminPlan,
  getSuperAdminPlans,
  updateSuperAdminPlan,
} from "@/lib/api/payment/payment.api";
import { useStore } from "@/lib/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetPlans = ({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) => {
  const { setPlans } = useStore((state) => state);

  return useQuery({
    queryKey: ["Plans", page, limit, search],
    queryFn: async () => {
      const res = await getSuperAdminPlans({
        page,
        limit,
      });
      const data = res.data;
      setPlans(data?.data || []);
      return data;
    },
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await createSuperAdminPlan(data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Plan created successfully");
      queryClient.invalidateQueries({ queryKey: ["Plans"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create plan");
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await updateSuperAdminPlan({ id, payload: data });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Plan updated successfully");
      queryClient.invalidateQueries({ queryKey: ["Plans"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update plan");
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ plan_id }: { plan_id: string }) => {
      const res = await deleteSuperAdminPlan({ plan_id });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Plan deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["Plans"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete plan");
    },
  });
};
