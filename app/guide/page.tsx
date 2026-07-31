"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowRight, BookOpen } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { PiedDePage } from "@/components/PiedDePage";
import { SECTIONS } from "@/lib/guide";
import { lireSession } from "@/lib/session";

/**
 * Mode d'emploi.
 *
 * Choix délibéré contre la visite guidée : celle-ci s'affiche une fois,
 * se ferme, et la question revient toujours plus tard. Un manuel
 * consultable sert les deux publics — celui qui découvre et le lit en
 * entier, celui qui revient chercher une réponse précise.
 *
 * Le sommaire suit le défilement et marque la section lue, pour qu'on
 * sache toujours où l'on se trouve dans un texte long.
 */
export default function PageGuide() {
  const router = useRouter();
  const [active, setActive] = useState(SECTIONS[0].cle);

  useEffect(() => {
    if (!lireSession()) router.replace("/connexion");
  }, [router]);

  useEffect(() => {
    const observateur = new IntersectionObserver(
      (entrees) => {
        const visible = entrees.find((e) => e.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      // La zone de détection couvre le haut de l'écran : une section
      // devient « courante » quand son titre approche du sommet.
      { rootMargin: "-80px 0px -70% 0px" },
    );

    SECTIONS.forEach((s) => {
      const noeud = document.getElementById(s.cle);
      if (noeud) observateur.observe(noeud);
    });
    return () => observateur.disconnect();
  }, []);

  return (
    <main className="min-h-screen px-6 pb-16 pt-6">
      <div className="mx-auto max-w-5xl">
        <Navigation />

        <header className="mb-8">
          <p className="mb-2 flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] text-teal">
            <BookOpen size={13} aria-hidden="true" /> Mode d&apos;emploi
          </p>
          <h1 className="text-[30px] font-semibold leading-[1.1] sm:text-[36px]">
            Comment utiliser DataCloser
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Quinze minutes de lecture pour tout comprendre. Vous pouvez aussi
            n&apos;ouvrir que la section qui vous manque.
          </p>
        </header>

        <div className="flex gap-10">
          <nav
            aria-label="Sommaire"
            className="sticky top-24 hidden h-fit w-56 shrink-0 lg:block"
          >
            <ul className="flex flex-col gap-0.5 border-l border-line">
              {SECTIONS.map((section) => (
                <li key={section.cle}>
                  <a
                    href={`#${section.cle}`}
                    aria-current={active === section.cle ? "true" : undefined}
                    className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm transition ${
                      active === section.cle
                        ? "border-teal text-content"
                        : "border-transparent text-muted hover:text-content"
                    }`}
                  >
                    {section.titre}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 flex-1">
            {SECTIONS.map((section) => (
              <section
                key={section.cle}
                id={section.cle}
                className="mb-10 scroll-mt-24"
              >
                <h2 className="text-[22px] font-semibold leading-tight">
                  {section.titre}
                </h2>
                <p className="mb-5 mt-1 text-sm text-muted">{section.resume}</p>

                <div className="flex flex-col gap-4">
                  {section.passages.map((passage, i) =>
                    passage.attention ? (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 rounded-xl border border-warn/30 bg-warn/5 p-4"
                      >
                        <AlertTriangle
                          size={15}
                          aria-hidden="true"
                          className="mt-px shrink-0 text-warn"
                        />
                        <p className="text-sm leading-relaxed text-content-soft">
                          {passage.attention}
                        </p>
                      </div>
                    ) : (
                      <div
                        key={i}
                        className="rounded-xl border border-line bg-surface p-5"
                      >
                        {passage.titre && (
                          <h3 className="mb-1.5 text-sm font-medium">
                            {passage.titre}
                          </h3>
                        )}
                        {passage.texte && (
                          <p className="text-sm leading-relaxed text-content-soft">
                            {passage.texte}
                          </p>
                        )}
                        {passage.points && (
                          <ul className="mt-2 flex flex-col gap-1.5">
                            {passage.points.map((point) => (
                              <li
                                key={point}
                                className="flex items-start gap-2 text-sm leading-relaxed text-content-soft"
                              >
                                <span
                                  aria-hidden="true"
                                  className="mt-[9px] size-1 shrink-0 rounded-full bg-teal"
                                />
                                {point}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </section>
            ))}

            <div className="rounded-xl border border-teal/30 bg-teal/5 p-5">
              <h2 className="text-sm font-medium">Une question qui n&apos;est pas ici ?</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-content-soft">
                L&apos;assistant connaît votre activité et vos chasses. Il
                répond à votre cas plutôt qu&apos;à la prospection en général.
              </p>
              <Link
                href="/assistant"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-hover"
              >
                Ouvrir l&apos;assistant
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        <PiedDePage />
      </div>
    </main>
  );
}
