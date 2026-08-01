"use client";

import { useEffect } from "react";

/**
 * Enregistre le service worker, condition posée par Chrome pour
 * proposer l'installation sur l'écran d'accueil.
 *
 * Ne rend rien : c'est un effet de bord, monté une fois dans le layout.
 * Un échec est silencieux — l'application marche parfaitement sans, et
 * afficher une erreur pour une fonction d'agrément serait déplacé.
 */
export function EnregistrerServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Silencieux : l'installation sur l'écran d'accueil ne sera pas
      // proposée, rien d'autre ne change.
    });
  }, []);

  return null;
}
