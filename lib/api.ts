import type {
  Campagne,
  ConfigSmtp,
  Lead,
  LogEnvoi,
  Modeles,
  NouvelleCampagne,
  Qualification,
} from "./types";
import { effacerSession, lireSession } from "./session";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class SessionExpiree extends Error {
  constructor() {
    super("Votre session a expiré. Reconnectez-vous.");
  }
}

async function appeler<T>(chemin: string): Promise<T> {
  const session = lireSession();
  if (!session) throw new SessionExpiree();

  const reponse = await fetch(`${BASE}${chemin}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${session.jeton}` },
  });

  if (reponse.status === 401) {
    effacerSession();
    throw new SessionExpiree();
  }
  if (!reponse.ok) {
    throw new Error("Le serveur n'a pas répondu correctement. Réessayez.");
  }
  return reponse.json();
}

export interface ReponseLeads {
  fichier: string | null;
  total: number;
  leads: Lead[];
}

/** Leads du scan demandé, ou du plus récent par défaut. */
export function recupererLeads(fichier?: string): Promise<ReponseLeads> {
  const suffixe = fichier ? `?fichier=${encodeURIComponent(fichier)}` : "";
  return appeler<ReponseLeads>(`/leads${suffixe}`);
}

/** Scans disponibles, du plus récent au plus ancien. */
export async function recupererScans(): Promise<string[]> {
  const data = await appeler<{ scans: string[] }>("/scans");
  return data.scans ?? [];
}

export interface ScanDetail {
  fichier: string;
  titre: string;
  total: number;
  contactables: number;
}

/** Scans avec leur volume, pour l'écran Exports. */
export async function recupererScansDetails(): Promise<{
  scans: ScanDetail[];
  tronque: boolean;
}> {
  return appeler("/scans/details");
}

/** Déclenche le téléchargement du CSV d'origine. */
export async function telechargerExport(fichier: string): Promise<void> {
  const session = lireSession();
  if (!session) throw new SessionExpiree();

  const reponse = await fetch(
    `${BASE}/export?fichier=${encodeURIComponent(fichier)}`,
    { headers: { Authorization: `Bearer ${session.jeton}` } },
  );

  if (reponse.status === 401) {
    effacerSession();
    throw new SessionExpiree();
  }
  if (!reponse.ok) throw new Error("Téléchargement impossible. Réessayez.");

  const blob = await reponse.blob();
  const url = URL.createObjectURL(blob);
  const lien = document.createElement("a");
  lien.href = url;
  lien.download = fichier;
  lien.click();
  URL.revokeObjectURL(url);
}

async function envoyer<T>(chemin: string, corps: unknown): Promise<T> {
  const session = lireSession();
  if (!session) throw new SessionExpiree();

  const reponse = await fetch(`${BASE}${chemin}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.jeton}`,
    },
    body: JSON.stringify(corps),
  });

  if (reponse.status === 401) {
    effacerSession();
    throw new SessionExpiree();
  }
  if (!reponse.ok) {
    const detail = await reponse.json().catch(() => null);
    throw new Error(detail?.detail ?? "L'enregistrement a échoué. Réessayez.");
  }
  return reponse.json();
}

/** Configuration SMTP enregistrée, sans le mot de passe. */
export function lireConfigSmtp(): Promise<{
  configure: boolean;
  config: ConfigSmtp | null;
}> {
  return appeler("/outreach/smtp");
}

/** Enregistre la configuration. Mot de passe vide = on garde l'existant. */
export function ecrireConfigSmtp(config: ConfigSmtp): Promise<{ enregistre: boolean }> {
  return envoyer("/outreach/smtp", config);
}

/** Campagnes de l'utilisateur. */
export async function recupererCampagnes(): Promise<Campagne[]> {
  const data = await appeler<{ campagnes: Campagne[] }>("/outreach/campagnes");
  return data.campagnes ?? [];
}

/** Journal d'envoi d'une campagne. */
export async function recupererLogs(campagneId: string): Promise<LogEnvoi[]> {
  const data = await appeler<{ logs: LogEnvoi[] }>(
    `/outreach/campagnes/${encodeURIComponent(campagneId)}/logs`,
  );
  return data.logs ?? [];
}

/** Ouvre une session. Lève une erreur explicite si les identifiants sont refusés. */
export async function seConnecter(email: string, motDePasse: string) {
  const reponse = await fetch(`${BASE}/auth/connexion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, mot_de_passe: motDePasse }),
  });

  if (reponse.status === 401) {
    throw new Error("Email ou mot de passe incorrect.");
  }
  if (!reponse.ok) {
    throw new Error("Connexion impossible pour le moment. Réessayez.");
  }
  return reponse.json() as Promise<{ jeton: string; email: string; credits: number }>;
}

/** Qualifications email présentes dans un scan, avec leur volume. */
export async function recupererQualifications(
  fichier: string,
): Promise<Qualification[]> {
  const data = await appeler<{ qualifications: Qualification[] }>(
    `/outreach/qualifications?fichier=${encodeURIComponent(fichier)}`,
  );
  return data.qualifications ?? [];
}

/** Modèles enregistrés, ou modèles par défaut si aucun n'est sauvegardé. */
export function recupererModeles(): Promise<Modeles> {
  return appeler<Modeles>("/outreach/modeles");
}

/** Crée la campagne et alimente la file d'envoi. */
export function creerCampagne(
  campagne: NouvelleCampagne,
): Promise<{ id: string; nom: string; destinataires: number }> {
  return envoyer("/outreach/campagnes", campagne);
}
