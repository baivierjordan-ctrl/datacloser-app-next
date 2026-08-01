"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, MailCheck, Pause, Play, Trash2 } from "lucide-react";
import {
  changerStatutCampagne,
  recupererLogs,
  supprimerCampagne,
} from "@/lib/api";
import { dateCourte, dateHeure } from "@/lib/dates";
import { type Campagne, type LogEnvoi } from "@/lib/types";
import { useLangue, type Cle } from "@/lib/i18n";

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

export function ListeCampagnes({
  campagnes,
  onChangement,
}: {
  campagnes: Campagne[];
  onChangement?: () => void;
}) {
  const { t } = useLangue();
  const [ouverte, setOuverte] = useState<string | null>(null);
  const [logs, setLogs] = useState<Record<string, LogEnvoi[]>>({});
  const [chargement, setChargement] = useState<string | null>(null);
  const [erreur, setErreur] = useState("");
  const [aSupprimer, setASupprimer] = useState<string | null>(null);
  const [ligneOuverte, setLigneOuverte] = useState<string | null>(null);
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
      <div className="rounded-xl border border-line bg-surface px-5 py-10 text-center">
        <p className="text-sm text-content">{t("liste.vide")}</p>
        <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-muted">
          {t("liste.videDetail")}
        </p>
        <Link
          href="/outreach?vue=creation"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-hover"
        >
          {t("liste.creer")}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
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
                <h3 className="truncate text-[16px] font-medium">{campagne.nom}</h3>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                  <span className={COULEUR_STATUT[campagne.statut] ?? "text-muted"}>
                    {t(`campagneStatut.${campagne.statut}` as Cle) ?? campagne.statut}
                  </span>
                  <span>
                    <span className="font-mono tabular-nums">
                      {campagne.total_leads}
                    </span>
                    {t("liste.destinatairesSuffixe")}
                  </span>
                  <span>
                    <span className="font-mono tabular-nums">
                      {campagne.envoyes}
                    </span>
                    {campagne.envoyes > 1 ? t("liste.envois") : t("liste.envoi")}
                  </span>
                  {campagne.echecs > 0 && (
                    <span className="text-danger">
                      <span className="font-mono tabular-nums">
                        {campagne.echecs}
                      </span>{" "}
                      {t("liste.enEchec")}
                    </span>
                  )}
                  <span>{t("liste.creeeLe")} {dateCourte(campagne.created_at)}</span>
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
              <div className="border-t border-line bg-ink px-5 py-4">
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
                      <Pause size={12} aria-hidden="true" /> {t("liste.pause")}
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
                      <Play size={12} aria-hidden="true" /> {t("liste.reprendre")}
                    </button>
                  ) : null}

                  {aSupprimer === campagne.id ? (
                    <span className="flex flex-wrap items-center gap-2 text-xs text-danger">
                      {t("liste.confirmerSuppression")}
                      <button
                        type="button"
                        disabled={occupee === campagne.id}
                        onClick={() =>
                          agir(campagne.id, () => supprimerCampagne(campagne.id))
                        }
                        className="rounded-lg bg-danger px-3 py-1.5 font-medium text-white transition hover:opacity-90 disabled:opacity-40"
                      >
                        {occupee === campagne.id ? t("liste.suppression") : t("liste.confirmer")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setASupprimer(null)}
                        className="rounded-lg border border-line px-3 py-1.5 text-muted transition hover:text-content"
                      >
                        {t("liste.annuler")}
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setASupprimer(campagne.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs text-muted transition hover:border-danger/40 hover:text-danger"
                    >
                      <Trash2 size={12} aria-hidden="true" /> {t("liste.supprimer")}
                    </button>
                  )}
                </div>

                {chargement === campagne.id ? (
                  <p className="text-xs text-muted">{t("liste.chargementJournal")}</p>
                ) : erreur ? (
                  <p role="alert" className="text-xs text-danger">
                    {erreur}
                  </p>
                ) : !journal || journal.length === 0 ? (
                  <p className="text-xs text-muted">
                    {t("liste.journalVide")}
                  </p>
                ) : (
                  <ul className="flex flex-col">
                    {journal.map((ligne, i) => {
                      const cle = `${campagne.id}-${i}`;
                      const ouverte = ligneOuverte === cle;
                      const heure = dateHeure(ligne.created_at);

                      return (
                        <li key={cle} className="border-b border-line/50 last:border-0">
                          <button
                            type="button"
                            onClick={() =>
                              setLigneOuverte(ouverte ? null : cle)
                            }
                            disabled={!ligne.email_genere && !ligne.erreur}
                            aria-expanded={ouverte}
                            className="flex w-full flex-wrap items-baseline gap-x-3 gap-y-0.5 py-2 text-left text-xs disabled:cursor-default"
                          >
                            <span className="min-w-0 flex-1 truncate">
                              <span className="text-content">
                                {ligne.entreprise || ligne.destinataire}
                              </span>
                              {ligne.contact && (
                                <span className="text-muted"> · {ligne.contact}</span>
                              )}
                            </span>
                            <span className="hidden truncate font-mono text-muted sm:inline">
                              {ligne.destinataire}
                            </span>
                            <span className="font-mono text-muted">{heure}</span>
                            <span
                              className={`flex w-20 items-center justify-end gap-1 text-right font-mono ${
                                ligne.erreur
                                  ? "text-danger"
                                  : ligne.repondu_at
                                    ? "text-teal"
                                    : "text-muted"
                              }`}
                            >
                              {ligne.repondu_at && (
                                <MailCheck size={12} aria-hidden="true" />
                              )}
                              {ligne.erreur
                                ? t("liste.echec")
                                : ligne.repondu_at
                                  ? t("liste.repondu")
                                  : ligne.statut || t("liste.envoye")}
                            </span>
                          </button>

                          {ouverte && (
                            <div className="mb-2 rounded-lg border border-line bg-surface p-3">
                              {ligne.erreur && (
                                <p className="mb-2 text-xs text-danger">
                                  {ligne.erreur}
                                </p>
                              )}
                              {ligne.email_genere && (
                                <>
                                  <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-teal">
                                    {t("liste.messageEnvoye")}
                                  </p>
                                  <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed text-content-soft">
                                    {ligne.email_genere}
                                  </pre>
                                </>
                              )}
                            </div>
                          )}
                        </li>
                      );
                    })}
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
