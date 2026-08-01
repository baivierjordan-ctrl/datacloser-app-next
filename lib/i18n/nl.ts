import type { Traductions } from "./fr";

/**
 * Dictionnaire néerlandais.
 *
 * Registre : le vouvoiement français devient « u » et non « je ». Le
 * néerlandais des affaires en Belgique reste formel entre inconnus, et
 * l'application s'adresse à des dirigeants qu'elle n'a jamais vus.
 *
 * Quelques termes restent en anglais parce que c'est ainsi qu'on les
 * dit dans le métier en néerlandais : « Outreach », « Exports ». Les
 * traduire donnerait un vocabulaire correct mais que personne n'emploie.
 */

export const nl: Traductions = {
  // ── Navigatie ──
  "nav.accueil": "Start",
  "nav.radar": "Radar",
  "nav.outreach": "Outreach",
  "nav.exports": "Exports",
  "nav.assistant": "Assistent",
  "nav.guide": "Handleiding",
  "nav.entreprise": "Mijn onderneming",
  "nav.boutique": "Winkel",
  "nav.partenariat": "Partnerschap",
  "nav.administration": "Beheer",
  "nav.compte": "Account",
  "nav.deconnexion": "Afmelden",
  "nav.sections": "Secties",
  "nav.tableauDeBord": "DataCloser, dashboard",
  "nav.credits": "Resterende credits — bijladen",

  // ── Weergave en taal ──
  "reglages.apparence": "Weergave",
  "reglages.themeClair": "Licht",
  "reglages.themeSombre": "Donker",
  "reglages.themeSysteme": "Systeem",
  "reglages.choixTheme": "Themakeuze",
  "reglages.langue": "Taal",
  "reglages.choixLangue": "Taalkeuze",

  // ── Aanmelden ──
  "connexion.titre": "Aanmelden",
  "connexion.email": "E-mail",
  "connexion.motDePasse": "Wachtwoord",
  "connexion.valider": "Aanmelden",
  "connexion.enCours": "Bezig met aanmelden…",
  "connexion.champsManquants": "Vul uw e-mailadres en wachtwoord in.",
  "connexion.motDePasseOublie": "Wachtwoord vergeten?",
  "connexion.pasDeCompte": "Nog geen account?",
  "connexion.creerCompte": "Maak er een aan",
  "connexion.accrocheTitre": "Uw markt, doorlopend gescand.",
  "connexion.accrocheTexte":
    "De engine spoort ondernemingen op, verifieert de beslissers en hun e-mailadressen, en schrijft vervolgens een openingszin op basis van hun eigen website.",
};
