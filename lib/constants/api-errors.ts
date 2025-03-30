// lib/constants/api-errors.ts

// Types des erreurs
export enum ApiErrorType {
  // Erreurs d'authentification
  UNAUTHORIZED = "UNAUTHORIZED",
  TOKEN_MISSING = "TOKEN_MISSING",
  TOKEN_INVALID = "TOKEN_INVALID",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  TOKEN_REVOKED = "TOKEN_REVOKED",
  INVALID_TOKEN_TYPE = "INVALID_TOKEN_TYPE",
  ROOT_USER_REFRESH = "ROOT_USER_REFRESH",

  // Erreurs d'autorisation
  FORBIDDEN = "FORBIDDEN",
  UNAUTHORIZED_ACCESS = "UNAUTHORIZED_ACCESS",
  UNAUTHORIZED_DELETE = "UNAUTHORIZED_DELETE",
  UNAUTHORIZED_PRIVATE_COMMENT = "UNAUTHORIZED_PRIVATE_COMMENT",

  // Erreurs de validation
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_DATE_FORMAT = "INVALID_DATE_FORMAT",
  INVALID_DATE_RANGE = "INVALID_DATE_RANGE",
  INVALID_GROUP_BY = "INVALID_GROUP_BY",

  // Erreurs de ressources
  NOT_FOUND = "NOT_FOUND",
  SIGNALEMENT_NOT_FOUND = "SIGNALEMENT_NOT_FOUND",
  PUBLICATION_NOT_FOUND = "PUBLICATION_NOT_FOUND",
  CITIZEN_NOT_FOUND = "CITIZEN_NOT_FOUND",
  ADMIN_NOT_FOUND = "ADMIN_NOT_FOUND",
  NOTIFICATION_NOT_FOUND = "NOTIFICATION_NOT_FOUND",

  // Erreurs liées aux entités
  DUPLICATE_EMAIL = "DUPLICATE_EMAIL",
  DUPLICATE_PHONE = "DUPLICATE_PHONE",
  NO_STATUS_CHANGE = "NO_STATUS_CHANGE",
  INVALID_STATUS_TRANSITION = "INVALID_STATUS_TRANSITION",
  NO_DOCUMENTS_PROVIDED = "NO_DOCUMENTS_PROVIDED",
  NO_LINKS_PROVIDED = "NO_LINKS_PROVIDED",
  FILE_SIZE_EXCEEDED = "FILE_SIZE_EXCEEDED",

  // Erreurs de rate limiting
  RATE_LIMIT_ERROR = "RATE_LIMIT_ERROR",

  // Erreurs techniques
  SERVER_ERROR = "SERVER_ERROR",
}

// Interface pour les objets d'erreur
export interface ApiErrorInfo {
  message: string;
  status: number;
  userAction?: string;
}

