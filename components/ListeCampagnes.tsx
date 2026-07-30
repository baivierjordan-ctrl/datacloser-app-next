"use client";

import { useState } from "react";
import { ChevronDown, Pause, Play, Trash2 } from "lucide-react";
import {
  changerStatutCampagne,
  recupererLogs,
  supprimerCampagne,
} from "@/lib/api";
import { LIBELLES_CAMPAGNE, type Campagne, type LogEnvoi } from "@/lib/types";

// Un envoi n'est pas un destinataire : les relances J+4, J+9 et J+14
// incrementent le compteur d'envois sans ajouter personne a la campagne.
// Les deux chiffres sont donc presentes separement, jamais en fraction.
const COULEUR_STATUT: Record<string, string> = {
  active: "text-ok",
  pausee: "text-warn",
  terminee: "text-muted",
  brouillon: "text-muted",
  annulee: "text-danger",
};

function dateCourte(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("fr-BE", { day: "2-digit", month: "short", year: "numeric" });
}

export function ListeCampagnes({
  campagnes,
  onChangement,
}: {
  campagnes: Campagne[];
  onChangement?: () => void;
}) {
  const [ouverte, setOuverte] = useState<string | null>(null);
  const [logs, setLogs] = useState<Record<string, LogEnvoi[]>>({});
  const [chargement, setChargement] = useState<string | null>(null);
  const [erreur, setErreur] = useState("");
  const [aSupprimer, setASupprimer] = useState<string | null>(null);
  const [occupee, setOccupee] = useState<string | null>(null);

  /** Exécute une action sur une campagne et prévient le parent de rafraîchir. */
  async function agir(id: string, action: () => Promise<unknown>) {
    setOccupee(id);
    setErreur("");
    try {
      await action();
      onChangement?.();
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setOccupee(null);
      setASupprimer(null);
    }
  }

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
                    {LIBELLES_CAMPAGNE[campagne.statut] ?? campagne.statut}
                  </span>
                  <span>
                    <span className="font-mono tabular-nums">
                      {campagne.total_leads}
                    </span>
                    {" destinataires"}
                  </span>
                  <span>
                    <span className="font-mono tabular-nums">
                      {campagne.envoyes}
                    </span>
                    {campagne.envoyes > 1 ? " envois" : " envoi"}
                  </span>
                  {campagne.echecs > 0 && (
                    <span className="text-danger">
                      <span className="font-mono tabular-nums">
                        {campagne.echecs}
                      </span>{" "}
                      en échec
                    </span>
                  )}
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
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  {campagne.statut === "active" ? (
                    <button
                      type="button"
                      disabled={occupee === campagne.id}
                      onClick={() =>
                        agir(campagne.id, () =>
                          changerStatutCampagne(campagne.id, "pausee"),
                        )
                      }
                      className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs text-muted transition hover:border-warn/40 hover:text-warn disabled:opacity-40"
                    >
                      <Pause size={12} aria-hidden="true" /> Mettre en pause
                    </button>
                  ) : campagne.statut === "pausee" ? (
                    <button
                      type="button"
                      disabled={occupee === campagne.id}
                      onClick={() =>
                        agir(campagne.id, () =>
                          changerStatutCampagne(campagne.id, "active"),
                        )
                      }
                      className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs text-muted transition hover:border-teal/40 hover:text-teal disabled:opacity-40"
                    >
                      <Play size={12} aria-hidden="true" /> Reprendre les envois
                    </button>
                  ) : null}

                  {aSupprimer === campagne.id ? (
                    <span className="flex flex-wrap items-center gap-2 text-xs text-danger">
                      Supprimer définitivement cette campagne, sa file
                      d&apos;envoi et son journal ?
                      <button
                        type="button"
                        disabled={occupee === campagne.id}
                        onClick={() =>
                          agir(campagne.id, () => supprimerCampagne(campagne.id))
                        }
                        className="rounded-lg bg-danger px-3 py-1.5 font-medium text-ink transition hover:opacity-90 disabled:opacity-40"
                      >
                        {occupee === campagne.id ? "Suppression…" : "Confirmer"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setASupprimer(null)}
                        className="rounded-lg border border-line px-3 py-1.5 text-muted transition hover:text-content"
                      >
                        Annuler
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setASupprimer(campagne.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs text-muted transition hover:border-danger/40 hover:text-danger"
                    >
                      <Trash2 size={12} aria-hidden="true" /> Supprimer
                    </button>
                  )}
                </div>

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
