"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Sparkles, Type, X } from "lucide-react";
import { ameliorerMessage, proposerObjets } from "@/lib/api";
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
  onChangerSujet,
  actionAuChargement,
  remarques,
}: {
  sujet: string;
  corps: string;
  onAppliquer: (sujet: string, corps: string) => void;
  onChangerSujet: (sujet: string) => void;
  /** Action déclenchée à l'arrivée, quand un conseil l'a demandée. */
  actionAuChargement?: "objets" | "reecrire";
  /** Remarques du dernier audit, pour ne pas refaire le travail en aveugle. */
  remarques?: string[];
}) {
  const [proposition, setProposition] = useState<PropositionMessage | null>(null);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");
  const [objets, setObjets] = useState<string[]>([]);
  const [objetsEnCours, setObjetsEnCours] = useState(false);

  const pret = sujet.trim() !== "" && corps.trim() !== "";

  // Un conseil peut demander l'action directement : arriver sur la page
  // sans que rien ne se passe reviendrait à promettre puis abandonner.
  const [declenchee, setDeclenchee] = useState(false);

  const zone = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!actionAuChargement || declenchee || !pret) return;
    setDeclenchee(true);
    // La proposition apparaît en bas du formulaire : sans cela,
    // l'utilisateur reste en haut de page et croit qu'il ne se passe
    // rien.
    zone.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (actionAuChargement === "objets") {
      demanderObjets();
    } else {
      demander();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionAuChargement, pret, declenchee]);

  async function demanderObjets() {
    setErreur("");
    setObjetsEnCours(true);
    try {
      setObjets(await proposerObjets(sujet, corps));
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setObjetsEnCours(false);
    }
  }

  async function demander() {
    setErreur("");
    setEnCours(true);
    try {
      setProposition(await ameliorerMessage(sujet, corps, remarques ?? []));
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setEnCours(false);
    }
  }

  const attente = enCours || objetsEnCours;

  return (
    <div
      ref={zone}
      className={`mt-4 border-t pt-4 ${
        actionAuChargement ? "border-teal/40" : "border-line"
      }`}
    >
      {actionAuChargement && attente && (
        <p className="mb-3 flex items-center gap-2 text-xs text-teal">
          <Loader2 size={13} className="animate-spin" aria-hidden="true" />
          Préparation de la proposition demandée depuis vos conseils…
        </p>
      )}

      <div className="flex flex-wrap gap-4">
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

      <button
        type="button"
        onClick={demanderObjets}
        disabled={sujet.trim() === "" || objetsEnCours}
        className="flex items-center gap-2 text-xs text-muted transition hover:text-teal disabled:opacity-50"
      >
        {objetsEnCours ? (
          <Loader2 size={13} className="animate-spin" aria-hidden="true" />
        ) : (
          <Type size={13} aria-hidden="true" />
        )}
        {objetsEnCours ? "Recherche…" : "Proposer d'autres objets"}
      </button>
      </div>

      {objets.length > 0 && (
        <div className="apparition mt-4 rounded-xl border border-line bg-surface p-4">
          <p className="mb-1 text-sm font-medium">Autres objets possibles</p>
          <p className="mb-3 text-xs text-muted">
            Trois angles différents. Changez-en un sur deux entre vos
            campagnes : c&apos;est la seule façon de savoir ce qui fait ouvrir.
          </p>
          <div className="flex flex-col gap-2">
            {objets.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => {
                  onChangerSujet(o);
                  setObjets([]);
                }}
                className="rounded-lg border border-line px-3 py-2.5 text-left text-sm transition hover:border-teal hover:text-teal"
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      )}

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
        <div className="apparition mt-4 rounded-xl border border-teal/30 bg-teal/5 p-5">
          <p className="text-sm font-medium">Trois angles possibles</p>
          <p className="mt-1 text-xs text-muted">
            {proposition.diagnostic_utilise
              ? "Écrits en tenant compte des résultats mesurés sur vos envois. "
              : ""}
            Comparez-les : c&apos;est le choix qui vous apprendra ce qui parle
            à vos prospects.
          </p>

          <div className="mt-4 flex flex-col gap-3">
            {proposition.versions.map((version) => {
              const conseille =
                version.angle.toLowerCase() ===
                proposition.recommande.toLowerCase();
              const alertes = [
                version.mesures.offre.length > 0 && "contient une offre",
                version.mesures.corps_long && "trop long",
                version.mesures.objet_tronque_mobile && "objet trop long",
              ].filter(Boolean);

              return (
                <article
                  key={version.angle}
                  className={`rounded-lg border p-4 ${
                    conseille ? "border-teal/50 bg-surface" : "border-line bg-surface"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-medium">{version.angle}</h4>
                    {conseille && (
                      <span className="rounded-full bg-teal/15 px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-teal">
                        conseillé
                      </span>
                    )}
                    <span className="ml-auto font-mono text-[11px] text-muted">
                      {version.mesures.mots_corps} mots
                    </span>
                  </div>

                  {version.pourquoi && (
                    <p className="mt-1.5 text-xs italic text-muted">
                      {version.pourquoi}
                    </p>
                  )}

                  <p className="mt-3 text-sm">
                    <span className="text-muted">Objet : </span>
                    {version.sujet}
                  </p>
                  <pre className="mt-2 max-h-52 overflow-y-auto whitespace-pre-wrap break-words border-t border-line pt-3 font-mono text-[13px] leading-relaxed text-content-soft">
                    {version.corps}
                  </pre>

                  {/* Une proposition peut violer un critère malgré la
                      consigne : le signaler vaut mieux que la retirer,
                      l'utilisateur reste juge. */}
                  {alertes.length > 0 && (
                    <p className="mt-2 text-xs text-warn">
                      À vérifier : {alertes.join(", ")}.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onAppliquer(version.sujet, version.corps);
                      setProposition(null);
                    }}
                    className="mt-3 flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-hover"
                  >
                    <Check size={14} aria-hidden="true" />
                    Utiliser cette version
                  </button>
                </article>
              );
            })}
          </div>

          {proposition.changements.length > 0 && (
            <>
              <p className="mb-2 mt-4 text-xs text-muted">
                Ce qui change par rapport à votre message
              </p>
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

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setProposition(null)}
              className="flex items-center gap-2 text-xs text-muted transition hover:text-content"
            >
              <X size={13} aria-hidden="true" />
              Garder mon message
            </button>
            <p className="text-xs text-muted">
              Relisez avant de remplacer : ce message partira de votre adresse.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
