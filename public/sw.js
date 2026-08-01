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

self.addEventListener("fetch", () => {
  // Volontairement vide.
  //
  // La version précédente appelait respondWith(fetch(...)), ce qui
  // faisait transiter TOUT le trafic par ce fichier : au moindre
  // hoquet réseau, la page entière échouait avec « This page couldn't
  // load » là où le navigateur aurait simplement réessayé.
  //
  // Un gestionnaire déclaré suffit au critère d'installation de
  // Chrome. Ne pas appeler respondWith laisse le navigateur gérer la
  // requête lui-même, ce qu'il fait mieux que nous.
});
