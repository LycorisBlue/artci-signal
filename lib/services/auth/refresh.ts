/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ROUTES } from "@/lib/constants/api-routes";
import { apiPost } from "../api-services";

// Stocke le token dans un cookie client
const saveToken = (token: string) => {
  document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=3600`;
};

type RefreshPayload = {
  refreshToken: string;
};

type RefreshSuccess = {
  message: string;
  data: {
    accessToken: string;
    expires: string;
  };
};

type RefreshError = {
  status: number;
  message: string;
  data?: {
    errorType?:
      | "TOKEN_INVALID"
      | "TOKEN_EXPIRED"
      | "TOKEN_REVOKED"
      | "INVALID_TOKEN_TYPE"
      | "ROOT_USER_REFRESH"
      | "USER_NOT_FOUND"
      | "VALIDATION_ERROR"
      | "SERVER_ERROR";
    errors?: Record<string, string>;
    error?: string;
  };
};

export const refreshToken = async (
  payload: RefreshPayload
): Promise<RefreshSuccess> => {
  try {
    const res = await apiPost(API_ROUTES.AUTH.REFRESH, payload);

    // Option : mettre à jour le token dans les cookies
    saveToken(res.data.accessToken);

    return res;
  } catch (error: any) {
    const typedError: RefreshError = {
      status: error.status,
      message: error.message,
      data: error.data,
    };
    throw typedError;
  }
};
