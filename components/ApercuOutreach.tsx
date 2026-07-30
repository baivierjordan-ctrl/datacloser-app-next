"use client";

import { useState } from "react";
import { AlertTriangle, ChevronRight, Eye, Loader2, Shuffle } from "lucide-react";
import { genererApercu } from "@/lib/api";
import type { ApercuEmail } from "@/lib/types";

/**
 * Aperçu de l'email tel qu'il partira, construit sur un destinataire réel
 * du scan. Rien n'est envoyé : c'est une simulation.
 *
 * Le moteur peut écarter un lead — accroche incohérente, données
 * manquantes. Dans ce cas la raison compte plus que l'email, et on
 * l'affiche à la place.
 */
export function ApercuOutreach({
  fichier,
  sujet,
  corps,
}: {
  fichier: string;
  sujet: string;
  corps: string;
}) {
  const [apercu, setApercu] = useState<ApercuEmail | null>(null);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");

  const pret = fichier !== "" && sujet.trim() !== "" && corps.trim() !== "";

  async function generer(index?: number) {
    setErreur("");
    setEnCours(true);
    try {
      setApercu(await genererApercu({ fichier, sujet, corps, index }));
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setEnCours(false);
    }
  }

  return (
    <section className="rounded-xl border border-line bg-surface p-5">
      <h2 className="mb-1 flex items-center gap-2 text-sm font-medium">
        <Eye size={14} className="text-teal" aria-hidden="true" />
        Aperçu avant envoi
      </h2>
      <p className="mb-4 text-xs text-muted">
        L&apos;email est construit sur un destinataire réel de ce scan, avec
        votre signature. Rien n&apos;est envoyé.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => generer()}
          disabled={!pret || enCours}
          className="flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm text-muted transition hover:border-line-hover hover:text-content disabled:cursor-not-allowed disabled:opacity-40"
        >
          {enCours ? (
            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
          ) : (
            <Shuffle size={14} aria-hidden="true" />
          )}
          {enCours ? "Construction…" : "Aperçu au hasard"}
        </button>

        {apercu && (
          <button
            type="button"
            onClick={() => generer(apercu.index + 1)}
            disabled={enCours}
            className="flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm text-muted transition hover:border-line-hover hover:text-content disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={14} aria-hidden="true" /> Destinataire suivant
          </button>
        )}
      </div>

      {!pret && (
        <p className="mt-3 text-xs text-muted">
          Choisissez un scan et rédigez le message pour activer l&apos;aperçu.
        </p>
      )}

      {erreur && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger"
        >
          {erreur}
        </p>
      )}

      {apercu && (
        <div className="mt-4 rounded-lg border border-line bg-ink p-4">
          <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line pb-3">
            <span className="text-sm font-medium">{apercu.entreprise}</span>
            {apercu.decideur && (
              <span className="text-xs text-muted">{apercu.decideur}</span>
            )}
            <span className="font-mono text-[11px] text-muted">
              {apercu.destinataire}
            </span>
            <span className="ml-auto font-mono text-[11px] text-muted">
              {apercu.index + 1} / {apercu.total}
            </span>
          </div>

          {apercu.valide ? (
            <>
              <p className="mb-3 text-sm">
                <span className="text-muted">Objet : </span>
                {apercu.sujet}
              </p>
              <pre className="whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed text-content-soft">
                {apercu.corps}
              </pre>
              {apercu.langue && (
                <p className="mt-3 border-t border-line pt-3 text-[11px] text-muted">
                  Rédigé en {apercu.langue}
                  {apercu.qualification && ` · ${apercu.qualification}`}
                </p>
              )}
            </>
          ) : (
            <div className="flex items-start gap-2 text-xs text-warn">
              <AlertTriangle size={14} className="mt-px shrink-0" aria-hidden="true" />
              <span>
                Ce destinataire sera écarté de l&apos;envoi
                {apercu.raison ? ` : ${apercu.raison}` : "."}
              </span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
