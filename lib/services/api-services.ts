// Modifications à apporter au fichier lib/services/api-services.ts

import { getFromStorage } from "@/lib/utils/storage";
import { withAuthHandling } from "@/lib/utils/auth-interceptor";

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
  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    headers: headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw { status: res.status, ...error };
  }

  return res.json().catch(() => ({}));
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

export const apiDelete = async (url: string) => {
  return withAuthHandling(request, "DELETE", url);
};
