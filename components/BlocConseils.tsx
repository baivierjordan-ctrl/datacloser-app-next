"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Check, Compass, Info } from "lucide-react";
import { recupererConseils } from "@/lib/api";
import type { Conseil } from "@/lib/types";

/**
 * Conseils d'accompagnement.
 *
 * Chaque recommandation cite un chiffre réel du compte. Rien n'est
 * rédigé à la volée par le moteur de langage : sur un écran dont le
 * seul intérêt est d'être exact, un chiffre inventé ruinerait la
 * confiance dans tous les autres.
 *
 * Trois niveaux, dans l'ordre où ils empêchent d'avancer : ce qui
 * bloque, ce qui coûte, ce qui améliore.
 */

const APPARENCE = {
  bloquant: {
    Icone: AlertTriangle,
    bordure: "border-danger/30",
    fond: "bg-danger/5",
    teinte: "text-danger",
    libelle: "Bloquant",
  },
  important: {
    Icone: AlertTriangle,
    bordure: "border-warn/30",
    fond: "bg-warn/5",
    teinte: "text-warn",
    libelle: "À corriger",
  },
  conseil: {
    Icone: Info,
    bordure: "border-line",
    fond: "bg-surface",
    teinte: "text-muted",
    libelle: "Conseil",
  },
} as const;

export function BlocConseils() {
  const [conseils, setConseils] = useState<Conseil[] | null>(null);
  const [toutVaBien, setToutVaBien] = useState(false);

  useEffect(() => {
    recupererConseils()
      .then((r) => {
        setConseils(r.conseils);
        setToutVaBien(r.tout_va_bien);
      })
      .catch(() => setConseils([]));
  }, []);

  if (!conseils) {
    return (
      <div
        className="mb-5 h-32 animate-pulse rounded-xl border border-line bg-surface"
        aria-busy="true"
      />
    );
  }

  if (conseils.length === 0 && !toutVaBien) return null;

  return (
    <section className="mb-5" aria-labelledby="conseils">
      <h2
        id="conseils"
        className="mb-3 flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] text-teal"
      >
        <Compass size={13} aria-hidden="true" /> Ce que je vous conseille
      </h2>

      {toutVaBien ? (
        <div className="rounded-xl border border-ok/30 bg-ok/5 px-5 py-4">
          <p className="flex items-center gap-2.5 text-sm">
            <Check size={16} className="shrink-0 text-ok" aria-hidden="true" />
            <span className="text-content">
              Votre configuration ne présente aucun défaut détectable.
            </span>
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            La suite se joue sur le volume et la régularité : de nouvelles
            chasses, des envois étalés plutôt que groupés.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {conseils.map((conseil, rang) => {
            const style = APPARENCE[conseil.gravite] ?? APPARENCE.conseil;
            const { Icone } = style;

            return (
              <article
                key={conseil.titre}
                style={{ animationDelay: `${rang * 50}ms` }}
                className={`apparition rounded-xl border p-5 ${style.bordure} ${style.fond}`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Icone
                    size={14}
                    aria-hidden="true"
                    className={`shrink-0 ${style.teinte}`}
                  />
                  <h3 className="text-sm font-medium">{conseil.titre}</h3>
                  <span
                    className={`font-mono text-[11px] uppercase tracking-[0.14em] ${style.teinte}`}
                  >
                    {style.libelle}
                  </span>
                </div>

                {/* Le constat porte le chiffre : c'est lui qui rend le
                    conseil crédible plutôt que générique. */}
                <p className="mt-2 text-sm text-content-soft">{conseil.constat}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  {conseil.action}
                </p>

                <Link
                  href={conseil.lien}
                  className="mt-3.5 inline-flex items-center gap-1.5 text-xs text-teal transition hover:underline"
                >
                  Y aller
                  <ArrowRight size={12} aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-3 text-xs leading-relaxed text-muted">
        Ces conseils portent sur votre configuration, mesurée sur vos données.
        DataCloser n&apos;enregistre ni les ouvertures ni les réponses : aucun
        conseil ne prétend juger l&apos;efficacité réelle de vos messages.
      </p>
    </section>
  );
}
