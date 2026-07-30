/** Statut de vérification de l'email, aligné sur l'enrichissement FullEnrich. */
export type StatutEmail = "verifie" | "catchall" | "introuvable";

/** Un prospect issu d'un scan Radar. */
export interface Lead {
  id: number;
  societe: string;
  contact: string;
  role: string;
  email: string;
  statut: StatutEmail;
  /** Pertinence évaluée par le moteur IA, de 1 à 10. */
  score: number;
  ville: string;
  site: string;
  tel: string;
  /** Accroche personnalisée générée à partir du site du prospect. */
  accroche: string | null;
  /** Besoins détectés sur le site du prospect (0 à 2). */
  besoins?: string[];
}

/** Filtres appliqués à la liste de résultats. */
export interface FiltresRadar {
  scoreMin: number;
  verifiesSeuls: boolean;
}

export const LIBELLES_STATUT: Record<StatutEmail, string> = {
  verifie: "Vérifié",
  catchall: "Catch-all",
  introuvable: "Introuvable",
};

/** Un lead sans email vérifiable n'est ni contactable ni facturé. */
export function estContactable(lead: Lead): boolean {
  return lead.statut !== "introuvable";
}

/** Configuration d'envoi SMTP. Le mot de passe n'est jamais relu depuis le serveur. */
export interface ConfigSmtp {
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_password?: string;
  signature: string;
  delai_min_secondes: number;
  plage_debut: number;
  plage_fin: number;
  jours_actifs: number[];
}

/** Statuts normalisés par l'API. La base stocke un vocabulaire historique. */
export type StatutCampagne =
  | "brouillon"
  | "active"
  | "pausee"
  | "terminee"
  | "annulee";

export const LIBELLES_CAMPAGNE: Record<StatutCampagne, string> = {
  brouillon: "Brouillon",
  active: "Active",
  pausee: "En pause",
  terminee: "Terminée",
  annulee: "Annulée",
};

export interface Campagne {
  id: string;
  nom: string;
  statut: StatutCampagne;
  created_at: string | null;
  launched_at: string | null;
  total_leads: number;
  envoyes: number;
  echecs: number;
}

export interface LogEnvoi {
  destinataire: string;
  statut: string;
  erreur: string | null;
  created_at: string | null;
}

export const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

/** Fournisseurs courants, pour pré-remplir hôte et port. */
export const FOURNISSEURS: Record<string, { host: string; port: number }> = {
  Gmail: { host: "smtp.gmail.com", port: 587 },
  "Outlook / Hotmail": { host: "smtp-mail.outlook.com", port: 587 },
  OVH: { host: "ssl0.ovh.net", port: 587 },
};

/** Une qualification email présente dans un scan, avec son volume. */
export interface Qualification {
  libelle: string;
  nombre: number;
  /** Présélectionnée : les qualifications non contactables sont exclues. */
  recommandee: boolean;
}

export interface Relance {
  sujet: string;
  corps: string;
}

/** Modèles d'email proposés à la création d'une campagne. */
export interface Modeles {
  sujet: string;
  corps: string;
  relances: { j4: Relance; j9: Relance; j14: Relance };
  variables: string[];
}

export interface NouvelleCampagne {
  nom: string;
  fichier: string;
  sujet: string;
  corps: string;
  qualifications: string[];
  relance_j4?: Relance | null;
  relance_j9?: Relance | null;
  relance_j14?: Relance | null;
}
