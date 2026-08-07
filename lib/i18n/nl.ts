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

  // ── Registratie ──
  "inscription.eyebrow": "Registratie",
  "inscription.titre": "Maak uw account aan",
  "inscription.sousTitre": "U krijgt 50 credits om te starten.",
  "inscription.email": "Zakelijk e-mailadres",
  "inscription.motDePasse": "Wachtwoord",
  "inscription.longueurMini": "Minimaal 8 tekens",
  "inscription.societe": "Onderneming",
  "inscription.adresse": "Adres, optioneel",
  "inscription.tva": "Btw-nummer, optioneel",
  "inscription.valider": "Account aanmaken",
  "inscription.enCours": "Bezig met aanmaken…",
  "inscription.dejaInscrit": "Al geregistreerd?",
  "inscription.seConnecter": "Meld u aan",

  // ── Wachtwoord vergeten ──
  "oubli.eyebrow": "Wachtwoord",
  "oubli.titre": "Wachtwoord vergeten",
  "oubli.consigne":
    "Vul uw e-mailadres in: u ontvangt een link om een nieuw wachtwoord te kiezen.",
  "oubli.champEmail": "E-mailadres",
  "oubli.valider": "Link ontvangen",
  "oubli.enCours": "Bezig met verzenden…",
  "oubli.envoye":
    "Als er een account voor dit adres bestaat, is er zojuist een link verstuurd. Die blijft één uur geldig.",
  "oubli.indesirables": "Kijk ook in uw ongewenste e-mail als er niets binnenkomt.",
  "oubli.retour": "Terug naar aanmelden",

  // ── Voettekst ──
  "pied.mentions": "Wettelijke vermeldingen",
  "pied.cgu": "Gebruiksvoorwaarden",
  "pied.confidentialite": "Privacybeleid",
  "pied.marque": "Gedeponeerd merk BOIP nr. 160599",
  "pied.legal": "Juridische informatie",

  // ── Radar ──
  "radar.eyebrow": "Radar",
  "radar.titre": "Een scan starten",
  "radar.intro":
    "Geef een beroep en een gebied op. De engine spoort de ondernemingen op, zoekt de beslisser, verifieert zijn e-mailadres en schrijft een openingszin op basis van hun website. Het resultaat wordt een bestand, raadpleegbaar bij Exports.",
  "radar.termine": "Scan voltooid.",
  "radar.termineDetail": "Uw bestand staat klaar bij Exports.",
  "radar.voirResultats": "Resultaten bekijken",

  // Lopende scan
  "radar.entreprisesAnalysees": "geanalyseerde ondernemingen",
  "radar.arreter": "Stoppen",
  "radar.peutFermer": "U mag deze pagina sluiten: de scan loopt door op onze servers.",
  "radar.optionsIndisponibles": "De zoekopties konden niet worden geladen.",
  "radar.reessayer": "Opnieuw proberen",

  // Stap 1
  "radar.etape1Titre": "Wie zoekt u?",
  "radar.etape1Detail":
    "Eén beroep per invoer. Kies liever « dakdekker » dan « bouw »: brede termen leveren gidsen op, beroepen leveren ondernemingen op.",
  "radar.metiers": "Beroepen of trefwoorden",
  "radar.metiersExemple": "verwarmingsinstallateur, loodgieter, dakdekker…",
  "radar.ajouter": "Toevoegen",
  "radar.proposerMetiers": "Verwante beroepen voorstellen",
  "radar.recherche": "Bezig met zoeken…",

  // Stap 2
  "radar.etape2Titre": "Waar zoeken?",
  "radar.etape2Detail":
    "Elk beroep wordt in elke stad gezocht. Twee beroepen en drie steden geven zes zoekopdrachten — begin klein om de kwaliteit te beoordelen.",
  "radar.pays": "Land",
  "radar.mode": "Zoekmodus",
  "radar.villes": "Steden",
  "radar.zones": "Postcodes of gemeenten, gescheiden door komma's",
  "radar.zonesExemple": "6180, 7100, Trazegnies",

  // Stap 3
  "radar.etape3Titre": "Instellingen",
  "radar.etape3Detail": "Optioneel. De standaardwaarden volstaan voor een eerste scan.",
  "radar.resultatsPar": "Resultaten per trefwoord en per locatie:",
  "radar.mapsLimite": "— Maps is beperkt tot",
  "radar.nomFichier": "Bestandsnaam, optioneel",
  "radar.nomFichierExemple": "verwarmingsinstallateurs_henegouwen",
  "radar.chercherTel": "Ook telefoonnummers zoeken",
  "radar.chercherTelCout": "(+10 credits per gevonden nummer)",
  "radar.sansSite": "Controleren of er geen website is",

  // Overzicht
  "radar.incomplet": "Voeg minstens één beroep en één gebied toe om te starten.",
  "radar.metierSingulier": "beroep",
  "radar.metierPluriel": "beroepen",
  "radar.zoneSingulier": "gebied",
  "radar.zonePluriel": "gebieden",
  "radar.resultats": "resultaten",
  "radar.recherches": "zoekopdrachten",
  "radar.coutRappel":
    "Eén credit per onderneming met een geverifieerd e-mailadres. Ondernemingen zonder adres worden nooit aangerekend.",
  "radar.lancer": "Scan starten",
  "radar.dejaEnCours": "Er loopt al een scan",
  "radar.vosChasses": "Uw scans",

  // Statussen
  "scan.en_attente": "In wachtrij",
  "scan.en_cours": "Bezig",
  "scan.annulation_demandee": "Annulering gevraagd",
  "scan.termine": "Voltooid",
  "scan.erreur": "Mislukt",

  // ── Overzicht scans ──
  "histo.chasse": "Scan",
  "histo.analysees": "geanalyseerd",
  "histo.relancer": "Opnieuw uitvoeren met dezelfde instellingen",
  "histo.telecharger": "Bestand downloaden",
  "histo.fichierIndisponible":
    "Dit bestand is niet meer beschikbaar. Voer de scan opnieuw uit om het aan te maken.",

  // ── Outreach ──
  "outreach.eyebrow": "Outreach",
  "outreach.titre": "Uw e-mailcampagnes",
  "outreach.smtpManquant":
    "Er is geen verzendserver ingesteld. Vul uw gegevens in bij Instellingen voordat u een campagne start.",
  "outreach.ongletCampagnes": "Campagnes",
  "outreach.ongletCreation": "Nieuwe campagne",
  "outreach.ongletReglages": "Instellingen",
  "outreach.creeeAvant": "Campagne aangemaakt:",
  "outreach.destinataire": "ontvanger",
  "outreach.destinataires": "ontvangers",
  "outreach.creeeApres": "in de verzendwachtrij.",

  // ── Verzendserver (SMTP) ──
  "smtp.titre": "Verzendserver",
  "smtp.chiffre": "Het wachtwoord wordt versleuteld voordat het wordt opgeslagen.",
  "smtp.fournisseur": "Provider",
  "smtp.personnalise": "Aangepast",
  "smtp.hote": "SMTP-server",
  "smtp.port": "Poort",
  "smtp.expedition": "Afzendadres",
  "smtp.expeditionExemple": "u@voorbeeld.com",
  "smtp.motDePasse": "Wachtwoord",
  "smtp.motDePasseConserver": " — laat leeg om het huidige te behouden",
  "smtp.gmail": "Gebruik bij Gmail een app-wachtwoord, niet dat van uw account.",
  "smtp.signature": "Handtekening",
  "smtp.rythme": "Verzendritme",
  "smtp.delaiMin": "Minimale wachttijd",
  "smtp.delaiReel": "Werkelijk:",
  "smtp.debut": "Van",
  "smtp.fin": "Tot",
  "smtp.jours": "Verzenddagen",
  "smtp.enregistrer": "Opslaan",
  "smtp.enregistrement": "Bezig met opslaan…",
  "smtp.enregistre": "Configuratie opgeslagen",
  "smtp.errExpedition": "Vul het afzendadres in.",
  "smtp.errMotDePasse": "Het wachtwoord is vereist bij de eerste configuratie.",
  "smtp.errJour": "Kies minstens één verzenddag.",
  "smtp.errHeures": "Het beginuur moet vóór het einduur liggen.",
  "jour.0": "Ma",
  "jour.1": "Di",
  "jour.2": "Wo",
  "jour.3": "Do",
  "jour.4": "Vr",
  "jour.5": "Za",
  "jour.6": "Zo",

  // ── Campagne aanmaken ──
  "campagne.aucunScan": "Geen scan beschikbaar. Voer eerst een scan uit via Radar.",
  "campagne.smtpAvant":
    "Vul uw verzendserver in bij Instellingen voordat u een campagne start.",
  "campagne.nom": "Naam van de campagne",
  "campagne.nomExemple": "Prospectie verwarmingsinstallateurs Charleroi",
  "campagne.scanSource": "Bronbestand",
  "campagne.demoActiver": "Een gepersonaliseerde demonstratielink toevoegen",
  "campagne.demoDetail": "Elke ontvanger krijgt een link naar drie van zijn eigen prospects, al gevonden door de motor. U hoeft niets voor te bereiden.",
  "campagne.demoAttente": "De campagne blijft gepauzeerd terwijl de links worden voorbereid (ongeveer 30 minuten voor 100 ontvangers). Daarna kunt u ze activeren.",
  "campagne.demoBloc": "Ik heb mijn motor op uw markt losgelaten: hier zijn drie bedrijven die passen bij uw typische klanten → {{lien_demo}}",
  "campagne.aideDemoTitre": "Waarvoor dient deze link?",
  "campagne.aideDemoTexte": "Vóór verzending leest de motor de website van elke ontvanger, leidt daaruit af wie zijn klanten zijn en zoekt echte overeenkomende bedrijven. De link opent een pagina die ze meteen toont. Een ontvanger zonder bruikbare website krijgt dezelfde e-mail, zonder die zin.",
  "demos.enCours": "Demonstratielinks worden voorbereid",
  "demos.termine": "Demonstratielinks klaar",
  "demos.echec": "De voorbereiding is onderbroken",
  "demos.prets": "klaar",
  "demos.illisibles": "onleesbare website(s)",
  "demos.patience": "U kunt deze pagina sluiten: de voorbereiding loopt door op de server.",
  "demos.activerMaintenant": "U kunt de campagne activeren.",
  "demos.reprendre": "Voorbereiding hervatten",
  "campagne.destinataires": "Ontvangers",
  "campagne.aideQualifTitre": "Waarom filteren op kwalificatie",
  "campagne.aideQualifTexte":
    "Verzenden naar onvindbare adressen schaadt de reputatie van uw domein: servers merken u uiteindelijk aan als spam. De betrouwbare kwalificaties staan standaard aangevinkt; verruim met kennis van zaken.",
  "campagne.qualifDefaut":
    "De meest betrouwbare kwalificaties staan standaard aangevinkt. Verruim om het volume te verhogen.",
  "campagne.aucuneAdresse": "Deze scan bevat geen bruikbaar e-mailadres.",
  "campagne.message": "Bericht",
  "campagne.objet": "Onderwerp",
  "campagne.corps": "Berichttekst",
  "campagne.modeleEnregistre": "Sjabloon opgeslagen",
  "campagne.enregistrerModele": "Opslaan als standaardsjabloon",
  "campagne.origineAvant": "Sjabloon overgenomen van «",
  "campagne.origineApres":
    "», uw campagne met het hoogste antwoordpercentage. Pas het aan voordat u start.",
  "campagne.activerRelances": "Herinneringen inschakelen",
  "campagne.aideRelanceTitre": "Hoe herinneringen werken",
  "campagne.aideRelanceTexte":
    "De herinnering D+4 vertrekt vier dagen na het eerste bericht, en uitsluitend naar ontvangers die het hebben ontvangen zonder te antwoorden. D+9 en D+14 volgen dezelfde cascadelogica. Herinneringen kosten geen credits: enkel het eerste bericht wordt aangerekend.",
  "campagne.relanceDetail":
    "De herinnering vertrekt 4 dagen na het eerste bericht, en uitsluitend naar wie het heeft ontvangen.",
  "campagne.relanceJ4": "Herinnering D+4",
  "campagne.relanceJ9": "Herinnering D+9",
  "campagne.relanceJ14": "Herinnering D+14",
  "campagne.ajouterJ9": "Een herinnering D+9 toevoegen",
  "campagne.ajouterJ14": "Een herinnering D+14 toevoegen",
  "campagne.credit": "credit",
  "campagne.credits": "credits",
  "campagne.factureRappel":
    "Enkel het eerste bericht wordt aangerekend. Eventuele herinneringen kosten niets extra.",
  "campagne.lancer": "Campagne starten",
  "campagne.creation": "Bezig met aanmaken…",
  "campagne.suffixeObjet": "— onderwerp",
  "campagne.suffixeCorps": "— tekst",

  // ── Campagnelijst ──
  "liste.vide": "Nog geen campagnes.",
  "liste.videDetail":
    "Een campagne schrijft voor elke ontvanger een bericht op basis van zijn website en verstuurt het vanaf uw adres, met een wachttijd tussen elke verzending.",
  "liste.creer": "Een campagne aanmaken",
  "liste.destinatairesSuffixe": " ontvangers",
  "liste.envoi": " verzending",
  "liste.envois": " verzendingen",
  "liste.enEchec": "mislukt",
  "liste.creeeLe": "Aangemaakt op",
  "liste.pause": "Pauzeren",
  "liste.activer": "Activeren",
  "liste.reprendre": "Verzendingen hervatten",
  "liste.confirmerSuppression":
    "Deze campagne, haar verzendwachtrij en haar logboek definitief verwijderen?",
  "liste.suppression": "Bezig met verwijderen…",
  "liste.confirmer": "Bevestigen",
  "liste.annuler": "Annuleren",
  "liste.supprimer": "Verwijderen",
  "liste.chargementJournal": "Logboek wordt geladen…",
  "liste.journalVide": "Geen verzending geregistreerd voor deze campagne.",
  "liste.messageEnvoye": "Verzonden bericht",
  "liste.echec": "mislukt",
  "liste.repondu": "beantwoord",
  "liste.envoye": "verzonden",
  "campagneStatut.brouillon": "Concept",
  "campagneStatut.active": "Actief",
  "campagneStatut.pausee": "Gepauzeerd",
  "campagneStatut.terminee": "Voltooid",
  "campagneStatut.annulee": "Geannuleerd",

  // ── Voorbeeld ──
  "apercu.construction": "Bezig met opbouwen…",
  "apercu.auHasard": "Willekeurig voorbeeld",

  // ── Berichtaudit ──
  "audit.bouton": "Mijn bericht auditen",
  "audit.enCours": "Bezig met analyseren…",
  "audit.constats": "Vaststellingen gemeten op uw tekst",
  "audit.critereAvant": "criterium/criteria op",
  "audit.critereApres": "nageleefd",
  "audit.aFaire": "Te doen: ",
  "audit.parOuCommencer": "Waarmee beginnen",
  "audit.versionCorrigee": "Gecorrigeerde versie",
  "audit.appliqueRemarques": "Past de vijf bovenstaande opmerkingen toe.",
  "audit.objet": "Onderwerp: ",
  "audit.appliquer": "Deze correcties toepassen",
  "audit.reserve":
    "De becijferde vaststellingen zijn op uw tekst gemeten. De beoordelingen komen van de engine en berusten op bekende praktijken, niet op waarnemingen bij uw ontvangers: alleen een vergelijkende test geeft uitsluitsel.",
  "audit.respecte": "Nageleefd",
  "audit.ameliorable": "Voor verbetering vatbaar",
  "audit.manque": "Te corrigeren",
  "audit.frictionAvant": "Het bericht vraagt om de e-mail te verlaten (",
  "audit.frictionApres": "): elke extra stap kost antwoorden.",
  "audit.promesseChiffree": "Becijferde belofte: daardoor leest het bericht als reclame.",
  "audit.objetTronqueAvant": "Onderwerp van",
  "audit.objetTronqueApres": "tekens: op een telefoon afgekapt boven 60.",
  "audit.corpsLongAvant": "Bericht van",
  "audit.corpsLongApres": "woorden: boven 120 wordt het diagonaal gelezen.",
  "audit.declencheurs": "Termen die filters in de gaten houden:",
  "audit.aucuneQuestion": "Geen enkele vraag: niets nodigt de ontvanger uit om te antwoorden.",
  "audit.liensApres": "links: boven één enkele gaat de afleverbaarheid achteruit.",
  "audit.pasPersonnalise":
    "Geen openingsvariabele: al uw ontvangers krijgen dezelfde tekst.",
  "audit.majuscules": "Onderwerp met een hoog aandeel hoofdletters.",
  "audit.exclamations": "uitroeptekens.",

  // ── Bericht verbeteren ──
  "amelio.preparation": "Het gevraagde voorstel wordt voorbereid vanuit uw advies…",
  "amelio.reecrire": "Een verbeterde versie voorstellen",
  "amelio.reecritureEnCours": "Bezig met herschrijven…",
  "amelio.autresObjets": "Andere onderwerpen voorstellen",
  "amelio.rechercheObjets": "Bezig met zoeken…",
  "amelio.objetsTitre": "Andere mogelijke onderwerpen",
  "amelio.objetsDetail":
    "Drie verschillende invalshoeken. Wissel er om de twee campagnes één: alleen zo weet u wat mensen doet openen.",
  "amelio.redigezDabord": "Schrijf eerst een onderwerp en een bericht.",
  "amelio.troisAngles": "Drie mogelijke invalshoeken",
  "amelio.avecDiagnostic": "Geschreven op basis van de resultaten gemeten op uw verzendingen. ",
  "amelio.comparez":
    "Vergelijk ze: die keuze leert u wat uw prospects aanspreekt.",
  "amelio.conseille": "aanbevolen",
  "amelio.mots": "woorden",
  "amelio.objet": "Onderwerp: ",
  "amelio.aVerifier": "Na te kijken:",
  "amelio.utiliser": "Deze versie gebruiken",
  "amelio.changements": "Wat er verandert ten opzichte van uw bericht",
  "amelio.garder": "Mijn bericht behouden",
  "amelio.relisez": "Lees na voordat u vervangt: dit bericht vertrekt vanaf uw adres.",
  "amelio.alerteFriction": "vraagt om de e-mail te verlaten",
  "amelio.alerteLong": "te lang",
  "amelio.alerteObjetLong": "onderwerp te lang",

  // ── Personalisatievariabelen ──
  "variable.aide": "Voeg deze variabelen in uw bericht in: de engine vervangt ze voor elke ontvanger.",
  "variable.prénom": "Voornaam van de beslisser",
  "variable.entreprise": "Naam van de onderneming",
  "variable.ICEBREAKER_IA": "Openingszin geschreven op basis van de website van de onderneming",
  "variable.besoin_1": "Eerste behoefte die op de website is vastgesteld",
  "variable.besoin_2": "Tweede behoefte die op de website is vastgesteld",
  "variable.site": "Webadres van de onderneming",
  "variable.signature": "Uw handtekening, ingesteld bij Instellingen",

  // ── Dashboard ──
  "accueil.eyebrow": "Dashboard",
  "accueil.bonjour": "Hallo",
  "accueil.chasseEnCours": "Er loopt een scan. De resultaten verschijnen in de Radar.",
  "accueil.derniereChasse": "Laatste scan op",
  "accueil.aucuneChasse": "Nog geen scan.",
  "accueil.credits": "beschikbare credits",
  "accueil.entreprisesAnalysees": "geanalyseerde ondernemingen",
  "accueil.emailEnvoye": "verzonden e-mail",
  "accueil.emailsEnvoyes": "verzonden e-mails",
  "accueil.reponseRecue": "ontvangen antwoord",
  "accueil.reponsesRecues": "ontvangen antwoorden",
  "accueil.profilComplete": "profiel ingevuld",
  "accueil.chasseLancee": "gestarte scan",
  "accueil.chassesLancees": "gestarte scans",
  "accueil.campagneActive": "actieve campagne",
  "accueil.campagnesActives": "actieve campagnes",
  "accueil.sur": "van",
  "accueil.envoiEchec": "mislukte verzending",
  "accueil.envoisEchec": "mislukte verzendingen",

  // ── Advies op het dashboard ──
  "conseils.titre": "Wat ik u aanraad",
  "conseils.rienADire": "Uw configuratie vertoont geen vaststelbare tekortkoming.",
  "conseils.suite":
    "Het vervolg draait om volume en regelmaat: nieuwe scans, verzendingen gespreid in plaats van gebundeld.",
  "conseils.faireMoiMeme": "Zelf doen",
  "conseils.yAller": "Ernaartoe",
  "conseils.reserve":
    "Dit advies steunt op uw werkelijke gegevens. Antwoorden worden in uw mailbox gedetecteerd; openingen worden niet gemeten, omdat een trackingpixel ten koste gaat van afleverbaarheid en van het respect voor de ontvanger.",
  "conseils.bloquant": "Blokkerend",
  "conseils.aCorriger": "Te corrigeren",
  "conseils.conseil": "Advies",

  // ── Snelle start ──
  "demarrage.titre": "Snelle start",
  "demarrage.remplit":
    "Vult het onderstaande formulier in. Er vertrekt niets zolang u de scan niet hebt gestart.",
  "demarrage.chasserIdeaux": "Mijn ideale klanten zoeken",
  "demarrage.analyseProfil": "Uw profiel wordt geanalyseerd…",
  "demarrage.deduits": "Beroepen en gebieden afgeleid uit uw ondernemingsprofiel.",
  "demarrage.formulaireRempli":
    "Het onderstaande formulier is ingevuld. Lees het na, pas het aan en start de scan onderaan de pagina.",
  "demarrage.pourquoi": "Waarom deze beroepen en gebieden?",
  "demarrage.ouSecteur": "Of vertrek van een sector",

  // ── Voorbeeldweergave ──
  "exemple.aucuneChasse": "Nog geen scan.",
  "exemple.forme":
    "Zo ziet een resultaat eruit: onderneming, beslisser, geverifieerd e-mailadres, relevantiescore en een openingszin geschreven vanaf hun website. Deze twee regels zijn fictief.",
  "exemple.societe1": "Verwarming & Sanitair (voorbeeld)",
  "exemple.contact1": "Voornaam Naam · Zaakvoerder",
  "exemple.accroche1":
    "Uw pagina « energiepremies » vermeldt nog het barema van vorig jaar — een eenvoudig signaal om als eerste contact aan te snijden.",
  "exemple.societe2": "Regionale dakwerken (voorbeeld)",
  "exemple.contact2": "Voornaam Naam · Verantwoordelijke offertes",
  "exemple.accroche2":
    "Drie recente beoordelingen vermelden de reactietijd op offerteaanvragen.",

  // ── Mijn onderneming ──
  "entreprise.eyebrow": "Mijn onderneming",
  "entreprise.titre": "Uw doelgroepprofiel",
  "entreprise.intro":
    "Dit profiel voedt de scoring van leads en het schrijven van openingszinnen. Hoe nauwkeuriger het is, hoe beter de engine mikt.",
  "entreprise.completion": "Profiel ingevuld",
  "entreprise.completionLabel": "Volledigheid van het profiel",
  "entreprise.demarrage": "Snelle start",
  "entreprise.demarrageDetail": "Een startsjabloon op basis van uw activiteit. Alles blijft aanpasbaar.",
  "entreprise.remplirDepuisSite": "Invullen vanaf uw website",
  "entreprise.remplirDetail":
    "De engine leest uw website en stelt een profiel voor. Er wordt niets opgeslagen zonder uw bevestiging.",
  "entreprise.urlExemple": "https://uw-website.be",
  "entreprise.urlLabel": "Adres van uw website",
  "entreprise.analyser": "Analyseren",
  "entreprise.analyse": "Bezig met analyseren…",
  "entreprise.votreActivite": "Uw activiteit",
  "entreprise.vosClients": "Uw ideale klanten",
  "entreprise.vosClientsDetail":
    "Dient om leads buiten de doelgroep te weren voordat ze uw credits opgebruiken.",
  "entreprise.nonPrecise": "Niet opgegeven",
  "entreprise.enregistrer": "Mijn profiel opslaan",
  "entreprise.enregistrement": "Bezig met opslaan…",
  "entreprise.enregistre": "Profiel opgeslagen. De engine richt zich voortaan op uw activiteit.",
  "entreprise.preRempli": "Profiel vooraf ingevuld vanaf uw website. Controleer, pas aan en sla op.",
  "entreprise.modeAvant": "Modus «",
  "entreprise.modeApres": "» toegepast. Pas aan en sla op.",
  "entreprise.exSecteur": "B2B-SaaS, webbureau, advies…",
  "entreprise.exDifferenciateur": "Wat u onderscheidt, in één zin",
  "entreprise.exOffre": "Beschrijf in twee of drie zinnen wat u verkoopt en aan wie.",
  "entreprise.exIcpSecteurs": "Webbureaus, industriële kmo's, consultants…",
  "entreprise.exGeographie": "België, Frankrijk, Luxemburg…",
  "profil.company_name": "Naam van uw onderneming",
  "profil.website": "Website",
  "profil.sector": "Uw activiteitensector",
  "profil.offer_description": "Wat u verkoopt",
  "profil.icp_sectors": "Sectoren van uw ideale klanten",
  "profil.icp_company_size": "Omvang van de beoogde klanten",
  "profil.icp_geography": "Prioritaire geografische zones",
  "profil.differentiator": "Uw belangrijkste onderscheidende factor",
  "profil.keywords": "Trefwoorden van uw vak",

  // ── Exports ──
  "exports.eyebrow": "Exports",
  "exports.titre": "Uw leadbestanden",
  "exports.intro": "Elke scan levert een CSV-bestand op dat u in uw CRM kunt hergebruiken.",
  "exports.ongletFichiers": "Bestanden",
  "exports.ongletCrm": "CRM-koppeling",
  "exports.vide": "Nog geen bestand.",
  "exports.videDetail":
    "Elke scan levert een downloadbaar bestand op, te openen in een rekenblad of in te laden in uw CRM.",
  "exports.lancerChasse": "Een scan starten",
  "exports.consulter": "Bekijken",
  "exports.telecharger": "Downloaden",
  "exports.preparation": "Bezig met voorbereiden…",
  "exports.douzeRecents": "Enkel de 12 recentste scans worden getoond.",

  // Globale cache
  "cache.titre": "Uit de globale cache halen",
  "cache.detail":
    "Haalt leads op die al tijdens eerdere scans zijn tegengekomen, zonder een externe oproep te verbruiken.",
  "cache.filtrer": "Filteren op ondernemingsnaam…",
  "cache.filtrerLabel": "Filteren op ondernemingsnaam",
  "cache.maxLignes": "Maximumaantal regels",
  "cache.telechargerCsv": "Downloaden als CSV",
  "cache.aucunLead": "Geen enkele lead komt overeen met dit filter.",
  "cache.ligneTrouvee": "gevonden regel",
  "cache.lignesTrouvees": "gevonden regels",
  "cache.entreprise": "Onderneming",
  "cache.decideur": "Beslisser",
  "cache.email": "E-mail",
  "cache.site": "Website",
  "cache.ville": "Stad",

  // CRM-koppeling
  "crm.adresse": "Ontvangstadres",
  "crm.adresseDetail":
    "Plak hier het adres dat Make, Zapier, n8n of uw CRM heeft opgegeven. Uw leads worden er in JSON-formaat naartoe gestuurd.",
  "crm.webhookExemple": "https://hook.eu2.make.com/…",
  "crm.webhookLabel": "Adres van de webhook",
  "crm.enregistree": "Adres opgeslagen.",
  "crm.effacee": "Adres gewist.",
  "crm.envoyerFichier": "Een bestand versturen",
  "crm.envoyerDetail": "Alle regels van het gekozen bestand vertrekken naar het opgeslagen adres.",
  "crm.aucunFichier": "Geen bestand beschikbaar. Voer eerst een scan uit.",
  "crm.adresseDabord": "Sla eerst hierboven een adres op.",
  "crm.fichierLabel": "Te versturen bestand",
  "crm.ligneEnvoyee": "regel verstuurd.",
  "crm.lignesEnvoyees": "regels verstuurd.",

  // Bestandstabel
  "fichier.tous": "Alle bestanden",
  "fichier.aideCredits": "Hoe credits worden geteld",
  "fichier.aideCreditsTexte":
    "Eén credit per eerste verzonden bericht, uitsluitend naar geverifieerde of catch-all contacten. Herinneringen zijn gratis en onvindbare adressen kosten nooit iets. Credits vervallen niet.",
  "fichier.qualiteEmails": "Kwaliteit van de e-mailadressen",
  "fichier.aideQualifTitre": "De drie kwalificatieniveaus",
  "fichier.aideQualifTexte":
    "Geverifieerd: de server van de ontvanger heeft bevestigd dat het adres bestaat — het beste niveau. Catch-all: de server aanvaardt alles, niet te bevestigen zonder te verzenden — met voorzichtigheid bruikbaar. Onvindbaar: geen betrouwbaar adres — uitgesloten van campagnes, nooit aangerekend bij verzending.",
  "fichier.lancerCampagne": "Een campagne starten",
  "fichier.vide": "Dit bestand bevat geen enkele regel.",
  "fichier.videDetail":
    "Het bestand wordt aangemaakt bij de start van een scan en op het einde gevuld: een onderbroken scan laat dus een leeg bestand achter onder dezelfde naam. Voer ze opnieuw uit vanuit de Radar om het aan te maken.",
  "fichier.filtrer": "Filteren op om het even welke kolom…",
  "fichier.filtrerLabel": "Regels filteren",
  "fichier.ligne": "regel",
  "fichier.lignes": "regels",
  "fichier.creditsEnvoi": "credits bij verzending",
  "fichier.verifie": "Geverifieerd",
  "fichier.catchall": "Catch-all",
  "fichier.introuvable": "Onvindbaar",
  "fichier.telechargementImpossible": "Downloaden onmogelijk.",
  "exports.entreprises": "ondernemingen",
  "exports.contactables": "contacteerbaar",
  "cache.extraire": "Ophalen",
  "crm.enregistrer": "Opslaan",
  "crm.envoyer": "Versturen",
  "fichier.colonnes": "kolommen",
  "fichier.apresFiltre": "na filtering",
  "fichier.entreprises": "ondernemingen",
  "fichier.contactables": "contacteerbaar",
  "fichier.qualiteLabel": "geverifieerd, catch-all, onvindbaar",

  // ── Assistent ──
  "assistant.eyebrow": "Assistent",
  "assistant.titre": "Een vraag over uw prospectie?",
  "assistant.intro":
    "De assistent kent uw activiteit: zijn antwoorden gaan over uw geval, niet over prospectie in het algemeen. Voeg een leadbestand toe zodat hij het kan analyseren.",
  "assistant.pourCommencer": "Om te beginnen",
  "assistant.reserve": "Antwoorden kunnen fouten bevatten. Controleer wat belangrijk is.",
  "assistant.redige": "De assistent schrijft zijn antwoord",
  "assistant.redigeCourt": "De assistent schrijft",
  "assistant.retirerFichier": "Bestand verwijderen",
  "assistant.joindreFichier": "Een bestand toevoegen",
  "assistant.question": "Stel uw vraag…",
  "assistant.questionCourt": "Uw vraag…",
  "assistant.questionLabel": "Uw vraag",
  "assistant.envoyer": "De vraag versturen",
  "assistant.envoyerCourt": "Versturen",
  "assistant.analyseFichier": "Analyseer dit bestand",
  "assistant.fichierTropGros": "Bestand te groot. Maximaal 5 MB.",
  "assistant.ouvrir": "De assistent openen",
  "assistant.pleinEcran": "Op volledig scherm openen",
  "assistant.fermer": "Sluiten",
  "assistant.accueilBulle":
    "Stel een vraag over uw prospectie, of voeg een leadbestand toe zodat ik het analyseer.",

  // ── Winkel ──
  "boutique.eyebrow": "Winkel",
  "boutique.titre": "Uw credits bijladen",
  "boutique.soldeAvant": "Huidig saldo:",
  "boutique.soldeApres": "credits. Gekochte credits vervallen niet.",
  "boutique.codePromo": "Hebt u een promotiecode?",
  "boutique.codeExemple": "PRODUCTHUNT",
  "boutique.codeLabel": "Promotiecode",
  "boutique.appliquer": "Toepassen",
  "boutique.enProfiter": "Hiervan profiteren",
  "boutique.abonnements": "Abonnementen",
  "boutique.recharges": "Eenmalige bijladingen",
  "boutique.stripe":
    "De betaling wordt verwerkt door Stripe. Wij hebben geen toegang tot bankgegevens.",

  // ── Partnerschap ──
  "partenariat.eyebrow": "Partnerschap",
  "partenariat.titre": "Doorverwijzing en affiliatie",
  "partenariat.intro":
    "Twee afzonderlijke programma's: het ene vergoedt in credits, het andere in commissies.",
  "partenariat.parrainage": "Doorverwijzing",
  "partenariat.parrainageDetail":
    "Voor vaste gebruikers die willen prospecteren zonder te betalen.",
  "partenariat.lienCopie": "Link gekopieerd",
  "partenariat.copierLien": "Mijn link kopiëren",
  "partenariat.copieEchouee":
    "Automatisch kopiëren is mislukt. Selecteer de link handmatig.",
  "partenariat.affiliation": "Affiliatie",
  "partenariat.affiliationDetail":
    "Voor bureaus, opleiders en makers van B2B-content.",
  "partenariat.vagues":
    "Het programma opent in golven. Schrijf ons om op de wachtlijst te komen.",
  "partenariat.rejoindre": "Op de lijst komen",
  "partenariat.mailSujet": "Affiliatieprogramma DataCloser",
  "partenariat.mailCorps":
    "Goedendag,\n\nIk wil graag deelnemen aan het affiliatieprogramma van DataCloser.\n\nMet dank.",

  // ── Uitschrijving ──
  "desinscription.enCours": "Uw aanvraag wordt geregistreerd…",
  "desinscription.fait": "Het is in orde.",
  "desinscription.confirmation":
    "ontvangt geen enkel prospectiebericht meer dat via DataCloser wordt verzonden, ongeacht de afzender.",
  "desinscription.enFile":
    "Een bericht dat op het ogenblik van uw aanvraag al in de verzendwachtrij stond, kan de komende minuten nog aankomen. Er volgt geen enkel ander.",
  "desinscription.echec": "De registratie is mislukt.",
  "desinscription.rechargez": "Herlaad deze pagina, of schrijf naar",
  "desinscription.traiteeManuellement": ": uw aanvraag wordt dan handmatig verwerkt.",
  "desinscription.absente": "Ontbrekend adres",
  "desinscription.absenteDetail":
    "Deze link bevat geen adres om uit te schrijven. Gebruik de link onderaan de e-mail die u hebt ontvangen, of schrijf naar",

  // ── Beheer ──
  "admin.reservee": "Deze pagina is voorbehouden aan het beheer.",
  "admin.eyebrow": "Beheer",
  "admin.titre": "Controletoren",
  "admin.leadsCache": "leads in de globale cache",
  "admin.comptes": "accounts",
  "admin.agentsActifs": "actieve autonome agenten",
  "admin.crediter": "Een account crediteren",
  "admin.compte": "Account",
  "admin.credits": "Credits",
  "admin.compteExemple": "klant@voorbeeld.be",
  "admin.boutonCrediter": "Crediteren",
  "admin.agent": "Autonome agent",
  "admin.agentDetail":
    "Elke nacht leest de agent het profiel van het account, start een scan en plaatst de beste leads in de verzendwachtrij. Hij verstuurt zelf nooit.",
  "admin.activer": "Inschakelen",
  "admin.desactiver": "Uitschakelen",
  "admin.agentAvant": "Agent",
  "admin.agentActive": "ingeschakeld",
  "admin.agentDesactive": "uitgeschakeld",
  "admin.agentPour": "voor",
  "admin.titreComptes": "Accounts",
  "admin.purge": "De cache van niet-geverifieerde leads leegmaken",
  "admin.purgeDetail":
    "Verwijdert definitief uit de globale cache de leads waarvan het e-mailadres nooit is geverifieerd. Ze worden bij de volgende scan opnieuw ter verrijking aangeboden. Onomkeerbaar.",
  "admin.purgeConfirmation": "Typ PURGER over om te bevestigen",
  "admin.boutonPurger": "Leegmaken",

  // ── Handleiding ──
  "guide.eyebrow": "Handleiding",
  "guide.titre": "Hoe DataCloser gebruiken",
  "guide.intro":
    "Vijftien minuten lezen om alles te begrijpen. U kunt ook enkel het onderdeel openen dat u nodig hebt.",
  "guide.sommaire": "Inhoud",

  // ── Installatie-uitnodiging ──
  "install.titre": "DataCloser op uw scherm",
  "install.safari": "Tik op de knop Delen in Safari en vervolgens op « Zet op beginscherm ».",
  "install.detail":
    "Open uw scans en campagnes met één handeling, zonder via de browser te gaan.",
  "install.installer": "Installeren",
  "install.installerLabel": "DataCloser installeren",
  "install.fermer": "Sluiten",

  // ── Link Building (beheer) ──
  "lb.titre": "Link Building",
  "lb.detail":
    "Zoekt websites die een link naar DataCloser zouden aanvaarden, controleert hun autoriteit en vindt een contactpersoon. De zoekopdracht loopt door als u deze pagina sluit.",
  "lb.sujets": "Onderwerpen, één per regel",
  "lb.langueCible": "Doeltaal",
  "lb.francais": "Frans",
  "lb.neerlandais": "Nederlands",
  "lb.lancer": "De zoekopdracht starten",
  "lb.enCours": "Bezig met zoeken…",
  "apercu.titre": "Voorbeeld vóór verzending",
  "apercu.detail":
    "De e-mail wordt opgebouwd voor een echte ontvanger uit deze scan, met uw handtekening. Er wordt niets verzonden.",
  "apercu.suivant": "Volgende ontvanger",
  "apercu.objet": "Onderwerp: ",

  // ── Context voor de assistent ──
  "ctx.jeVois": "Ik zie wat u voor u hebt:",
  "ctx.tableauDeBord": "zijn dashboard",
  "ctx.creationCampagne": "het aanmaken van een e-mailcampagne",
  "ctx.fichierLeads": "het leadbestand",
  "ctx.sugAccueil1": "Wat moet ik als eerste doen?",
  "ctx.sugAccueil2": "Is mijn antwoordpercentage normaal?",
  "ctx.sugAccueil3": "Hoe krijg ik meer antwoorden?",
  "ctx.sugCampagne1": "Zal dit bericht antwoorden opleveren?",
  "ctx.sugCampagne2": "Hoe verbeter ik mijn onderwerp?",
  "ctx.sugCampagne3": "Hoe vaak moet ik herinneren?",
  "ctx.sugFichier1": "Komen deze leads overeen met mijn doelgroep?",
  "ctx.sugFichier2": "Met welke begin ik het best?",
  "ctx.sugFichier3": "Wat doe ik met de catch-all adressen?",
};
