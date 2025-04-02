import { API_ROUTES } from "@/lib/constants/api-routes";
import { apiPost } from "../api-services";
import { createApiService } from "@/lib/utils/service-creator";
import { ApiError } from "@/lib/types/api-error";
import { useUserStore } from "@/lib/stores/userStore";

// Supprime un cookie (client seulement)
const removeCookie = (key: string) => {
  document.cookie = `${key}=; path=/; max-age=0`;
};

// Type pour la réponse de succès
type LogoutSuccess = {
  message: string;
};

// Types d'erreur spécifiques pour le logout
type LogoutErrorType =
  | "TOKEN_MISSING"
  | "UNAUTHORIZED"
  | "TOKEN_REVOCATION_ERROR"
  | "SERVER_ERROR";

// Export du type d'erreur pour réutilisation
export type LogoutError = ApiError<LogoutErrorType>;

// Création du service de base avec gestion d'erreur standardisée
const logoutBase = createApiService<LogoutSuccess, LogoutErrorType>(
  () => apiPost(API_ROUTES.AUTH.LOGOUT, {}),
  "Erreur lors de la déconnexion"
);

// Service logout avec actions complémentaires post-déconnexion
export const logout = async (): Promise<LogoutSuccess> => {
  try {
    const res = await logoutBase();

    // Nettoyage cookies
    removeCookie("token");
    removeCookie("refreshToken");

    // Nettoyer le store utilisateur
    if (typeof window !== "undefined") {
      // On ne peut pas utiliser le hook ici directement,
      // alors on accède au store via son API interne
      useUserStore.getState().clearUserData();

      // Redirection
      window.location.href = "/login";
    }

    return res;
  } catch (error) {
    // Propagation de l'erreur déjà formatée
    throw error;
  }
};
