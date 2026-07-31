"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles, Target } from "lucide-react";
import { proposerPlanIcp, recupererSecteurs } from "@/lib/api";
import type { PlanIcp, SecteurRapide } from "@/lib/types";

/**
 * Deux façons de remplir le formulaire sans réfléchir aux mots-clés :
 * partir de son profil, ou partir d'un secteur tout prêt.
 *
 * Aucune des deux ne lance la chasse. Une chasse consomme des crédits ;
 * la configuration revient au formulaire, l'utilisateur la relit et
 * décide. C'est la différence entre assister et déposséder.
 */
export function DemarrageRapide({
  onPlan,
  onSecteur,
}: {
  onPlan: (plan: PlanIcp) => void;
  onSecteur: (secteur: SecteurRapide) => void;
}) {
  const [secteurs, setSecteurs] = useState<SecteurRapide[]>([]);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    recupererSecteurs().then(setSecteurs).catch(() => {});
  }, []);

  return (
    <section className="rounded-xl border border-line bg-surface p-5">
      <h2 className="flex items-center gap-2 text-sm font-medium">
        <Sparkles size={14} className="text-teal" aria-hidden="true" />
        Démarrage rapide
      </h2>
      <p className="mb-4 mt-1 text-xs text-muted">
        Remplit le formulaire ci-dessous. Rien ne part tant que vous
        n&apos;avez pas lancé la chasse.
      </p>

      <button
        type="button"
        disabled={enCours}
        onClick={async () => {
          setErreur("");
          setEnCours(true);
          try {
            onPlan(await proposerPlanIcp());
          } catch (e) {
            setErreur((e as Error).message);
          } finally {
            setEnCours(false);
          }
        }}
        className="flex w-full items-center gap-2.5 rounded-lg border border-teal/30 bg-teal/5 px-4 py-3 text-left transition hover:border-teal/50 disabled:opacity-50"
      >
        {enCours ? (
          <Loader2 size={15} className="shrink-0 animate-spin text-teal" aria-hidden="true" />
        ) : (
          <Target size={15} className="shrink-0 text-teal" aria-hidden="true" />
        )}
        <span>
          <span className="block text-sm font-medium">
            {enCours ? "Analyse de votre profil…" : "Chasser mes clients idéaux"}
          </span>
          <span className="mt-0.5 block text-xs text-muted">
            Métiers et zones déduits de votre profil d&apos;entreprise.
          </span>
        </span>
      </button>

      {erreur && (
        <p role="alert" className="mt-3 text-xs text-danger">
          {erreur}
        </p>
      )}

      {secteurs.length > 0 && (
        <>
          <p className="mb-2.5 mt-5 text-xs text-muted">Ou partez d&apos;un secteur</p>
          <div className="flex flex-wrap gap-2">
            {secteurs.map((secteur) => (
              <button
                key={secteur.cle}
                type="button"
                onClick={() => onSecteur(secteur)}
                title={secteur.mots.join(", ")}
                className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-teal hover:text-teal"
              >
                {secteur.libelle}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
