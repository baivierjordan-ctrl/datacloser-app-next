"use client";

import { useEffect } from "react";

/**
 * Retire le service worker déjà installé.
 *
 * Les versions précédentes empêchaient l'application de charger. Plutôt
 * que d'en enregistrer un nouveau, on désinstalle ce qui traîne : un
 * service worker survit à la suppression du code qui l'enregistrait,
 * seule une désinscription explicite le retire.
 *
 * Chrome ne proposera donc plus l'installation automatique. C'est le
 * prix à payer, et il est bien inférieur à celui d'une application qui
 * ne s'ouvre pas.
 */
export function EnregistrerServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .getRegistrations()
      .then((enregistrements) =>
        enregistrements.forEach((e) => e.unregister()),
      )
      .catch(() => {
        // Silencieux : l'application fonctionne de toute façon.
      });
  }, []);

  return null;
}
