"use client";

/**
 * Préférence de thème.
 *
 * Trois valeurs : « clair », « sombre », ou « systeme » qui suit le
 * réglage du système d'exploitation. Le défaut est « systeme » : on ne
 * décide pas à la place de quelqu'un qui a déjà exprimé un choix au
 * niveau de sa machine.
 *
 * Stockée dans localStorage et non sessionStorage : contrairement à la
 * session, une préférence d'affichage doit survivre à la fermeture du
 * navigateur.
 */

const CLE = "datacloser.theme";

export type Theme = "clair" | "sombre" | "systeme";

export function lireTheme(): Theme {
  if (typeof window === "undefined") return "systeme";
  const brut = window.localStorage.getItem(CLE);
  return brut === "clair" || brut === "sombre" ? brut : "systeme";
}

/** Résout « systeme » en la valeur effective du moment. */
export function themeEffectif(theme: Theme): "clair" | "sombre" {
  if (theme !== "systeme") return theme;
  if (typeof window === "undefined") return "clair";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "sombre"
    : "clair";
}

export function appliquerTheme(theme: Theme): void {
  const effectif = themeEffectif(theme);
  const racine = document.documentElement;

  if (effectif === "sombre") {
    racine.setAttribute("data-theme", "sombre");
  } else {
    racine.removeAttribute("data-theme");
  }

  // La barre du navigateur sur mobile suit le fond de la page.
  const balise = document.querySelector('meta[name="theme-color"]');
  balise?.setAttribute("content", effectif === "sombre" ? "#0a0d12" : "#f6f7f9");
}

export function ecrireTheme(theme: Theme): void {
  if (theme === "systeme") {
    window.localStorage.removeItem(CLE);
  } else {
    window.localStorage.setItem(CLE, theme);
  }
  appliquerTheme(theme);
}
