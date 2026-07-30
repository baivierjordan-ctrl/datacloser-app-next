"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Handshake, Mail } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { SessionExpiree, recupererPartenariat } from "@/lib/api";
import { lireSession } from "@/lib/session";
import type { Partenariat } from "@/lib/types";

export default function PagePartenariat() {
  const router = useRouter();
  const [donnees, setDonnees] = useState<Partenariat | null>(null);
  const [copie, setCopie] = useState(false);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    if (!lireSession()) {
      router.replace("/connexion");
      return;
    }
    recupererPartenariat()
      .then(setDonnees)
      .catch((e: Error) => {
        if (e instanceof SessionExpiree) {
          router.replace("/connexion");
          return;
        }
        setErreur(e.message);
      });
  }, [router]);

  async function copier(texte: string) {
    try {
      await navigator.clipboard.writeText(texte);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      setErreur("La copie automatique a échoué. Sélectionnez le lien à la main.");
    }
  }

  const mailto = donnees
    ? `mailto:${donnees.affiliation.contact}` +
      "?subject=" +
      encodeURIComponent("Programme d'affiliation DataCloser") +
      "&body=" +
      encodeURIComponent(
        "Bonjour,\n\nJe souhaite rejoindre le programme d'affiliation DataCloser.\n\nMerci.",
      )
    : "";

  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-4xl">
        <Navigation />

        <header className="mb-6">
          <p className="mb-1.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-teal">
            <Handshake size={13} aria-hidden="true" /> Partenariat
          </p>
          <h1 className="text-[28px] font-semibold leading-tight">
            Parrainage et affiliation
          </h1>
          <p className="mt-2 text-sm text-muted">
            Deux programmes distincts : l&apos;un rémunère en crédits, l&apos;autre
            en commissions.
          </p>
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
          <div className="grid gap-4 sm:grid-cols-2">
            <section className="rounded-xl border border-line bg-surface p-5">
              <h2 className="text-sm font-medium">Parrainage</h2>
              <p className="mt-1 text-xs text-muted">
                Pour les utilisateurs réguliers qui veulent prospecter sans
                payer.
              </p>

              <ul className="mt-4 flex flex-col gap-2 text-xs text-muted">
                <li className="flex items-start gap-2">
                  <Check size={13} className="mt-px shrink-0 text-teal" aria-hidden="true" />
                  {donnees.parrainage.gain_parrain}
                </li>
                <li className="flex items-start gap-2">
                  <Check size={13} className="mt-px shrink-0 text-teal" aria-hidden="true" />
                  {donnees.parrainage.gain_filleul}
                </li>
              </ul>

              <p className="mt-4 break-all rounded-lg border border-line bg-ink px-3 py-2 font-mono text-[11px] text-content">
                {donnees.lien_parrainage}
              </p>

              <button
                type="button"
                onClick={() => copier(donnees.lien_parrainage)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-ink transition hover:bg-teal-hover"
              >
                {copie ? (
                  <>
                    <Check size={14} aria-hidden="true" /> Lien copié
                  </>
                ) : (
                  <>
                    <Copy size={14} aria-hidden="true" /> Copier mon lien
                  </>
                )}
              </button>
            </section>

            <section className="rounded-xl border border-line bg-surface p-5">
              <h2 className="text-sm font-medium">Affiliation</h2>
              <p className="mt-1 text-xs text-muted">
                Pour les agences, formateurs et créateurs de contenu B2B.
              </p>

              <ul className="mt-4 flex flex-col gap-2 text-xs text-muted">
                <li className="flex items-start gap-2">
                  <Check size={13} className="mt-px shrink-0 text-teal" aria-hidden="true" />
                  {donnees.affiliation.commission}
                </li>
                <li className="flex items-start gap-2">
                  <Check size={13} className="mt-px shrink-0 text-teal" aria-hidden="true" />
                  {donnees.affiliation.paiement}
                </li>
              </ul>

              <p className="mt-4 rounded-lg border border-line bg-ink px-3 py-2 text-xs text-muted">
                Le programme ouvre par vagues. Écrivez-nous pour rejoindre la
                liste d&apos;attente.
              </p>

              <a
                href={mailto}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-line px-4 py-2 text-sm text-content transition hover:border-teal"
              >
                <Mail size={14} aria-hidden="true" /> Rejoindre la liste
              </a>
            </section>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2" aria-busy="true">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-xl border border-line bg-surface"
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
