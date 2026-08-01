"use client";

import { useLangue } from "@/lib/i18n";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";

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

interface EvenementInstallation extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InviteInstallation() {
  const { t } = useLangue();
  const [evenement, setEvenement] = useState<EvenementInstallation | null>(null);
  const [surIphone, setSurIphone] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Déjà installée : l'application tourne en mode autonome.
    const installee =
      window.matchMedia("(display-mode: standalone)").matches ||
      // Safari expose cet indicateur hors du standard.
      (window.navigator as { standalone?: boolean }).standalone === true;

    if (installee || localStorage.getItem(CLE_REFUS)) return;

    // iOS ne fournit aucun événement d'installation : Safari impose de
    // passer par son menu de partage. On explique la manœuvre plutôt
    // que de laisser l'utilisateur sans issue.
    const iphone =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      /safari/i.test(navigator.userAgent) &&
      !/crios|fxios/i.test(navigator.userAgent);

    if (iphone) {
      setSurIphone(true);
      const minuteur = setTimeout(() => setVisible(true), DELAI_AVANT_INVITE);
      return () => clearTimeout(minuteur);
    }

    function capter(e: Event) {
      // Empêche l'invite native de Chrome : on choisit le moment.
      e.preventDefault();
      setEvenement(e as EvenementInstallation);
      setTimeout(() => setVisible(true), DELAI_AVANT_INVITE);
    }

    window.addEventListener("beforeinstallprompt", capter);
    return () => window.removeEventListener("beforeinstallprompt", capter);
  }, []);

  function refuser() {
    localStorage.setItem(CLE_REFUS, "1");
    setVisible(false);
  }

  async function installer() {
    if (!evenement) return;
    setVisible(false);
    await evenement.prompt();
    const { outcome } = await evenement.userChoice;
    // Un refus dans la boîte native vaut refus : ne pas réinsister.
    if (outcome === "dismissed") localStorage.setItem(CLE_REFUS, "1");
    setEvenement(null);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={t("install.installerLabel")}
      className="apparition fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-xl border border-line bg-surface p-4 shadow-lg shadow-slate-900/10"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal"
        >
          {surIphone ? <Share size={16} /> : <Download size={16} />}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{t("install.titre")}</p>
          {surIphone ? (
            <p className="mt-1 text-xs leading-relaxed text-muted">
              {t("install.safari")}
            </p>
          ) : (
            <p className="mt-1 text-xs leading-relaxed text-muted">
              {t("install.detail")}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {!surIphone && (
              <button
                type="button"
                onClick={installer}
                className="rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-hover"
              >
                {t("install.installer")}
              </button>
            )}
            <button
              type="button"
              onClick={refuser}
              className="rounded-lg px-3 py-2 text-sm text-muted transition hover:text-content"
            >
              {surIphone ? "Compris" : "Plus tard"}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={refuser}
          aria-label={t("install.fermer")}
          className="shrink-0 text-muted transition hover:text-content"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
