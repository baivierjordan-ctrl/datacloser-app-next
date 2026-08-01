"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, Check, Compass, Info, Wand2 } from "lucide-react";
import type { Conseil } from "@/lib/types";
import { useLangue } from "@/lib/i18n";

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
    cle: "conseils.bloquant",
  },
  important: {
    Icone: AlertTriangle,
    bordure: "border-warn/30",
    fond: "bg-warn/5",
    teinte: "text-warn",
    cle: "conseils.aCorriger",
  },
  conseil: {
    Icone: Info,
    bordure: "border-line",
    fond: "bg-surface",
    teinte: "text-muted",
    cle: "conseils.conseil",
  },
} as const;

/** Adresse déclenchant l'action, lue par l'écran de destination. */
function lienAction(conseil: Conseil): string {
  const f = conseil.faire;
  if (!f) return conseil.lien;

  switch (f.type) {
    case "modele_gagnant":
      return `/outreach?vue=creation&modele=${encodeURIComponent(f.campagne_id ?? "")}`;
    case "variantes_objet":
      return "/outreach?vue=creation&action=objets";
    case "reecrire":
      return "/outreach?vue=creation&action=reecrire";
    case "chasse_icp":
      return "/radar?action=icp";
    default:
      return conseil.lien;
  }
}

/**
 * Les conseils arrivent avec l'accueil plutôt que par un appel séparé :
 * celui-ci recalculait tout et rien ne garantissait que les deux
 * affichent les mêmes chiffres.
 */
export function BlocConseils({
  conseils,
  toutVaBien,
}: {
  conseils: Conseil[];
  toutVaBien: boolean;
}) {
  const { t } = useLangue();

  if (conseils.length === 0 && !toutVaBien) return null;

  return (
    <section className="mb-5" aria-labelledby="conseils">
      <h2
        id="conseils"
        className="mb-3 flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] text-teal"
      >
        <Compass size={13} aria-hidden="true" /> {t("conseils.titre")}
      </h2>

      {toutVaBien ? (
        <div className="rounded-xl border border-ok/30 bg-ok/5 px-5 py-4">
          <p className="flex items-center gap-2.5 text-sm">
            <Check size={16} className="shrink-0 text-ok" aria-hidden="true" />
            <span className="text-content">
              {t("conseils.rienADire")}
            </span>
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            {t("conseils.suite")}
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
                    {t(style.cle)}
                  </span>
                </div>

                {/* Le constat porte le chiffre : c'est lui qui rend le
                    conseil crédible plutôt que générique. */}
                <p className="mt-2 text-sm text-content-soft">{conseil.constat}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  {conseil.action}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {conseil.faire ? (
                    <>
                      {/* Un conseil qui diagnostique sans proposer de
                          remède laisse l'utilisateur devant une page
                          vide. L'action porte le lien qui la déclenche. */}
                      <Link
                        href={lienAction(conseil)}
                        className="inline-flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-hover"
                      >
                        <Wand2 size={14} aria-hidden="true" />
                        {conseil.faire.libelle}
                      </Link>
                      <Link
                        href={conseil.lien}
                        className="text-xs text-muted transition hover:text-content"
                      >
                        {t("conseils.faireMoiMeme")}
                      </Link>
                    </>
                  ) : (
                    <Link
                      href={conseil.lien}
                      className="inline-flex items-center gap-1.5 text-xs text-teal transition hover:underline"
                    >
                      {t("conseils.yAller")}
                      <ArrowRight size={12} aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-3 text-xs leading-relaxed text-muted">
        {t("conseils.reserve")}
      </p>
    </section>
  );
}
