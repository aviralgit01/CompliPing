import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  forgetPasswordReset,
  forgetPasswordSendEmail,
  loginAdminApi,
  getUserProfile,
  loginApi,
  logoutUser,
  resendEmail,
  signupApi,
  onBoarding,
} from "@/lib/api/auth/auth.api";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const { login } = useStore((state) => state);

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      // console.log(data?.data?.data, "--------------login");

      login(data?.data?.data?.user_data, data?.data?.data?.token ?? "");
    },
  });
};

export const useAdminLogin = () => {
  const { login } = useStore((state) => state);

  return useMutation({
    mutationFn: loginAdminApi,
    onSuccess: (data) => {
      login(data?.data?.data?.user_data, data?.data?.data?.token ?? "");
    },
  });
};

export const useSignup = () => {
  const { login } = useStore((state) => state);

  return useMutation({
    mutationFn: signupApi,
    retry: false,

    onSuccess: (data) => {},

    onError: (error: any) => {},
  });
};

export const useResendEmail = () => {
  return useMutation({
    mutationFn: resendEmail,
    retry: false,

    onSuccess: (data) => {},

    onError: (error: any) => {},
  });
};

export const useLogout = () => {
  const router = useRouter();
  const { toggleLoading, isLoading, logout } = useStore();
  return useMutation({
    mutationFn: logoutUser,
    retry: false,
    onMutate: () => {
      toggleLoading(true);
    },

    onSuccess: (data) => {
      logout();
      router.push("/login");
    },

    onError: (error: any) => {},
    onSettled: () => {
      setTimeout(() => {
        toggleLoading(false);
      }, 300);
    },
  });
};

export const useForgetPasswordSendEmail = () => {
  return useMutation({
    mutationFn: forgetPasswordSendEmail,
    retry: false,

    onSuccess: (data: any) => {
      toast.success(
        data?.data?.message || data?.message || "Reset link sent successfully",
      );
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to send reset link";
      toast.error(message);
    },
  });
};

export const useForgetPasswordReset = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: forgetPasswordReset,
    retry: false,
    onSuccess: (data: any) => {
      toast.success(
        data?.data?.message || data?.message || "Password reset successful",
      );
      router.push("/login");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to reset password";
      toast.error(message);
    },
  });
};

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ["UserProfile"],
    queryFn: async () => {
      const res = await getUserProfile();
      return res.data.data;
    },
  });
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changePassword,
    retry: false,
    onSuccess: (data: any) => {
      toast.success(
        data?.data?.message || data?.message || "Password changed successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["UserProfile"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to change password";
      toast.error(message);
    },
  });
};

export const useOnBoarding = () => {
  return useMutation({
    mutationFn: onBoarding,
    retry: false,
    onSuccess: (data: any) => {
      toast.success(
        data?.data?.message ||
          data?.message ||
          "Onboarding completed successfully",
      );
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to complete onboarding";
      toast.error(message);
    },
  });
};
