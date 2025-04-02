/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/utils/error-handler.ts
import { ApiError } from "../types/api-error";

/**
 * Convertit une erreur brute d'API en objet d'erreur typé
 * @param error Erreur brute reçue de l'API
 * @param defaultMessage Message par défaut si aucun message n'est disponible
 * @returns Objet d'erreur typé
 */
export function handleApiError<T>(
  error: any,
  defaultMessage: string
): ApiError<T> {
  return {
    status: error.status || 500,
    message: error.message || defaultMessage,
    data: error.data,
  };
}
