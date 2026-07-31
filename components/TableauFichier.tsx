"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Download, Loader2, Search } from "lucide-react";
import { recupererContenuFichier, telechargerExport } from "@/lib/api";
import type { ContenuFichier } from "@/lib/types";

/**
 * Tableau complet d'un fichier de leads.
 *
 * Le Radar donne la synthèse d'une chasse ; ici on ouvre le fichier tel
 * qu'il est, avec ses colonnes réelles — y compris celles ajoutées au
 * fil des versions de l'application. Aucune normalisation, aucun tri
 * imposé : ce qu'on lit est ce que contient le CSV.
 *
 * En-tête figé et défilement dans les deux sens : une trentaine de
 * colonnes sur des centaines de lignes se parcourt mal autrement.
 */

/** Colonnes qui méritent d'être larges : elles portent des phrases. */
const COLONNES_LARGES = /accroche|icebreaker|besoin|description|message/i;

export function TableauFichier({
  fichier,
  onRetour,
}: {
  fichier: string;
  onRetour: () => void;
}) {
  const [contenu, setContenu] = useState<ContenuFichier | null>(null);
  const [erreur, setErreur] = useState("");
  const [recherche, setRecherche] = useState("");
  const [enCours, setEnCours] = useState(false);

  useEffect(() => {
    setContenu(null);
    setErreur("");
    recupererContenuFichier(fichier)
      .then(setContenu)
      .catch((e: Error) => setErreur(e.message));
  }, [fichier]);

  const lignes = useMemo(() => {
    if (!contenu) return [];
    const terme = recherche.trim().toLowerCase();
    if (!terme) return contenu.lignes;
    return contenu.lignes.filter((ligne) =>
      ligne.some((cellule) => cellule.toLowerCase().includes(terme)),
    );
  }, [contenu, recherche]);

  const titre = fichier.replace(/\.csv$/i, "").replace(/_/g, " ");

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onRetour}
          className="flex items-center gap-2 text-sm text-muted transition hover:text-content"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Tous les fichiers
        </button>

        <button
          type="button"
          disabled={enCours}
          onClick={() => {
            setEnCours(true);
            telechargerExport(fichier)
              .catch(() => setErreur("Téléchargement impossible."))
              .finally(() => setEnCours(false));
          }}
          className="flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm text-muted transition hover:border-line-hover hover:text-content disabled:opacity-50"
        >
          {enCours ? (
            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
          ) : (
            <Download size={14} aria-hidden="true" />
          )}
          Télécharger
        </button>
      </div>

      <h2 className="text-[22px] font-semibold leading-tight">{titre}</h2>

      {contenu && (
        <p className="mt-1.5 text-sm text-muted">
          <span className="font-mono tabular-nums text-content">
            {contenu.total}
          </span>{" "}
          {contenu.total > 1 ? "lignes" : "ligne"} ·{" "}
          <span className="font-mono tabular-nums">
            {contenu.colonnes.length}
          </span>{" "}
          colonnes
          {recherche.trim() && (
            <>
              {" · "}
              <span className="font-mono tabular-nums text-teal">
                {lignes.length}
              </span>{" "}
              après filtre
            </>
          )}
        </p>
      )}

      {erreur && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger"
        >
          {erreur}
        </p>
      )}

      {!contenu && !erreur && (
        <div
          className="mt-5 h-96 animate-pulse rounded-xl border border-line bg-surface"
          aria-busy="true"
        />
      )}

      {contenu && contenu.total === 0 && (
        <div className="mt-5 rounded-xl border border-warn/30 bg-warn/5 px-5 py-8 text-center">
          <p className="text-sm text-content">
            Ce fichier ne contient aucune ligne.
          </p>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted">
            Le fichier est créé au départ d&apos;une chasse et rempli à la fin :
            une chasse interrompue laisse donc un fichier vide sous le même nom.
            Relancez-la depuis le Radar pour le régénérer.
          </p>
        </div>
      )}

      {contenu && contenu.total > 0 && (
        <>
          <div className="relative mt-5">
            <Search
              size={14}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Filtrer sur n'importe quelle colonne…"
              aria-label="Filtrer les lignes"
              className="w-full rounded-lg border border-line bg-ink py-2 pl-9 pr-3 text-sm text-content outline-none transition focus:border-teal"
            />
          </div>

          {lignes.length === 0 ? (
            <p className="mt-4 rounded-xl border border-line bg-surface px-5 py-10 text-center text-sm text-muted">
              Aucune ligne ne contient « {recherche.trim()} ».
            </p>
          ) : (
            <div className="mt-4 max-h-[70vh] overflow-auto rounded-xl border border-line">
              <table className="w-max min-w-full border-collapse text-xs">
                <thead className="sticky top-0 z-10">
                  <tr>
                    {contenu.colonnes.map((colonne) => (
                      <th
                        key={colonne}
                        scope="col"
                        className="border-b border-line bg-surface px-3 py-2.5 text-left font-mono text-[10px] font-normal uppercase tracking-[0.1em] text-muted"
                      >
                        {colonne}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lignes.map((ligne, i) => (
                    <tr
                      key={i}
                      className="border-b border-line/40 last:border-0 hover:bg-surface"
                    >
                      {ligne.map((cellule, j) => (
                        <td
                          key={j}
                          title={cellule || undefined}
                          className={`px-3 py-2 align-top ${
                            COLONNES_LARGES.test(contenu.colonnes[j] ?? "")
                              ? "max-w-md min-w-[18rem] text-content-soft"
                              : "max-w-[16rem] truncate whitespace-nowrap text-content-soft"
                          }`}
                        >
                          {cellule || <span className="text-muted/40">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {contenu.tronque && (
            <p className="mt-3 text-center text-xs text-muted">
              Seules les {contenu.lignes.length} premières lignes sont affichées.
              Le fichier téléchargé les contient toutes.
            </p>
          )}
        </>
      )}
    </div>
  );
}
