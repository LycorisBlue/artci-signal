import { API_ROUTES } from "@/lib/constants/api-routes";
import { apiPut } from "../api-services";
import { createApiService } from "@/lib/utils/service-creator";
import { ApiError } from "@/lib/types/api-error";
import { PriorityLevel } from "@/lib/constants/status";

// Type pour la payload de la requête
export type FlagSignalementPayload = {
  priority_level: PriorityLevel;
  commentaire?: string | null;
};

// Type pour la réponse de mise à jour de priorité
export type FlagSignalementResponse = {
  message: string;
  data: {
    signalement: {
      id: string;
      titre: string;
      ancienne_priorite: PriorityLevel;
      nouvelle_priorite: PriorityLevel;
      commentaire: string | null;
    };
  };
};

// Types d'erreur spécifiques pour le flag de signalement
export type FlagSignalementErrorType =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "SIGNALEMENT_NOT_FOUND"
  | "SERVER_ERROR";

// Export du type d'erreur pour réutilisation
export type FlagSignalementError = ApiError<FlagSignalementErrorType>;

/**
 * Service pour définir la priorité d'un signalement
 * @param id - Identifiant du signalement
 * @param payload - Données de priorité et commentaire optionnel
 * @returns Promesse avec la réponse de l'API
 */
export const flagSignalement = createApiService<
FlagSignalementResponse,
  FlagSignalementErrorType >
    ((id: string, payload: FlagSignalementPayload) => {
      // Vérifier si la route est définie dans API_ROUTES
      const routeFunction = API_ROUTES.SIGNALEMENT.FLAG;

      if (!routeFunction) {
        throw new Error("Route non définie pour le flag de signalement");
      }

      return apiPut(routeFunction(id), payload);
    },
    "Erreur lors de la mise à jour de la priorité du signalement");

/**
 * Met à jour la priorité d'un signalement
 * @param id - ID du signalement
 * @param priorityLevel - Niveau de priorité à définir
 * @param commentaire - Commentaire optionnel expliquant le changement
 * @returns Promise avec les données de mise à jour
 */
export const updateSignalementPriority = async (
  id: string,
  priorityLevel: PriorityLevel,
  commentaire?: string
): Promise<FlagSignalementResponse> => {
  try {
    return await flagSignalement(id, {
      priority_level: priorityLevel,
      commentaire: commentaire || null,
    });
  } catch (error) {
    // Propagation de l'erreur déjà formatée
    throw error;
  }
};
