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

  // ── Création de campagne ──
  "campagne.aucunScan": "Aucun scan disponible. Lancez d'abord une recherche depuis Radar.",
  "campagne.smtpAvant":
    "Renseignez votre serveur d'envoi dans Réglages avant de lancer une campagne.",
  "campagne.nom": "Nom de la campagne",
  "campagne.nomExemple": "Prospection chauffagistes Charleroi",
  "campagne.scanSource": "Scan source",
  "campagne.destinataires": "Destinataires",
  "campagne.aideQualifTitre": "Pourquoi filtrer par qualification",
  "campagne.aideQualifTexte":
    "Envoyer aux adresses introuvables nuit à la réputation de votre domaine : les serveurs finissent par vous classer en spam. Les qualifications fiables sont cochées d'office ; élargissez en connaissance de cause.",
  "campagne.qualifDefaut":
    "Les qualifications les plus fiables sont cochées par défaut. Élargissez pour augmenter le volume.",
  "campagne.aucuneAdresse": "Ce scan ne contient aucune adresse email exploitable.",
  "campagne.message": "Message",
  "campagne.objet": "Objet",
  "campagne.corps": "Corps du message",
  "campagne.modeleEnregistre": "Modèle enregistré",
  "campagne.enregistrerModele": "Enregistrer comme modèle par défaut",
  "campagne.origineAvant": "Modèle repris de «",
  "campagne.origineApres":
    "», votre campagne qui obtient le meilleur taux de réponse. Ajustez-le avant de lancer.",
  "campagne.activerRelances": "Activer les relances",
  "campagne.aideRelanceTitre": "Comment fonctionnent les relances",
  "campagne.aideRelanceTexte":
    "La relance J+4 part quatre jours après le premier message, et uniquement aux destinataires qui l'ont reçu sans répondre. J+9 et J+14 suivent la même logique en cascade. Les relances ne coûtent aucun crédit : seul le premier message est facturé.",
  "campagne.relanceDetail":
    "La relance part 4 jours après le premier message, et uniquement aux destinataires l'ayant reçu.",
  "campagne.relanceJ4": "Relance J+4",
  "campagne.relanceJ9": "Relance J+9",
  "campagne.relanceJ14": "Relance J+14",
  "campagne.ajouterJ9": "Ajouter une relance J+9",
  "campagne.ajouterJ14": "Ajouter une relance J+14",
  "campagne.credit": "crédit",
  "campagne.credits": "crédits",
  "campagne.factureRappel":
    "Seul le premier message est facturé. Les relances éventuelles ne coûtent rien de plus.",
  "campagne.lancer": "Lancer la campagne",
  "campagne.creation": "Création…",
  "campagne.suffixeObjet": "— objet",
  "campagne.suffixeCorps": "— corps",

  // ── Liste des campagnes ──
  "liste.vide": "Aucune campagne pour l'instant.",
  "liste.videDetail":
    "Une campagne écrit un message pour chaque destinataire à partir de son site, puis l'envoie depuis votre adresse, en respectant un délai entre chaque envoi.",
  "liste.creer": "Créer une campagne",
  "liste.destinatairesSuffixe": " destinataires",
  "liste.envoi": " envoi",
  "liste.envois": " envois",
  "liste.enEchec": "en échec",
  "liste.creeeLe": "Créée le",
  "liste.pause": "Mettre en pause",
  "liste.reprendre": "Reprendre les envois",
  "liste.confirmerSuppression":
    "Supprimer définitivement cette campagne, sa file d'envoi et son journal ?",
  "liste.suppression": "Suppression…",
  "liste.confirmer": "Confirmer",
  "liste.annuler": "Annuler",
  "liste.supprimer": "Supprimer",
  "liste.chargementJournal": "Chargement du journal…",
  "liste.journalVide": "Aucun envoi enregistré pour cette campagne.",
  "liste.messageEnvoye": "Message envoyé",
  "liste.echec": "échec",
  "liste.repondu": "répondu",
  "liste.envoye": "envoyé",
  "campagneStatut.brouillon": "Brouillon",
  "campagneStatut.active": "Active",
  "campagneStatut.pausee": "En pause",
  "campagneStatut.terminee": "Terminée",
  "campagneStatut.annulee": "Annulée",

  // ── Aperçu ──
  "apercu.construction": "Construction…",
  "apercu.auHasard": "Aperçu au hasard",

  // ── Audit du message ──
  "audit.bouton": "Auditer mon message",
  "audit.enCours": "Analyse en cours…",
  "audit.constats": "Constats mesurés sur votre texte",
  "audit.critereAvant": "critère(s) sur",
  "audit.critereApres": "respecté(s)",
  "audit.aFaire": "À faire : ",
  "audit.parOuCommencer": "Par quoi commencer",
  "audit.versionCorrigee": "Version corrigée",
  "audit.appliqueRemarques": "Applique les cinq remarques ci-dessus.",
  "audit.objet": "Objet : ",
  "audit.appliquer": "Appliquer ces corrections",
  "audit.reserve":
    "Les constats chiffrés sont mesurés sur votre texte. Les appréciations viennent du moteur et reposent sur les pratiques connues, pas sur l'observation de vos destinataires : seul un essai comparé tranchera.",
  "audit.respecte": "Respecté",
  "audit.ameliorable": "Améliorable",
  "audit.manque": "À corriger",
  "audit.frictionAvant": "Le message demande de sortir de l'email (",
  "audit.frictionApres": ") : chaque étape supplémentaire coûte des réponses.",
  "audit.promesseChiffree": "Promesse chiffrée : elle fait lire le message comme une publicité.",
  "audit.objetTronqueAvant": "Objet de",
  "audit.objetTronqueApres": "caractères : coupé sur téléphone au-delà de 60.",
  "audit.corpsLongAvant": "Message de",
  "audit.corpsLongApres": "mots : au-delà de 120, il se lit en diagonale.",
  "audit.declencheurs": "Termes surveillés par les filtres :",
  "audit.aucuneQuestion": "Aucune question : rien n'invite le destinataire à répondre.",
  "audit.liensApres": "liens : au-delà d'un seul, la délivrabilité se dégrade.",
  "audit.pasPersonnalise":
    "Pas de variable d'accroche : tous vos destinataires reçoivent le même texte.",
  "audit.majuscules": "Objet à forte proportion de majuscules.",
  "audit.exclamations": "points d'exclamation.",

  // ── Amélioration du message ──
  "amelio.preparation": "Préparation de la proposition demandée depuis vos conseils…",
  "amelio.reecrire": "Proposer une version améliorée",
  "amelio.reecritureEnCours": "Réécriture en cours…",
  "amelio.autresObjets": "Proposer d'autres objets",
  "amelio.rechercheObjets": "Recherche…",
  "amelio.objetsTitre": "Autres objets possibles",
  "amelio.objetsDetail":
    "Trois angles différents. Changez-en un sur deux entre vos campagnes : c'est la seule façon de savoir ce qui fait ouvrir.",
  "amelio.redigezDabord": "Rédigez d'abord un objet et un message.",
  "amelio.troisAngles": "Trois angles possibles",
  "amelio.avecDiagnostic": "Écrits en tenant compte des résultats mesurés sur vos envois. ",
  "amelio.comparez":
    "Comparez-les : c'est le choix qui vous apprendra ce qui parle à vos prospects.",
  "amelio.conseille": "conseillé",
  "amelio.mots": "mots",
  "amelio.objet": "Objet : ",
  "amelio.aVerifier": "À vérifier :",
  "amelio.utiliser": "Utiliser cette version",
  "amelio.changements": "Ce qui change par rapport à votre message",
  "amelio.garder": "Garder mon message",
  "amelio.relisez": "Relisez avant de remplacer : ce message partira de votre adresse.",
  "amelio.alerteFriction": "demande de sortir de l'email",
  "amelio.alerteLong": "trop long",
  "amelio.alerteObjetLong": "objet trop long",

  // ── Variables de personnalisation ──
  // Les jetons eux-mêmes ne sont jamais traduits : le moteur les
  // reconnaît à l'identique. Seule leur explication suit la langue.
  "variable.aide": "Insérez ces variables dans votre message : le moteur les remplace pour chaque destinataire.",
  "variable.prénom": "Prénom du décideur",
  "variable.entreprise": "Nom de l'entreprise",
  "variable.ICEBREAKER_IA": "Accroche rédigée à partir du site de l'entreprise",
  "variable.besoin_1": "Premier besoin détecté sur le site",
  "variable.besoin_2": "Deuxième besoin détecté sur le site",
  "variable.site": "Adresse du site de l'entreprise",
  "variable.signature": "Votre signature, définie dans Réglages",

  // ── Tableau de bord ──
  "accueil.eyebrow": "Tableau de bord",
  "accueil.bonjour": "Bonjour",
  "accueil.chasseEnCours": "Une chasse est en cours. Les résultats arriveront dans le Radar.",
  "accueil.derniereChasse": "Dernière chasse le",
  "accueil.aucuneChasse": "Aucune chasse pour l'instant.",
  "accueil.credits": "crédits disponibles",
  "accueil.entreprisesAnalysees": "entreprises analysées",
  "accueil.emailEnvoye": "email envoyé",
  "accueil.emailsEnvoyes": "emails envoyés",
  "accueil.reponseRecue": "réponse reçue",
  "accueil.reponsesRecues": "réponses reçues",
  "accueil.profilComplete": "profil complété",
  "accueil.chasseLancee": "chasse lancée",
  "accueil.chassesLancees": "chasses lancées",
  "accueil.campagneActive": "campagne active",
  "accueil.campagnesActives": "campagnes actives",
  "accueil.sur": "sur",
  "accueil.envoiEchec": "envoi en échec",
  "accueil.envoisEchec": "envois en échec",

  // ── Conseils du tableau de bord ──
  "conseils.titre": "Ce que je vous conseille",
  "conseils.rienADire": "Votre configuration ne présente aucun défaut détectable.",
  "conseils.suite":
    "La suite se joue sur le volume et la régularité : de nouvelles chasses, des envois étalés plutôt que groupés.",
  "conseils.faireMoiMeme": "Faire moi-même",
  "conseils.yAller": "Y aller",
  "conseils.reserve":
    "Ces conseils s'appuient sur vos données réelles. Les réponses sont détectées dans votre boîte ; les ouvertures ne sont pas mesurées, un pixel de suivi se payant en délivrabilité et en respect du destinataire.",
  "conseils.bloquant": "Bloquant",
  "conseils.aCorriger": "À corriger",
  "conseils.conseil": "Conseil",

  // ── Démarrage rapide ──
  "demarrage.titre": "Démarrage rapide",
  "demarrage.remplit":
    "Remplit le formulaire ci-dessous. Rien ne part tant que vous n'avez pas lancé la chasse.",
  "demarrage.chasserIdeaux": "Chasser mes clients idéaux",
  "demarrage.analyseProfil": "Analyse de votre profil…",
  "demarrage.deduits": "Métiers et zones déduits de votre profil d'entreprise.",
  "demarrage.formulaireRempli":
    "Le formulaire ci-dessous est rempli. Relisez-le, ajustez, puis lancez la chasse en bas de page.",
  "demarrage.pourquoi": "Pourquoi ces métiers et ces zones ?",
  "demarrage.ouSecteur": "Ou partez d'un secteur",

  // ── Aperçu d'exemple ──
  "exemple.aucuneChasse": "Aucune chasse pour l'instant.",
  "exemple.forme":
    "Voici la forme d'un résultat : entreprise, décideur, email vérifié, note de pertinence et accroche rédigée depuis leur site. Ces deux lignes sont fictives.",
  "exemple.societe1": "Chauffage & Sanitaire (exemple)",
  "exemple.contact1": "Prénom Nom · Gérant",
  "exemple.accroche1":
    "Votre page « primes énergie » cite encore le barème de l'an dernier — un signal simple à ouvrir en premier contact.",
  "exemple.societe2": "Toiture régionale (exemple)",
  "exemple.contact2": "Prénom Nom · Responsable devis",
  "exemple.accroche2":
    "Trois avis récents mentionnent le délai de réponse aux demandes de devis.",
} as const;

export type Traductions = Record<keyof typeof fr, string>;
