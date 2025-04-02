import { API_ROUTES } from "@/lib/constants/api-routes";
import { apiGet } from "../api-services";
import { createApiService } from "@/lib/utils/service-creator";
import { ApiError } from "@/lib/types/api-error";

// Type pour la réponse de succès
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

// Types d'erreur spécifiques pour le service me
type MeErrorType =
  | "TOKEN_MISSING"
  | "TOKEN_INVALID"
  | "TOKEN_EXPIRED"
  | "TOKEN_REVOKED"
  | "USER_NOT_FOUND"
  | "SERVER_ERROR";

// Export du type d'erreur pour réutilisation
export type MeError = ApiError<MeErrorType>;

// Création du service Me avec gestion d'erreur standardisée
export const getMe = createApiService<MeSuccess, MeErrorType>(
  () => apiGet(API_ROUTES.AUTH.ME),
  "Erreur lors de la récupération des données utilisateur"
);
