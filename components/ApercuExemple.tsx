"use client";

import { BarreScore } from "@/components/BarreScore";
import { useLangue } from "@/lib/i18n";

/**
 * Ce qu'une chasse produit, montré avant d'avoir dépensé un crédit.
 *
 * S'affiche à la place de l'historique tant qu'aucune chasse n'a été
 * lancée : c'est le moment exact où l'on hésite à engager des crédits
 * sans savoir ce qu'on obtiendra. Ces lignes sont fictives et le
 * disent — elles illustrent la forme d'un résultat, rien de plus.
 */

const EXEMPLES = [
  { societe: "exemple.societe1", contact: "exemple.contact1", score: 9, accroche: "exemple.accroche1" },
  { societe: "exemple.societe2", contact: "exemple.contact2", score: 8, accroche: "exemple.accroche2" },
] as const;

export function ApercuExemple() {
  const { t } = useLangue();

  return (
    <div>
      <p className="mb-3 rounded-lg border border-line bg-surface px-4 py-3 text-xs leading-relaxed text-muted">
        <span className="text-content">{t("exemple.aucuneChasse")}</span>{" "}
        {t("exemple.forme")}
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
                <p className="text-[16px] font-medium">{t(exemple.societe)}</p>
                <p className="mt-0.5 text-xs text-muted">{t(exemple.contact)}</p>
              </div>
              <BarreScore valeur={exemple.score} />
            </div>
            <p className="mt-3 border-t border-line pt-3 text-xs italic leading-relaxed text-muted">
              « {t(exemple.accroche)} »
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
