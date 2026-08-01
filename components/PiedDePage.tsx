"use client";

import { Marque } from "@/components/Marque";
import { useLangue, type Cle } from "@/lib/i18n";

/**
 * Pied de page applicatif.
 *
 * Les pages légales vivent sur le site public : on y renvoie plutôt
 * que d'en dupliquer le contenu, qui divergerait à la première mise à
 * jour. Formulations reprises telles quelles du site.
 */

const LIENS: { cle: Cle; href: string }[] = [
  { cle: "pied.mentions", href: "https://datacloser.com/mentions-legales.html" },
  { cle: "pied.cgu", href: "https://datacloser.com/cgu.html" },
  {
    cle: "pied.confidentialite",
    href: "https://datacloser.com/politique-de-confidentialite.html",
  },
];

export function PiedDePage() {
  const { t } = useLangue();

  return (
    <footer className="mt-16 border-t border-line pt-6">
      <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
        <div>
          <Marque />
          <p className="mt-2 text-xs text-muted">
            © {new Date().getFullYear()} DataCloser — Jordan Baivier, Belgique.
          </p>
          <p className="mt-1 font-mono text-[12px] text-muted">
            {t("pied.marque")}
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label={t("pied.legal")}>
          {LIENS.map((lien) => (
            <a
              key={lien.href}
              href={lien.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted transition hover:text-content"
            >
              {t(lien.cle)}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
