"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { recupererLogs } from "@/lib/api";
import type { Campagne, LogEnvoi } from "@/lib/types";

const COULEUR_STATUT: Record<string, string> = {
  active: "text-ok",
  terminee: "text-muted",
  brouillon: "text-warn",
  annulee: "text-danger",
};

function dateCourte(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("fr-BE", { day: "2-digit", month: "short", year: "numeric" });
}

export function ListeCampagnes({ campagnes }: { campagnes: Campagne[] }) {
  const [ouverte, setOuverte] = useState<string | null>(null);
  const [logs, setLogs] = useState<Record<string, LogEnvoi[]>>({});
  const [chargement, setChargement] = useState<string | null>(null);
  const [erreur, setErreur] = useState("");

  async function basculer(id: string) {
    if (ouverte === id) {
      setOuverte(null);
      return;
    }
    setOuverte(id);
    if (logs[id]) return;

    setChargement(id);
    setErreur("");
    try {
      const resultat = await recupererLogs(id);
      setLogs((precedent) => ({ ...precedent, [id]: resultat }));
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setChargement(null);
    }
  }

  if (campagnes.length === 0) {
    return (
      <p className="rounded-xl border border-line bg-surface px-5 py-10 text-center text-sm text-muted">
        Aucune campagne pour le moment. Sélectionnez des leads depuis le Radar
        pour en créer une.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {campagnes.map((campagne) => {
        const estOuverte = ouverte === campagne.id;
        const journal = logs[campagne.id];

        return (
          <article
            key={campagne.id}
            className={`overflow-hidden rounded-xl border bg-surface transition-colors ${
              estOuverte ? "border-teal/30" : "border-line hover:border-line-hover"
            }`}
          >
            <button
              type="button"
              onClick={() => basculer(campagne.id)}
              aria-expanded={estOuverte}
              className="flex w-full items-center gap-4 px-5 py-4 text-left"
            >
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[15px] font-medium">{campagne.nom}</h3>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                  <span className={COULEUR_STATUT[campagne.statut] ?? "text-muted"}>
                    {campagne.statut}
                  </span>
                  <span>
                    <span className="font-mono tabular-nums">
                      {campagne.total_leads}
                    </span>{" "}
                    destinataires
                  </span>
                  <span>Créée le {dateCourte(campagne.created_at)}</span>
                </p>
              </div>

              <ChevronDown
                size={16}
                aria-hidden="true"
                className={`shrink-0 text-muted transition-transform ${
                  estOuverte ? "rotate-180" : ""
                }`}
              />
            </button>

            {estOuverte && (
              <div className="border-t border-line bg-ink/60 px-5 py-4">
                {chargement === campagne.id ? (
                  <p className="text-xs text-muted">Chargement du journal…</p>
                ) : erreur ? (
                  <p role="alert" className="text-xs text-danger">
                    {erreur}
                  </p>
                ) : !journal || journal.length === 0 ? (
                  <p className="text-xs text-muted">
                    Aucun envoi enregistré pour cette campagne.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-1.5">
                    {journal.map((ligne, i) => (
                      <li
                        key={`${ligne.destinataire}-${i}`}
                        className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs"
                      >
                        <span className="text-content-soft">{ligne.destinataire}</span>
                        <span
                          className={
                            ligne.erreur ? "text-danger" : "text-ok"
                          }
                          title={ligne.erreur ?? undefined}
                        >
                          {ligne.erreur ? "échec" : ligne.statut || "envoyé"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
