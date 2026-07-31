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
  contact: string;
  entreprise: string;
  statut: string;
  erreur: string | null;
  credits: number;
  /** Horodatage de la réponse du destinataire, si elle a été détectée. */
  repondu_at: string | null;
  /** L'email tel qu'il est parti — la seule trace de ce que le destinataire a reçu. */
  email_genere: string;
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

/** Options de recherche proposées au lancement d'une chasse. */
export interface OptionsRadar {
  pays: string[];
  villes: Record<string, string[]>;
  modes: string[];
  plafond_maps: number;
}

export type StatutScan =
  | "en_attente"
  | "en_cours"
  | "annulation_demandee"
  | "termine"
  | "erreur"
  | string;

export interface ScanRadar {
  id: string;
  nom_fichier: string;
  statut: StatutScan;
  mots_cles: string[];
  lieux: string[];
  pays: string | null;
  mode_recherche: string | null;
  leads_analyses: number;
  created_at: string | null;
  erreur: string | null;
}

export interface NouveauScan {
  mots_cles: string[];
  lieux: string[];
  pays: string;
  mode_recherche: string;
  max_par_mot: number;
  nom_export: string;
  enrichir_tel: boolean;
  verifier_absence_site: boolean;
}

/** Une chasse dans l'un de ces états interdit d'en lancer une autre. */
export const SCAN_ACTIF: StatutScan[] = [
  "en_attente",
  "en_cours",
  "annulation_demandee",
];

export const LIBELLES_SCAN: Record<string, string> = {
  en_attente: "En attente",
  en_cours: "En cours",
  annulation_demandee: "Annulation demandée",
  termine: "Terminée",
  erreur: "Échec",
};

/** Profil entreprise : il nourrit le scoring et les accroches du moteur. */
export interface ProfilEntreprise {
  company_name: string;
  website: string;
  sector: string;
  offer_description: string;
  icp_sectors: string;
  icp_company_size: string;
  icp_geography: string;
  differentiator: string;
  keywords: string;
}

export interface ModeMetier {
  cle: string;
  libelle: string;
  description: string;
  profil: Partial<ProfilEntreprise>;
}

export interface ReponseProfil {
  profil: ProfilEntreprise;
  completion: number;
  tailles: string[];
  modes: ModeMetier[];
}

export interface Offre {
  cle: string;
  nom: string;
  prix: string;
  periode: string;
  credits: number;
  lien: string;
  avantages: string[];
}

export interface Boutique {
  credits: number;
  abonnements: Offre[];
  packs: Offre[];
}

export interface Partenariat {
  lien_parrainage: string;
  parrainage: { gain_parrain: string; gain_filleul: string };
  affiliation: { commission: string; paiement: string; contact: string };
}

/** Libellés des champs du profil, utilisés à l'affichage. */
export const LIBELLES_PROFIL: Record<keyof ProfilEntreprise, string> = {
  company_name: "Nom de votre entreprise",
  website: "Site web",
  sector: "Votre secteur d'activité",
  offer_description: "Ce que vous vendez",
  icp_sectors: "Secteurs de vos clients idéaux",
  icp_company_size: "Taille des clients visés",
  icp_geography: "Zones géographiques prioritaires",
  differentiator: "Votre différenciateur clé",
  keywords: "Mots-clés de votre métier",
};

/** Email tel qu'il partira, construit pour un destinataire réel. */
export interface ApercuEmail {
  index: number;
  total: number;
  entreprise: string;
  decideur: string;
  destinataire: string;
  qualification: string;
  sujet: string;
  corps: string;
  /** Faux quand le moteur écarte ce lead : la raison explique pourquoi. */
  valide: boolean;
  raison: string;
  langue: string;
}

/** Chiffres de synthèse de l'écran d'accueil, en un seul appel. */
export interface EtapeDemarrage {
  cle: string;
  titre: string;
  detail: string;
  lien: string;
  faite: boolean;
}

