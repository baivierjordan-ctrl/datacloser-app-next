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

  // ── Radar ──
  "radar.eyebrow": "Radar",
  "radar.titre": "Start a hunt",
  "radar.intro":
    "Enter a trade and an area. The engine identifies companies, finds the decision-maker, verifies their email and writes an opening line drawn from their website. The result becomes a file, available under Exports.",
  "radar.termine": "Hunt complete.",
  "radar.termineDetail": "Your file is waiting under Exports.",
  "radar.voirResultats": "View results",

  // Hunt in progress
  "radar.entreprisesAnalysees": "companies analysed",
  "radar.arreter": "Stop",
  "radar.peutFermer": "You can close this page: the hunt continues on our servers.",
  "radar.optionsIndisponibles": "Could not load the search options.",
  "radar.reessayer": "Try again",

  // Step 1
  "radar.etape1Titre": "Who are you looking for?",
  "radar.etape1Detail":
    "One trade per entry. Prefer \u201croofer\u201d to \u201cconstruction\u201d: broad terms return directories, trades return companies.",
  "radar.metiers": "Trades or keywords",
  "radar.metiersExemple": "heating engineer, plumber, roofer…",
  "radar.ajouter": "Add",
  "radar.proposerMetiers": "Suggest related trades",
  "radar.recherche": "Searching…",

  // Step 2
  "radar.etape2Titre": "Where should we look?",
  "radar.etape2Detail":
    "Each trade is searched in each city. Two trades and three cities make six searches — start small to judge the quality.",
  "radar.pays": "Country",
  "radar.mode": "Search mode",
  "radar.villes": "Cities",
  "radar.zones": "Postcodes or municipalities, separated by commas",
  "radar.zonesExemple": "6180, 7100, Trazegnies",

  // Step 3
  "radar.etape3Titre": "Settings",
  "radar.etape3Detail": "Optional. The default values suit a first hunt.",
  "radar.resultatsPar": "Results per keyword and per location:",
  "radar.mapsLimite": "— Maps is capped at",
  "radar.nomFichier": "File name, optional",
  "radar.nomFichierExemple": "heating_engineers_hainaut",
  "radar.chercherTel": "Also look for phone numbers",
  "radar.chercherTelCout": "(+10 credits per number found)",
  "radar.sansSite": "Check whether there is no website",

  // Summary
  "radar.incomplet": "Add at least one trade and one area to start.",
  "radar.metierSingulier": "trade",
  "radar.metierPluriel": "trades",
  "radar.zoneSingulier": "area",
  "radar.zonePluriel": "areas",
  "radar.resultats": "results",
  "radar.recherches": "searches",
  "radar.coutRappel":
    "One credit per company whose email is verified. Companies without an address are never charged.",
  "radar.lancer": "Start the hunt",
  "radar.dejaEnCours": "A hunt is already running",
  "radar.vosChasses": "Your hunts",

  // Statuses
  "scan.en_attente": "Queued",
  "scan.en_cours": "Running",
  "scan.annulation_demandee": "Cancellation requested",
  "scan.termine": "Complete",
  "scan.erreur": "Failed",

  // ── Hunt history ──
  "histo.chasse": "Hunt",
  "histo.analysees": "analysed",
  "histo.relancer": "Run again with the same settings",
  "histo.telecharger": "Download the file",
  "histo.fichierIndisponible":
    "This file is no longer available. Run the hunt again to regenerate it.",

  // ── Outreach ──
  "outreach.eyebrow": "Outreach",
  "outreach.titre": "Your email campaigns",
  "outreach.smtpManquant":
    "No sending server configured. Enter your details under Settings before starting a campaign.",
  "outreach.ongletCampagnes": "Campaigns",
  "outreach.ongletCreation": "New campaign",
  "outreach.ongletReglages": "Settings",
  "outreach.creeeAvant": "Campaign created:",
  "outreach.destinataire": "recipient",
  "outreach.destinataires": "recipients",
  "outreach.creeeApres": "queued for sending.",

  // ── Sending server (SMTP) ──
  "smtp.titre": "Sending server",
  "smtp.chiffre": "The password is encrypted before being stored.",
  "smtp.fournisseur": "Provider",
  "smtp.personnalise": "Custom",
  "smtp.hote": "SMTP server",
  "smtp.port": "Port",
  "smtp.expedition": "Sending address",
  "smtp.expeditionExemple": "you@example.com",
  "smtp.motDePasse": "Password",
  "smtp.motDePasseConserver": " — leave empty to keep the current one",
  "smtp.gmail": "On Gmail, use an app password, not your account password.",
  "smtp.signature": "Signature",
  "smtp.rythme": "Sending pace",
  "smtp.delaiMin": "Minimum delay",
  "smtp.delaiReel": "Actual:",
  "smtp.debut": "From",
  "smtp.fin": "To",
  "smtp.jours": "Sending days",
  "smtp.enregistrer": "Save",
  "smtp.enregistrement": "Saving…",
  "smtp.enregistre": "Configuration saved",
  "smtp.errExpedition": "Enter the sending address.",
  "smtp.errMotDePasse": "A password is required for the first configuration.",
  "smtp.errJour": "Choose at least one sending day.",
  "smtp.errHeures": "The start time must come before the end time.",
  "jour.0": "Mon",
  "jour.1": "Tue",
  "jour.2": "Wed",
  "jour.3": "Thu",
  "jour.4": "Fri",
  "jour.5": "Sat",
  "jour.6": "Sun",

  // ── Campaign creation ──
  "campagne.aucunScan": "No hunt available. Run a search from Radar first.",
  "campagne.smtpAvant":
    "Enter your sending server under Settings before starting a campaign.",
  "campagne.nom": "Campaign name",
  "campagne.nomExemple": "Heating engineers outreach, Charleroi",
  "campagne.scanSource": "Source file",
  "campagne.destinataires": "Recipients",
  "campagne.aideQualifTitre": "Why filter by qualification",
  "campagne.aideQualifTexte":
    "Sending to unreachable addresses harms your domain reputation: servers eventually mark you as spam. Reliable qualifications are ticked by default; widen the selection knowingly.",
  "campagne.qualifDefaut":
    "The most reliable qualifications are ticked by default. Widen the selection to increase volume.",
  "campagne.aucuneAdresse": "This hunt contains no usable email address.",
  "campagne.message": "Message",
  "campagne.objet": "Subject",
  "campagne.corps": "Message body",
  "campagne.modeleEnregistre": "Template saved",
  "campagne.enregistrerModele": "Save as default template",
  "campagne.origineAvant": "Template taken from \u201c",
  "campagne.origineApres":
    "\u201d, your campaign with the best reply rate. Adjust it before launching.",
  "campagne.activerRelances": "Enable follow-ups",
  "campagne.aideRelanceTitre": "How follow-ups work",
  "campagne.aideRelanceTexte":
    "The D+4 follow-up goes out four days after the first message, and only to recipients who received it without replying. D+9 and D+14 follow the same cascading logic. Follow-ups cost no credits: only the first message is charged.",
  "campagne.relanceDetail":
    "The follow-up goes out 4 days after the first message, and only to those who received it.",
  "campagne.relanceJ4": "Follow-up D+4",
  "campagne.relanceJ9": "Follow-up D+9",
  "campagne.relanceJ14": "Follow-up D+14",
  "campagne.ajouterJ9": "Add a D+9 follow-up",
  "campagne.ajouterJ14": "Add a D+14 follow-up",
  "campagne.credit": "credit",
  "campagne.credits": "credits",
  "campagne.factureRappel":
    "Only the first message is charged. Any follow-ups cost nothing extra.",
  "campagne.lancer": "Launch the campaign",
  "campagne.creation": "Creating…",
  "campagne.suffixeObjet": "— subject",
  "campagne.suffixeCorps": "— body",

  // ── Campaign list ──
  "liste.vide": "No campaigns yet.",
  "liste.videDetail":
    "A campaign writes a message for each recipient based on their website, then sends it from your address, leaving a delay between each send.",
  "liste.creer": "Create a campaign",
  "liste.destinatairesSuffixe": " recipients",
  "liste.envoi": " send",
  "liste.envois": " sends",
  "liste.enEchec": "failed",
  "liste.creeeLe": "Created on",
  "liste.pause": "Pause",
  "liste.reprendre": "Resume sending",
  "liste.confirmerSuppression":
    "Permanently delete this campaign, its sending queue and its log?",
  "liste.suppression": "Deleting…",
  "liste.confirmer": "Confirm",
  "liste.annuler": "Cancel",
  "liste.supprimer": "Delete",
  "liste.chargementJournal": "Loading the log…",
  "liste.journalVide": "No send recorded for this campaign.",
  "liste.messageEnvoye": "Message sent",
  "liste.echec": "failed",
  "liste.repondu": "replied",
  "liste.envoye": "sent",
  "campagneStatut.brouillon": "Draft",
  "campagneStatut.active": "Active",
  "campagneStatut.pausee": "Paused",
  "campagneStatut.terminee": "Complete",
  "campagneStatut.annulee": "Cancelled",

  // ── Preview ──
  "apercu.construction": "Building…",
  "apercu.auHasard": "Random preview",

  // ── Message audit ──
  "audit.bouton": "Audit my message",
  "audit.enCours": "Analysing…",
  "audit.constats": "Findings measured on your text",
  "audit.critereAvant": "criteria out of",
  "audit.critereApres": "met",
  "audit.aFaire": "To do: ",
  "audit.parOuCommencer": "Where to start",
  "audit.versionCorrigee": "Corrected version",
  "audit.appliqueRemarques": "Applies the five remarks above.",
  "audit.objet": "Subject: ",
  "audit.appliquer": "Apply these corrections",
  "audit.reserve":
    "The numerical findings are measured on your text. The judgements come from the engine and rest on known practice, not on observing your recipients: only a comparative test will settle it.",
  "audit.respecte": "Met",
  "audit.ameliorable": "Could be better",
  "audit.manque": "Needs fixing",
  "audit.frictionAvant": "The message asks the reader to leave the email (",
  "audit.frictionApres": "): every extra step costs replies.",
  "audit.promesseChiffree": "Numerical promise: it makes the message read like an advert.",
  "audit.objetTronqueAvant": "Subject of",
  "audit.objetTronqueApres": "characters: cut off on phones beyond 60.",
  "audit.corpsLongAvant": "Message of",
  "audit.corpsLongApres": "words: beyond 120, it gets skimmed.",
  "audit.declencheurs": "Terms watched by filters:",
  "audit.aucuneQuestion": "No question: nothing invites the recipient to reply.",
  "audit.liensApres": "links: beyond a single one, deliverability suffers.",
  "audit.pasPersonnalise":
    "No opening variable: all your recipients receive the same text.",
  "audit.majuscules": "Subject with a high proportion of capitals.",
  "audit.exclamations": "exclamation marks.",

  // ── Message improvement ──
  "amelio.preparation": "Preparing the suggestion requested from your advice…",
  "amelio.reecrire": "Suggest an improved version",
  "amelio.reecritureEnCours": "Rewriting…",
  "amelio.autresObjets": "Suggest other subject lines",
  "amelio.rechercheObjets": "Searching…",
  "amelio.objetsTitre": "Other possible subject lines",
  "amelio.objetsDetail":
    "Three different angles. Change one every other campaign: it is the only way to learn what gets opened.",
  "amelio.redigezDabord": "Write a subject and a message first.",
  "amelio.troisAngles": "Three possible angles",
  "amelio.avecDiagnostic": "Written taking into account the results measured on your sends. ",
  "amelio.comparez":
    "Compare them: the choice is what will teach you what speaks to your prospects.",
  "amelio.conseille": "recommended",
  "amelio.mots": "words",
  "amelio.objet": "Subject: ",
  "amelio.aVerifier": "To check:",
  "amelio.utiliser": "Use this version",
  "amelio.changements": "What changes compared with your message",
  "amelio.garder": "Keep my message",
  "amelio.relisez": "Read it over before replacing: this message will go out from your address.",
  "amelio.alerteFriction": "asks the reader to leave the email",
  "amelio.alerteLong": "too long",
  "amelio.alerteObjetLong": "subject too long",
};
