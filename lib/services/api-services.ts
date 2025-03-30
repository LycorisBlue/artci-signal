import { getFromStorage } from "@/lib/utils/storage";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

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

// Fonction générique
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

// Fonctions spécifiques
export const apiGet = (url: string) => request("GET", url);
export const apiPost = (url: string, data: unknown) =>
  request("POST", url, data);
export const apiPut = (url: string, data: unknown) => request("PUT", url, data);
export const apiDelete = (url: string) => request("DELETE", url);
