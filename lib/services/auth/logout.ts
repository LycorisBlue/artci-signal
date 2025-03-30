/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ROUTES } from "@/lib/constants/api-routes";
import { apiPost } from "../api-services";

// Supprime un cookie (client seulement)
const removeCookie = (key: string) => {
  document.cookie = `${key}=; path=/; max-age=0`;
};

type LogoutSuccess = {
  message: string;
};

type LogoutError = {
  status: number;
  message: string;
  data?: {
    errorType?:
      | "TOKEN_MISSING"
      | "UNAUTHORIZED"
      | "TOKEN_REVOCATION_ERROR"
      | "SERVER_ERROR";
    [key: string]: any;
  };
};

export const logout = async (): Promise<LogoutSuccess> => {
  try {
    const res = await apiPost(API_ROUTES.AUTH.LOGOUT, {});

    // Nettoyage cookies
    removeCookie("token");
    removeCookie("refreshToken");

    // Redirection
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }

    return res;
  } catch (error: any) {
    const typedError: LogoutError = {
      status: error.status,
      message: error.message,
      data: error.data,
    };
    throw typedError;
  }
};
