"use client";

import { useState } from "react";
import { AlertTriangle, Check, ClipboardCheck, Loader2 } from "lucide-react";
import { auditerMessage } from "@/lib/api";
import type { AuditMessage } from "@/lib/types";

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
  respecte: { libelle: "Respecté", couleur: "text-ok", puce: "bg-ok" },
  ameliorable: { libelle: "Améliorable", couleur: "text-warn", puce: "bg-warn" },
  manque: { libelle: "À corriger", couleur: "text-danger", puce: "bg-danger" },
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
        m.offre.length > 0 &&
          `Offre commerciale en premier contact (${m.offre.join(", ")}) : elle appartient à la relance, une fois l'échange amorcé.`,
        m.promesse_chiffree &&
          "Promesse chiffrée : elle fait lire le message comme une publicité.",
        m.objet_tronque_mobile &&
          `Objet de ${m.longueur_objet} caractères : coupé sur téléphone au-delà de 60.`,
        m.corps_long &&
          `Message de ${m.mots_corps} mots : au-delà de 120, il se lit en diagonale.`,
        m.declencheurs.length > 0 &&
          `Termes surveillés par les filtres : ${m.declencheurs.join(", ")}.`,
        m.questions === 0 &&
          "Aucune question : rien n'invite le destinataire à répondre.",
        m.liens > 1 &&
          `${m.liens} liens : au-delà d'un seul, la délivrabilité se dégrade.`,
        !m.personnalise &&
          "Pas de variable d'accroche : tous vos destinataires reçoivent le même texte.",
        m.majuscules_objet && "Objet à forte proportion de majuscules.",
        m.exclamations > 1 && `${m.exclamations} points d'exclamation.`,
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
        {enCours ? "Analyse en cours…" : "Auditer mon message"}
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
                Constats mesurés sur votre texte
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
            {audit.axes.filter((a) => a.verdict === "respecte").length} critère(s)
            sur {audit.axes.length} respecté(s)
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
                    {ETATS[axe.verdict]?.libelle ?? ""}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-content-soft">
                  {axe.constat}
                </p>
                {axe.correction && (
                  <p className="mt-2 border-t border-line pt-2 text-xs leading-relaxed text-muted">
                    <span className="text-teal">À faire : </span>
                    {axe.correction}
                  </p>
                )}
              </div>
            ))}
          </div>

          {audit.priorite && (
            <div className="mt-4 rounded-lg border border-teal/30 bg-teal/5 p-4">
              <p className="text-xs font-medium text-teal">Par quoi commencer</p>
              <p className="mt-1.5 text-sm leading-relaxed text-content-soft">
                {audit.priorite}
              </p>
            </div>
          )}

          {audit.corrige_corps && (
            <div className="mt-4 rounded-lg border border-line bg-ink p-4">
              <p className="text-sm font-medium">Version corrigée</p>
              <p className="mt-1 text-xs text-muted">
                Applique les cinq remarques ci-dessus.
              </p>
              <p className="mt-3 text-sm">
                <span className="text-muted">Objet : </span>
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
                Appliquer ces corrections
              </button>
            </div>
          )}

          <p className="mt-4 text-xs leading-relaxed text-muted">
            Les constats chiffrés sont mesurés sur votre texte. Les
            appréciations viennent du moteur et reposent sur les pratiques
            connues, pas sur l&apos;observation de vos destinataires : seul un
            essai comparé tranchera.
          </p>
        </div>
      )}
    </div>
  );
}
