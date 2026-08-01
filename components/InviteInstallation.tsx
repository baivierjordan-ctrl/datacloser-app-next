"use client";

import { useEffect, useState } from "react";
import { Share, X } from "lucide-react";

/**
 * Invite à installer l'application sur l'écran d'accueil.
 *
 * Chrome propose parfois cette installation de lui-même, mais selon des
 * critères opaques : beaucoup d'utilisateurs ne verront jamais rien. On
 * capte donc l'événement pour déclencher l'invite au bon moment.
 *
 * Deux principes tenus ici :
 *
 * — Ne pas interrompre. Le bandeau apparaît en bas, après quelques
 *   secondes d'usage, jamais à l'arrivée : proposer d'installer avant
 *   d'avoir montré quoi que ce soit revient à quémander.
 *
 * — Un refus vaut refus. Il est mémorisé et l'invite ne revient plus.
 *   Rien n'agace plus qu'une proposition qu'on a déjà écartée.
 */

const CLE_REFUS = "datacloser.installation.refusee";
const DELAI_AVANT_INVITE = 8000;

export function InviteInstallation() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Déjà installée : l'application tourne en mode autonome.
    const installee =
      window.matchMedia("(display-mode: standalone)").matches ||
      // Safari expose cet indicateur hors du standard.
      (window.navigator as { standalone?: boolean }).standalone === true;

    if (installee || localStorage.getItem(CLE_REFUS)) return;

    // L'application n'enregistre plus de service worker — celui-ci
    // l'empêchait de charger. Chrome n'émet donc plus
    // « beforeinstallprompt », et aucun bouton d'installation ne peut
    // être déclenché depuis la page. On explique la manœuvre par le
    // menu du navigateur, qui reste possible partout.
    const minuteur = setTimeout(() => setVisible(true), DELAI_AVANT_INVITE);
    return () => clearTimeout(minuteur);
  }, []);

  function refuser() {
    localStorage.setItem(CLE_REFUS, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Installer DataCloser"
      className="apparition fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-xl border border-line bg-surface p-4 shadow-lg shadow-slate-900/10"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal"
        >
          <Share size={16} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">DataCloser sur votre écran</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Ouvrez le menu de votre navigateur, puis « Ajouter à l&apos;écran
            d&apos;accueil » : vos chasses et vos campagnes en un geste.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={refuser}
              className="rounded-lg px-3 py-2 text-sm text-muted transition hover:text-content"
            >
              Compris
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={refuser}
          aria-label="Fermer"
          className="shrink-0 text-muted transition hover:text-content"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
