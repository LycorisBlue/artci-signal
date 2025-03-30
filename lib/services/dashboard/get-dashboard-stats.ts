/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ROUTES } from "@/lib/constants/api-routes";
import { apiGet } from "../api-services";

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

// Types pour les erreurs
export type DashboardError = {
  status: number;
  message: string;
  data?: {
    errorType?: string;
    error?: string;
  };
};

/**
 * Récupère les statistiques du tableau de bord
 * @param period - Période d'analyse (jour, semaine, mois, année, tout)
 * @returns Promesse avec les statistiques du tableau de bord
 */
export const getDashboardStats = async (
  period: PeriodType = "month"
): Promise<DashboardStatsResponse> => {
  try {
    // Vérifier si la route est définie dans API_ROUTES
    const url = API_ROUTES.ADMIN?.DASHBOARD || "/admin/dashboard";

    // Construire l'URL avec le paramètre de période
    const urlWithParams = `${url}?period=${period}`;

    return await apiGet(urlWithParams);
  } catch (error: any) {
    // Si erreur 401 (non autorisé), effacer les données d'authentification
    if (error.status === 401) {
      if (typeof window !== "undefined") {
        // Supprimer les tokens du localStorage et des cookies
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        document.cookie = "token=; path=/; max-age=0";
        document.cookie = "refreshToken=; path=/; max-age=0";

        // Rediriger vers la page de connexion si nécessaire
        // window.location.href = "/login";
      }
    }

    const typedError: DashboardError = {
      status: error.status || 500,
      message:
        error.status === 401
          ? "Session expirée, veuillez vous reconnecter"
          : error.message || "Erreur lors de la récupération des statistiques",
      data: error.data,
    };

    throw typedError;
  }
};

/**
 * Hook React pour récupérer les statistiques du tableau de bord
 * Note: Ce hook peut être utilisé avec React ou React Query si vous l'ajoutez à votre projet
 */
export const useDashboardStats = async (period: PeriodType = "month") => {
  try {
    const response = await getDashboardStats(period);
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
