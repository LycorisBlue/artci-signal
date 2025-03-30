const cookieStorage = {
  set: (key: string, value: unknown) => {
    document.cookie = `${key}=${encodeURIComponent(
      JSON.stringify(value)
    )}; path=/`;
  },
  get: (key: string): string | null => {
    const match = document.cookie.match(new RegExp("(^| )" + key + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  },
  has: (key: string): boolean => {
    return document.cookie.includes(`${key}=`);
  },
};

// Enregistre une valeur (stringifiable)
export const saveToStorage = (
  key: string,
  value: unknown,
  useCookies = false
) => {
  if (typeof window === "undefined") return;
  if (useCookies) {
    cookieStorage.set(key, value);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// Vérifie si une clé existe
export const hasInStorage = (key: string, useCookies = false): boolean => {
  if (typeof window === "undefined") return false;
  return useCookies
    ? cookieStorage.has(key)
    : localStorage.getItem(key) !== null;
};

// Récupère une donnée parsée
export const getFromStorage = async <T = unknown>(
  key: string,
  useCookies = false
): Promise<T | null> => {
  if (typeof window !== "undefined") {
    // Client
    if (useCookies) {
      const match = document.cookie.match(
        new RegExp("(^| )" + key + "=([^;]+)")
      );
      return match ? (JSON.parse(decodeURIComponent(match[2])) as T) : null;
    } else {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    }
  }

  // Serveur
  if (useCookies) {
    try {
      const mod = await import("next/headers");
      const rawCookies = await mod.cookies(); // dans certains contextes c'est une Promise
      const value = rawCookies.get(key)?.value;
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  }

  return null;
};


