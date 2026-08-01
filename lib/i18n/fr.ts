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

  // ── Inscription ──
  "inscription.eyebrow": "Inscription",
  "inscription.titre": "Créez votre compte",
  "inscription.sousTitre": "50 crédits vous sont offerts pour démarrer.",
  "inscription.email": "Adresse email professionnelle",
  "inscription.motDePasse": "Mot de passe",
  "inscription.longueurMini": "8 caractères minimum",
  "inscription.societe": "Société",
  "inscription.adresse": "Adresse, facultatif",
  "inscription.tva": "Numéro de TVA, facultatif",
  "inscription.valider": "Créer mon compte",
  "inscription.enCours": "Création…",
  "inscription.dejaInscrit": "Déjà inscrit ?",
  "inscription.seConnecter": "Connectez-vous",

  // ── Mot de passe oublié ──
  "oubli.eyebrow": "Mot de passe",
  "oubli.titre": "Mot de passe oublié",
  "oubli.consigne":
    "Indiquez votre adresse : vous recevrez un lien pour en choisir un nouveau.",
  "oubli.champEmail": "Adresse email",
  "oubli.valider": "Recevoir le lien",
  "oubli.enCours": "Envoi…",
  "oubli.envoye":
    "Si un compte existe pour cette adresse, un lien vient d'être envoyé. Il reste valable une heure.",
  "oubli.indesirables": "Pensez à regarder dans les indésirables si rien n'arrive.",
  "oubli.retour": "Retour à la connexion",

  // ── Pied de page ──
  "pied.mentions": "Mentions légales",
  "pied.cgu": "Conditions d'utilisation",
  "pied.confidentialite": "Politique de confidentialité",
  "pied.marque": "Marque déposée BOIP n°160599",
  "pied.legal": "Informations légales",

  // ── Radar ──
  "radar.eyebrow": "Radar",
  "radar.titre": "Lancer une chasse",
  "radar.intro":
    "Indiquez un métier et une zone. Le moteur identifie les entreprises, cherche le décideur, vérifie son email et rédige une accroche à partir de leur site. Le résultat devient un fichier, consultable dans Exports.",
  "radar.termine": "Chasse terminée.",
  "radar.termineDetail": "Votre fichier vous attend dans Exports.",
  "radar.voirResultats": "Voir les résultats",

  // Chasse en cours
  "radar.entreprisesAnalysees": "entreprises analysées",
  "radar.arreter": "Arrêter",
  "radar.peutFermer": "Vous pouvez fermer cette page : la chasse continue sur nos serveurs.",
  "radar.optionsIndisponibles": "Impossible de charger les options de recherche.",
  "radar.reessayer": "Réessayer",

  // Étape 1
  "radar.etape1Titre": "Qui cherchez-vous ?",
  "radar.etape1Detail":
    "Un métier par entrée. Préférez « couvreur » à « bâtiment » : les termes larges ramènent des annuaires, les métiers ramènent des entreprises.",
  "radar.metiers": "Métiers ou mots-clés",
  "radar.metiersExemple": "chauffagiste, plombier, couvreur…",
  "radar.ajouter": "Ajouter",
  "radar.proposerMetiers": "Proposer des métiers proches",
  "radar.recherche": "Recherche…",

  // Étape 2
  "radar.etape2Titre": "Où chercher ?",
  "radar.etape2Detail":
    "Chaque métier sera cherché dans chaque ville. Deux métiers et trois villes font six recherches — commencez petit pour juger la qualité.",
  "radar.pays": "Pays",
  "radar.mode": "Mode de recherche",
  "radar.villes": "Villes",
  "radar.zones": "Codes postaux ou communes, séparés par des virgules",
  "radar.zonesExemple": "6180, 7100, Trazegnies",

  // Étape 3
  "radar.etape3Titre": "Réglages",
  "radar.etape3Detail": "Facultatif. Les valeurs par défaut conviennent à une première chasse.",
  "radar.resultatsPar": "Résultats par mot-clé et par lieu :",
  "radar.mapsLimite": "— Maps est limité à",
  "radar.nomFichier": "Nom du fichier, facultatif",
  "radar.nomFichierExemple": "chauffagistes_hainaut",
  "radar.chercherTel": "Chercher aussi les numéros de téléphone",
  "radar.chercherTelCout": "(+10 crédits par numéro trouvé)",
  "radar.sansSite": "Vérifier l'absence de site web",

  // Récapitulatif
  "radar.incomplet": "Ajoutez au moins un métier et une zone pour lancer.",
  "radar.metierSingulier": "métier",
  "radar.metierPluriel": "métiers",
  "radar.zoneSingulier": "zone",
  "radar.zonePluriel": "zones",
  "radar.resultats": "résultats",
  "radar.recherches": "recherches",
  "radar.coutRappel":
    "Un crédit par entreprise dont l'email est vérifié. Les entreprises sans adresse ne sont jamais facturées.",
  "radar.lancer": "Lancer la chasse",
  "radar.dejaEnCours": "Une chasse est en cours",
  "radar.vosChasses": "Vos chasses",

  // Statuts de chasse
  "scan.en_attente": "En attente",
  "scan.en_cours": "En cours",
  "scan.annulation_demandee": "Annulation demandée",
  "scan.termine": "Terminée",
  "scan.erreur": "Échec",

  // ── Historique des chasses ──
  "histo.chasse": "Chasse",
  "histo.analysees": "analysées",
  "histo.relancer": "Relancer avec les mêmes réglages",
  "histo.telecharger": "Télécharger le fichier",
  "histo.fichierIndisponible":
    "Ce fichier n'est plus disponible. Relancez la chasse pour le régénérer.",

  // ── Outreach ──
  "outreach.eyebrow": "Outreach",
  "outreach.titre": "Vos campagnes d'emails",
  "outreach.smtpManquant":
    "Aucun serveur d'envoi configuré. Renseignez vos accès dans Réglages avant de lancer une campagne.",
  "outreach.ongletCampagnes": "Campagnes",
  "outreach.ongletCreation": "Nouvelle campagne",
  "outreach.ongletReglages": "Réglages",
  "outreach.creeeAvant": "Campagne créée :",
  "outreach.destinataire": "destinataire",
  "outreach.destinataires": "destinataires",
  "outreach.creeeApres": "en file d'envoi.",

  // ── Serveur d'envoi (SMTP) ──
  "smtp.titre": "Serveur d'envoi",
  "smtp.chiffre": "Le mot de passe est chiffré avant d'être stocké.",
  "smtp.fournisseur": "Fournisseur",
  "smtp.personnalise": "Personnalisé",
  "smtp.hote": "Serveur SMTP",
  "smtp.port": "Port",
  "smtp.expedition": "Adresse d'expédition",
  "smtp.expeditionExemple": "vous@exemple.com",
  "smtp.motDePasse": "Mot de passe",
  "smtp.motDePasseConserver": " — laissez vide pour conserver l'actuel",
  "smtp.gmail": "Sur Gmail, utilisez un mot de passe d'application, pas celui du compte.",
  "smtp.signature": "Signature",
  "smtp.rythme": "Rythme d'envoi",
  "smtp.delaiMin": "Délai minimum",
  "smtp.delaiReel": "Réel :",
  "smtp.debut": "Début",
  "smtp.fin": "Fin",
  "smtp.jours": "Jours d'envoi",
  "smtp.enregistrer": "Enregistrer",
  "smtp.enregistrement": "Enregistrement…",
  "smtp.enregistre": "Configuration enregistrée",
  "smtp.errExpedition": "Renseignez l'adresse d'expédition.",
  "smtp.errMotDePasse": "Le mot de passe est requis pour la première configuration.",
  "smtp.errJour": "Choisissez au moins un jour d'envoi.",
  "smtp.errHeures": "L'heure de début doit précéder l'heure de fin.",
  "jour.0": "Lun",
  "jour.1": "Mar",
  "jour.2": "Mer",
  "jour.3": "Jeu",
  "jour.4": "Ven",
  "jour.5": "Sam",
  "jour.6": "Dim",
} as const;

export type Traductions = Record<keyof typeof fr, string>;
