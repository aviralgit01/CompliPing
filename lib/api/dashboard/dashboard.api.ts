import { api } from "../axios";
import { handleApi } from "../handleApi";
import { DashboardData, GetDashboardResponse } from "./dashboard.api type";

export const getDashboardApi = async () => {
  return handleApi(api.get("/dashboard"));
};
