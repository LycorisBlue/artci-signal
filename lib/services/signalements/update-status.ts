import { API_ROUTES } from "@/lib/constants/api-routes";
import { apiPut } from "../api-services";
import { createApiService } from "@/lib/utils/service-creator";
import { ApiError } from "@/lib/types/api-error";
import { SignalementStatus } from "@/lib/constants/status";

// Type pour la payload de la requête
export type UpdateStatusPayload = {
  statut: SignalementStatus;
  commentaire: string;
};

// Type pour l'historique de mise à jour
type StatusHistoryEntry = {
  id: string;
  created_at: string;
};

// Type pour la réponse de mise à jour du statut
export type UpdateStatusResponse = {
  message: string;
  data: {
    signalement: {
      id: string;
      titre: string;
      ancien_statut: SignalementStatus;
      nouveau_statut: SignalementStatus;
      commentaire: string;
      utilisateur_notifie: boolean;
    };
    historique: StatusHistoryEntry;
  };
};

// Types d'erreur spécifiques pour la mise à jour de statut
export type UpdateStatusErrorType =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "NO_STATUS_CHANGE"
  | "INVALID_STATUS_TRANSITION"
  | "SIGNALEMENT_NOT_FOUND"
  | "SERVER_ERROR";

// Export du type d'erreur pour réutilisation
export type UpdateStatusError = ApiError<UpdateStatusErrorType>;

/**
 * Service pour mettre à jour le statut d'un signalement
 * @param id - Identifiant du signalement
 * @param payload - Données de mise à jour (statut et commentaire)
 * @returns Promesse avec la réponse de l'API
 */
export const updateSignalementStatus = createApiService<
  UpdateStatusResponse,
  UpdateStatusErrorType
>((id: string, payload: UpdateStatusPayload) => {
  // Vérifier si la route est définie dans API_ROUTES
  const routeFunction = API_ROUTES.SIGNALEMENT.UPDATE_STATUS;

  if (!routeFunction) {
    throw new Error("Route non définie pour la mise à jour du statut");
  }

  return apiPut(routeFunction(id), payload);
}, "Erreur lors de la mise à jour du statut du signalement");

/**
 * Change le statut d'un signalement
 * @param id - ID du signalement
 * @param newStatus - Nouveau statut à appliquer
 * @param commentaire - Commentaire expliquant le changement de statut
 * @returns Promise avec les données de mise à jour
 */
export const changeSignalementStatus = async (
  id: string,
  newStatus: SignalementStatus,
  commentaire: string
): Promise<UpdateStatusResponse> => {
  try {
    if (!commentaire || commentaire.trim().length < 10) {
      throw {
        status: 400,
        message: "Le commentaire doit contenir au moins 10 caractères",
        data: {
          errorType: "VALIDATION_ERROR",
          errors: {
            commentaire:
              "Le commentaire est trop court (minimum 10 caractères)",
          },
        },
      } as UpdateStatusError;
    }

    return await updateSignalementStatus(id, {
      statut: newStatus,
      commentaire: commentaire.trim(),
    });
  } catch (error) {
    // Propagation de l'erreur déjà formatée
    throw error;
  }
};
