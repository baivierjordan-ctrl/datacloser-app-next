"use client";

import { useEffect, useRef, useState } from "react";
import { HelpCircle } from "lucide-react";

/**
 * Aide contextuelle : un point d'interrogation discret qui ouvre une
 * explication à l'endroit exact où la question se pose.
 *
 * Choix délibéré contre le tutoriel d'accueil : une visite guidée
 * s'affiche une fois, se ferme, s'oublie. Une aide posée sur le concept
 * lui-même reste disponible le jour où la question revient — et elle
 * revient toujours plus tard, jamais pendant la visite.
 *
 * Ouverture au clic et non au survol : le survol n'existe pas au
 * doigt, et une bulle qui apparaît dès qu'on passe dessus gêne plus
 * qu'elle n'aide.
 */
export function Aide({ titre, children }: { titre: string; children: React.ReactNode }) {
  const [ouvert, setOuvert] = useState(false);
  const zone = useRef<HTMLSpanElement>(null);

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

  return (
    <span className="relative inline-flex" ref={zone}>
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        aria-expanded={ouvert}
        aria-label={`Aide : ${titre}`}
        className={`inline-flex transition ${
          ouvert ? "text-teal" : "text-muted/60 hover:text-muted"
        }`}
      >
        <HelpCircle size={13} aria-hidden="true" />
      </button>

      {ouvert && (
        <span
          role="tooltip"
          className="apparition absolute left-1/2 top-full z-30 mt-2 w-72 -translate-x-1/2 rounded-xl border border-line bg-surface p-4 text-left shadow-lg shadow-black/40"
        >
          <span className="mb-1.5 block text-xs font-medium text-content">
            {titre}
          </span>
          <span className="block text-xs font-normal leading-relaxed text-muted">
            {children}
          </span>
        </span>
      )}
    </span>
  );
}
