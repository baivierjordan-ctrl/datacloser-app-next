"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Radar } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { PiedDePage } from "@/components/PiedDePage";
import { SessionExpiree, recupererAccueil } from "@/lib/api";
import { dateSeule } from "@/lib/dates";
import { lireSession } from "@/lib/session";
import type { Accueil } from "@/lib/types";

/** Le prénom se déduit de l'adresse : mieux que « Bonjour utilisateur ». */
function saluer(email: string): string {
  const debut = email.split("@")[0].split(/[._-]/)[0];
  if (!debut) return "Bonjour";
  return `Bonjour ${debut.charAt(0).toUpperCase()}${debut.slice(1)}`;
}

/** Un chiffre et ce qu'il compte. Le chiffre porte, le mot explique. */
function Chiffre({
  valeur,
  libelle,
  accent = false,
  rang = 0,
}: {
  valeur: number | string;
  libelle: string;
  accent?: boolean;
  rang?: number;
}) {
  return (
    <div
      className="apparition rounded-xl border border-line bg-surface p-5"
      style={{ animationDelay: `${rang * 45}ms` }}
    >
      <p
        className={`font-display text-[34px] font-semibold leading-none tabular-nums ${
          accent ? "text-teal" : "text-content"
        }`}
      >
        {valeur}
      </p>
      <p className="mt-2 text-xs text-muted">{libelle}</p>
    </div>
  );
}

export default function PageAccueil() {
  const router = useRouter();
  const [donnees, setDonnees] = useState<Accueil | null>(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    if (!lireSession()) {
      router.replace("/connexion");
      return;
    }
    recupererAccueil()
      .then(setDonnees)
      .catch((e: Error) => {
        if (e instanceof SessionExpiree) {
          router.replace("/connexion");
          return;
        }
        setErreur(e.message);
      });
  }, [router]);

  return (
    <main className="min-h-screen px-6 pb-16 pt-6">
      <div className="mx-auto max-w-5xl">
        <Navigation />

        <header className="mb-8">
          <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-teal">
            <Radar size={13} aria-hidden="true" /> Tableau de bord
          </p>
          <h1 className="text-[30px] font-semibold leading-[1.1] sm:text-[36px]">
            {donnees ? saluer(donnees.email) : "Bonjour"}
          </h1>
          {donnees && (
            <p className="mt-2 text-sm text-muted">
              {donnees.chasse_en_cours
                ? "Une chasse est en cours. Les résultats arriveront dans le Radar."
                : donnees.derniere_chasse
                  ? `Dernière chasse le ${dateSeule(donnees.derniere_chasse.created_at)}.`
                  : "Aucune chasse pour l'instant."}
            </p>
          )}
        </header>

        {erreur && (
          <p
            role="alert"
            className="mb-4 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger"
          >
            {erreur}
          </p>
        )}

        {donnees ? (
          <>
            {!donnees.demarrage_termine && (
              <section
                className="apparition mb-5 rounded-xl border border-line bg-surface p-5"
                aria-labelledby="premiers-pas"
              >
                <div className="mb-4 flex items-baseline justify-between gap-4">
                  <h2 id="premiers-pas" className="text-sm font-medium">
                    Premiers pas
                  </h2>
                  <span className="font-mono text-xs text-muted">
                    {donnees.etapes.filter((e) => e.faite).length} / {donnees.etapes.length}
                  </span>
                </div>

                <ol className="flex flex-col gap-1">
                  {donnees.etapes.map((etape) => (
                    <li key={etape.cle}>
                      <Link
                        href={etape.lien}
                        className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition ${
                          etape.faite ? "opacity-45" : "hover:bg-ink"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`mt-px flex size-[18px] shrink-0 items-center justify-center rounded-full border ${
                            etape.faite
                              ? "border-teal bg-teal text-ink"
                              : "border-line-hover"
                          }`}
                        >
                          {etape.faite && <Check size={11} strokeWidth={3} />}
                        </span>
                        <span className="min-w-0">
                          <span
                            className={`block text-sm ${
                              etape.faite ? "line-through" : "text-content"
                            }`}
                          >
                            {etape.titre}
                          </span>
                          {!etape.faite && (
                            <span className="mt-0.5 block text-xs text-muted">
                              {etape.detail}
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <section
              className="apparition mb-5 rounded-xl border border-teal/30 bg-teal/5 p-5"
              aria-labelledby="prochaine-action"
            >
              <h2 id="prochaine-action" className="text-sm font-medium text-teal">
                {donnees.action.titre}
              </h2>
              <p className="mt-1.5 max-w-xl text-sm text-content-soft">
                {donnees.action.detail}
              </p>
              <Link
                href={donnees.action.lien}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-ink transition hover:bg-teal-hover"
              >
                {donnees.action.bouton}
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </section>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Chiffre
                valeur={donnees.credits}
                libelle="crédits disponibles"
                accent
                rang={0}
              />
              <Chiffre
                valeur={donnees.entreprises_analysees}
                libelle="entreprises analysées"
                rang={1}
              />
              <Chiffre
                valeur={donnees.emails_envoyes}
                libelle={donnees.emails_envoyes > 1 ? "emails envoyés" : "email envoyé"}
                rang={2}
              />
              <Chiffre
                valeur={`${donnees.profil_completion} %`}
                libelle="profil complété"
                rang={3}
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Chiffre
                valeur={donnees.chasses}
                libelle={donnees.chasses > 1 ? "chasses lancées" : "chasse lancée"}
                rang={4}
              />
              <Chiffre
                valeur={donnees.campagnes_actives}
                libelle={`${donnees.campagnes_actives > 1 ? "campagnes actives" : "campagne active"} sur ${donnees.campagnes}`}
                rang={5}
              />
              <Chiffre
                valeur={donnees.emails_echoues}
                libelle={donnees.emails_echoues > 1 ? "envois en échec" : "envoi en échec"}
                rang={6}
              />
            </div>
          </>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-xl border border-line bg-surface"
              />
            ))}
          </div>
        )}

        <PiedDePage />
      </div>
    </main>
  );
}
