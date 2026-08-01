import type {
  Accueil,
  ActionAssistant,
  AuditMessage,
  ModeleCampagne,
  PropositionMessage,
  EtatBacklinks,
  LigneCache,
  EtatAdmin,
  PlanIcp,
  SecteurRapide,
  Conseil,
  ContenuFichier,
  TourConversation,
  ApercuEmail,
  Campagne,
  ConfigSmtp,
  Lead,
  LogEnvoi,
  Modeles,
  NouvelleCampagne,
  NouveauScan,
  OptionsRadar,
  Qualification,
  Boutique,
  Partenariat,
  ProfilEntreprise,
  ReponseProfil,
  ScanRadar,
} from "./types";
import { effacerSession, lireSession } from "./session";
import { lireLangue } from "./langue";

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

/**
 * Message lisible à partir d'une réponse d'erreur.
 *
 * FastAPI renvoie une chaîne pour nos erreurs explicites, mais une
 * LISTE d'objets quand la validation échoue. Afficher cette liste telle
 * quelle donnait « [object Object] » à l'utilisateur, c'est-à-dire rien.
 */
function messageErreur(detail: unknown, defaut: string): string {
  if (typeof detail === "string" && detail.trim()) return detail;

  if (Array.isArray(detail)) {
    const champs = detail
      .map((e) => {
        const chemin = Array.isArray(e?.loc)
          ? e.loc.filter((x: unknown) => x !== "body").join(" → ")
          : "";
        const raison = typeof e?.msg === "string" ? e.msg : "";
        return [chemin, raison].filter(Boolean).join(" : ");
      })
      .filter(Boolean);
    if (champs.length > 0) return `Champ invalide — ${champs.join(" ; ")}`;
  }

  return defaut;
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
    throw new Error(
      messageErreur(detail?.detail, "L'enregistrement a échoué. Réessayez."),
    );
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

/**
 * Modèles enregistrés, ou modèles par défaut si aucun n'est sauvegardé.
 *
 * La langue accompagne la demande : le serveur sert un modèle de départ
 * rédigé dans la langue de l'interface. Sans elle, un utilisateur
 * néerlandophone recevait un modèle en français.
 */
export function recupererModeles(): Promise<Modeles> {
  return appeler<Modeles>(`/outreach/modeles?langue=${lireLangue()}`);
}

/** Crée la campagne et alimente la file d'envoi. */
export function creerCampagne(
  campagne: NouvelleCampagne,
): Promise<{ id: string; nom: string; destinataires: number }> {
  return envoyer("/outreach/campagnes", campagne);
}

/** Pays, villes suggérées et modes de recherche. */
export function recupererOptionsRadar(): Promise<OptionsRadar> {
  return appeler<OptionsRadar>("/radar/options");
}

/** Historique des chasses et identifiant de celle en cours, s'il y en a une. */
export function recupererScansRadar(): Promise<{
  scans: ScanRadar[];
  actif: string | null;
}> {
  return appeler("/radar/scans");
}

/** Dépose une chasse dans la file. */
export function lancerScan(
  scan: NouveauScan,
): Promise<{ id: string; nom_fichier: string; requetes_estimees: number }> {
  return envoyer("/radar/scan", scan);
}

/** Demande l'arrêt d'une chasse en cours. */
export function annulerScan(id: string): Promise<{ annulation_demandee: boolean }> {
  return envoyer(`/radar/scan/${encodeURIComponent(id)}/annuler`, {});
}

/** Journal d'une chasse, en flux : seules les lignes nouvelles sont renvoyées. */
export function recupererLogsScan(
  id: string,
  depuis: number,
): Promise<{
  total: number;
  depuis: number;
  lignes: string[];
  statut: string;
  termine: boolean;
}> {
  return appeler(
    `/radar/scan/${encodeURIComponent(id)}/logs?depuis=${depuis}`,
  );
}

/** Crée un compte et ouvre directement la session. */
export async function sInscrire(donnees: {
  email: string;
  mot_de_passe: string;
  societe: string;
  adresse?: string;
  tva?: string;
}): Promise<{ jeton: string; email: string; credits: number }> {
  const reponse = await fetch(`${BASE}/auth/inscription`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(donnees),
  });
  if (!reponse.ok) {
    const detail = await reponse.json().catch(() => null);
    throw new Error(
      messageErreur(detail?.detail, "Inscription impossible. Réessayez."),
    );
  }
  return reponse.json();
}

