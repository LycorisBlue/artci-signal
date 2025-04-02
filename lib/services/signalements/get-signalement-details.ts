import { API_ROUTES } from "@/lib/constants/api-routes";
import { apiGet } from "../api-services";
import { createApiService } from "@/lib/utils/service-creator";
import { ApiError } from "@/lib/types/api-error";
import { useState, useEffect } from "react";

// Types pour les preuves
export type Preuve = {
  id: string;
  nom: string;
  type: "DOCUMENT" | "IMAGE" | "VIDEO" | "LIEN";
  url: string;
  taille?: number;
  date_ajout: string;
};

// Types pour les commentaires
export type Commentaire = {
  id: string;
  contenu: string;
  date: string;
  interne: boolean;
  auteur: {
    id: string;
    nom: string;
    role: "root" | "admin" | "citoyen";
  };
};

// Type pour la localisation
export type Localisation = {
  latitude: number;
  longitude: number;
  ville: string;
  pays: string;
  source: string;
} | null;

// Type pour l'utilisateur
export type UtilisateurDetail = {
  id: string;
  nom: string;
  email: string;
} | null;

// Type pour un signalement détaillé
export type SignalementDetail = {
  id: string;
  type_incident: string;
  titre: string;
  description: string;
  anonyme: boolean;
  statut: string;
  priority_level?: string;
  date_creation: string;
  date_modification: string;
  localisation: Localisation;
  utilisateur: UtilisateurDetail;
  preuves: Preuve[];
  commentaires: Commentaire[];
};

// Type pour la réponse complète
export type SignalementDetailResponse = {
  message: string;
  data: SignalementDetail;
};

// Types d'erreur spécifiques pour le détail d'un signalement
export type SignalementDetailErrorType =
  | "TOKEN_MISSING"
  | "TOKEN_INVALID"
  | "TOKEN_EXPIRED"
  | "UNAUTHORIZED"
  | "UNAUTHORIZED_ACCESS"
  | "SIGNALEMENT_NOT_FOUND"
  | "SERVER_ERROR";

// Export du type d'erreur pour réutilisation
export type SignalementDetailError = ApiError<SignalementDetailErrorType>;

/**
 * Service pour récupérer les détails d'un signalement
 * @param id - Identifiant du signalement
 * @returns Promesse avec les détails du signalement
 */
export const getSignalementDetail = createApiService<
  SignalementDetailResponse,
  SignalementDetailErrorType
>((id: string) => {
  // Vérifier si la route est définie dans API_ROUTES
  const routeFunction = API_ROUTES.SIGNALEMENT.DETAIL;

  if (!routeFunction) {
    throw new Error("Route non définie pour le détail d'un signalement");
  }

  const url = routeFunction(id);
  return apiGet(url);
}, "Erreur lors de la récupération des détails du signalement");

/**
 * Hook React pour récupérer les détails d'un signalement
 * @param id - Identifiant du signalement
 * @returns Object contenant les données, l'état de chargement et l'erreur éventuelle
 */
export const useSignalementDetail = (id: string | undefined) => {
  const [state, setState] = useState<{
    data: SignalementDetail | null;
    isLoading: boolean;
    error: SignalementDetailError | null;
    isRefetching: boolean;
  }>({
    data: null,
    isLoading: true,
    error: null,
    isRefetching: false,
  });

  const fetchData = async (signal?: AbortSignal) => {
    if (!id) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: {
          status: 400,
          message: "Identifiant du signalement manquant",
          data: {
            errorType: "SIGNALEMENT_NOT_FOUND",
          },
        },
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      isLoading: !prev.data,
      isRefetching: !!prev.data,
      error: null,
    }));

    try {
      // Ajouter un objet AbortSignal à la requête si nécessaire
      const response = await getSignalementDetail(id);

      if (signal?.aborted) return;

      setState({
        data: response.data,
        isLoading: false,
        isRefetching: false,
        error: null,
      });
    } catch (error) {
      if (signal?.aborted) return;

      setState({
        data: null,
        isLoading: false,
        isRefetching: false,
        error: error as SignalementDetailError,
      });
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);

    return () => {
      controller.abort();
    };
  }, [id]);

  return {
    ...state,
    refetch: () => fetchData(),
  };
};
