"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { appliquerTheme, ecrireTheme, lireTheme, type Theme } from "@/lib/theme";

const CHOIX = [
  { valeur: "clair" as const, libelle: "Clair", Icone: Sun },
  { valeur: "sombre" as const, libelle: "Sombre", Icone: Moon },
  { valeur: "systeme" as const, libelle: "Système", Icone: Monitor },
];

/**
 * Choix du thème, dans le menu du compte.
 *
 * Trois segments plutôt qu'un interrupteur : « système » n'est pas un
 * troisième thème mais l'absence de choix, et un interrupteur à deux
 * positions ne saurait pas l'exprimer.
 */
export function SelecteurTheme() {
  const [theme, setTheme] = useState<Theme>("systeme");

  useEffect(() => {
    setTheme(lireTheme());

    // Quand l'utilisateur suit son système, un changement de réglage
    // doit se répercuter sans recharger la page.
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const suivre = () => {
      if (lireTheme() === "systeme") appliquerTheme("systeme");
    };
    media.addEventListener("change", suivre);
    return () => media.removeEventListener("change", suivre);
  }, []);

  return (
    <div className="border-t border-line px-4 py-3">
      <p className="mb-2 text-xs text-muted">Apparence</p>
      <div
        role="radiogroup"
        aria-label="Choix du thème"
        className="flex gap-1 rounded-lg border border-line p-1"
      >
        {CHOIX.map(({ valeur, libelle, Icone }) => {
          const actif = theme === valeur;
          return (
            <button
              key={valeur}
              type="button"
              role="radio"
              aria-checked={actif}
              onClick={() => {
                setTheme(valeur);
                ecrireTheme(valeur);
              }}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition ${
                actif
                  ? "bg-ink text-content"
                  : "text-muted hover:text-content"
              }`}
            >
              <Icone size={13} aria-hidden="true" />
              {libelle}
            </button>
          );
        })}
      </div>
    </div>
  );
}