/** Demande l'envoi d'un lien de réinitialisation. */
export async function demanderReset(email: string): Promise<{ message: string }> {
  const reponse = await fetch(`${BASE}/auth/reset/demande`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!reponse.ok) throw new Error("Envoi impossible pour le moment. Réessayez.");
  return reponse.json();
}

/** Applique un nouveau mot de passe à partir du jeton reçu par email. */
export async function validerReset(
  token: string,
  motDePasse: string,
): Promise<{ message: string }> {
  const reponse = await fetch(`${BASE}/auth/reset/valider`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, mot_de_passe: motDePasse }),
  });
  if (!reponse.ok) {
    const detail = await reponse.json().catch(() => null);
    throw new Error(messageErreur(detail?.detail, "Lien invalide ou expiré."));
  }
  return reponse.json();
}

/** Profil enregistré, options de saisie et modes métier. */
export function recupererProfil(): Promise<ReponseProfil> {
  return appeler<ReponseProfil>("/entreprise/profil");
}

/** Enregistre le profil entreprise. */
export function enregistrerProfil(
  profil: ProfilEntreprise,
): Promise<{ enregistre: boolean; completion: number }> {
  return envoyer("/entreprise/profil", profil);
}

/** Propose un profil déduit du site indiqué. Rien n'est enregistré. */
export function analyserSite(
  url: string,
): Promise<{ profil: Partial<ProfilEntreprise> }> {
  return envoyer("/entreprise/analyser-url", { url });
}

/** Offres et liens de paiement, déjà personnalisés. */
export function recupererBoutique(): Promise<Boutique> {
  // La langue est reportée sur la page de paiement Stripe.
  return appeler<Boutique>(`/boutique?langue=${lireLangue()}`);
}

/** Vérifie un code promotionnel. */
export function verifierPromo(
  code: string,
): Promise<{ libelle: string; message: string; lien: string }> {
  return envoyer(`/boutique/promo?langue=${lireLangue()}`, { code });
}

/** Lien de parrainage et conditions des programmes. */
export function recupererPartenariat(): Promise<Partenariat> {
  return appeler<Partenariat>("/partenariat");
}

/** Construit l'email tel qu'il partira, sans rien envoyer. */
export function genererApercu(demande: {
  fichier: string;
  sujet: string;
  corps: string;
  index?: number;
}): Promise<ApercuEmail> {
  return envoyer("/outreach/apercu", demande);
}

/** Mémorise le modèle : il servira de base aux prochaines campagnes. */
export function enregistrerModele(
  sujet: string,
  corps: string,
): Promise<{ enregistre: boolean }> {
  return envoyer("/outreach/modeles", { sujet, corps });
}

/** Met une campagne en pause ou la relance. */
export function changerStatutCampagne(
  id: string,
  statut: "active" | "pausee",
): Promise<{ statut: string }> {
  return envoyer(`/outreach/campagnes/${encodeURIComponent(id)}/statut`, {
    statut,
  });
}

/** Supprime une campagne, sa file d'envoi et son journal. */
export async function supprimerCampagne(id: string): Promise<void> {
  const session = lireSession();
  if (!session) throw new SessionExpiree();

  const reponse = await fetch(
    `${BASE}/outreach/campagnes/${encodeURIComponent(id)}`,
    { method: "DELETE", headers: { Authorization: `Bearer ${session.jeton}` } },
  );
  if (reponse.status === 401) {
    effacerSession();
    throw new SessionExpiree();
  }
  if (!reponse.ok) throw new Error("Suppression impossible. Réessayez.");
}

