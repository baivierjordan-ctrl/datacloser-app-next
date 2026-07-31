"use client";

import { useState } from "react";
import { Archive, Download, Loader2, Search } from "lucide-react";
import { exporterCache } from "@/lib/api";
import type { LigneCache } from "@/lib/types";

const champ =
  "w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-content outline-none transition focus:border-teal";

/**
 * Extraction depuis le cache global.
 *
 * Les leads déjà rencontrés lors de scans précédents sont réutilisables
 * sans consommer d'appel externe. Utile pour reconstituer une liste
 * sans relancer une chasse.
 */
export function ExportCache() {
  const [recherche, setRecherche] = useState("");
  const [limite, setLimite] = useState(100);
  const [lignes, setLignes] = useState<LigneCache[] | null>(null);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");

  async function extraire() {
    setErreur("");
    setEnCours(true);
    try {
      const r = await exporterCache(recherche.trim(), limite);
      setLignes(r.lignes);
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setEnCours(false);
    }
  }

  function telecharger() {
    if (!lignes?.length) return;

    const entetes = ["Entreprise", "Décideur", "Email", "Site", "Ville"];
    const echapper = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const contenu = [
      entetes.join(";"),
      ...lignes.map((l) =>
        [l.entreprise, l.decideur, l.email, l.site, l.ville]
          .map(echapper)
          .join(";"),
      ),
    ].join("\n");

    // Le BOM garantit que les accents s'affichent correctement à
    // l'ouverture dans un tableur.
    const lien = document.createElement("a");
    lien.href = URL.createObjectURL(
      new Blob(["\ufeff" + contenu], { type: "text/csv;charset=utf-8;" }),
    );
    lien.download = `cache-global-${new Date().toISOString().slice(0, 10)}.csv`;
    lien.click();
    URL.revokeObjectURL(lien.href);
  }

  return (
    <section className="rounded-xl border border-line bg-surface p-5">
      <h2 className="mb-1 flex items-center gap-2 text-sm font-medium">
        <Archive size={14} className="text-teal" aria-hidden="true" />
        Extraire du cache global
      </h2>
      <p className="mb-4 text-xs leading-relaxed text-muted">
        Récupère des leads déjà rencontrés lors de scans précédents, sans
        consommer d&apos;appel externe.
      </p>

      <div className="flex flex-wrap items-end gap-3">
        <div className="relative min-w-[16rem] flex-1">
          <Search
            size={14}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            className={`${champ} pl-9`}
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !enCours && extraire()}
            placeholder="Filtrer par nom d'entreprise…"
            aria-label="Filtrer par nom d'entreprise"
          />
        </div>
        <input
          type="number"
          min={10}
          max={1000}
          step={10}
          value={limite}
          onChange={(e) => setLimite(Number(e.target.value))}
          aria-label="Nombre maximum de lignes"
          className={`${champ} w-28`}
        />
        <button
          type="button"
          onClick={extraire}
          disabled={enCours}
          className="flex h-[38px] items-center gap-2 rounded-lg border border-line px-4 text-sm text-muted transition hover:border-line-hover hover:text-content disabled:opacity-40"
        >
          {enCours && (
            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
          )}
          Extraire
        </button>
      </div>

      {erreur && (
        <p role="alert" className="mt-3 text-xs text-danger">
          {erreur}
        </p>
      )}

      {lignes && (
        <div className="mt-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted">
              <span className="font-mono tabular-nums text-content">
                {lignes.length}
              </span>{" "}
              {lignes.length > 1 ? "lignes trouvées" : "ligne trouvée"}
            </p>
            {lignes.length > 0 && (
              <button
                type="button"
                onClick={telecharger}
                className="flex items-center gap-2 rounded-lg bg-teal px-3 py-1.5 text-xs font-medium text-white transition hover:bg-teal-hover"
              >
                <Download size={12} aria-hidden="true" />
                Télécharger en CSV
              </button>
            )}
          </div>

          {lignes.length === 0 ? (
            <p className="rounded-lg border border-line bg-ink px-4 py-6 text-center text-xs text-muted">
              Aucun lead ne correspond à ce filtre.
            </p>
          ) : (
            <div className="max-h-72 overflow-auto rounded-lg border border-line">
              <table className="w-full text-xs">
                <tbody>
                  {lignes.map((l, i) => (
                    <tr key={i} className="border-b border-line/40 last:border-0">
                      <td className="px-3 py-2 text-content-soft">
                        {l.entreprise || "—"}
                      </td>
                      <td className="px-3 py-2 text-muted">{l.decideur || "—"}</td>
                      <td className="px-3 py-2 font-mono text-muted">
                        {l.email || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
