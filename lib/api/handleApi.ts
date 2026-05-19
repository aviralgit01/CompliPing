import { AxiosError, AxiosResponse } from "axios";
import { ApiResponse } from "./api.types";

export const handleApi = async <T>(
  promise: Promise<AxiosResponse<any>>,
): Promise<ApiResponse<T>> => {
  try {
    const res = await promise;

    return {
      success: true,
      message: res?.data?.message || "Success",
      data: res?.data?.data ?? null,
    };
  } catch (error: unknown) {
    let message = "Something went wrong";

    if (error instanceof AxiosError) {
      message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    throw new AxiosError(message);
  }
};
