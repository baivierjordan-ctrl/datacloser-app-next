"use client";

import { useState } from "react";
import { AlertTriangle, Check, ClipboardCheck, Loader2 } from "lucide-react";
import { auditerMessage } from "@/lib/api";
import type { AuditMessage } from "@/lib/types";
import { useLangue } from "@/lib/i18n";

/**
 * Audit du message, sur cinq axes.
 *
 * Deux natures d'information cohabitent, et l'écran les distingue :
 * les mesures sont calculées côté serveur — une longueur ne s'invente
 * pas — tandis que les appréciations viennent du moteur. Mélanger les
 * deux ferait passer un avis pour un fait.
 */

/**
 * Trois états, et rien de plus.
 *
 * La note chiffrée a été retirée : sur cinq messages successifs
 * objectivement meilleurs, elle a rendu 5, 6, 8, 6 puis 5. Un modèle de
 * langage n'évalue pas de façon stable sur des écarts fins, et un
 * chiffre instable invite à optimiser contre du bruit.
 */
const ETATS = {
  respecte: { cle: "audit.respecte", couleur: "text-ok", puce: "bg-ok" },
  ameliorable: { cle: "audit.ameliorable", couleur: "text-warn", puce: "bg-warn" },
  manque: { cle: "audit.manque", couleur: "text-danger", puce: "bg-danger" },
} as const;

export function AuditMessageBloc({
  sujet,
  corps,
  onAppliquer,
  onRemarques,
}: {
  sujet: string;
  corps: string;
  onAppliquer: (sujet: string, corps: string) => void;
  /** Transmet les corrections relevées, pour la réécriture. */
  onRemarques?: (remarques: string[]) => void;
}) {
  const { t } = useLangue();
  const [audit, setAudit] = useState<AuditMessage | null>(null);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");

  const pret = sujet.trim() !== "" && corps.trim() !== "";

  async function auditer() {
    setErreur("");
    setEnCours(true);
    try {
      const resultat = await auditerMessage(sujet, corps);
      setAudit(resultat);
      onRemarques?.(
        resultat.axes
          .filter((a) => a.correction?.trim())
          .map((a) => `${a.nom} : ${a.correction}`),
      );
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setEnCours(false);
    }
  }

  const m = audit?.mesures;

  // Les constats objectifs, formulés seulement quand ils s'appliquent.
  const faits = m
    ? [
        m.friction.length > 0 &&
          `${t("audit.frictionAvant")}${m.friction.join(", ")}${t("audit.frictionApres")}`,
        m.promesse_chiffree &&
          t("audit.promesseChiffree"),
        m.objet_tronque_mobile &&
          `${t("audit.objetTronqueAvant")} ${m.longueur_objet} ${t("audit.objetTronqueApres")}`,
        m.corps_long &&
          `${t("audit.corpsLongAvant")} ${m.mots_corps} ${t("audit.corpsLongApres")}`,
        m.declencheurs.length > 0 &&
          `${t("audit.declencheurs")} ${m.declencheurs.join(", ")}.`,
        m.questions === 0 &&
          t("audit.aucuneQuestion"),
        m.liens > 1 &&
          `${m.liens} ${t("audit.liensApres")}`,
        !m.personnalise &&
          t("audit.pasPersonnalise"),
        m.majuscules_objet && t("audit.majuscules"),
        m.exclamations > 1 && `${m.exclamations} ${t("audit.exclamations")}`,
      ].filter(Boolean)
    : [];

  return (
    <div className="mt-4 border-t border-line pt-4">
      <button
        type="button"
        onClick={auditer}
        disabled={!pret || enCours}
        className="flex items-center gap-2 text-xs text-muted transition hover:text-teal disabled:opacity-50"
      >
        {enCours ? (
          <Loader2 size={13} className="animate-spin" aria-hidden="true" />
        ) : (
          <ClipboardCheck size={13} aria-hidden="true" />
        )}
        {enCours ? t("audit.enCours") : t("audit.bouton")}
      </button>

      {erreur && (
        <p role="alert" className="mt-3 text-xs text-danger">
          {erreur}
        </p>
      )}

      {audit && (
        <div className="apparition mt-4 rounded-xl border border-line bg-surface p-5">
          <p className="text-sm leading-relaxed text-content-soft">
            {audit.verdict}
          </p>

          {faits.length > 0 && (
            <div className="mt-4 rounded-lg border border-warn/30 bg-warn/5 p-4">
              <p className="mb-2 flex items-center gap-2 text-xs font-medium text-warn">
                <AlertTriangle size={13} aria-hidden="true" />
                {t("audit.constats")}
              </p>
              <ul className="flex flex-col gap-1.5">
                {faits.map((f) => (
                  <li key={String(f)} className="text-xs leading-relaxed text-content-soft">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-3 font-mono text-xs text-muted">
            {audit.axes.filter((a) => a.verdict === "respecte").length} {t("audit.critereAvant")} {audit.axes.length} {t("audit.critereApres")}
          </p>

          <div className="mt-4 flex flex-col gap-3">
            {audit.axes.map((axe) => (
              <div key={axe.nom} className="rounded-lg border border-line p-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className={`size-2 shrink-0 rounded-full ${
                      ETATS[axe.verdict]?.puce ?? "bg-muted"
                    }`}
                  />
                  <h4 className="text-sm font-medium">{axe.nom}</h4>
                  <span
                    className={`font-mono text-[11px] uppercase tracking-[0.12em] ${
                      ETATS[axe.verdict]?.couleur ?? "text-muted"
                    }`}
                  >
                    {ETATS[axe.verdict] ? t(ETATS[axe.verdict].cle) : ""}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-content-soft">
                  {axe.constat}
                </p>
                {axe.correction && (
                  <p className="mt-2 border-t border-line pt-2 text-xs leading-relaxed text-muted">
                    <span className="text-teal">{t("audit.aFaire")}</span>
                    {axe.correction}
                  </p>
                )}
              </div>
            ))}
          </div>

          {audit.priorite && (
            <div className="mt-4 rounded-lg border border-teal/30 bg-teal/5 p-4">
              <p className="text-xs font-medium text-teal">{t("audit.parOuCommencer")}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-content-soft">
                {audit.priorite}
              </p>
            </div>
          )}

          {audit.corrige_corps && (
            <div className="mt-4 rounded-lg border border-line bg-ink p-4">
              <p className="text-sm font-medium">{t("audit.versionCorrigee")}</p>
              <p className="mt-1 text-xs text-muted">
                {t("audit.appliqueRemarques")}
              </p>
              <p className="mt-3 text-sm">
                <span className="text-muted">{t("audit.objet")}</span>
                {audit.corrige_sujet}
              </p>
              <pre className="mt-2 max-h-56 overflow-y-auto whitespace-pre-wrap break-words border-t border-line pt-3 font-mono text-[13px] leading-relaxed text-content-soft">
                {audit.corrige_corps}
              </pre>
              <button
                type="button"
                onClick={() => {
                  onAppliquer(audit.corrige_sujet || sujet, audit.corrige_corps);
                  setAudit(null);
                }}
                className="mt-3 flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-hover"
              >
                <Check size={14} aria-hidden="true" />
                {t("audit.appliquer")}
              </button>
            </div>
          )}

          <p className="mt-4 text-xs leading-relaxed text-muted">
            {t("audit.reserve")}
          </p>
        </div>
      )}
    </div>
  );
}
