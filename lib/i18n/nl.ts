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
  "radar.titre": "Een zoekactie starten",
  "radar.intro":
    "Geef een beroep en een gebied op. De engine spoort de ondernemingen op, zoekt de beslisser, verifieert zijn e-mailadres en schrijft een openingszin op basis van hun website. Het resultaat wordt een bestand, raadpleegbaar bij Exports.",
  "radar.termine": "Zoekactie voltooid.",
  "radar.termineDetail": "Uw bestand staat klaar bij Exports.",
  "radar.voirResultats": "Resultaten bekijken",

  // Lopende zoekactie
  "radar.entreprisesAnalysees": "geanalyseerde ondernemingen",
  "radar.arreter": "Stoppen",
  "radar.peutFermer": "U mag deze pagina sluiten: de zoekactie loopt door op onze servers.",
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
  "radar.etape3Detail": "Optioneel. De standaardwaarden volstaan voor een eerste zoekactie.",
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
  "radar.lancer": "Zoekactie starten",
  "radar.dejaEnCours": "Er loopt al een zoekactie",
  "radar.vosChasses": "Uw zoekacties",

  // Statussen
  "scan.en_attente": "In wachtrij",
  "scan.en_cours": "Bezig",
  "scan.annulation_demandee": "Annulering gevraagd",
  "scan.termine": "Voltooid",
  "scan.erreur": "Mislukt",

  // ── Overzicht zoekacties ──
  "histo.chasse": "Zoekactie",
  "histo.analysees": "geanalyseerd",
  "histo.relancer": "Opnieuw uitvoeren met dezelfde instellingen",
  "histo.telecharger": "Bestand downloaden",
  "histo.fichierIndisponible":
    "Dit bestand is niet meer beschikbaar. Voer de zoekactie opnieuw uit om het aan te maken.",

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
};
