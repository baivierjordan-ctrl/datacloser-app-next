/**
 * Service worker minimal.
 *
 * Chrome n'affiche « Installer l'application » que si un service worker
 * répond aux requêtes de navigation. Celui-ci fait le strict minimum
 * pour le permettre.
 *
 * Il ne met RIEN en cache, volontairement. Un tableau de bord affiche
 * des crédits, des campagnes en cours, des réponses reçues — servir une
 * version périmée de ces chiffres serait pire que ne rien afficher, et
 * la mise à jour d'un cache est la source d'incident la plus fréquente
 * sur ce genre de fichier.
 *
 * Hors ligne, l'application ne fonctionne donc pas. C'est assumé :
 * chaque écran a besoin de l'API pour dire quoi que ce soit de vrai.
 */

self.addEventListener("install", () => {
  // Prendre la main immédiatement plutôt qu'au prochain chargement.
  self.skipWaiting();
});

self.addEventListener("activate", (evenement) => {
  evenement.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (evenement) => {
  // Le réseau, toujours. Ce gestionnaire existe pour satisfaire le
  // critère d'installation, pas pour intercepter quoi que ce soit.
  evenement.respondWith(fetch(evenement.request));
});
