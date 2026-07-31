"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Download, RotateCcw } from "lucide-react";
import { ApercuExemple } from "@/components/ApercuExemple";
import { ConsoleScan } from "@/components/ConsoleScan";
import { recupererScansRadar, telechargerExport } from "@/lib/api";
import { dateHeure } from "@/lib/dates";
import { LIBELLES_SCAN, SCAN_ACTIF, type ScanRadar } from "@/lib/types";

const COULEUR: Record<string, string> = {
  en_cours: "text-teal",
  en_attente: "text-warn",
  annulation_demandee: "text-warn",
  termine: "text-muted",
  erreur: "text-danger",
};

/**
 * Chasses passées, journal compris.
 *
 * Le journal d'une chasse terminée explique ce qui a été trouvé et ce
 * qui a échoué : c'est souvent là qu'on comprend pourquoi un résultat
 * déçoit. Il reste replié tant qu'on ne le demande pas.
 */
export function HistoriqueChasses({
  onRelancer,
}: {
  onRelancer: (scan: ScanRadar) => void;
}) {
  const [scans, setScans] = useState<ScanRadar[]>([]);
  const [ouvert, setOuvert] = useState<string | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    recupererScansRadar()
      .then((r) => {
        setScans(r.scans);
        setChargement(false);
      })
      .catch((e: Error) => {
        setErreur(e.message);
        setChargement(false);
      });
  }, []);

  if (chargement) {
    return (
      <div className="flex flex-col gap-2" aria-busy="true">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-xl border border-line bg-surface"
          />
        ))}
      </div>
    );
  }

  if (erreur) {
    return (
      <p
        role="alert"
        className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger"
      >
        {erreur}
      </p>
    );
  }

  if (scans.length === 0) {
    return <ApercuExemple />;
  }

  return (
    <div className="flex flex-col gap-2">
      {scans.map((scan, rang) => {
        const estOuvert = ouvert === scan.id;
        const actif = SCAN_ACTIF.includes(scan.statut);

        return (
          <article
            key={scan.id}
            style={{ animationDelay: `${Math.min(rang, 8) * 30}ms` }}
            className={`apparition overflow-hidden rounded-xl border bg-surface transition-colors ${
              estOuvert ? "border-teal/30" : "border-line hover:border-line-hover"
            }`}
          >
            <button
              type="button"
              onClick={() => setOuvert(estOuvert ? null : scan.id)}
              aria-expanded={estOuvert}
              className="flex w-full items-center gap-4 px-5 py-4 text-left"
            >
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[16px] font-medium">
                  {scan.mots_cles.join(", ") || scan.nom_fichier || "Chasse"}
                </h3>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                  <span className={COULEUR[scan.statut] ?? "text-muted"}>
                    {LIBELLES_SCAN[scan.statut] ?? scan.statut}
                  </span>
                  {scan.lieux.length > 0 && <span>{scan.lieux.join(", ")}</span>}
                  <span>
                    <span className="font-mono tabular-nums">
                      {scan.leads_analyses}
                    </span>{" "}
                    analysées
                  </span>
                  <span>{dateHeure(scan.created_at)}</span>
                </p>
              </div>

              <ChevronDown
                size={16}
                aria-hidden="true"
                className={`shrink-0 text-muted transition-transform ${
                  estOuvert ? "rotate-180" : ""
                }`}
              />
            </button>

            {estOuvert && (
              <div className="border-t border-line bg-ink px-5 py-4">
                <div className="mb-1 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onRelancer(scan)}
                    className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs text-muted transition hover:border-teal/40 hover:text-teal"
                  >
                    <RotateCcw size={12} aria-hidden="true" /> Relancer avec les
                    mêmes réglages
                  </button>

                  {scan.nom_fichier && !actif && (
                    <button
                      type="button"
                      onClick={() =>
                        telechargerExport(scan.nom_fichier).catch(() =>
                          setErreur(
                            "Ce fichier n'est plus disponible. Relancez la chasse pour le régénérer.",
                          ),
                        )
                      }
                      className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs text-muted transition hover:border-line-hover hover:text-content"
                    >
                      <Download size={12} aria-hidden="true" /> Télécharger le
                      fichier
                    </button>
                  )}
                </div>

                {scan.erreur && (
                  <p className="mt-3 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger">
                    {scan.erreur}
                  </p>
                )}

                <ConsoleScan id={scan.id} actif={actif} />
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
