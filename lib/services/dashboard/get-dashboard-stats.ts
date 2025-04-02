import { API_ROUTES } from "@/lib/constants/api-routes";
import { apiGet } from "../api-services";
import { createApiService } from "@/lib/utils/service-creator";
import { ApiError } from "@/lib/types/api-error";
import { useState, useEffect } from "react";

// Types pour la période
export type PeriodType = "day" | "week" | "month" | "year" | "all";

// Type pour les métadonnées
export type DashboardMetadata = {
  periode: {
    debut: string;
    fin: string;
    type: PeriodType;
  };
};

// Types pour les sections du dashboard
export type UserStats = {
  total: number;
  nouveaux: number;
  par_role: Record<string, number>;
};

export type SignalementStats = {
  total: number;
  nouveaux: number;
  par_statut: Record<string, number>;
  par_type: Array<{ type: string; count: number }>;
  par_priorite: Record<string, number>;
};

export type PublicationStats = {
  total: number;
  nouvelles: number;
  par_sensibilite: Record<string, number>;
};

export type ActivityStats = {
  commentaires: number;
  notifications: number;
  par_jour: Array<{
    date: string;
    signalements: number;
  }>;
};

export type SystemEvent = {
  id: string;
  message: string;
  source: string;
  action: string;
  status: string;
  date: string;
};

// Type pour la réponse complète
export type DashboardStats = {
  metadata: DashboardMetadata;
  utilisateurs: UserStats;
  signalements: SignalementStats;
  publications: PublicationStats;
  activite: ActivityStats;
  evenements_systeme: SystemEvent[];
};

// Type pour la réponse API
export type DashboardStatsResponse = {
  message: string;
  data: DashboardStats;
};

// Types d'erreur spécifiques pour le dashboard
export type DashboardErrorType =
  | "TOKEN_MISSING"
  | "TOKEN_INVALID"
  | "TOKEN_EXPIRED"
  | "INVALID_PERIOD"
  | "FORBIDDEN"
  | "SERVER_ERROR";

// Export du type d'erreur pour réutilisation
export type DashboardError = ApiError<DashboardErrorType>;

/**
 * Service pour récupérer les statistiques du tableau de bord
 * @param period - Période d'analyse (jour, semaine, mois, année, tout)
 * @returns Promesse avec les statistiques du tableau de bord
 */
export const getDashboardStats = createApiService<
  DashboardStatsResponse,
  DashboardErrorType
>(async (period: PeriodType = "month") => {
  // Vérifier si la route est définie dans API_ROUTES
  const url = API_ROUTES.ADMIN?.DASHBOARD || "/admin/dashboard";

  // Construire l'URL avec le paramètre de période
  const urlWithParams = `${url}?period=${period}`;

  return await apiGet(urlWithParams);
}, "Erreur lors de la récupération des statistiques du tableau de bord");

/**
 * Hook React pour récupérer les statistiques du tableau de bord
 * @param period - Période d'analyse (jour, semaine, mois, année, tout)
 * @returns Object contenant les données, l'état de chargement et l'erreur éventuelle
 */
export const useDashboardStats = (period: PeriodType = "month") => {
  const [state, setState] = useState<{
    data: DashboardStats | null;
    isLoading: boolean;
    error: DashboardError | null;
  }>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await getDashboardStats(period);
        setState({
          data: response.data,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          isLoading: false,
          error: error as DashboardError,
        });
      }
    };

    fetchData();
  }, [period]);

  return state;
};
