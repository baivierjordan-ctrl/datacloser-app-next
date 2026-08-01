/**
 * Service worker de désinstallation.
 *
 * Les versions précédentes de ce fichier empêchaient l'application de
 * charger. Un service worker déjà enregistré ne disparaît pas quand on
 * cesse de l'enregistrer : le navigateur garde l'ancien. Le seul moyen
 * de le retirer chez les utilisateurs est de publier une version qui se
 * désinstalle elle-même.
 *
 * C'est ce que fait ce fichier, et rien d'autre.
 *
 * Conséquence assumée : Chrome ne proposera plus « Installer
 * l'application » automatiquement. L'ajout à l'écran d'accueil reste
 * possible par le menu du navigateur, et une application qui se lance
 * vaut mieux qu'un bouton d'installation.
 */

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (evenement) => {
  evenement.waitUntil(
    (async () => {
      // Vider les caches éventuellement laissés derrière.
      const noms = await caches.keys();
      await Promise.all(noms.map((n) => caches.delete(n)));

      // Se désinscrire, puis recharger les pages ouvertes pour qu'elles
      // repartent sans intermédiaire.
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) => client.navigate(client.url));
    })(),
  );
});
