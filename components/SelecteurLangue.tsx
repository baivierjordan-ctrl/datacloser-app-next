"use client";

import { LANGUES, NOMS, type Langue } from "@/lib/langue";
import { useLangue } from "@/lib/i18n";

/**
 * Choix de la langue, dans le menu du compte.
 *
 * Les langues s'affichent dans leur propre langue — « Nederlands », pas
 * « Néerlandais ». Quelqu'un qui cherche à sortir d'une interface qu'il
 * ne comprend pas reconnaît le nom de la sienne, jamais sa traduction.
 *
 * Trois segments comme pour le thème, et non une liste déroulante :
 * trois choix courts se lisent d'un regard et se touchent du pouce.
 */
export function SelecteurLangue() {
  const { langue, changer, t } = useLangue();

  return (
    <div className="border-t border-line px-4 py-3">
      <p className="mb-2 text-xs text-muted">{t("reglages.langue")}</p>
      <div
        role="radiogroup"
        aria-label={t("reglages.choixLangue")}
        className="flex gap-1 rounded-lg border border-line p-1"
      >
        {LANGUES.map((valeur: Langue) => {
          const actif = langue === valeur;
          return (
            <button
              key={valeur}
              type="button"
              role="radio"
              aria-checked={actif}
              lang={valeur}
              onClick={() => changer(valeur)}
              className={`flex flex-1 items-center justify-center rounded-md px-2 py-1.5 text-xs transition ${
                actif ? "bg-ink text-content" : "text-muted hover:text-content"
              }`}
            >
              {NOMS[valeur]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
