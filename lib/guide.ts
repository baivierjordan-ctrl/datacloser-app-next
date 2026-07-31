/**
 * Contenu du mode d'emploi.
 *
 * Séparé de l'affichage : c'est un texte qui vivra et se corrigera au
 * fil des retours d'utilisateurs, sans qu'on ait à toucher au rendu.
 *
 * Principe d'écriture : chaque section répond à une question qu'on se
 * pose vraiment, et nomme le piège plutôt que de décrire le bouton. Un
 * utilisateur qui lit « cliquez sur Lancer » n'apprend rien ; celui qui
 * lit « les termes larges ramènent des annuaires » évite une chasse
 * perdue.
 */

export interface Passage {
  titre?: string;
  texte?: string;
  points?: string[];
  attention?: string;
}

export interface SectionGuide {
  cle: string;
  titre: string;
  resume: string;
  passages: Passage[];
}

export const SECTIONS: SectionGuide[] = [
  {
    cle: "principe",
    titre: "Le principe en trois temps",
    resume: "Ce que fait DataCloser, et dans quel ordre.",
    passages: [
      {
        texte:
          "DataCloser cherche des entreprises correspondant à votre cible, trouve la personne à contacter et son adresse email, puis rédige pour chacune un message personnalisé à partir de son propre site.",
      },
      {
        titre: "1. Vous décrivez votre activité",
        texte:
          "Dans Mon entreprise, vous indiquez ce que vous vendez et à qui. Le moteur s'en sert pour noter la pertinence de chaque entreprise trouvée. Sans ce profil, il note à l'aveugle et vos crédits partent sur des entreprises hors cible.",
      },
      {
        titre: "2. Vous lancez une chasse",
        texte:
          "Dans le Radar, vous indiquez un métier et une zone. Le moteur identifie les entreprises, cherche le décideur, vérifie son adresse email et rédige une accroche. Le résultat devient un fichier.",
      },
      {
        titre: "3. Vous envoyez une campagne",
        texte:
          "Dans Outreach, vous rédigez un modèle de message. Chaque destinataire reçoit une version personnalisée, envoyée depuis votre propre adresse, avec un délai entre chaque envoi.",
      },
    ],
  },
  {
    cle: "vocabulaire",
    titre: "Le vocabulaire",
    resume: "Cinq mots à connaître pour lire l'application.",
    passages: [
      {
        titre: "Crédit",
        texte:
          "L'unité de consommation. Un crédit est débité par entreprise dont l'email est vérifié lors d'une chasse, et un crédit par email réellement envoyé. Les entreprises sans adresse exploitable ne sont jamais facturées. Les crédits n'expirent pas.",
      },
      {
        titre: "Qualification de l'email",
        texte:
          "Le niveau de confiance dans une adresse. Vérifié : le serveur du destinataire a confirmé qu'elle existe. Catch-all : le serveur accepte tout, impossible de confirmer sans envoyer. Introuvable : aucune adresse fiable, l'entreprise est exclue des campagnes.",
      },
      {
        titre: "Score de pertinence",
        texte:
          "Une note sur dix attribuée par le moteur d'après votre profil. Elle mesure l'adéquation avec votre cible, pas la qualité de l'entreprise.",
      },
      {
        titre: "Accroche",
        texte:
          "Une phrase écrite pour chaque destinataire à partir de son site — une page datée, un délai mentionné dans les avis, une zone non couverte. C'est elle qui distingue votre message d'un envoi de masse.",
      },
      {
        titre: "Chasse",
        texte:
          "Une recherche lancée dans le Radar. Elle tourne sur nos serveurs : vous pouvez fermer la page, elle continue.",
      },
    ],
  },
  {
    cle: "chasse",
    titre: "Réussir une chasse",
    resume: "Le choix des mots-clés détermine tout le reste.",
    passages: [
      {
        titre: "Cherchez un métier, pas un secteur",
        texte:
          "« Couvreur » ramène des entreprises. « Bâtiment » ramène des annuaires, des places de marché et des fédérations — dont aucun n'est un prospect. C'est la cause la plus fréquente d'une chasse décevante.",
      },
      {
        titre: "Commencez petit",
        texte:
          "Deux ou trois métiers, une ou deux villes. Vous jugerez la qualité du ciblage avant d'engager davantage. Chaque métier est cherché dans chaque zone : trois métiers et quatre villes font douze recherches.",
      },
      {
        titre: "Choisissez le bon mode",
        texte:
          "Google Maps convient aux métiers ancrés localement, qui ont une adresse physique — artisans, commerces, cabinets. Google Search convient aux activités dispersées ou purement en ligne — agences, éditeurs de logiciel, conseil.",
      },
      {
        attention:
          "Si plus de 40 % des entreprises d'une chasse n'ont aucune adresse exploitable, vos mots-clés sont trop larges. L'accueil vous le signale automatiquement.",
      },
      {
        titre: "Deux raccourcis",
        points: [
          "Chasser mes clients idéaux : le moteur déduit métiers et zones de votre profil d'entreprise.",
          "Les secteurs prêts à l'emploi remplissent le formulaire en un clic, avec le mode adapté.",
          "Aucun des deux ne lance la chasse : vous relisez, vous ajustez, vous décidez.",
        ],
      },
    ],
  },
  {
    cle: "campagne",
    titre: "Envoyer sans abîmer votre réputation",
    resume: "La délivrabilité se joue avant le premier envoi.",
    passages: [
      {
        titre: "Connectez votre propre adresse",
        texte:
          "Les messages partent de votre boîte, pas de la nôtre. C'est ce qui les fait arriver en boîte de réception plutôt qu'en indésirables — et ce qui permet à vos prospects de vous répondre directement.",
      },
      {
        titre: "Montez en puissance progressivement",
        texte:
          "Un domaine qui n'a jamais envoyé de volume et qui expédie soudain trois cents messages sera classé en spam. Comptez une vingtaine d'envois par jour la première semaine, puis augmentez graduellement.",
      },
      {
        titre: "N'écrivez pas aux introuvables",
        texte:
          "Chaque message envoyé à une adresse inexistante dégrade la réputation de votre domaine. Les qualifications fiables sont cochées d'office : élargissez seulement en connaissance de cause.",
      },
      {
        titre: "Utilisez l'accroche personnalisée",
        texte:
          "La variable d'accroche insère la phrase écrite pour ce destinataire. Sans elle, tous vos messages sont identiques — c'est le premier signal que repèrent les filtres anti-spam.",
      },
      {
        titre: "Relancez avec mesure",
        texte:
          "Les relances partent à J+4, J+9 et J+14, uniquement aux destinataires qui n'ont pas répondu. Chaque relance envoyée coûte un crédit, comme un message normal.",
      },
      {
        attention:
          "Servez-vous de l'aperçu avant de lancer. Il construit le message tel qu'il partira, sur un destinataire réel, et vous pouvez faire défiler les leads un par un.",
      },
    ],
  },
  {
    cle: "resultats",
    titre: "Exploiter vos résultats",
    resume: "Le fichier, sa lecture, et le passage vers votre CRM.",
    passages: [
      {
        texte:
          "Chaque chasse produit un fichier dans Exports. Consulter l'ouvre en entier, avec toutes ses colonnes et un filtre sur n'importe laquelle d'entre elles. Télécharger vous donne le CSV, ouvrable dans un tableur.",
      },
      {
        titre: "Envoi automatique vers votre outil",
        texte:
          "L'onglet Connexion CRM accepte une adresse de webhook fournie par Make, Zapier, n8n ou votre CRM. Vos leads y sont envoyés au format JSON, sans passer par un fichier.",
      },
      {
        titre: "Suivre une campagne",
        texte:
          "Le journal d'une campagne liste chaque envoi. Dépliez une ligne pour voir le message exact reçu par ce prospect, ou le détail de l'erreur en cas d'échec.",
      },
    ],
  },
  {
    cle: "limites",
    titre: "Ce que DataCloser ne fait pas",
    resume: "Mieux vaut le savoir avant que le découvrir.",
    passages: [
      {
        titre: "Il ne mesure ni les ouvertures ni les réponses",
        texte:
          "L'application sait qu'un message est parti, pas ce qu'il est devenu. Les réponses arrivent dans votre boîte mail : c'est là qu'il faut les suivre. Aucun conseil de l'application ne prétend donc juger l'efficacité de vos messages, seulement votre configuration.",
      },
      {
        titre: "Il ne garantit pas une adresse pour chaque entreprise",
        texte:
          "Certaines entreprises n'exposent aucune adresse exploitable. Elles apparaissent comme introuvables et ne vous coûtent rien.",
      },
      {
        titre: "Il n'écrit pas à votre place sans contrôle",
        texte:
          "Le moteur rédige les accroches, vous écrivez le message. L'aperçu existe pour que rien ne parte sans que vous l'ayez lu.",
      },
    ],
  },
  {
    cle: "rgpd",
    titre: "Prospection et RGPD",
    resume: "Ce qui est prévu, et ce qui reste à votre charge.",
    passages: [
      {
        texte:
          "La prospection B2B est autorisée en Belgique et en France, à condition que le message concerne l'activité professionnelle du destinataire, que l'origine des données soit indiquée, et qu'un moyen de refus soit offert.",
      },
      {
        titre: "Ce que l'application fait pour vous",
        points: [
          "Chaque email inclut automatiquement la source des données et un lien de désinscription.",
          "Un en-tête technique de désinscription est ajouté, reconnu par les messageries.",
          "Toute désinscription bloque définitivement l'adresse, y compris pour vos campagnes futures.",
        ],
      },
      {
        attention:
          "Ce qui reste à votre charge : écrire des messages qui concernent réellement l'activité professionnelle du destinataire, et répondre aux demandes d'information sur vos données. Ce mode d'emploi n'est pas un avis juridique.",
      },
    ],
  },
];
