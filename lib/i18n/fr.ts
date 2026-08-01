/**
 * Dictionnaire français — la référence.
 *
 * C'est ce fichier qui fait foi : son type `Traductions` contraint les
 * autres langues, si bien qu'oublier une clé en néerlandais devient une
 * erreur de compilation plutôt qu'un mot français apparaissant au
 * milieu d'un écran traduit.
 *
 * Les clés sont nommées par emplacement (`nav.`, `connexion.`) et non
 * par contenu : « connexion.titre » survit à une reformulation, pas
 * « connexion.se_connecter_maintenant ».
 */

export const fr = {
  // ── Navigation ──
  "nav.accueil": "Accueil",
  "nav.radar": "Radar",
  "nav.outreach": "Outreach",
  "nav.exports": "Exports",
  "nav.assistant": "Assistant",
  "nav.guide": "Mode d'emploi",
  "nav.entreprise": "Mon entreprise",
  "nav.boutique": "Boutique",
  "nav.partenariat": "Partenariat",
  "nav.administration": "Administration",
  "nav.compte": "Compte",
  "nav.deconnexion": "Se déconnecter",
  "nav.sections": "Sections",
  "nav.tableauDeBord": "DataCloser, tableau de bord",
  "nav.credits": "Crédits restants — recharger",

  // ── Apparence et langue, dans le menu du compte ──
  "reglages.apparence": "Apparence",
  "reglages.themeClair": "Clair",
  "reglages.themeSombre": "Sombre",
  "reglages.themeSysteme": "Système",
  "reglages.choixTheme": "Choix du thème",
  "reglages.langue": "Langue",
  "reglages.choixLangue": "Choix de la langue",

  // ── Connexion ──
  "connexion.titre": "Connexion",
  "connexion.email": "Email",
  "connexion.motDePasse": "Mot de passe",
  "connexion.valider": "Se connecter",
  "connexion.enCours": "Connexion…",
  "connexion.champsManquants": "Renseignez votre email et votre mot de passe.",
  "connexion.motDePasseOublie": "Mot de passe oublié ?",
  "connexion.pasDeCompte": "Pas encore de compte ?",
  "connexion.creerCompte": "Créez-en un",
  "connexion.accrocheTitre": "Votre marché, balayé en continu.",
  "connexion.accrocheTexte":
    "Le moteur détecte les entreprises, vérifie les décideurs et leurs emails, puis rédige une accroche à partir de leur propre site.",
} as const;

export type Traductions = Record<keyof typeof fr, string>;
