import { create } from "zustand";
import { getMe } from "@/lib/services/auth/me";
import { persist, createJSONStorage } from "zustand/middleware";

// Définir le type pour les données utilisateur
type UserData = {
  id: string;
  nom: string;
  email: string;
  numero: string;
  role: "root" | "admin" | "citoyen";
} | null;

// Définir l'interface du store
interface UserState {
  userData: UserData;
  isLoading: boolean;
  error: string | null;
  hasAttemptedLoad: boolean;
  fetchUserData: () => Promise<void>;
  clearUserData: () => void;
}

// Créer le store avec persistance
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userData: null,
      isLoading: false,
      error: null,
      hasAttemptedLoad: false,

      fetchUserData: async () => {
        // Ne pas recharger si déjà en cours de chargement
        if (get().isLoading) return;

        // Si on a déjà les données et qu'on a déjà tenté de charger, ne pas recharger
        if (get().userData && get().hasAttemptedLoad) return;

        set({ isLoading: true, error: null });

        try {
          const response = await getMe();
          set({
            userData: response.data.user,
            isLoading: false,
            hasAttemptedLoad: true,
          });
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des données utilisateur:",
            error
          );
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Erreur inconnue",
            hasAttemptedLoad: true,
          });
        }
      },

      clearUserData: () => {
        set({
          userData: null,
          error: null,
          hasAttemptedLoad: false,
        });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage), // Utiliser sessionStorage au lieu de localStorage
    }
  )
);
