import { api } from "../axios";

export const getSuperAdminPlans = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  id?: string;
}) => {
  return api.get("/payment/razor_pay/plan", {
    params,
  });
};

export const createSuperAdminPlan = async (payload: any) => {
  return api.post("/payment/razor_pay/plan", payload);
};

export const updateSuperAdminPlan = async ({
  id,
  payload,
}: {
  id: string;
  payload: any;
}) => {
  return api.put("/payment/razor_pay/plan", {
    id,
    ...payload,
  });
};

export const deleteSuperAdminPlan = async ({
  plan_id,
}: {
  plan_id: string;
}) => {
  return api.delete("/payment/razor_pay/plan", {
    params: { plan_id },
  });
};
