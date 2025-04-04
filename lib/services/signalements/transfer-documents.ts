import { API_ROUTES } from "@/lib/constants/api-routes";
import { apiPostFormData } from "../api-services";
import { createApiService } from "@/lib/utils/service-creator";
import { ApiError } from "@/lib/types/api-error";
import { SignalementStatus } from "@/lib/constants/status";

// Types pour les documents transférés
export type DocumentInfo = {
  id: string;
  nom_fichier: string;
  type_fichier: "DOCUMENT" | "IMAGE" | "VIDEO";
  url: string;
  taille: number;
};

// Type pour la réponse de transfert de documents
export type TransferDocumentsResponse = {
  message: string;
  data: {
    signalement_id: string;
    documents: DocumentInfo[];
    message: string;
    statut_modifie: boolean;
  };
};

// Types d'erreur spécifiques pour le transfert de documents
export type TransferDocumentsErrorType =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NO_DOCUMENTS_PROVIDED"
  | "FILE_SIZE_EXCEEDED"
  | "SIGNALEMENT_NOT_FOUND"
  | "SERVER_ERROR";

// Export du type d'erreur pour réutilisation
export type TransferDocumentsError = ApiError<TransferDocumentsErrorType>;

/**
 * Service pour transférer des documents vers un signalement
 * @param id - Identifiant du signalement
 * @param formData - FormData contenant les documents et les options
 * @returns Promesse avec la réponse de l'API
 */
export const transferDocumentsToSignalement = createApiService<
  TransferDocumentsResponse,
  TransferDocumentsErrorType
>((id: string, formData: FormData) => {
  // Vérifier si la route est définie dans API_ROUTES
  const routeFunction = API_ROUTES.SIGNALEMENT.TRANSFER_DOCUMENTS;

  if (!routeFunction) {
    throw new Error("Route non définie pour le transfert de documents");
  }

  return apiPostFormData(routeFunction(id), formData);
}, "Erreur lors du transfert de documents au signalement");

/**
 * Transfère des documents à un signalement existant
 * @param id - ID du signalement
 * @param files - Array de fichiers à uploader
 * @param updateStatus - Si true, le statut du signalement sera mis à jour
 * @param newStatus - Nouveau statut à appliquer (si updateStatus est true)
 * @returns Promise avec les données de la réponse
 */
export const uploadDocumentsToSignalement = async (
  id: string,
  files: File[],
  updateStatus: boolean = false,
  newStatus?: SignalementStatus
): Promise<TransferDocumentsResponse> => {
  try {
    // Créer un objet FormData
    const formData = new FormData();

    // Ajouter chaque fichier au FormData
    for (const file of files) {
      formData.append("documents", file);
    }

    // Ajouter les options de mise à jour du statut si nécessaire
    if (updateStatus) {
      formData.append("updateStatus", "true");

      if (newStatus) {
        formData.append("newStatus", newStatus);
      }
    } else {
      formData.append("updateStatus", "false");
    }

    return await transferDocumentsToSignalement(id, formData);
  } catch (error) {
    // Propagation de l'erreur déjà formatée
    throw error;
  }
};