/** Chiffres de synthèse et prochaine action suggérée. */
export function recupererAccueil(): Promise<Accueil> {
  return appeler<Accueil>("/accueil");
}

/** Pose une question à l'assistant, historique joint pour garder le fil. */
export function interrogerAssistant(
  question: string,
  historique: TourConversation[],
  contexte = "",
): Promise<{ reponse: string; actions: ActionAssistant[] }> {
  return envoyer("/assistant", { question, historique, contexte, langue: lireLangue() });
}

/** Questions de départ, adaptées à l'avancement du compte. */
export async function recupererSuggestions(): Promise<string[]> {
  const d = await appeler<{ suggestions: string[] }>("/assistant/suggestions");
  return d.suggestions ?? [];
}

/** Adresse du webhook CRM enregistrée. */
export async function recupererWebhook(): Promise<string> {
  const d = await appeler<{ url: string }>("/crm/webhook");
  return d.url ?? "";
}

/** Enregistre l'adresse du webhook, ou l'efface si elle est vide. */
export function enregistrerWebhook(url: string): Promise<{ url: string }> {
  return envoyer("/crm/webhook", { url });
}

/** Envoie une charge de test vers l'adresse indiquée. */
export function testerWebhook(
  url: string,
): Promise<{ code: number; message: string }> {
  return envoyer("/crm/test", { url });
}

/** Pousse les leads d'un fichier vers le webhook enregistré. */
export function envoyerVersCrm(fichier: string): Promise<{ envoyes: number }> {
  return envoyer("/crm/envoyer", { fichier });
}

/** Métiers proches de ceux déjà saisis, pour élargir une chasse. */
export async function suggererMetiers(mots: string[]): Promise<string[]> {
  const d = await envoyer<{ suggestions: string[] }>("/radar/suggestions", {
    mots,
  });
  return d.suggestions ?? [];
}

/** Contenu complet d'un fichier, colonnes réelles comprises. */
export function recupererContenuFichier(
  fichier: string,
): Promise<ContenuFichier> {
  return appeler<ContenuFichier>(
    `/fichier/contenu?fichier=${encodeURIComponent(fichier)}`,
  );
}

/** Diagnostic de la configuration, chaque conseil adossé à un fait. */
export function recupererConseils(): Promise<{
  conseils: Conseil[];
  tout_va_bien: boolean;
  mesure_reponses: boolean;
}> {
  return appeler("/conseils");
}

/** Recherches prêtes à l'emploi, par secteur. */
export async function recupererSecteurs(): Promise<SecteurRapide[]> {
  const d = await appeler<{ secteurs: SecteurRapide[] }>("/radar/secteurs");
  return d.secteurs ?? [];
}

/** Chasse déduite du profil. Ne lance rien : la configuration est à valider. */
export function proposerPlanIcp(): Promise<PlanIcp> {
  return envoyer("/radar/plan-icp", {});
}

/** Solde de crédits, lu en direct. */
export async function recupererCredits(): Promise<number> {
  const d = await appeler<{ credits: number }>("/credits");
  return d.credits ?? 0;
}

/** Vue d'ensemble de l'administration. Refusée aux comptes non habilités. */
export function recupererEtatAdmin(): Promise<EtatAdmin> {
  return appeler<EtatAdmin>("/admin/etat");
}

/** Ajoute des crédits à un compte existant. */
export function crediterCompte(
  email: string,
  montant: number,
): Promise<{ email: string; ajoutes: number; solde: number }> {
  return envoyer("/admin/crediter", { email, montant });
}

/** Active ou désactive l'agent autonome d'un compte. */
export function basculerAgent(
  email: string,
  actif: boolean,
): Promise<{ email: string; actif: boolean }> {
  return envoyer("/admin/agent", { email, actif });
}

