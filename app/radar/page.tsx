"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Search } from "lucide-react";
import { LancementScan } from "@/components/LancementScan";
import { Navigation } from "@/components/Navigation";
import { PiedDePage } from "@/components/PiedDePage";
import { lireSession } from "@/lib/session";

/**
 * Radar : on y chasse, rien d'autre.
 *
 * Les résultats vivent dans Exports — un onglet, un verbe. Quand une
 * chasse se termine, un bandeau annonce le fichier et renvoie là où on
 * le consulte, plutôt que d'installer ici une seconde lecture des
 * mêmes données.
 */
function ContenuRadar() {
  const router = useRouter();
  const parametres = useSearchParams();
  const icpDemande = parametres.get("action") === "icp";
  const [termine, setTermine] = useState(false);

  useEffect(() => {
    if (!lireSession()) router.replace("/connexion");
  }, [router]);

  return (
    <main className="min-h-screen px-6 pb-16 pt-6">
      <div className="mx-auto max-w-5xl">
        <Navigation />

        <header className="mb-8">
          <p className="mb-2 flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] text-teal">
            <Search size={13} aria-hidden="true" /> Radar
          </p>
          <h1 className="text-[30px] font-semibold leading-[1.1] sm:text-[36px]">
            Lancer une chasse
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Indiquez un métier et une zone. Le moteur identifie les
            entreprises, cherche le décideur, vérifie son email et rédige une
            accroche à partir de leur site. Le résultat devient un fichier,
            consultable dans Exports.
          </p>
        </header>

        {termine && (
          <div className="apparition mb-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-ok/30 bg-ok/5 px-5 py-4">
            <p className="flex items-center gap-2.5 text-sm">
              <Check size={16} className="shrink-0 text-ok" aria-hidden="true" />
              <span>
                <span className="text-content">Chasse terminée.</span>{" "}
                <span className="text-muted">
                  Votre fichier vous attend dans Exports.
                </span>
              </span>
            </p>
            <Link
              href="/exports"
              className="flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-hover"
            >
              Voir les résultats
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        )}

        <LancementScan
          declencherIcp={icpDemande}
          onTermine={() => setTermine(true)}
        />

        <PiedDePage />
      </div>
    </main>
  );
}

export default function PageRadar() {
  return (
    <Suspense fallback={null}>
      <ContenuRadar />
    </Suspense>
  );
}
