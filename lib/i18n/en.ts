import type { Traductions } from "./fr";

/**
 * Dictionnaire anglais.
 *
 * Anglais britannique, cohérent avec un produit européen qui s'adresse
 * d'abord au Benelux et à la Suisse : « organisation », « personalise ».
 *
 * Le vouvoiement français n'a pas d'équivalent : l'anglais reste direct
 * sans être familier, ce qui est le registre attendu d'un outil de
 * travail.
 */

export const en: Traductions = {
  // ── Navigation ──
  "nav.accueil": "Home",
  "nav.radar": "Radar",
  "nav.outreach": "Outreach",
  "nav.exports": "Exports",
  "nav.assistant": "Assistant",
  "nav.guide": "User guide",
  "nav.entreprise": "My company",
  "nav.boutique": "Store",
  "nav.partenariat": "Partnership",
  "nav.administration": "Administration",
  "nav.compte": "Account",
  "nav.deconnexion": "Sign out",
  "nav.sections": "Sections",
  "nav.tableauDeBord": "DataCloser, dashboard",
  "nav.credits": "Credits remaining — top up",

  // ── Appearance and language ──
  "reglages.apparence": "Appearance",
  "reglages.themeClair": "Light",
  "reglages.themeSombre": "Dark",
  "reglages.themeSysteme": "System",
  "reglages.choixTheme": "Theme selection",
  "reglages.langue": "Language",
  "reglages.choixLangue": "Language selection",

  // ── Sign in ──
  "connexion.titre": "Sign in",
  "connexion.email": "Email",
  "connexion.motDePasse": "Password",
  "connexion.valider": "Sign in",
  "connexion.enCours": "Signing in…",
  "connexion.champsManquants": "Enter your email address and password.",
  "connexion.motDePasseOublie": "Forgotten your password?",
  "connexion.pasDeCompte": "No account yet?",
  "connexion.creerCompte": "Create one",
  "connexion.accrocheTitre": "Your market, scanned continuously.",
  "connexion.accrocheTexte":
    "The engine finds companies, verifies decision-makers and their email addresses, then writes an opening line drawn from their own website.",

  // ── Sign up ──
  "inscription.eyebrow": "Sign up",
  "inscription.titre": "Create your account",
  "inscription.sousTitre": "You get 50 credits to start with.",
  "inscription.email": "Work email address",
  "inscription.motDePasse": "Password",
  "inscription.longueurMini": "8 characters minimum",
  "inscription.societe": "Company",
  "inscription.adresse": "Address, optional",
  "inscription.tva": "VAT number, optional",
  "inscription.valider": "Create my account",
  "inscription.enCours": "Creating…",
  "inscription.dejaInscrit": "Already registered?",
  "inscription.seConnecter": "Sign in",

  // ── Forgotten password ──
  "oubli.eyebrow": "Password",
  "oubli.titre": "Forgotten password",
  "oubli.consigne":
    "Enter your address and we will send you a link to choose a new one.",
  "oubli.champEmail": "Email address",
  "oubli.valider": "Send me the link",
  "oubli.enCours": "Sending…",
  "oubli.envoye":
    "If an account exists for this address, a link has just been sent. It remains valid for one hour.",
  "oubli.indesirables": "Do check your spam folder if nothing arrives.",
  "oubli.retour": "Back to sign in",

  // ── Footer ──
  "pied.mentions": "Legal notice",
  "pied.cgu": "Terms of use",
  "pied.confidentialite": "Privacy policy",
  "pied.marque": "Registered trade mark BOIP no. 160599",
  "pied.legal": "Legal information",
};
