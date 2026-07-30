"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Coins, LogOut } from "lucide-react";
import { Marque } from "@/components/Marque";
import { effacerSession, lireSession } from "@/lib/session";

const ONGLETS = [
  { href: "/accueil", libelle: "Accueil" },
  { href: "/radar", libelle: "Radar" },
  { href: "/outreach", libelle: "Outreach" },
  { href: "/exports", libelle: "Exports" },
  { href: "/assistant", libelle: "Assistant" },
  { href: "/entreprise", libelle: "Mon entreprise" },
  { href: "/boutique", libelle: "Boutique" },
  { href: "/partenariat", libelle: "Partenariat" },
];

export function Navigation() {
  const router = useRouter();
  const chemin = usePathname();
  const [compte, setCompte] = useState("");
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    const session = lireSession();
    if (session) {
      setCompte(session.email);
      setCredits(session.credits);
    }
  }, []);

  function deconnecter() {
    effacerSession();
    router.replace("/connexion");
  }

  return (
    <header className="sticky top-0 z-20 -mx-6 mb-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line bg-ink/85 px-6 py-3 backdrop-blur-md">
      <div className="flex min-w-0 flex-1 items-center gap-5">
        <Link href="/accueil" className="shrink-0" aria-label="DataCloser, tableau de bord">
          <Marque />
        </Link>

        <span aria-hidden="true" className="h-5 w-px shrink-0 bg-line" />

        <nav className="-mb-3 flex gap-5 overflow-x-auto" aria-label="Sections">
        {ONGLETS.map((onglet) => {
          const actif = chemin === onglet.href;
          return (
            <Link
              key={onglet.href}
              href={onglet.href}
              aria-current={actif ? "page" : undefined}
              className={`relative whitespace-nowrap pb-3 text-sm transition-colors ${
                actif ? "text-content" : "text-muted hover:text-content"
              }`}
            >
              {onglet.libelle}
              {actif && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-px h-px bg-teal"
                />
              )}
            </Link>
          );
        })}
        </nav>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted">
        {credits !== null && (
          <span
            className="flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1"
            title="Crédits restants"
          >
            <Coins size={12} className="text-teal" aria-hidden="true" />
            <span className="font-mono tabular-nums text-content">{credits}</span>
          </span>
        )}
        <button
          type="button"
          onClick={deconnecter}
          className="flex items-center gap-1.5 transition hover:text-content"
        >
          {compte}
          <LogOut size={12} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
