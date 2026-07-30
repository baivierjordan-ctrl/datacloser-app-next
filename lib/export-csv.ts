import { LIBELLES_STATUT, type Lead } from "./types";

/**
 * Export CSV de la sélection courante.
 *
 * Le fichier est construit dans le navigateur : la sélection n'existe
 * que côté client, inutile de refaire un aller-retour serveur. Le
 * séparateur point-virgule et le BOM UTF-8 assurent l'ouverture directe
 * dans Excel en configuration francophone.
 */

const COLONNES: { entete: string; valeur: (lead: Lead) => string }[] = [
  { entete: "Entreprise", valeur: (l) => l.societe },
  { entete: "Décideur", valeur: (l) => l.contact },
  { entete: "Fonction", valeur: (l) => l.role },
  { entete: "Email", valeur: (l) => l.email },
  { entete: "Qualification", valeur: (l) => LIBELLES_STATUT[l.statut] ?? "" },
  { entete: "Score", valeur: (l) => String(l.score) },
  { entete: "Localité", valeur: (l) => l.ville },
  { entete: "Site", valeur: (l) => l.site },
  { entete: "Téléphone", valeur: (l) => l.tel },
  { entete: "Accroche", valeur: (l) => l.accroche ?? "" },
  { entete: "Besoin 1", valeur: (l) => l.besoins?.[0] ?? "" },
  { entete: "Besoin 2", valeur: (l) => l.besoins?.[1] ?? "" },
];

/** Échappe un champ : guillemets doublés, encadrement si nécessaire. */
function champ(valeur: string): string {
  const texte = (valeur ?? "").replace(/\r?\n/g, " ").trim();
  return /[";]/.test(texte) ? `"${texte.replace(/"/g, '""')}"` : texte;
}

function nomFichier(source: string | null): string {
  const base = (source ?? "selection").replace(/\.csv$/i, "");
  const date = new Date().toISOString().slice(0, 10);
  return `${base}_selection_${date}.csv`;
}

/** Déclenche le téléchargement du CSV. Retourne le nombre de lignes écrites. */
export function exporterSelection(leads: Lead[], source: string | null): number {
  if (leads.length === 0) return 0;

  const lignes = [
    COLONNES.map((c) => c.entete).join(";"),
    ...leads.map((lead) => COLONNES.map((c) => champ(c.valeur(lead))).join(";")),
  ];

  // Le BOM évite les accents cassés à l'ouverture dans Excel.
  const blob = new Blob(["\ufeff" + lignes.join("\r\n")], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const lien = document.createElement("a");
  lien.href = url;
  lien.download = nomFichier(source);
  lien.click();
  URL.revokeObjectURL(url);

  return leads.length;
}
