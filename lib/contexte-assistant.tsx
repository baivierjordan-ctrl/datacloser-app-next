"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Contexte d'écran transmis à l'assistant.
 *
 * Sans lui, la bulle est un chatbot générique : elle sait ce que
 * l'utilisateur vend, pas ce qu'il regarde. « Ce message est-il bon ? »
 * ne veut alors rien dire, et il faut tout réexpliquer à chaque fois.
 *
 * Chaque écran déclare ce qu'il affiche. Rien n'est demandé au serveur :
 * la page a déjà ces données en main, et les redemander coûterait une
 * requête à chaque ouverture de la bulle.
 */

export interface ContexteEcran {
  /** Où se trouve l'utilisateur, en une phrase. */
  ecran: string;
  /** Ce qu'il regarde : faits courts, jamais de données personnelles en masse. */
  details?: string[];
  /** Questions pertinentes ici, proposées en un clic. */
  suggestions?: string[];
}

const Contexte = createContext<{
  contexte: ContexteEcran | null;
  definir: (c: ContexteEcran | null) => void;
}>({ contexte: null, definir: () => {} });

export function FournisseurContexteAssistant({
  children,
}: {
  children: ReactNode;
}) {
  const [contexte, definir] = useState<ContexteEcran | null>(null);
  const valeur = useMemo(() => ({ contexte, definir }), [contexte]);
  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>;
}

/** Lecture, côté bulle. */
export function useContexteAssistant() {
  return useContext(Contexte).contexte;
}

/**
 * Déclaration, côté écran.
 *
 * Le contexte est effacé au démontage : une bulle qui parlerait encore
 * de l'écran précédent serait pire que pas de contexte du tout.
 */
export function useDeclarerContexte(
  contexte: ContexteEcran | null,
  dependances: unknown[] = [],
) {
  const { definir } = useContext(Contexte);

  // Les dépendances sont réduites à une chaîne. Un appelant qui passe un
  // tableau ou un objet recréé à chaque rendu — « [motsCles, lieux] »
  // par exemple — déclencherait sinon une boucle infinie : l'identité
  // change à chaque fois, l'effet se rejoue, l'écran finit par ne plus
  // répondre. Comparer le contenu plutôt que la référence rend ce piège
  // impossible.
  const signature = JSON.stringify(dependances);

  useEffect(() => {
    definir(contexte);
    return () => definir(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);
}

/** Met le contexte en forme pour le moteur. */
export function formaterContexte(c: ContexteEcran | null): string {
  if (!c) return "";
  const lignes = [`L'utilisateur se trouve sur : ${c.ecran}.`];
  if (c.details?.length) {
    lignes.push("Ce qu'il a sous les yeux :");
    lignes.push(...c.details.map((d) => `- ${d}`));
  }
  lignes.push(
    "Réponds à son cas précis en t'appuyant sur ces éléments, sans les " +
      "répéter inutilement.",
  );
  return lignes.join("\n");
}