// Mapping entre types d'erreur et informations associées
export const API_ERRORS: Record<ApiErrorType, ApiErrorInfo> = {
  // Erreurs d'authentification
  [ApiErrorType.UNAUTHORIZED]: {
    message: "Vous n'êtes pas autorisé à accéder à cette ressource",
    status: 401,
    userAction: "Veuillez vous reconnecter",
  },
  [ApiErrorType.TOKEN_MISSING]: {
    message: "Token d'authentification manquant",
    status: 401,
    userAction: "Veuillez vous reconnecter",
  },
  [ApiErrorType.TOKEN_INVALID]: {
    message: "Token d'authentification invalide",
    status: 401,
    userAction: "Veuillez vous reconnecter",
  },
  [ApiErrorType.TOKEN_EXPIRED]: {
    message: "Votre session a expiré",
    status: 401,
    userAction: "Veuillez vous reconnecter",
  },
  [ApiErrorType.TOKEN_REVOKED]: {
    message: "Votre session a été révoquée",
    status: 401,
    userAction: "Veuillez vous reconnecter",
  },
  [ApiErrorType.INVALID_TOKEN_TYPE]: {
    message: "Type de token incorrect",
    status: 401,
    userAction: "Veuillez vous reconnecter",
  },
  [ApiErrorType.ROOT_USER_REFRESH]: {
    message: "Les utilisateurs root ne peuvent pas rafraîchir leur token",
    status: 401,
    userAction: "Veuillez vous reconnecter",
  },

  // Erreurs d'autorisation
  [ApiErrorType.FORBIDDEN]: {
    message: "Vous n'avez pas les permissions requises",
    status: 403,
  },
  [ApiErrorType.UNAUTHORIZED_ACCESS]: {
    message: "Vous n'êtes pas autorisé à accéder à cette ressource",
    status: 403,
  },
  [ApiErrorType.UNAUTHORIZED_DELETE]: {
    message: "Vous n'êtes pas autorisé à supprimer cette ressource",
    status: 403,
  },
  [ApiErrorType.UNAUTHORIZED_PRIVATE_COMMENT]: {
    message: "Les citoyens ne peuvent pas créer de commentaires privés",
    status: 403,
  },

  // Erreurs de validation
  [ApiErrorType.VALIDATION_ERROR]: {
    message: "Données invalides",
    status: 400,
    userAction: "Veuillez vérifier les informations saisies",
  },
  [ApiErrorType.INVALID_DATE_FORMAT]: {
    message: "Format de date invalide",
    status: 400,
    userAction: "Utilisez le format YYYY-MM-DD",
  },
  [ApiErrorType.INVALID_DATE_RANGE]: {
    message: "Plage de dates invalide",
    status: 400,
    userAction: "La date de début doit être antérieure à la date de fin",
  },
  [ApiErrorType.INVALID_GROUP_BY]: {
    message: "Paramètre de regroupement invalide",
    status: 400,
  },

  // Erreurs de ressources
  [ApiErrorType.NOT_FOUND]: {
    message: "Ressource non trouvée",
    status: 404,
  },
  [ApiErrorType.SIGNALEMENT_NOT_FOUND]: {
    message: "Signalement non trouvé",
    status: 404,
  },
  [ApiErrorType.PUBLICATION_NOT_FOUND]: {
    message: "Publication non trouvée",
    status: 404,
  },
  [ApiErrorType.CITIZEN_NOT_FOUND]: {
    message: "Citoyen non trouvé",
    status: 404,
  },
  [ApiErrorType.ADMIN_NOT_FOUND]: {
    message: "Administrateur non trouvé",
    status: 404,
  },
  [ApiErrorType.NOTIFICATION_NOT_FOUND]: {
    message: "Notification non trouvée",
    status: 404,
  },

  // Erreurs liées aux entités
  [ApiErrorType.DUPLICATE_EMAIL]: {
    message: "Cet email est déjà utilisé",
    status: 400,
  },
  [ApiErrorType.DUPLICATE_PHONE]: {
    message: "Ce numéro de téléphone est déjà utilisé",
    status: 400,
  },
  [ApiErrorType.NO_STATUS_CHANGE]: {
    message: "Le nouveau statut est identique au statut actuel",
    status: 400,
  },
  [ApiErrorType.INVALID_STATUS_TRANSITION]: {
    message: "Cette transition de statut n'est pas autorisée",
    status: 400,
  },
  [ApiErrorType.NO_DOCUMENTS_PROVIDED]: {
    message: "Aucun document fourni",
    status: 400,
  },
  [ApiErrorType.NO_LINKS_PROVIDED]: {
    message: "Aucun lien fourni",
    status: 400,
  },
  [ApiErrorType.FILE_SIZE_EXCEEDED]: {
    message: "La taille du fichier dépasse la limite autorisée",
    status: 400,
    userAction: "Veuillez choisir un fichier de moins de 10 Mo",
  },

  // Erreurs de rate limiting
  [ApiErrorType.RATE_LIMIT_ERROR]: {
    message: "Trop de tentatives, veuillez réessayer plus tard",
    status: 429,
    userAction: "Veuillez patienter avant de réessayer",
  },

  // Erreurs techniques
  [ApiErrorType.SERVER_ERROR]: {
    message: "Une erreur inattendue s'est produite",
    status: 500,
    userAction: "Veuillez réessayer ultérieurement ou contacter le support",
  },
};


