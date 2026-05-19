// /lib/api/auth.api.ts

import { LoginData } from "@/lib/api/auth/auth.types";
import { api } from "../axios";
import { handleApi } from "../handleApi";

export const loginApi = (payload: { email: string; password: string }) => {
  return api.post("/auth/login", payload);
};

export const loginAdminApi = (payload: { email: string; password: string }) => {
  return api.post("/auth/super_admin/login", payload);
};

export const signupApi = async (data: any) => {
  // return handleApi<LoginData>(api.post("/auth/signup", data));
  return api.post("/auth/signup", data);
};

export const resendEmail = async (data: any) => {
  return api.post("/auth/resend_email", data);
};

export const logoutUser = async () => {
  return api.post("/auth/logout");
};

export const forgetPasswordSendEmail = async (data: any) => {
  return api.post("/auth/forget_password/send_email", data);
};

export const forgetPasswordReset = async (data: {
  password: string;
  conform_password?: string;
  email?: string;
}) => {
  return api.post("/auth/forget_password", data);
};

export const getUserProfile = async () => {
  return api.get("/auth/me");
};

export const changePassword = async (data: {
  password: string;
  new_password: string;
  confirm_password: string;
}) => {
  return api.post("/auth/change_password", data);
};

export const onBoarding = async (data: any) => {
  return api.post("/auth/on_boarding", data);
};
