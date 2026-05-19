import { api } from "../axios";

export const getPlans = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  id?: string;
}) => {
  return api.get("/payment/razor_pay/plan", {
    params,
  });
};

export const postSubscription = (payload: any) => {
  return api.post("/payment/razor_pay/subscription", payload);
};

export const getTransactionsHistory = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return api.get("payment/razor_pay/transaction_history", {
    params,
  });
};
