// Modifications à apporter au fichier lib/services/api-services.ts

import { getFromStorage } from "@/lib/utils/storage";
import { withAuthHandling } from "@/lib/utils/auth-interceptor";
import { ApiError } from "../types/api-error";


const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://artci.api-medev.com";

// Récupère le token depuis le storage
export const getToken = async (): Promise<string | null> => {
  return await getFromStorage<string>("token", true);
};

const defaultHeaders = async () => {
  const token = await getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Fonction générique pour les requêtes API
const request = async (method: string, url: string, data?: unknown) => {
  const headers = await defaultHeaders();

  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      method,
      headers: headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!res.ok) {
      // Extraire les données d'erreur de la réponse
      const errorData = await res.json().catch(() => ({}));

      // Créer une erreur formatée selon notre pattern ApiError
      const formattedError: ApiError = {
        status: res.status,
        message: errorData.message || `Erreur HTTP ${res.status}`,
        data: {
          errorType: errorData.errorType || "API_ERROR",
          ...errorData,
        },
      };

      throw formattedError;
    }

    return res.json().catch(() => ({}));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Si c'est déjà une erreur formatée (de notre throw ci-dessus), la propager
    if (error.status && error.message) {
      throw error;
    }

    // Sinon, c'est une erreur réseau ou autre, la formater
    throw {
      status: 0,
      message: error.message || "Erreur réseau",
      data: {
        errorType: "NETWORK_ERROR",
      },
    } as ApiError;
  }
};

// Fonctions spécifiques avec gestion d'authentification
export const apiGet = async (url: string) => {
  return withAuthHandling(request, "GET", url);
};

export const apiPost = async (url: string, data: unknown) => {
  return withAuthHandling(request, "POST", url, data);
};

export const apiPut = async (url: string, data: unknown) => {
  return withAuthHandling(request, "PUT", url, data);
};

export const apiDelete = async (url: string, data?: unknown) => {
  return withAuthHandling(request, "DELETE", url, data);
};
