"use client";

import { BarreScore } from "@/components/BarreScore";

/**
 * Ce qu'une chasse produit, montré avant d'avoir dépensé un crédit.
 *
 * S'affiche à la place de l'historique tant qu'aucune chasse n'a été
 * lancée : c'est le moment exact où l'on hésite à engager des crédits
 * sans savoir ce qu'on obtiendra. Ces lignes sont fictives et le
 * disent — elles illustrent la forme d'un résultat, rien de plus.
 */

const EXEMPLES = [
  {
    societe: "Chauffage & Sanitaire (exemple)",
    contact: "Prénom Nom · Gérant",
    score: 9,
    accroche:
      "Votre page « primes énergie » cite encore le barème de l'an dernier — un signal simple à ouvrir en premier contact.",
  },
  {
    societe: "Toiture régionale (exemple)",
    contact: "Prénom Nom · Responsable devis",
    score: 8,
    accroche:
      "Trois avis récents mentionnent le délai de réponse aux demandes de devis.",
  },
];

export function ApercuExemple() {
  return (
    <div>
      <p className="mb-3 rounded-lg border border-line bg-surface px-4 py-3 text-xs leading-relaxed text-muted">
        <span className="text-content">Aucune chasse pour l&apos;instant.</span>{" "}
        Voici la forme d&apos;un résultat : entreprise, décideur, email vérifié,
        note de pertinence et accroche rédigée depuis leur site. Ces deux lignes
        sont fictives.
      </p>

      <div className="flex flex-col gap-2" aria-hidden="true">
        {EXEMPLES.map((exemple, rang) => (
          <article
            key={exemple.societe}
            className="apparition rounded-xl border border-dashed border-line bg-surface px-5 py-4 opacity-55"
            style={{ animationDelay: `${rang * 70}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-medium">{exemple.societe}</p>
                <p className="mt-0.5 text-xs text-muted">{exemple.contact}</p>
              </div>
              <BarreScore valeur={exemple.score} />
            </div>
            <p className="mt-3 border-t border-line pt-3 text-xs italic leading-relaxed text-muted">
              « {exemple.accroche} »
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
