"use client";

import { useEffect, useRef, useState } from "react";
import { recupererLogsScan } from "@/lib/api";

/**
 * Journal d'un scan, en direct.
 *
 * Le serveur ne renvoie que les lignes non encore reçues : on lui
 * transmet le nombre déjà en mémoire. Le défilement suit le bas du
 * journal, sauf si l'utilisateur est remonté lire quelque chose.
 */
export function ConsoleScan({ id, actif }: { id: string; actif: boolean }) {
  const [lignes, setLignes] = useState<string[]>([]);
  const cadre = useRef<HTMLDivElement>(null);
  const suivreLeBas = useRef(true);

  // Miroir de l'état : permet au sondage de connaître le nombre de
  // lignes déjà reçues sans se recréer à chaque nouvelle ligne.
  const lignesRecues = useRef(0);
  lignesRecues.current = lignes.length;

  useEffect(() => {
    setLignes([]);
    suivreLeBas.current = true;
  }, [id]);

  useEffect(() => {
    let annule = false;

    async function tirer() {
      try {
        const r = await recupererLogsScan(id, lignesRecues.current);
        if (annule || r.lignes.length === 0) return;
        setLignes((p) => [...p, ...r.lignes]);
      } catch {
        // Un échec de sondage est sans gravité : le scan continue
        // côté serveur et la ligne manquante arrivera au tour suivant.
      }
    }

    tirer();
    if (!actif) return;
    const minuterie = setInterval(tirer, 5000);
    return () => {
      annule = true;
      clearInterval(minuterie);
    };
  }, [id, actif]);

  useEffect(() => {
    const e = cadre.current;
    if (e && suivreLeBas.current) e.scrollTop = e.scrollHeight;
  }, [lignes]);

  if (lignes.length === 0) {
    return (
      <p className="mt-3 text-xs text-muted">
        {actif ? "En attente des premières lignes…" : "Aucun journal disponible."}
      </p>
    );
  }

  return (
    <div
      ref={cadre}
      onScroll={(e) => {
        const el = e.currentTarget;
        suivreLeBas.current =
          el.scrollHeight - el.scrollTop - el.clientHeight < 40;
      }}
      className="mt-3 max-h-72 overflow-y-auto rounded-lg border border-line bg-ink p-3 font-mono text-[12px] leading-relaxed text-muted"
      role="log"
      aria-live="polite"
      aria-label="Journal du scan"
    >
      {lignes.map((ligne, i) => (
        <p key={i} className="whitespace-pre-wrap break-words">
          {ligne}
        </p>
      ))}
    </div>
  );
}
