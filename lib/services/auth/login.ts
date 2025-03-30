/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ROUTES } from "@/lib/constants/api-routes";
import { apiPost } from "../api-services";

type LoginPayload = {
  email: string;
  password: string;
};

type LoginSuccess = {
  message: string;
  data: {
    user: {
      id: string;
      fullname: string;
      email: string;
      role: "root" | "admin" | "citoyen";
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
      expires: string;
      canRefresh: boolean;
    };
  };
};

type LoginError = {
  status: number;
  message: string;
  data?: {
    errorType?: string;
    errors?: Record<string, string>;
    [key: string]: any;
  };
};

export const login = async (payload: LoginPayload): Promise<LoginSuccess> => {
  try {
    return await apiPost(API_ROUTES.AUTH.LOGIN, payload);
  } catch (error: any) {
    // Typage explicite de l'erreur conforme au YAML
    const typedError: LoginError = {
      status: error.status,
      message: error.message,
      data: error.data,
    };
    throw typedError;
  }
};
