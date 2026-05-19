import {
  getPlans,
  getTransactionsHistory,
  postSubscription,
} from "@/lib/api/payment/billing.api";
import { useStore } from "@/lib/store";
import { useMutation, useQuery } from "@tanstack/react-query";
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
      const res = await getPlans({
        page,
        limit,
      });
      const data = res.data;
      setPlans(data?.data || []);
      return data;
    },
  });
};

export const usePostSubscription = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await postSubscription(data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Subscription created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create subscription",
      );
    },
  });
};

export const useTransactionHistory = ({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) => {
  const { setTransactions } = useStore((state) => state);
  return useQuery({
    queryKey: ["Transactions", page, limit, search],
    queryFn: async () => {
      const res = await getTransactionsHistory({
        page,
        limit,
        search,
      });
      const data = res.data;
      setTransactions(data?.data || []);
      return data;
    },
  });
};
