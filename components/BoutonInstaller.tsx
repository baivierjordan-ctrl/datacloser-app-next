"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

/**
 * Entrée d'installation dans le menu du compte.
 *
 * Le bandeau d'invite ne revient pas après un refus — c'est voulu. Mais
 * quelqu'un qui a dit « plus tard » doit pouvoir changer d'avis : cette
 * entrée reste disponible tant que l'application n'est pas installée,
 * et disparaît une fois qu'elle l'est.
 */

interface EvenementInstallation extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function BoutonInstaller() {
  const [evenement, setEvenement] = useState<EvenementInstallation | null>(null);

  useEffect(() => {
    const installee =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;
    if (installee) return;

    function capter(e: Event) {
      e.preventDefault();
      setEvenement(e as EvenementInstallation);
    }
    window.addEventListener("beforeinstallprompt", capter);
    return () => window.removeEventListener("beforeinstallprompt", capter);
  }, []);

  // Rien à proposer : navigateur incompatible, ou déjà installée.
  if (!evenement) return null;

  return (
    <button
      type="button"
      role="menuitem"
      onClick={async () => {
        await evenement.prompt();
        await evenement.userChoice;
        setEvenement(null);
      }}
      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-content-soft transition hover:bg-ink"
    >
      <Download size={14} aria-hidden="true" />
      Installer l&apos;application
    </button>
  );
}
