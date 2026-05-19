export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  data: null;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;