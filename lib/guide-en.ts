import type { SectionGuide } from "./guide";

/**
 * Mode d'emploi — version anglaise.
 *
 * Anglais britannique, comme le reste de l'interface. Les exemples de
 * métiers sont conservés : ils illustrent un raisonnement, pas un
 * marché.
 */

export const SECTIONS_EN: SectionGuide[] = [
  {
    cle: "principe",
    titre: "The principle in three steps",
    resume: "What DataCloser does, and in what order.",
    passages: [
      {
        texte:
          "DataCloser looks for companies matching your target, finds the person to contact and their email address, then writes each of them a personalised message drawn from their own website.",
      },
      {
        titre: "1. You describe your business",
        texte:
          "Under My company, you state what you sell and to whom. The engine uses this to score the relevance of every company it finds. Without that profile it scores blind, and your credits go to companies outside your target.",
      },
      {
        titre: "2. You start a scan",
        texte:
          "In Radar, you enter a trade and an area. The engine identifies the companies, finds the decision-maker, verifies their email address and writes an opening line. The result becomes a file.",
      },
      {
        titre: "3. You send a campaign",
        texte:
          "In Outreach, you write a message template. Each recipient receives a personalised version, sent from your own address, with a delay between each send.",
      },
    ],
  },
  {
    cle: "vocabulaire",
    titre: "The vocabulary",
    resume: "Five words to know in order to read the application.",
    passages: [
      {
        titre: "Credit",
        texte:
          "The unit of consumption. One credit is charged per company whose email is verified during a scan, and one credit per first message sent. Follow-ups are free, and companies with no usable address are never charged. Credits do not expire.",
      },
      {
        titre: "Email qualification",
        texte:
          "The level of confidence in an address. Verified: the recipient's server confirmed it exists. Catch-all: the server accepts everything, impossible to confirm without sending. Unreachable: no reliable address, the company is excluded from campaigns.",
      },
      {
        titre: "Relevance score",
        texte:
          "A mark out of ten given by the engine based on your profile. It measures the fit with your target, not the quality of the company.",
      },
      {
        titre: "Opening line",
        texte:
          "A sentence written for each recipient from their website — a page out of date, a delay mentioned in reviews, an area not covered. It is what distinguishes your message from a mass mailing.",
      },
      {
        titre: "Scan",
        texte:
          "A search started in Radar. It runs on our servers: you can close the page, it carries on.",
      },
    ],
  },
  {
    cle: "chasse",
    titre: "Making a scan work",
    resume: "The choice of keywords determines everything else.",
    passages: [
      {
        titre: "Search for a trade, not a sector",
        texte:
          "\u201cRoofer\u201d returns companies. \u201cConstruction\u201d returns directories, marketplaces and trade bodies — none of which is a prospect. This is the most common cause of a disappointing scan.",
      },
      {
        titre: "Start small",
        texte:
          "Two or three trades, one or two cities. You will judge the quality of the targeting before committing further. Each trade is searched in each area: three trades and four cities make twelve searches.",
      },
      {
        titre: "Choose the right mode",
        texte:
          "Google Maps suits locally rooted trades with a physical address — tradespeople, shops, practices. Google Search suits dispersed or purely online activities — agencies, software publishers, consultancies.",
      },
      {
        attention:
          "If more than 40% of the companies in a scan have no usable address, your keywords are too broad. The dashboard flags this automatically.",
      },
      {
        titre: "Two shortcuts",
        points: [
          "Scan my ideal clients: the engine infers trades and areas from your company profile.",
          "The ready-made sectors fill in the form in one click, with the right mode.",
          "Neither of them starts the scan: you read it over, you adjust, you decide.",
        ],
      },
    ],
  },
  {
    cle: "campagne",
    titre: "Sending without damaging your reputation",
    resume: "Deliverability is decided before the first send.",
    passages: [
      {
        titre: "Connect your own address",
        texte:
          "Messages go out from your mailbox, not ours. That is what gets them into the inbox rather than the spam folder — and what lets your prospects reply to you directly.",
      },
      {
        titre: "Build up gradually",
        texte:
          "A domain that has never sent volume and suddenly dispatches three hundred messages will be classed as spam. Reckon on about twenty sends a day in the first week, then increase gradually.",
      },
      {
        titre: "Do not write to unreachable addresses",
        texte:
          "Every message sent to a non-existent address degrades your domain's reputation. The reliable qualifications are ticked by default: widen the selection only knowingly.",
      },
      {
        titre: "Use the personalised opening line",
        texte:
          "The opening variable inserts the sentence written for that recipient. Without it, all your messages are identical — the first signal spam filters pick up on.",
      },
      {
        titre: "Follow up in moderation",
        texte:
          "Follow-ups go out at D+4, D+9 and D+14, only to recipients who have not replied. They cost no credits: only the first message of a sequence is charged. There is therefore no financial reason to do without them.",
      },
      {
        attention:
          "Use the preview before launching. It builds the message exactly as it will go out, on a real recipient, and you can scroll through the leads one by one.",
      },
    ],
  },
  {
    cle: "resultats",
    titre: "Making use of your results",
    resume: "The file, how to read it, and the route into your CRM.",
    passages: [
      {
        texte:
          "Each scan produces a file under Exports. View opens it in full, with all its columns and a filter on any of them. Download gives you the CSV, which opens in a spreadsheet.",
      },
      {
        titre: "Automatic sending to your tool",
        texte:
          "The CRM connection tab accepts a webhook address supplied by Make, Zapier, n8n or your CRM. Your leads are sent there in JSON format, without going through a file.",
      },
      {
        titre: "Following a campaign",
        texte:
          "A campaign's log lists every send. Expand a row to see the exact message that prospect received, or the details of the error if it failed.",
      },
    ],
  },
  {
    cle: "limites",
    titre: "What DataCloser does not do",
    resume: "Better known in advance than discovered later.",
    passages: [
      {
        titre: "It does not measure opens",
        texte:
          "Knowing who opened a message means slipping an invisible image into it. We do not do this: those pixels are blocked by most mail clients, they degrade deliverability, and they spy on someone who never asked for it. Replies, on the other hand, are detected — the only figure that really measures anything.",
      },
      {
        titre: "How replies are detected",
        texte:
          "If you have configured your sending, the application connects to your mailbox every twenty minutes and compares the senders of incoming messages with your recipients. It reads only the headers: never the content of your messages. You may need to enable IMAP access with your provider.",
      },
      {
        titre: "It does not guarantee an address for every company",
        texte:
          "Some companies expose no usable address. They appear as unreachable and cost you nothing.",
      },
      {
        titre: "It does not write the whole message for you",
        texte:
          "The division is clear: you write the template — the subject, the argument, the closing question — and the engine writes, for each recipient, the opening line drawn from their website, then adapts the message to their language. That is what makes it possible to send a hundred different messages without writing a hundred. The preview exists so that nothing goes out without you having read it.",
      },
    ],
  },
  {
    cle: "rgpd",
    titre: "Prospecting and GDPR",
    resume: "What is taken care of, and what remains yours.",
    passages: [
      {
        texte:
          "B2B prospecting is permitted in Belgium and in France, provided the message concerns the recipient's professional activity, the origin of the data is stated, and a means of refusal is offered.",
      },
      {
        titre: "What the application does for you",
        points: [
          "Every email automatically includes the source of the data and an unsubscribe link.",
          "A technical unsubscribe header is added, recognised by mail clients.",
          "Any unsubscribe blocks the address permanently, including for your future campaigns.",
        ],
      },
      {
        attention:
          "What remains yours: making sure the template you write genuinely concerns your recipients' professional activity, and answering requests for information about your data. This guide is not legal advice.",
      },
    ],
  },
];
