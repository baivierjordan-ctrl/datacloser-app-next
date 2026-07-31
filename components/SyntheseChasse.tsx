"use client";

import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { Aide } from "@/components/Aide";
import { BarreScore } from "@/components/BarreScore";
import { estContactable, LIBELLES_STATUT, type Lead } from "@/lib/types";

/**
 * Synthèse d'une chasse.
 *
 * Le détail des leads vit dans l'export : le parcourir dans l'interface
 * n'apporte rien qu'un tableur ne fasse mieux. L'écran répond à deux
 * questions — combien, et est-ce bon — puis propose les deux actions
 * qui en découlent.
 *
 * L'échantillon montre les trois meilleures lignes contactables : assez
 * pour juger le ciblage et le ton des accroches en deux secondes, sans
 * reconstruire une liste.
 */

const COULEUR_QUALIF: Record<string, string> = {
  verifie: "bg-ok",
  catchall: "bg-warn",
  introuvable: "bg-danger",
};

export function SyntheseChasse({
  leads,
  fichier,
  onExporter,
}: {
  leads: Lead[];
  fichier: string | null;
  onExporter: () => void;
}) {
  const contactables = leads.filter(estContactable);

  const repartition = (["verifie", "catchall", "introuvable"] as const).map(
    (statut) => ({
      statut,
      libelle: LIBELLES_STATUT[statut],
      nombre: leads.filter((l) => l.statut === statut).length,
    }),
  );

  const echantillon = [...contactables]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-warn/30 bg-warn/5 px-5 py-8 text-center">
        <p className="text-sm text-content">Ce fichier ne contient aucune ligne.</p>
        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted">
          Cela arrive quand une chasse est interrompue avant d&apos;écrire ses
          résultats — le fichier est créé au départ, les lignes arrivent à la
          fin. Relancez la chasse avec les mêmes réglages depuis l&apos;onglet
          « Nouvelle chasse » : elle régénérera le fichier.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { valeur: leads.length, libelle: "entreprises trouvées" },
          { valeur: contactables.length, libelle: "contactables", accent: true },
          { valeur: contactables.length, libelle: "crédits à l'envoi" },
        ].map((carte, rang) => (
          <div
            key={carte.libelle}
            className="apparition rounded-xl border border-line bg-surface p-5"
            style={{ animationDelay: `${rang * 45}ms` }}
          >
            <p
              className={`font-display text-[34px] font-semibold leading-none tabular-nums ${
                carte.accent ? "text-teal" : "text-content"
              }`}
            >
              {carte.valeur}
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
              {carte.libelle}
              {carte.libelle === "crédits à l'envoi" && (
                <Aide titre="Comment les crédits sont comptés">
                  Un crédit par email réellement envoyé, uniquement aux
                  contacts vérifiés ou catch-all. Les introuvables ne coûtent
                  jamais rien. Les crédits n&apos;expirent pas.
                </Aide>
              )}
            </p>
          </div>
        ))}
      </section>

      <section className="apparition rounded-xl border border-line bg-surface p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-medium">
          Qualité des emails
          <Aide titre="Les trois niveaux de qualification">
            Vérifié : le serveur du destinataire a confirmé que l&apos;adresse
            existe — le meilleur niveau. Catch-all : le serveur accepte tout,
            impossible de confirmer sans envoyer — utilisable avec prudence.
            Introuvable : aucune adresse fiable — exclu des campagnes, jamais
            facturé à l&apos;envoi.
          </Aide>
        </h2>

        {/* Une seule barre empilée : les proportions se comparent d'un
            regard, là où trois chiffres demandent un calcul mental. */}
        <div
          className="flex h-2.5 overflow-hidden rounded-full bg-ink"
          role="img"
          aria-label={repartition
            .map((r) => `${r.nombre} ${r.libelle}`)
            .join(", ")}
        >
          {repartition.map(
            (part) =>
              part.nombre > 0 && (
                <div
                  key={part.statut}
                  className={COULEUR_QUALIF[part.statut]}
                  style={{ width: `${(part.nombre / leads.length) * 100}%` }}
                />
              ),
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
          {repartition.map((part) => (
            <span
              key={part.statut}
              className="flex items-center gap-1.5 text-xs text-muted"
            >
              <span
                aria-hidden="true"
                className={`size-2 rounded-full ${COULEUR_QUALIF[part.statut]}`}
              />
              <span className="font-mono tabular-nums text-content">
                {part.nombre}
              </span>
              {part.libelle}
            </span>
          ))}
        </div>
      </section>

      {echantillon.length > 0 && (
        <section className="apparition rounded-xl border border-line bg-surface p-5">
          <h2 className="text-sm font-medium">Aperçu du ciblage</h2>
          <p className="mb-4 mt-1 text-xs text-muted">
            Les trois meilleures lignes, pour juger d&apos;un regard. Le
            fichier complet contient tout le reste.
          </p>

          <div className="flex flex-col gap-2.5">
            {echantillon.map((lead, rang) => (
              <article
                key={lead.id}
                className="apparition rounded-lg border border-line bg-ink px-4 py-3.5"
                style={{ animationDelay: `${rang * 60}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-baseline gap-x-2.5">
                      <span className="text-[15px] font-medium">
                        {lead.societe}
                      </span>
                      {lead.contact && (
                        <span className="text-xs text-muted">
                          {lead.contact}
                          {lead.role ? ` · ${lead.role}` : ""}
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-[11px] text-muted">
                      {lead.email}
                    </p>
                  </div>
                  <BarreScore valeur={lead.score} />
                </div>

                {lead.accroche && (
                  <p className="mt-3 border-t border-line pt-3 text-xs italic leading-relaxed text-content-soft">
                    « {lead.accroche} »
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="sticky bottom-6 flex flex-wrap items-center justify-end gap-3 rounded-xl border border-line bg-surface/95 px-5 py-3.5 backdrop-blur">
        <button
          type="button"
          onClick={onExporter}
          className="flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm text-content transition hover:border-line-hover"
        >
          <Download size={14} aria-hidden="true" />
          Exporter le fichier
        </button>
        <Link
          href={`/outreach?source=${encodeURIComponent(fichier ?? "")}`}
          className="flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-ink transition hover:bg-teal-hover"
        >
          Lancer une campagne
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
