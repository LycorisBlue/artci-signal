import { API_ROUTES } from "@/lib/constants/api-routes";
import { apiPost } from "../api-services";
import { createApiService } from "@/lib/utils/service-creator";
import { ApiError } from "@/lib/types/api-error";

// Type pour la payload de la requête
export type CommentPayload = {
  contenu: string;
  private?: boolean;
};

// Type pour un utilisateur dans un commentaire
type CommentaireUtilisateur = {
  id: string;
  nom: string;
  role: "root" | "admin" | "citoyen";
};

// Type pour la réponse de commentaire
export type CommentaireResponse = {
  id: string;
  contenu: string;
  signalement_id: string;
  interne: boolean;
  created_at: string;
  utilisateur: CommentaireUtilisateur;
};

// Type pour la réponse complète
export type AddCommentResponse = {
  message: string;
  data: {
    commentaire: CommentaireResponse;
    notification_envoyee: boolean;
  };
};

// Types d'erreur spécifiques pour l'ajout de commentaire
export type AddCommentErrorType =
  | "UNAUTHORIZED"
  | "UNAUTHORIZED_ACCESS"
  | "UNAUTHORIZED_PRIVATE_COMMENT"
  | "VALIDATION_ERROR"
  | "SIGNALEMENT_NOT_FOUND"
  | "SERVER_ERROR";

// Export du type d'erreur pour réutilisation
export type AddCommentError = ApiError<AddCommentErrorType>;

/**
 * Service pour ajouter un commentaire à un signalement
 * @param id - Identifiant du signalement
 * @param payload - Données du commentaire
 * @returns Promesse avec la réponse de l'API
 */
export const addComment = createApiService<
  AddCommentResponse,
  AddCommentErrorType
>((id: string, payload: CommentPayload) => {
  // Vérifier si la route est définie dans API_ROUTES
  const routeFunction = API_ROUTES.SIGNALEMENT.COMMENT;

  if (!routeFunction) {
    throw new Error("Route non définie pour l'ajout de commentaire");
  }

  // Appel API avec l'URL construite et les données
  return apiPost(routeFunction(id), payload);
}, "Erreur lors de l'ajout du commentaire");

/**
 * Crée un commentaire pour un signalement
 * @param id - ID du signalement
 * @param contenu - Contenu du commentaire
 * @param isPrivate - Si le commentaire est privé (visible uniquement par les administrateurs)
 * @returns Promise avec les données du commentaire ajouté
 */
export const createComment = async (
  id: string,
  contenu: string,
  isPrivate: boolean = true
): Promise<AddCommentResponse> => {
  try {
    return await addComment(id, {
      contenu,
      private: isPrivate,
    });
  } catch (error) {
    // Propagation de l'erreur déjà formatée
    throw error;
  }
};
