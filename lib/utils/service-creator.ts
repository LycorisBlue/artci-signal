/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/utils/service-creator.ts
import { handleApiError } from "./error-handler";

/**
 * Crée un service API typé avec gestion d'erreur standardisée
 * @param apiCall Fonction qui effectue l'appel API
 * @param errorMessage Message d'erreur par défaut
 * @returns Fonction de service API avec gestion d'erreur
 */
export function createApiService<TResponse, TError = string>(
  apiCall: (...args: any[]) => Promise<any>,
  errorMessage: string
) {
  return async (...args: any[]): Promise<TResponse> => {
    try {
      return await apiCall(...args);
    } catch (error) {
      throw handleApiError<TError>(error, errorMessage);
    }
  };
}
