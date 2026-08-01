import type { SectionGuide } from "./guide";

/**
 * Mode d'emploi — version néerlandaise.
 *
 * Traduit plutôt que transposé : les exemples restent les mêmes
 * (« dakdekker » plutôt que « couvreur »), parce qu'ils illustrent un
 * raisonnement — le métier ramène des entreprises, le secteur ramène
 * des annuaires — et non un marché particulier.
 *
 * Les noms d'écrans suivent la barre de navigation traduite : Radar,
 * Outreach et Exports restent tels quels, « Mon entreprise » devient
 * « Mijn onderneming ».
 */

export const SECTIONS_NL: SectionGuide[] = [
  {
    cle: "principe",
    titre: "Het principe in drie stappen",
    resume: "Wat DataCloser doet, en in welke volgorde.",
    passages: [
      {
        texte:
          "DataCloser zoekt ondernemingen die met uw doelgroep overeenstemmen, vindt de te contacteren persoon en zijn e-mailadres, en schrijft voor elk van hen een gepersonaliseerd bericht op basis van hun eigen website.",
      },
      {
        titre: "1. U beschrijft uw activiteit",
        texte:
          "Bij Mijn onderneming geeft u aan wat u verkoopt en aan wie. De engine gebruikt dat om de relevantie van elke gevonden onderneming te scoren. Zonder dat profiel scoort hij blind en gaan uw credits naar ondernemingen buiten uw doelgroep.",
      },
      {
        titre: "2. U start een zoekactie",
        texte:
          "In de Radar geeft u een beroep en een gebied op. De engine spoort de ondernemingen op, zoekt de beslisser, verifieert zijn e-mailadres en schrijft een openingszin. Het resultaat wordt een bestand.",
      },
      {
        titre: "3. U verstuurt een campagne",
        texte:
          "In Outreach schrijft u een berichtsjabloon. Elke ontvanger krijgt een gepersonaliseerde versie, verstuurd vanaf uw eigen adres, met een wachttijd tussen elke verzending.",
      },
    ],
  },
  {
    cle: "vocabulaire",
    titre: "De woordenschat",
    resume: "Vijf woorden om de applicatie te kunnen lezen.",
    passages: [
      {
        titre: "Credit",
        texte:
          "De verbruikseenheid. Er wordt één credit afgeboekt per onderneming waarvan het e-mailadres tijdens een zoekactie is geverifieerd, en één credit per eerste verzonden bericht. Herinneringen zijn gratis, en ondernemingen zonder bruikbaar adres worden nooit aangerekend. Credits vervallen niet.",
      },
      {
        titre: "Kwalificatie van het e-mailadres",
        texte:
          "Het vertrouwensniveau in een adres. Geverifieerd: de server van de ontvanger heeft bevestigd dat het bestaat. Catch-all: de server aanvaardt alles, niet te bevestigen zonder te verzenden. Onvindbaar: geen betrouwbaar adres, de onderneming wordt uitgesloten van campagnes.",
      },
      {
        titre: "Relevantiescore",
        texte:
          "Een cijfer op tien dat de engine toekent op basis van uw profiel. Het meet de aansluiting bij uw doelgroep, niet de kwaliteit van de onderneming.",
      },
      {
        titre: "Openingszin",
        texte:
          "Een zin die voor elke ontvanger wordt geschreven op basis van zijn website — een gedateerde pagina, een termijn die in beoordelingen wordt vermeld, een gebied dat niet wordt bediend. Die zin onderscheidt uw bericht van een massaverzending.",
      },
      {
        titre: "Zoekactie",
        texte:
          "Een opdracht die in de Radar wordt gestart. Ze draait op onze servers: u mag de pagina sluiten, ze loopt door.",
      },
    ],
  },
  {
    cle: "chasse",
    titre: "Een zoekactie doen slagen",
    resume: "De keuze van de trefwoorden bepaalt al de rest.",
    passages: [
      {
        titre: "Zoek een beroep, geen sector",
        texte:
          "« Dakdekker » levert ondernemingen op. « Bouw » levert gidsen, marktplaatsen en federaties op — waarvan geen enkele een prospect is. Dat is de meest voorkomende oorzaak van een teleurstellende zoekactie.",
      },
      {
        titre: "Begin klein",
        texte:
          "Twee of drie beroepen, één of twee steden. Zo beoordeelt u de kwaliteit van de afbakening voordat u verder gaat. Elk beroep wordt in elk gebied gezocht: drie beroepen en vier steden geven twaalf zoekopdrachten.",
      },
      {
        titre: "Kies de juiste modus",
        texte:
          "Google Maps past bij lokaal verankerde beroepen met een fysiek adres — ambachtslui, winkels, praktijken. Google Search past bij verspreide of louter online activiteiten — bureaus, softwareuitgevers, advies.",
      },
      {
        attention:
          "Als meer dan 40 % van de ondernemingen uit een zoekactie geen bruikbaar adres heeft, zijn uw trefwoorden te breed. Het dashboard meldt u dat automatisch.",
      },
      {
        titre: "Twee snelkoppelingen",
        points: [
          "Mijn ideale klanten zoeken: de engine leidt beroepen en gebieden af uit uw ondernemingsprofiel.",
          "De kant-en-klare sectoren vullen het formulier in één klik in, met de passende modus.",
          "Geen van beide start de zoekactie: u leest na, u past aan, u beslist.",
        ],
      },
    ],
  },
  {
    cle: "campagne",
    titre: "Versturen zonder uw reputatie te schaden",
    resume: "Afleverbaarheid wordt bepaald vóór de eerste verzending.",
    passages: [
      {
        titre: "Koppel uw eigen adres",
        texte:
          "De berichten vertrekken vanuit uw mailbox, niet vanuit de onze. Daardoor komen ze in het postvak IN terecht in plaats van bij ongewenste e-mail — en daardoor kunnen uw prospects u rechtstreeks antwoorden.",
      },
      {
        titre: "Bouw geleidelijk op",
        texte:
          "Een domein dat nooit volume heeft verstuurd en plots driehonderd berichten uitstuurt, belandt in spam. Reken op een twintigtal verzendingen per dag in de eerste week, en verhoog daarna geleidelijk.",
      },
      {
        titre: "Schrijf niet naar onvindbare adressen",
        texte:
          "Elk bericht naar een onbestaand adres schaadt de reputatie van uw domein. De betrouwbare kwalificaties staan standaard aangevinkt: verruim enkel met kennis van zaken.",
      },
      {
        titre: "Gebruik de gepersonaliseerde openingszin",
        texte:
          "De openingsvariabele voegt de zin in die voor die ontvanger is geschreven. Zonder haar zijn al uw berichten identiek — dat is het eerste signaal dat spamfilters opmerken.",
      },
      {
        titre: "Herinner met mate",
        texte:
          "De herinneringen vertrekken op D+4, D+9 en D+14, uitsluitend naar ontvangers die niet hebben geantwoord. Ze kosten geen enkele credit: enkel het eerste bericht van een reeks wordt aangerekend. Er is dus geen enkele financiële reden om ervan af te zien.",
      },
      {
        attention:
          "Gebruik het voorbeeld voordat u start. Het bouwt het bericht op zoals het zal vertrekken, bij een echte ontvanger, en u kunt de leads één voor één doorlopen.",
      },
    ],
  },
  {
    cle: "resultats",
    titre: "Uw resultaten benutten",
    resume: "Het bestand, hoe u het leest, en de weg naar uw CRM.",
    passages: [
      {
        texte:
          "Elke zoekactie levert een bestand op bij Exports. Bekijken opent het volledig, met al zijn kolommen en een filter op om het even welke ervan. Downloaden geeft u de CSV, te openen in een rekenblad.",
      },
      {
        titre: "Automatische verzending naar uw tool",
        texte:
          "Het tabblad CRM-koppeling aanvaardt een webhookadres van Make, Zapier, n8n of uw CRM. Uw leads worden er in JSON-formaat naartoe gestuurd, zonder tussenkomst van een bestand.",
      },
      {
        titre: "Een campagne opvolgen",
        texte:
          "Het logboek van een campagne somt elke verzending op. Klap een regel open om het exacte bericht te zien dat die prospect heeft ontvangen, of de details van de fout bij mislukking.",
      },
    ],
  },
  {
    cle: "limites",
    titre: "Wat DataCloser niet doet",
    resume: "Beter vooraf geweten dan achteraf ontdekt.",
    passages: [
      {
        titre: "Het meet geen openingen",
        texte:
          "Weten wie een bericht heeft geopend, veronderstelt dat er een onzichtbare afbeelding in wordt geplaatst. Dat doen wij niet: die pixels worden door de meeste e-mailprogramma's geblokkeerd, ze schaden de afleverbaarheid, en ze bespioneren iemand die er niet om heeft gevraagd. Antwoorden worden wél gedetecteerd — dat is het enige cijfer dat echt iets meet.",
      },
      {
        titre: "Hoe antwoorden worden gedetecteerd",
        texte:
          "Als u uw verzending hebt ingesteld, maakt de applicatie om de twintig minuten verbinding met uw mailbox en vergelijkt ze de afzenders van de ontvangen berichten met uw ontvangers. Ze leest enkel de hoofdingen: nooit de inhoud van uw berichten. Mogelijk moet u IMAP-toegang inschakelen bij uw provider.",
      },
      {
        titre: "Het garandeert geen adres voor elke onderneming",
        texte:
          "Sommige ondernemingen tonen geen enkel bruikbaar adres. Ze verschijnen als onvindbaar en kosten u niets.",
      },
      {
        titre: "Het schrijft niet het hele bericht in uw plaats",
        texte:
          "De taakverdeling is duidelijk: u schrijft het sjabloon — het onderwerp, het argument, de slotvraag — en de engine schrijft voor elke ontvanger de openingszin op basis van zijn website, en past het bericht vervolgens aan zijn taal aan. Zo verstuurt u honderd verschillende berichten zonder er honderd te schrijven. Het voorbeeld bestaat opdat er niets zou vertrekken zonder dat u het hebt gelezen.",
      },
    ],
  },
  {
    cle: "rgpd",
    titre: "Prospectie en AVG",
    resume: "Wat voorzien is, en wat voor uw rekening blijft.",
    passages: [
      {
        texte:
          "B2B-prospectie is toegelaten in België en in Frankrijk, op voorwaarde dat het bericht de beroepsactiviteit van de ontvanger betreft, dat de herkomst van de gegevens wordt vermeld, en dat er een manier wordt geboden om te weigeren.",
      },
      {
        titre: "Wat de applicatie voor u doet",
        points: [
          "Elke e-mail bevat automatisch de bron van de gegevens en een uitschrijflink.",
          "Er wordt een technische uitschrijfhoofding toegevoegd, die door e-mailprogramma's wordt herkend.",
          "Elke uitschrijving blokkeert het adres definitief, ook voor uw toekomstige campagnes.",
        ],
      },
      {
        attention:
          "Wat voor uw rekening blijft: erop toezien dat het sjabloon dat u schrijft werkelijk de beroepsactiviteit van uw ontvangers betreft, en antwoorden op vragen over uw gegevens. Deze handleiding is geen juridisch advies.",
      },
    ],
  },
];
