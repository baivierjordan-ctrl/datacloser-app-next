"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Sparkles, Target } from "lucide-react";
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
  const [explication, setExplication] = useState("");
  const [resume, setResume] = useState("");
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    recupererSecteurs().then(setSecteurs).catch(() => {});
  }, []);

  return (
    <section className="relative overflow-hidden rounded-xl border border-teal/25 bg-surface p-5">
      {/* Un halo discret distingue le raccourci du formulaire qu'il remplit. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-20 size-56 rounded-full bg-vif/25 blur-3xl"
      />
      <h2 className="relative flex items-center gap-2 text-sm font-medium">
        <Sparkles size={14} className="text-teal" aria-hidden="true" />
        Démarrage rapide
      </h2>
      <p className="relative mb-4 mt-1 text-xs text-muted">
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
            const plan = await proposerPlanIcp();
            onPlan(plan);
            // Le moteur explique son raisonnement : le cacher priverait
            // l'utilisateur du moyen de juger la proposition.
            setExplication(plan.explication);
            // Ce qui a été rempli compte plus que le raisonnement : on
            // l'annonce d'abord, en chiffres.
            setResume(
              `${plan.mots_cles.length} métiers et ${plan.villes.length} zones proposés.`,
            );
          } catch (e) {
            setErreur((e as Error).message);
            setExplication("");
            setResume("");
          } finally {
            setEnCours(false);
          }
        }}
        className="relative flex w-full items-center gap-3 rounded-lg bg-teal px-4 py-3.5 text-left text-white transition hover:bg-teal-hover disabled:opacity-60"
      >
        {enCours ? (
          <Loader2 size={18} className="shrink-0 animate-spin" aria-hidden="true" />
        ) : (
          <Target size={18} className="shrink-0" aria-hidden="true" />
        )}
        <span>
          <span className="block text-[16px] font-semibold">
            {enCours ? "Analyse de votre profil…" : "Chasser mes clients idéaux"}
          </span>
          <span className="mt-0.5 block text-xs text-white/70">
            Métiers et zones déduits de votre profil d&apos;entreprise.
          </span>
        </span>
      </button>

      {erreur && (
        <p role="alert" className="relative mt-3 text-xs text-danger">
          {erreur}
        </p>
      )}

      {resume && (
        <div
          role="status"
          className="apparition relative mt-3 rounded-lg border border-ok/30 bg-ok/5 px-4 py-3"
        >
          <p className="flex items-center gap-2 text-sm text-content">
            <Check size={15} className="shrink-0 text-ok" aria-hidden="true" />
            {resume}
          </p>
          <p className="mt-1.5 pl-[23px] text-xs text-muted">
            Le formulaire ci-dessous est rempli. Relisez-le, ajustez, puis
            lancez la chasse en bas de page.
          </p>

          {explication && (
            <details className="mt-2.5 pl-[23px]">
              <summary className="cursor-pointer text-xs text-teal transition hover:underline">
                Pourquoi ces métiers et ces zones ?
              </summary>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {explication}
              </p>
            </details>
          )}
        </div>
      )}

      {secteurs.length > 0 && (
        <>
          <p className="relative mb-2.5 mt-5 text-xs text-muted">Ou partez d&apos;un secteur</p>
          <div className="relative flex flex-wrap gap-2">
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
