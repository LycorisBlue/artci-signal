// lib/constants/status.ts

// Types de statut des signalements
export enum SignalementStatus {
  SOUMIS = "soumis",
  EN_TRAITEMENT = "en traitement",
  CLOTURE = "clôturé",
  NON_PRIS_EN_CHARGE = "non pris en charge",
}

// Types de priorité des signalements
export enum PriorityLevel {
  NORMAL = "normal",
  IMPORTANT = "important", 
  URGENT = "urgent",
  CRITIQUE = "critique",
}

// Types d'incidents
export enum IncidentType {
  ARNAQUE = "Arnaque en ligne",
  HARCELEMENT = "Harcèlement",
  VOL_IDENTITE = "Vol d'identité",
  PHISHING = "Phishing",
  CONTENU_ILLEGAL = "Diffusion de contenu illégal",
  PIRATAGE = "Piratage de compte",
  AUTRE = "Autre",
}

// Types de preuve
export enum ProofType {
  DOCUMENT = "DOCUMENT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  LIEN = "LIEN",
}

// Sensibilité des publications
export enum PublicationSensitivity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

// Rôles utilisateur
export enum UserRole {
  ROOT = "root",
  ADMIN = "admin",
  CITOYEN = "citoyen",
}

// Transitions de statut autorisées
export const ALLOWED_STATUS_TRANSITIONS: Record<
  SignalementStatus,
  SignalementStatus[]
> = {
  [SignalementStatus.SOUMIS]: [
    SignalementStatus.EN_TRAITEMENT,
    SignalementStatus.CLOTURE,
    SignalementStatus.NON_PRIS_EN_CHARGE,
  ],
  [SignalementStatus.EN_TRAITEMENT]: [
    SignalementStatus.CLOTURE,
    SignalementStatus.NON_PRIS_EN_CHARGE,
  ],
  [SignalementStatus.CLOTURE]: [SignalementStatus.EN_TRAITEMENT],
  [SignalementStatus.NON_PRIS_EN_CHARGE]: [SignalementStatus.EN_TRAITEMENT],
};

// Labels pour l'interface utilisateur
export const STATUS_LABELS: Record<SignalementStatus, string> = {
  [SignalementStatus.SOUMIS]: "Soumis",
  [SignalementStatus.EN_TRAITEMENT]: "En traitement",
  [SignalementStatus.CLOTURE]: "Clôturé",
  [SignalementStatus.NON_PRIS_EN_CHARGE]: "Non pris en charge",
};

export const PRIORITY_LABELS: Record<PriorityLevel, string> = {
  [PriorityLevel.NORMAL]: "Normal",
  [PriorityLevel.IMPORTANT]: "Important",
  [PriorityLevel.URGENT]: "Urgent",
  [PriorityLevel.CRITIQUE]: "Critique",
};

// Couleurs pour le statut et priorité (pour l'interface utilisateur)
export const STATUS_COLORS: Record<SignalementStatus, string> = {
  [SignalementStatus.SOUMIS]: "bg-blue-100 text-blue-800",
  [SignalementStatus.EN_TRAITEMENT]: "bg-yellow-100 text-yellow-800",
  [SignalementStatus.CLOTURE]: "bg-green-100 text-green-800",
  [SignalementStatus.NON_PRIS_EN_CHARGE]: "bg-red-100 text-red-800",
};

export const PRIORITY_COLORS: Record<PriorityLevel, string> = {
  [PriorityLevel.NORMAL]: "bg-gray-100 text-gray-800",
  [PriorityLevel.IMPORTANT]: "bg-blue-100 text-blue-800",
  [PriorityLevel.URGENT]: "bg-orange-100 text-orange-800",
  [PriorityLevel.CRITIQUE]: "bg-red-100 text-red-800",
};
