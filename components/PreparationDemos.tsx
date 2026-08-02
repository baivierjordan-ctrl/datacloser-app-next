"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Check, Link2, RotateCw } from "lucide-react";
import { etatPreparationDemos, relancerPreparationDemos } from "@/lib/api";
import { useLangue } from "@/lib/i18n";
import type { EtatPreparationDemos } from "@/lib/types";

const VIDE: EtatPreparationDemos = {
  statut: "aucune",
  faits: 0,
  total: 0,
  reussis: 0,
  echecs: 0,
  message: "",
};

/**
 * Avancement de la préparation des liens de démonstration.
 *
 * Le calcul tourne côté serveur pendant plusieurs dizaines de minutes. La
 * campagne reste en pause tant qu'il n'est pas terminé : un email parti sans
 * son lien est un email gâché. On interroge donc l'état toutes les cinq
 * secondes, et on laisse l'utilisateur fermer la page sans rien interrompre.
 */
export function PreparationDemos({
  campagneId,
  nomCampagne,
  onTermine,
}: {
  campagneId: string;
  nomCampagne?: string;
  onTermine?: (reussis: number, echecs: number) => void;
}) {
  const { t } = useLangue();
  const [etat, setEtat] = useState<EtatPreparationDemos>(VIDE);
  const [relance, setRelance] = useState(false);

  useEffect(() => {
    let vivant = true;
    let minuteur: ReturnType<typeof setTimeout>;
    let annonce = false;

    async function interroger() {
      try {
        const suivant = await etatPreparationDemos(campagneId);
        if (!vivant) return;
        setEtat(suivant);
        if (suivant.statut === "termine" && !annonce) {
          annonce = true;
          onTermine?.(suivant.reussis, suivant.echecs);
        }
        if (suivant.statut === "en_cours" || suivant.statut === "aucune") {
          minuteur = setTimeout(interroger, 5000);
        }
      } catch {
        if (vivant) minuteur = setTimeout(interroger, 10000);
      }
    }

    interroger();
    return () => {
      vivant = false;
      clearTimeout(minuteur);
    };
  }, [campagneId, onTermine]);

  if (etat.statut === "aucune" && etat.total === 0) return null;

  const pourcent =
    etat.total > 0 ? Math.min(100, Math.round((etat.faits / etat.total) * 100)) : 0;
  const fini = etat.statut === "termine";
  const echoue = etat.statut === "echec";

  async function reprendre() {
    setRelance(true);
    try {
      await relancerPreparationDemos(campagneId);
      setEtat({ ...etat, statut: "en_cours", message: "" });
    } finally {
      setRelance(false);
    }
  }

  return (
    <section
      className="rounded-xl border border-line bg-surface p-5"
      aria-live="polite"
    >
      <div className="mb-3 flex items-center gap-2 text-sm font-medium">
        {fini ? (
          <Check size={15} className="text-teal" aria-hidden="true" />
        ) : echoue ? (
          <AlertTriangle size={15} className="text-warn" aria-hidden="true" />
        ) : (
          <Link2 size={15} className="text-teal" aria-hidden="true" />
        )}
        {fini
          ? t("demos.termine")
          : echoue
            ? t("demos.echec")
            : t("demos.enCours")}
        {nomCampagne ? <span className="text-muted">— {nomCampagne}</span> : null}
      </div>

      {!echoue && (
        <>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-ink"
            role="progressbar"
            aria-valuenow={pourcent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-teal transition-[width] duration-500"
              style={{ width: `${fini ? 100 : pourcent}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted">
            {etat.faits}/{etat.total} — {etat.reussis} {t("demos.prets")}
            {etat.echecs > 0 ? `, ${etat.echecs} ${t("demos.illisibles")}` : ""}
          </p>
        </>
      )}

      {etat.message && (
        <p className="mt-2 truncate text-xs text-dim" title={etat.message}>
          {etat.message}
        </p>
      )}

      {!fini && !echoue && (
        <p className="mt-3 text-xs text-muted">{t("demos.patience")}</p>
      )}

      {fini && (
        <p className="mt-3 text-xs text-muted">{t("demos.activerMaintenant")}</p>
      )}

      {echoue && (
        <button
          type="button"
          onClick={reprendre}
          disabled={relance}
          className="mt-3 flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs text-content transition hover:border-teal disabled:opacity-50"
        >
          <RotateCw size={13} aria-hidden="true" />
          {t("demos.reprendre")}
        </button>
      )}
    </section>
  );
}
