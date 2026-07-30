"use client";

import { ArrowRight, Info } from "lucide-react";
import { BarreScore } from "@/components/BarreScore";

/**
 * Ce que donne une chasse, montré avant d'avoir dépensé un crédit.
 *
 * Un premier écran vide est le meilleur moyen de perdre quelqu'un : il
 * ne dit rien de ce que le produit sait faire. Ces trois lignes sont
 * fictives et le disent — elles illustrent la forme d'un résultat, pas
 * un contenu qu'on pourrait exploiter. Rien n'est sélectionnable, rien
 * n'est exportable : la seule action possible est de lancer une vraie
 * chasse.
 */

const EXEMPLES = [
  {
    societe: "Chauffage & Sanitaire (exemple)",
    contact: "Prénom Nom",
    role: "Gérant",
    ville: "Charleroi",
    score: 9,
    accroche:
      "Votre page « primes énergie » cite encore le barème de l'an dernier — un signal simple à ouvrir en premier contact.",
  },
  {
    societe: "Toiture régionale (exemple)",
    contact: "Prénom Nom",
    role: "Responsable devis",
    ville: "Namur",
    score: 8,
    accroche:
      "Trois avis récents mentionnent le délai de réponse aux demandes de devis.",
  },
  {
    societe: "Menuiserie artisanale (exemple)",
    contact: "Prénom Nom",
    role: "Fondateur",
    ville: "Mons",
    score: 7,
    accroche:
      "Aucune page ne cible les communes limitrophes, alors que la zone d'intervention les couvre.",
  },
];

export function ApercuExemple({ onCommencer }: { onCommencer: () => void }) {
  return (
    <div>
      <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-line bg-surface px-4 py-3">
        <Info size={15} className="mt-px shrink-0 text-teal" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-muted">
          <span className="text-content">Aucune chasse pour l&apos;instant.</span>{" "}
          Voici la forme d&apos;un résultat : entreprise, décideur, email
          vérifié, note de pertinence et accroche rédigée à partir de son site.
          Ces trois lignes sont fictives.
        </p>
      </div>

      <div className="flex flex-col gap-2" aria-hidden="true">
        {EXEMPLES.map((exemple, rang) => (
          <article
            key={exemple.societe}
            className="apparition rounded-xl border border-line bg-surface px-5 py-4 opacity-60"
            style={{ animationDelay: `${rang * 60}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-baseline gap-x-2.5">
                  <span className="text-[15px] font-medium">{exemple.societe}</span>
                  <span className="text-xs text-muted">
                    {exemple.contact} · {exemple.role}
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted">{exemple.ville}</p>
              </div>
              <BarreScore valeur={exemple.score} />
            </div>
            <p className="mt-3 border-t border-line pt-3 text-xs italic leading-relaxed text-muted">
              {exemple.accroche}
            </p>
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={onCommencer}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-teal px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-teal-hover"
      >
        Lancer ma première chasse
        <ArrowRight size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
