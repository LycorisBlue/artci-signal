import { API_ROUTES } from "@/lib/constants/api-routes";
import { apiPost } from "../api-services";
import { createApiService } from "@/lib/utils/service-creator";
import { ApiError } from "@/lib/types/api-error";

// Types existants pour le payload de connexion
type LoginPayload = {
  email: string;
  password: string;
};

// Type pour la réponse de connexion réussie
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

// Types d'erreur spécifiques pour le login
type LoginErrorType =
  | "TOKEN_MISSING"
  | "UNAUTHORIZED"
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_LOCKED"
  | "SERVER_ERROR";

// Export du type d'erreur pour une réutilisation éventuelle
export type LoginError = ApiError<LoginErrorType>;

// Création du service login avec gestion d'erreur standardisée
export const login = createApiService<LoginSuccess, LoginErrorType>(
  (payload: LoginPayload) => apiPost(API_ROUTES.AUTH.LOGIN, payload),
  "Identifiants incorrects. Veuillez réessayer."
);
