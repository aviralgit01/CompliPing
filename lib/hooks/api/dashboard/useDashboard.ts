import { getDashboardApi } from "@/lib/api/dashboard/dashboard.api";
import { useQuery } from "@tanstack/react-query";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardApi,
  });
};