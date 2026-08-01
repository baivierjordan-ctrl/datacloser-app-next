"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ecrireLangue,
  lireLangue,
  type Langue,
} from "@/lib/langue";
import { fr, type Traductions } from "./fr";
import { nl } from "./nl";
import { en } from "./en";

const DICTIONNAIRES: Record<Langue, Traductions> = { fr, nl, en };

export type Cle = keyof Traductions;

interface Contexte {
  langue: Langue;
  changer: (langue: Langue) => void;
  t: (cle: Cle) => string;
}

const ContexteLangue = createContext<Contexte>({
  langue: "fr",
  changer: () => {},
  t: (cle) => fr[cle],
});

/**
 * Fournisseur de langue, monté haut dans l'arbre.
 *
 * Le premier rendu se fait toujours en français, y compris côté
 * serveur : lire localStorage ou l'URL pendant le rendu produirait un
 * balisage différent de celui du serveur, et React remplacerait alors
 * la page entière en signalant une erreur d'hydratation. La langue
 * réelle est donc appliquée juste après, dans un effet.
 *
 * Le scintillement que cela peut provoquer reste bref et ne concerne
 * que du texte — contrairement au thème, où le fond de page change et
 * où l'on a préféré un script bloquant dans le layout.
 */
export function FournisseurLangue({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [langue, setLangue] = useState<Langue>("fr");

  useEffect(() => {
    const resolue = lireLangue();
    setLangue(resolue);

    // La langue est persistée systématiquement, et non seulement quand
    // elle arrive par l'URL.
    //
    // lib/api.ts n'est pas un composant : il ne peut pas lire l'état de
    // React et relit donc la préférence enregistrée à chaque appel. Tant
    // que l'écriture dépendait de la présence du paramètre, un visiteur
    // arrivé sur une page qui redirige (la racine renvoie vers l'accueil
    // ou la connexion) voyait bien l'interface traduite — l'état React
    // avait été fixé — mais partait avec un stockage vide : les requêtes
    // au serveur repartaient en français, et le moteur rédigeait en
    // français dans une interface néerlandaise.
    ecrireLangue(resolue);
  }, []);

  const changer = useCallback((choix: Langue) => {
    setLangue(choix);
    ecrireLangue(choix);
  }, []);

  const t = useCallback((cle: Cle) => DICTIONNAIRES[langue][cle], [langue]);

  return (
    <ContexteLangue.Provider value={{ langue, changer, t }}>
      {children}
    </ContexteLangue.Provider>
  );
}

/** Accès à la traduction et à la langue courante depuis un composant. */
export function useLangue(): Contexte {
  return useContext(ContexteLangue);
}
