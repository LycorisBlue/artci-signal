/* eslint-disable @typescript-eslint/no-explicit-any */

import { getFromStorage, saveToStorage } from "./storage";
import { refreshToken } from "@/lib/services/auth/refresh";

/**
 * Gère les erreurs d'authentification et tente de rafraîchir le token si nécessaire
 * @param error L'erreur retournée par une requête API
 * @returns Promise résolue si le token a été rafraîchi avec succès, sinon rejetée
 */
export const handleAuthError = async (error: any): Promise<boolean> => {
  // Vérifier si c'est une erreur d'authentification
  if (error.status === 401) {
    console.log("Erreur d'authentification détectée");

    // Vérifier si le type d'erreur est TOKEN_EXPIRED
    if (error.data?.errorType === "TOKEN_EXPIRED") {
      try {
        // Récupérer le refresh token
        const refreshTokenValue = await getFromStorage<string>(
          "refreshToken",
          true
        );

        if (!refreshTokenValue) {
          console.error("Pas de refresh token disponible");
          return false;
        }

        // Tenter de rafraîchir le token
        const response = await refreshToken({
          refreshToken: refreshTokenValue,
        });

        // Stocker le nouveau token
        saveToStorage("token", response.data.accessToken, true);

        console.log("Token rafraîchi avec succès");
        return true;
      } catch (refreshError) {
        console.error("Échec du rafraîchissement du token:", refreshError);

        // En cas d'échec du rafraîchissement, rediriger vers la page de connexion
        if (typeof window !== "undefined") {
          // Supprimer les tokens
          document.cookie = "token=; path=/; max-age=0";
          document.cookie = "refreshToken=; path=/; max-age=0";
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");

          // Rediriger après un court délai
          setTimeout(() => {
            window.location.href = "/login";
          }, 100);
        }

        return false;
      }
    } else {
      // Si ce n'est pas une erreur de token expiré, on redirige directement
      if (typeof window !== "undefined") {
        // Supprimer les tokens
        document.cookie = "token=; path=/; max-age=0";
        document.cookie = "refreshToken=; path=/; max-age=0";
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        // Rediriger après un court délai
        setTimeout(() => {
          window.location.href = "/login";
        }, 100);
      }

      return false;
    }
  }

  // Si ce n'est pas une erreur d'authentification, on ne fait rien
  return false;
};

/**
 * Wrapper pour les appels API qui gère automatiquement les erreurs d'authentification
 * @param apiCall Fonction d'appel API à exécuter
 * @param args Arguments de la fonction d'appel API
 * @returns Résultat de l'appel API
 */
export const withAuthHandling = async <T>(
  apiCall: (...args: any[]) => Promise<T>,
  ...args: any[]
): Promise<T> => {
  try {
    // Premier essai de l'appel API
    return await apiCall(...args);
  } catch (error: any) {
    console.error("Erreur API:", error);

    // Tenter de gérer l'erreur d'authentification
    if (error.status === 401 && (await handleAuthError(error))) {
      // Si l'erreur a été gérée avec succès (token rafraîchi), réessayer l'appel
      try {
        return await apiCall(...args);
      } catch (retryError) {
        console.error(
          "Erreur après tentative de rafraîchissement:",
          retryError
        );
        throw retryError;
      }
    }

    // Si l'erreur n'a pas été gérée, la propager
    throw error;
  }
};
