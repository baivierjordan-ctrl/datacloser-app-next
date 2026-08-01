/**
 * Service worker minimal.
 *
 * Chrome n'affiche « Installer l'application » que si un service worker
 * déclare un gestionnaire de requêtes. Celui-ci en déclare un vide.
 *
 * Il ne met RIEN en cache et n'appelle jamais respondWith : le
 * navigateur gère les requêtes lui-même, ce qu'il fait mieux. Un
 * tableau de bord affiche des crédits, des campagnes en cours, des
 * réponses reçues — servir une version périmée de ces chiffres serait
 * pire que de ne rien afficher.
 *
 * Hors ligne, l'application ne fonctionne donc pas. C'est assumé :
 * chaque écran a besoin de l'API pour dire quoi que ce soit de vrai.
 */

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (evenement) => {
  evenement.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // Volontairement vide : déclaré pour le critère d'installation,
  // sans jamais intercepter quoi que ce soit.
});