export interface Accueil {
  email: string;
  credits: number;
  etapes: EtapeDemarrage[];
  demarrage_termine: boolean;
  entreprises_analysees: number;
  chasses: number;
  chasse_en_cours: boolean;
  derniere_chasse: {
    nom_fichier: string;
    created_at: string | null;
    leads_analyses: number;
  } | null;
  campagnes: number;
  campagnes_actives: number;
  emails_envoyes: number;
  emails_echoues: number;
  reponses: number;
  conseils: Conseil[];
  tout_va_bien: boolean;
  profil_completion: number;
  smtp_configure: boolean;
  /** Une seule suggestion à la fois, calculée d'après l'obstacle réel. */
  action: { titre: string; detail: string; lien: string; bouton: string };
}

/** Un tour de conversation avec l'assistant. */
export interface TourConversation {
  role: "utilisateur" | "assistant";
  contenu: string;
}

/** Contenu brut d'un fichier de leads : en-têtes réels et lignes telles quelles. */
export interface ContenuFichier {
  fichier: string;
  colonnes: string[];
  lignes: string[][];
  total: number;
  contactables: number;
  /** Comptée sur tout le fichier, même au-delà du plafond d'affichage. */
  qualite: { verifie: number; catchall: number; introuvable: number };
  tronque: boolean;
}

/** Recommandation adossée à un fait mesuré sur le compte. */
export interface Conseil {
  gravite: "bloquant" | "important" | "conseil";
  titre: string;
  /** Le chiffre qui justifie le conseil. */
  constat: string;
  action: string;
  lien: string;
  /** L'action qui corrige le problème, quand elle existe. */
  faire: {
    type: "modele_gagnant" | "variantes_objet" | "reecrire" | "chasse_icp";
    libelle: string;
    campagne_id?: string;
    sujet?: string;
  } | null;
}

/** Recherche prête à l'emploi pour un secteur donné. */
export interface SecteurRapide {
  cle: string;
  libelle: string;
  mots: string[];
  mode: string;
}

/** Chasse proposée d'après le profil, à valider avant lancement. */
export interface PlanIcp {
  mots_cles: string[];
  pays: string;
  villes: string[];
  mode: string;
  explication: string;
}

/** Vue d'ensemble de l'administration. */
export interface EtatAdmin {
  leads_caches: number;
  comptes: { id: number; email: string; credits: number }[];
  agents_actifs: { email: string; credits: number; depuis: string | null }[];
  derniers_cycles: Record<string, unknown>[];
}

/** État du pipeline de recherche de domaines. */
export interface EtatBacklinks {
  en_cours: boolean;
  journal: string[];
  total_journal: number;
  erreur: string | null;
  resultat: {
    raw_found?: number;
    qualified?: number;
    with_emails?: number;
    prospects?: Record<string, unknown>[];
  } | null;
}

/** Ligne extraite du cache global. */
export interface LigneCache {
  entreprise: string;
  decideur: string;
  email: string;
  site: string;
  ville: string;
}

/** Réécriture proposée par le moteur. Rien n'est appliqué sans validation. */
export interface PropositionMessage {
  sujet: string;
  corps: string;
  changements: string[];
  /** Vrai quand la réécriture s'appuie sur les résultats mesurés. */
  diagnostic_utilise: boolean;
}

/** Modèle d'une campagne, pour repartir de celle qui marche. */
export interface ModeleCampagne {
  nom: string;
  sujet: string;
  corps: string;
}

/** Audit du message : mesures objectives et appréciations du moteur. */
export interface AuditMessage {
  note_globale: number | null;
  verdict: string;
  axes: { nom: string; note: number; constat: string; correction: string }[];
  priorite: string;
  /** Version corrigée appliquant les remarques, vide si non fournie. */
  corrige_sujet: string;
  corrige_corps: string;
  /** Calculées côté serveur : une longueur ne s'invente pas. */
  mesures: {
    longueur_objet: number;
    objet_tronque_mobile: boolean;
    mots_corps: number;
    corps_long: boolean;
    questions: number;
    liens: number;
    declencheurs: string[];
    personnalise: boolean;
    majuscules_objet: boolean;
    exclamations: number;
    /** Marqueurs d'offre commerciale : ils n'ont pas leur place en premier contact. */
    offre: string[];
    promesse_chiffree: boolean;
  };
}
