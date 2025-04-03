// lib/constants/api-routes.ts

// Types pour une meilleure auto-complétion et validation
export type AuthRoutes = {
  LOGIN: string;
  LOGOUT: string;
  ME: string;
  REFRESH: string;
};

export type AdminRoutes = {
  DASHBOARD: string;
  CITOYENS: string;
  CITOYEN_DETAILS: (id: string) => string;
  CITOYEN_DELETE: (id: string) => string;
  PROFILE: string;
};

export type SignalementRoutes = {
  ADMIN_LIST: string;
  DETAIL: (id: string) => string;
  UPDATE_STATUS: (id: string) => string;
  FLAG: (id: string) => string;
  COMMENT: (id: string) => string;
  SPAM: (id: string) => string;
  REMOVE_SPAM: (id: string) => string;
  STATS: string;
  STATS_PERIOD: string;
  STATS_TYPES: string;
  TRANSFER_DOCUMENTS: (id: string) => string;
};

export type PublicationRoutes = {
  CREATE: string;
  LIST: string;
  DETAIL: (id: string) => string;
  DELETE: (id: string) => string;
};

export type RootRoutes = {
  CREATE_ADMIN: string;
  LIST_ADMINS: string;
  ADMIN_DETAILS: (id: string) => string;
  UPDATE_ADMIN: (id: string) => string;
  DELETE_ADMIN: (id: string) => string;
};

export type NotificationRoutes = {
  LIST: string;
  COUNT: string;
  READ: (id: string) => string;
  READ_ALL: string;
  REMOVE: (id: string) => string;
};

export type ApiRoutes = {
  AUTH: AuthRoutes;
  ADMIN: AdminRoutes;
  SIGNALEMENT: SignalementRoutes;
  PUBLICATION: PublicationRoutes;
  ROOT: RootRoutes;
  NOTIFICATION: NotificationRoutes;
};

// Implémentation des routes
export const API_ROUTES: ApiRoutes = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH: "/auth/refresh",
  },
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    CITOYENS: "/admin/citoyens",
    CITOYEN_DETAILS: (id: string) => `/admin/citoyens/${id}`,
    CITOYEN_DELETE: (id: string) => `/admin/citoyens/${id}`,
    PROFILE: "/admin/profile",
  },
  SIGNALEMENT: {
    ADMIN_LIST: "/signalement/admin-list",
    DETAIL: (id: string) => `/signalement/detail/${id}`,
    UPDATE_STATUS: (id: string) => `/signalement/update-status/${id}`,
    FLAG: (id: string) => `/signalement/flag/${id}`,
    COMMENT: (id: string) => `/signalement/comment/${id}`,
    STATS: "/signalement/stats",
    STATS_PERIOD: "/signalement/stats-period",
    STATS_TYPES: "/signalement/stats-types",
    SPAM: (id: string) => `/signalement/spam/${id}`,
    REMOVE_SPAM: (id: string) => `/signalement/remove-spam/${id}`,
    TRANSFER_DOCUMENTS: (id: string) => `/signalement/transfer-documents/${id}`,
  },
  PUBLICATION: {
    CREATE: "/publication/create",
    LIST: "/publication/list",
    DETAIL: (id: string) => `/publication/${id}`,
    DELETE: (id: string) => `/publication/delete/${id}`,
  },
  ROOT: {
    CREATE_ADMIN: "/root/create-admin",
    LIST_ADMINS: "/root/list-admins",
    ADMIN_DETAILS: (id: string) => `/root/admin-details/${id}`,
    UPDATE_ADMIN: (id: string) => `/root/update-admin/${id}`,
    DELETE_ADMIN: (id: string) => `/root/delete-admin/${id}`,
  },
  NOTIFICATION: {
    LIST: "/notification/list",
    COUNT: "/notification/count",
    READ: (id: string) => `/notification/read/${id}`,
    READ_ALL: "/notification/read-all",
    REMOVE: (id: string) => `/notification/remove/${id}`,
  },
};
