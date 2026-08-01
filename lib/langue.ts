"use client";

/**
 * Préférence de langue.
 *
 * Trois valeurs : « fr », « nl », « en ». Le défaut reste le français,
 * langue historique du produit et de la majorité des comptes.
 *
 * L'ordre de résolution compte. Le paramètre d'URL passe avant la
 * préférence enregistrée, parce qu'il exprime une intention plus
 * récente : quelqu'un qui arrive depuis une page néerlandaise du site
 * veut lire en néerlandais, même s'il avait visité l'application en
 * français la semaine passée. Le choix est ensuite mémorisé, pour que
 * la langue survive à la navigation interne où le paramètre disparaît.
 *
 * Stockée dans localStorage et non sessionStorage : comme le thème,
 * une préférence d'affichage doit survivre à la fermeture du navigateur.
 *
 * La langue du navigateur n'est volontairement pas consultée. Un
 * francophone de Flandre a souvent un système en néerlandais ou en
 * anglais sans vouloir travailler dans ces langues ; la landing pose
 * déjà la question par une bannière, c'est le bon endroit pour le faire.
 */

const CLE = "datacloser.langue";

export const LANGUES = ["fr", "nl", "en"] as const;
export type Langue = (typeof LANGUES)[number];

export const NOMS: Record<Langue, string> = {
  fr: "Français",
  nl: "Nederlands",
  en: "English",
};

function estLangue(valeur: string | null): valeur is Langue {
  return valeur !== null && (LANGUES as readonly string[]).includes(valeur);
}

/**
 * Résout la langue à servir : paramètre d'URL, puis préférence
 * enregistrée, puis français.
 */
export function lireLangue(): Langue {
  if (typeof window === "undefined") return "fr";

  const parametre = new URLSearchParams(window.location.search).get("lang");
  if (estLangue(parametre)) return parametre;

  const enregistree = window.localStorage.getItem(CLE);
  return estLangue(enregistree) ? enregistree : "fr";
}

/**
 * Reporte la langue sur le document. Le `lang` de la racine n'est pas
 * cosmétique : les lecteurs d'écran choisissent leur voix dessus, et
 * les navigateurs leur césure.
 */
export function appliquerLangue(langue: Langue): void {
  document.documentElement.setAttribute("lang", langue);
}

export function ecrireLangue(langue: Langue): void {
  window.localStorage.setItem(CLE, langue);
  appliquerLangue(langue);
}
