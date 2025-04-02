import { API_ROUTES } from "@/lib/constants/api-routes";
import { apiPost } from "../api-services";
import { createApiService } from "@/lib/utils/service-creator";
import { ApiError } from "@/lib/types/api-error";

// Stocke le token dans un cookie client
const saveToken = (token: string) => {
  document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=3600`;
};

// Type pour le payload de rafraîchissement
type RefreshPayload = {
  refreshToken: string;
};

// Type pour la réponse de succès
type RefreshSuccess = {
  message: string;
  data: {
    accessToken: string;
    expires: string;
  };
};

// Types d'erreur spécifiques pour le refresh
type RefreshErrorType =
  | "TOKEN_INVALID"
  | "TOKEN_EXPIRED"
  | "TOKEN_REVOKED"
  | "INVALID_TOKEN_TYPE"
  | "ROOT_USER_REFRESH"
  | "USER_NOT_FOUND"
  | "VALIDATION_ERROR"
  | "SERVER_ERROR";

// Export du type d'erreur pour réutilisation
export type RefreshError = ApiError<RefreshErrorType>;

// Création du service de base avec gestion d'erreur standardisée
const refreshBase = createApiService<RefreshSuccess, RefreshErrorType>(
  (payload: RefreshPayload) => apiPost(API_ROUTES.AUTH.REFRESH, payload),
  "Erreur lors du rafraîchissement du token"
);

// Service refresh avec actions complémentaires pour sauvegarder le token
export const refreshToken = async (
  payload: RefreshPayload
): Promise<RefreshSuccess> => {
  try {
    const res = await refreshBase(payload);

    // Option : mettre à jour le token dans les cookies
    saveToken(res.data.accessToken);

    return res;
  } catch (error) {
    // Propagation de l'erreur déjà formatée
    throw error;
  }
};