/** Purge irréversible du cache des leads non vérifiés. */
export function purgerCache(
  confirmation: string,
): Promise<{ supprimes: number; message: string }> {
  return envoyer("/admin/purger-cache", { confirmation });
}

/** Démarre une recherche de domaines. Une seule à la fois. */
export function lancerBacklinks(demande: {
  sujets: string[];
  langue: string;
  maximum: number;
  da_min: number;
  score_min: number;
}): Promise<{ lance: boolean }> {
  return envoyer("/admin/backlinks/lancer", demande);
}

/** Journal et résultat de la recherche en cours ou de la dernière. */
export function etatBacklinks(): Promise<EtatBacklinks> {
  return appeler<EtatBacklinks>("/admin/backlinks");
}

/** Extrait des leads du cache global, sans relancer de scan. */
export function exporterCache(
  recherche: string,
  limite: number,
): Promise<{ lignes: LigneCache[]; total: number }> {
  const p = new URLSearchParams({ recherche, limite: String(limite) });
  return appeler(`/admin/cache?${p}`);
}

/** Demande une réécriture du modèle. N'applique rien. */
export function ameliorerMessage(
  sujet: string,
  corps: string,
  remarques: string[] = [],
): Promise<PropositionMessage> {
  return envoyer("/outreach/ameliorer", {
    sujet,
    corps,
    remarques,
    langue: lireLangue(),
  });
}

/** Modèle d'une campagne existante. */
export function recupererModeleCampagne(id: string): Promise<ModeleCampagne> {
  return appeler<ModeleCampagne>(
    `/outreach/campagnes/${encodeURIComponent(id)}/modele`,
  );
}

/** Trois objets alternatifs, pour comparer ce qui fait ouvrir. */
export async function proposerObjets(
  sujet: string,
  corps = "",
): Promise<string[]> {
  const d = await envoyer<{ variantes: string[] }>("/outreach/variantes-objet", {
    sujet,
    corps,
    langue: lireLangue(),
  });
  return d.variantes ?? [];
}

/** Audit du message sur cinq axes, mesures objectives comprises. */
export function auditerMessage(
  sujet: string,
  corps: string,
): Promise<AuditMessage> {
  return envoyer("/outreach/auditer", { sujet, corps, langue: lireLangue() });
}

/** Retire une adresse de toute prospection. Public : aucun compte requis. */
export async function desinscrire(email: string): Promise<void> {
  const reponse = await fetch(`${BASE}/desinscription`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!reponse.ok) {
    const detail = await reponse.json().catch(() => null);
    throw new Error(
      messageErreur(detail?.detail, "L'enregistrement a échoué. Réessayez."),
    );
  }
}

/** Pose une question accompagnée d'un fichier. Lu et analysé côté serveur. */
export async function interrogerAvecFichier(
  question: string,
  fichier: File,
  historique: TourConversation[],
  contexte = "",
): Promise<{
  reponse: string;
  fichier: string;
  analyse: boolean;
  actions: ActionAssistant[];
}> {
  const session = lireSession();
  if (!session) throw new SessionExpiree();

  const corps = new FormData();
  corps.append("question", question);
  corps.append("historique", JSON.stringify(historique));
  corps.append("contexte", contexte);
  corps.append("langue", lireLangue());
  corps.append("fichier", fichier);

  const reponse = await fetch(`${BASE}/assistant/fichier`, {
    method: "POST",
    // Pas de Content-Type : le navigateur pose la frontière multipart.
    headers: { Authorization: `Bearer ${session.jeton}` },
    body: corps,
  });

  if (reponse.status === 401) {
    effacerSession();
    throw new SessionExpiree();
  }
  if (!reponse.ok) {
    const detail = await reponse.json().catch(() => null);
    throw new Error(
      messageErreur(detail?.detail, "L'analyse du fichier a échoué."),
    );
  }
  return reponse.json();
}
