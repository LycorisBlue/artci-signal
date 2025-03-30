/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ROUTES } from "@/lib/constants/api-routes";
import { apiGet } from "../api-services";

type MeSuccess = {
  message: string;
  data: {
    user: {
      id: string;
      nom: string;
      numero: string;
      email: string;
      role: "root" | "admin" | "citoyen";
    };
    tokenInfo: {
      duration: string;
      canRefresh: boolean;
      message: string;
    };
  };
};

type MeError = {
  status: number;
  message: string;
  data?: {
    errorType?:
      | "TOKEN_MISSING"
      | "TOKEN_INVALID"
      | "TOKEN_EXPIRED"
      | "TOKEN_REVOKED"
      | "USER_NOT_FOUND"
      | "SERVER_ERROR";
    expired?: boolean;
    canRefresh?: boolean;
    role?: string;
    error?: string;
  };
};

export const getMe = async (): Promise<MeSuccess> => {
  try {
    return await apiGet(API_ROUTES.AUTH.ME);
  } catch (error: any) {
    const typedError: MeError = {
      status: error.status,
      message: error.message,
      data: error.data,
    };
    throw typedError;
  }
};
