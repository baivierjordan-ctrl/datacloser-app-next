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
