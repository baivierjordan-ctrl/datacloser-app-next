"use client";

/**
 * Session côté navigateur.
 * Le jeton vit en mémoire pendant la navigation et dans sessionStorage
 * pour survivre à un rafraîchissement — pas dans localStorage, qui
 * persisterait après la fermeture du navigateur sur un poste partagé.
 */

const CLE = "datacloser.session";

export interface Session {
  jeton: string;
  email: string;
  credits: number;
}

export function lireSession(): Session | null {
  if (typeof window === "undefined") return null;
  const brut = window.sessionStorage.getItem(CLE);
  if (!brut) return null;
  try {
    return JSON.parse(brut) as Session;
  } catch {
    return null;
  }
}

export function ecrireSession(session: Session): void {
  window.sessionStorage.setItem(CLE, JSON.stringify(session));
}

export function effacerSession(): void {
  window.sessionStorage.removeItem(CLE);
}
