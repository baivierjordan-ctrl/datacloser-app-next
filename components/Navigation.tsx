"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Building2,
  ChevronDown,
  Coins,
  Handshake,
  LogOut,
  ShoppingBag,
} from "lucide-react";
import { Marque } from "@/components/Marque";
import { recupererCredits } from "@/lib/api";
import { ecrireSession, effacerSession, lireSession } from "@/lib/session";

/**
 * Les cinq sections du travail quotidien restent dans la barre. Les
 * trois autres — profil, achats, parrainage — se visitent rarement et
 * se consultent depuis le menu du compte : huit onglets ne tiennent
 * pas dans la largeur et se lisent mal d'un regard.
 */
const ONGLETS = [
  { href: "/accueil", libelle: "Accueil" },
  { href: "/radar", libelle: "Radar" },
  { href: "/outreach", libelle: "Outreach" },
  { href: "/exports", libelle: "Exports" },
  { href: "/assistant", libelle: "Assistant" },
];

const MENU_COMPTE = [
  { href: "/entreprise", libelle: "Mon entreprise", Icone: Building2 },
  { href: "/boutique", libelle: "Boutique", Icone: ShoppingBag },
  { href: "/partenariat", libelle: "Partenariat", Icone: Handshake },
];

export function Navigation() {
  const router = useRouter();
  const chemin = usePathname();
  const [compte, setCompte] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [ouvert, setOuvert] = useState(false);
  const zone = useRef<HTMLDivElement>(null);

  // Le solde enregistré à la connexion vieillit dès la première chasse.
  // On l'affiche d'abord pour éviter un vide, puis on le remplace par la
  // valeur réelle — et on rafraîchit à chaque changement de page, seul
  // moment où une action a pu le faire bouger.
  useEffect(() => {
    const session = lireSession();
    if (!session) return;

    setCompte(session.email);
    setCredits(session.credits);

    let annule = false;
    recupererCredits()
      .then((solde) => {
        if (annule) return;
        setCredits(solde);
        const courante = lireSession();
        if (courante && courante.credits !== solde) {
          ecrireSession({ ...courante, credits: solde });
        }
      })
      .catch(() => {});

    return () => {
      annule = true;
    };
  }, [chemin]);

  // Le menu se referme au clic à côté et à la touche Échap : sans cela
  // il resterait ouvert derrière la page suivante.
  useEffect(() => {
    if (!ouvert) return;

    function auClic(e: MouseEvent) {
      if (!zone.current?.contains(e.target as Node)) setOuvert(false);
    }
    function auClavier(e: KeyboardEvent) {
      if (e.key === "Escape") setOuvert(false);
    }

    document.addEventListener("mousedown", auClic);
    document.addEventListener("keydown", auClavier);
    return () => {
      document.removeEventListener("mousedown", auClic);
      document.removeEventListener("keydown", auClavier);
    };
  }, [ouvert]);

  // Refermer à chaque changement de page.
  useEffect(() => setOuvert(false), [chemin]);

  function deconnecter() {
    effacerSession();
    router.replace("/connexion");
  }

  const dansLeMenu = MENU_COMPTE.some((e) => e.href === chemin);

  return (
    <header className="sticky top-0 z-20 -mx-6 mb-8 flex items-center justify-between gap-4 border-b border-line bg-ink/85 px-6 py-3 backdrop-blur-md">
      <div className="flex min-w-0 flex-1 items-center gap-5">
        <Link
          href="/accueil"
          className="shrink-0"
          aria-label="DataCloser, tableau de bord"
        >
          <Marque />
        </Link>

        <span aria-hidden="true" className="h-5 w-px shrink-0 bg-line" />

        <nav
          className="defilement-discret -mb-3 flex min-w-0 flex-1 gap-5 pb-3"
          aria-label="Sections"
        >
          {ONGLETS.map((onglet) => {
            const actif = chemin === onglet.href;
            return (
              <Link
                key={onglet.href}
                href={onglet.href}
                aria-current={actif ? "page" : undefined}
                className={`relative whitespace-nowrap text-sm transition-colors ${
                  actif ? "text-content" : "text-muted hover:text-content"
                }`}
              >
                {onglet.libelle}
                {actif && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-3 h-px bg-teal"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {credits !== null && (
          <Link
            href="/boutique"
            title="Crédits restants — recharger"
            className="flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs transition hover:border-teal/40"
          >
            <Coins size={12} className="text-teal" aria-hidden="true" />
            <span className="font-mono tabular-nums text-content">{credits}</span>
          </Link>
        )}

        <div className="relative" ref={zone}>
          <button
            type="button"
            onClick={() => setOuvert((o) => !o)}
            aria-expanded={ouvert}
            aria-haspopup="menu"
            className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs transition ${
              ouvert || dansLeMenu
                ? "text-content"
                : "text-muted hover:text-content"
            }`}
          >
            <span className="hidden max-w-[10rem] truncate sm:inline">
              {compte}
            </span>
            <span className="sm:hidden">Compte</span>
            <ChevronDown
              size={12}
              aria-hidden="true"
              className={`transition-transform ${ouvert ? "rotate-180" : ""}`}
            />
          </button>

          {ouvert && (
            <div
              role="menu"
              className="apparition absolute right-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-surface shadow-lg shadow-black/40"
            >
              <p className="truncate border-b border-line px-4 py-3 text-xs text-muted">
                {compte}
              </p>

              {MENU_COMPTE.map(({ href, libelle, Icone }) => (
                <Link
                  key={href}
                  href={href}
                  role="menuitem"
                  aria-current={chemin === href ? "page" : undefined}
                  className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition hover:bg-ink ${
                    chemin === href ? "text-teal" : "text-content-soft"
                  }`}
                >
                  <Icone size={14} aria-hidden="true" />
                  {libelle}
                </Link>
              ))}

              <button
                type="button"
                role="menuitem"
                onClick={deconnecter}
                className="flex w-full items-center gap-2.5 border-t border-line px-4 py-2.5 text-sm text-muted transition hover:bg-ink hover:text-danger"
              >
                <LogOut size={14} aria-hidden="true" />
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
