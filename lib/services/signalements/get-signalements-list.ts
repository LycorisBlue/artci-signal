/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ROUTES } from "@/lib/constants/api-routes";
import { apiGet } from "../api-services";
import {
  SignalementStatus,
  PriorityLevel,
  IncidentType,
} from "@/lib/constants/status";

// Types pour la pagination
export type PaginationParams = {
  page?: number;
  limit?: number;
};

// Types pour les filtres
export type SignalementFilters = {
  statut?: SignalementStatus;
  type_incident?: IncidentType;
  priority_level?: PriorityLevel;
  utilisateur_id?: string;
  anonyme?: "true" | "false";
  search?: string;
  date_debut?: string;
  date_fin?: string;
  sort_by?: "created_at" | "updated_at" | "type_incident" | "statut" | "titre";
  sort_dir?: "asc" | "desc";
};

// Type pour les preuves
export type PreuveItem = {
  id: string;
  type: "DOCUMENT" | "IMAGE" | "VIDEO" | "LIEN";
  nom: string;
  url: string;
};

// Type pour l'utilisateur
export type UtilisateurInfo = {
  id: string;
  nom: string;
  email: string;
  numero: string;
} | null;

// Type pour un signalement
export type Signalement = {
  id: string;
  type_incident: string;
  titre: string;
  description: string;
  anonyme: boolean;
  statut: string;
  priority_level: string;
  date_creation: string;
  date_modification: string;
  utilisateur: UtilisateurInfo;
  preuves_count: number;
  commentaires_count: number;
  dernier_commentaire: string | null;
  preuves: PreuveItem[];
};

// Type pour la pagination
export type PaginationInfo = {
  total: number;
  total_pages: number;
  current_page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
};

// Type pour les statistiques
export type SignalementStats = {
  total: number;
  by_status: {
    soumis: number;
    en_traitement: number;
    cloture: number;
    non_pris_en_charge: number;
  };
  anonymes: number;
};

// Type pour la réponse complète
export type SignalementsListResponse = {
  message: string;
  data: {
    signalements: Signalement[];
    pagination: PaginationInfo;
    stats: SignalementStats;
    filters: SignalementFilters;
  };
};

// Types pour les erreurs
export type SignalementsListError = {
  status: number;
  message: string;
  data?: {
    errorType?: string;
    error?: string;
  };
};

/**
 * Construit l'URL avec les paramètres de requête
 * @param baseUrl URL de base
 * @param params Paramètres à ajouter
 * @returns URL complète avec paramètres
 */
const buildUrl = (baseUrl: string, params?: Record<string, any>): string => {
  if (!params) return baseUrl;

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * Récupère la liste des signalements pour les administrateurs
 * @param pagination Paramètres de pagination (page, limit)
 * @param filters Filtres à appliquer
 * @returns Promesse avec la liste des signalements et métadonnées
 */
export const getSignalementsList = async (
  pagination?: PaginationParams,
  filters?: SignalementFilters
): Promise<SignalementsListResponse> => {
  try {
    // Vérifier si la route est définie dans API_ROUTES
    const baseUrl = API_ROUTES.SIGNALEMENT.ADMIN_LIST;

    // Combiner pagination et filtres
    const params = { ...pagination, ...filters };

    // Construire l'URL avec les paramètres
    const url = buildUrl(baseUrl, params);

    return await apiGet(url);
  } catch (error: any) {
    // Si erreur 401 (non autorisé), traiter spécifiquement
    if (error.status === 401) {
      if (typeof window !== "undefined") {
        // Gérer l'expiration de session côté client uniquement
        console.warn("Session expirée ou non authentifiée");
        // Possibilité de rediriger ici avec window.location.href = "/login";
      }
    }

    // Construire une erreur typée
    const typedError: SignalementsListError = {
      status: error.status || 500,
      message:
        error.message || "Erreur lors de la récupération des signalements",
      data: error.data,
    };

    throw typedError;
  }
};

/**
 * Hook pour récupérer les signalements (à utiliser avec React ou React Query)
 * Note: Ce hook peut être complété si vous ajoutez React Query à votre projet
 */
export const useSignalementsList = async (
  pagination?: PaginationParams,
  filters?: SignalementFilters
) => {
  try {
    const response = await getSignalementsList(pagination, filters);
    return {
      data: response.data,
      isLoading: false,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      isLoading: false,
      error,
    };
  }
};
