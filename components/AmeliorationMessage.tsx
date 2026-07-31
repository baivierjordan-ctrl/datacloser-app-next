"use client";

import { useState } from "react";
import { Check, Loader2, Sparkles, X } from "lucide-react";
import { ameliorerMessage } from "@/lib/api";
import type { PropositionMessage } from "@/lib/types";

/**
 * Réécriture du modèle par le moteur.
 *
 * Le moteur propose, l'utilisateur décide. Rien n'est appliqué
 * automatiquement : ces messages partent en son nom depuis son propre
 * domaine, et une réécriture non relue engagerait sa réputation
 * d'expéditeur — celle-ci se répare bien plus difficilement qu'un
 * mauvais taux de réponse.
 *
 * Les deux versions sont montrées côte à côte, avec la liste de ce qui
 * a changé : accepter à l'aveugle n'apprendrait rien, alors que
 * comparer forme le jugement pour les campagnes suivantes.
 */
export function AmeliorationMessage({
  sujet,
  corps,
  onAppliquer,
}: {
  sujet: string;
  corps: string;
  onAppliquer: (sujet: string, corps: string) => void;
}) {
  const [proposition, setProposition] = useState<PropositionMessage | null>(null);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");

  const pret = sujet.trim() !== "" && corps.trim() !== "";

  async function demander() {
    setErreur("");
    setEnCours(true);
    try {
      setProposition(await ameliorerMessage(sujet, corps));
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setEnCours(false);
    }
  }

  return (
    <div className="mt-4 border-t border-line pt-4">
      <button
        type="button"
        onClick={demander}
        disabled={!pret || enCours}
        className="flex items-center gap-2 text-xs text-muted transition hover:text-teal disabled:opacity-50"
      >
        {enCours ? (
          <Loader2 size={13} className="animate-spin" aria-hidden="true" />
        ) : (
          <Sparkles size={13} aria-hidden="true" />
        )}
        {enCours ? "Réécriture en cours…" : "Proposer une version améliorée"}
      </button>

      {!pret && (
        <p className="mt-2 text-xs text-muted">
          Rédigez d&apos;abord un objet et un message.
        </p>
      )}

      {erreur && (
        <p role="alert" className="mt-3 text-xs text-danger">
          {erreur}
        </p>
      )}

      {proposition && (
        <div className="apparition mt-4 rounded-xl border border-teal/30 bg-teal/5 p-4">
          <p className="text-sm font-medium">Version proposée</p>
          {proposition.diagnostic_utilise && (
            <p className="mt-1 text-xs text-muted">
              Écrite en tenant compte des résultats mesurés sur vos envois.
            </p>
          )}

          <div className="mt-4 rounded-lg border border-line bg-surface p-4">
            <p className="text-sm">
              <span className="text-muted">Objet : </span>
              {proposition.sujet}
            </p>
            <pre className="mt-3 max-h-64 overflow-y-auto whitespace-pre-wrap break-words border-t border-line pt-3 font-mono text-[13px] leading-relaxed text-content-soft">
              {proposition.corps}
            </pre>
          </div>

          {proposition.changements.length > 0 && (
            <>
              <p className="mb-2 mt-4 text-xs text-muted">Ce qui a changé</p>
              <ul className="flex flex-col gap-1.5">
                {proposition.changements.map((c) => (
                  <li
                    key={c}
                    className="flex items-start gap-2 text-xs leading-relaxed text-content-soft"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[7px] size-1 shrink-0 rounded-full bg-teal"
                    />
                    {c}
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                onAppliquer(proposition.sujet, proposition.corps);
                setProposition(null);
              }}
              className="flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-hover"
            >
              <Check size={14} aria-hidden="true" />
              Remplacer mon message
            </button>
            <button
              type="button"
              onClick={() => setProposition(null)}
              className="flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm text-muted transition hover:text-content"
            >
              <X size={14} aria-hidden="true" />
              Garder le mien
            </button>
          </div>

          <p className="mt-3 text-xs text-muted">
            Relisez avant de remplacer : ce message partira de votre adresse,
            en votre nom.
          </p>
        </div>
      )}
    </div>
  );
}
