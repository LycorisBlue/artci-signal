import { API_ROUTES } from "@/lib/constants/api-routes";
import { apiPost } from "../api-services";
import { createApiService } from "@/lib/utils/service-creator";
import { ApiError } from "@/lib/types/api-error";

// Type pour la payload de marquage de spam
export type SpamFlagPayload = {
  raison: string;
  updateStatus?: boolean;
};

// Type pour l'utilisateur de notification
type NotificationUser = {
  id: string;
  nom: string;
} | null;

// Type pour la réponse de flag spam
export type SpamFlagResponse = {
  message: string;
  data: {
    flag: {
      id: string;
      signalement_id: string;
      flag_type: string;
      raison: string;
      created_at: string;
    };
    signalement: {
      id: string;
      titre: string;
      statut: string;
      statut_modifie: boolean;
    };
    notification: {
      sent: boolean;
      utilisateur: NotificationUser;
    };
  };
};

// Types d'erreur spécifiques pour le marquage de spam
export type SpamFlagErrorType =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "ALREADY_FLAGGED"
  | "SIGNALEMENT_NOT_FOUND"
  | "SERVER_ERROR";

// Export du type d'erreur pour réutilisation
export type SpamFlagError = ApiError<SpamFlagErrorType>;

/**
 * Service pour marquer un signalement comme spam
 * @param id - Identifiant du signalement
 * @param payload - Données pour le marquage (raison et mise à jour de statut)
 * @returns Promesse avec la réponse de l'API
 */
export const flagSignalementAsSpam = createApiService<
  SpamFlagResponse,
  SpamFlagErrorType
>((id: string, payload: SpamFlagPayload) => {
  // Vérifier si la route est définie dans API_ROUTES
  const routeFunction = API_ROUTES.SIGNALEMENT.SPAM;

  if (!routeFunction) {
    throw new Error("Route non définie pour le marquage de spam");
  }

  return apiPost(routeFunction(id), payload);
}, "Erreur lors du marquage du signalement comme spam");

/**
 * Marque un signalement comme spam
 * @param id - ID du signalement
 * @param raison - Raison du marquage comme spam
 * @param updateStatus - Si true, le statut du signalement sera changé en "spam"
 * @returns Promise avec les données de la réponse
 */
export const markSignalementAsSpam = async (
  id: string,
  raison: string,
  updateStatus: boolean = true
): Promise<SpamFlagResponse> => {
  try {
    return await flagSignalementAsSpam(id, {
      raison,
      updateStatus,
    });
  } catch (error) {
    // Propagation de l'erreur déjà formatée
    throw error;
  }
};
