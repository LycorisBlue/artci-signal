import { API_ROUTES } from "@/lib/constants/api-routes";
import { apiDelete } from "../api-services";
import { createApiService } from "@/lib/utils/service-creator";
import { ApiError } from "@/lib/types/api-error";
import { SignalementStatus } from "@/lib/constants/status";

// Type pour la payload de la requête
export type RemoveSpamPayload = {
  newStatus?: SignalementStatus;
  raison?: string;
};

// Type pour l'utilisateur de notification
type NotificationUser = {
  id: string;
  nom: string;
} | null;

// Type pour la réponse du retrait de spam
export type RemoveSpamResponse = {
  message: string;
  data: {
    flag: {
      id: string;
      signalement_id: string;
      flag_type: string;
      actif: boolean;
    };
    signalement: {
      id: string;
      titre: string;
      statut: string;
      statut_modifie: boolean;
      statut_precedent: string | null;
    };
    notification: {
      sent: boolean;
      utilisateur: NotificationUser;
    };
  };
};

// Types d'erreur spécifiques pour le retrait de spam
export type RemoveSpamErrorType =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FLAGGED_AS_SPAM"
  | "SIGNALEMENT_NOT_FOUND"
  | "SERVER_ERROR";

// Export du type d'erreur pour réutilisation
export type RemoveSpamError = ApiError<RemoveSpamErrorType>;

/**
 * Service pour retirer le marquage spam d'un signalement
 * @param id - Identifiant du signalement
 * @param payload - Données optionnelles (nouveau statut et raison)
 * @returns Promesse avec la réponse de l'API
 */
export const removeSpamFlag = createApiService<
  RemoveSpamResponse,
  RemoveSpamErrorType
>((id: string, payload?: RemoveSpamPayload) => {
  // Vérifier si la route est définie dans API_ROUTES
  const routeFunction = API_ROUTES.SIGNALEMENT.REMOVE_SPAM;

  if (!routeFunction) {
    throw new Error("Route non définie pour le retrait de marquage spam");
  }

  // Note: apiDelete attend normalement seulement une URL, mais dans ce cas,
  // nous avons besoin de passer un payload. Cette implémentation dépend de votre
  // méthode apiDelete et si elle prend en charge un second paramètre.
  return apiDelete(routeFunction(id), payload);
}, "Erreur lors du retrait du marquage spam");

/**
 * Retire le marquage spam d'un signalement
 * @param id - ID du signalement
 * @param newStatus - Nouveau statut à appliquer au signalement (optionnel)
 * @param raison - Raison du retrait du marquage spam (optionnel)
 * @returns Promise avec les données de la réponse
 */
export const unmarkSignalementAsSpam = async (
  id: string,
  newStatus?: SignalementStatus,
  raison?: string
): Promise<RemoveSpamResponse> => {
  try {
    const payload: RemoveSpamPayload = {};

    if (newStatus) {
      payload.newStatus = newStatus;
    }

    if (raison) {
      payload.raison = raison;
    }

    return await removeSpamFlag(
      id,
      Object.keys(payload).length > 0 ? payload : undefined
    );
  } catch (error) {
    // Propagation de l'erreur déjà formatée
    throw error;
  }
};
