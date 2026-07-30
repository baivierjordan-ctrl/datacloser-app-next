"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Coins, LogOut } from "lucide-react";
import { effacerSession, lireSession } from "@/lib/session";

const ONGLETS = [
  { href: "/radar", libelle: "Radar" },
  { href: "/exports", libelle: "Exports" },
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
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
      <nav className="flex gap-1" aria-label="Sections">
        {ONGLETS.map((onglet) => {
          const actif = chemin === onglet.href;
          return (
            <Link
              key={onglet.href}
              href={onglet.href}
              aria-current={actif ? "page" : undefined}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                actif
                  ? "bg-surface text-content"
                  : "text-muted hover:text-content"
              }`}
            >
              {onglet.libelle}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-4 text-xs text-muted">
        {credits !== null && (
          <span className="flex items-center gap-1.5" title="Crédits restants">
            <Coins size={12} aria-hidden="true" />
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
