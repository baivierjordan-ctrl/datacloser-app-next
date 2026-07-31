"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Send } from "lucide-react";
import { CreationCampagne } from "@/components/CreationCampagne";
import { FormulaireSmtp } from "@/components/FormulaireSmtp";
import { ListeCampagnes } from "@/components/ListeCampagnes";
import { Navigation } from "@/components/Navigation";
import { PiedDePage } from "@/components/PiedDePage";
import {
  SessionExpiree,
  ecrireConfigSmtp,
  lireConfigSmtp,
  recupererCampagnes,
} from "@/lib/api";
import { lireSession } from "@/lib/session";
import type { Campagne, ConfigSmtp } from "@/lib/types";

type Vue = "campagnes" | "creation" | "reglages";

function Outreach() {
  const router = useRouter();
  const parametres = useSearchParams();
  const source = parametres.get("source") ?? undefined;
  // Deux chemins mènent à la création : arriver du Radar avec un scan,
  // ou suivre un lien explicite depuis un écran vide.
  const vueDemandee = parametres.get("vue");
  const modeleDemande = parametres.get("modele") ?? undefined;
  const [vue, setVue] = useState<Vue>(
    source || vueDemandee === "creation" ? "creation" : "campagnes",
  );
  const [message, setMessage] = useState("");
  const [campagnes, setCampagnes] = useState<Campagne[]>([]);
  const [config, setConfig] = useState<ConfigSmtp | null>(null);
  const [configure, setConfigure] = useState(false);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    if (!lireSession()) {
      router.replace("/connexion");
      return;
    }

    let annule = false;
    Promise.all([recupererCampagnes(), lireConfigSmtp()])
      .then(([listeCampagnes, reponseSmtp]) => {
        if (annule) return;
        setCampagnes(listeCampagnes);
        setConfig(reponseSmtp.config);
        setConfigure(reponseSmtp.configure);
        setChargement(false);
      })
      .catch((e: Error) => {
        if (annule) return;
        if (e instanceof SessionExpiree) {
          router.replace("/connexion");
          return;
        }
        setErreur(e.message);
        setChargement(false);
      });

    return () => {
      annule = true;
    };
  }, [router]);

  async function enregistrer(nouvelle: ConfigSmtp) {
    await ecrireConfigSmtp(nouvelle);
    setConfigure(true);
    setConfig({ ...nouvelle, smtp_password: undefined });
  }

  const onglet = (cible: Vue, libelle: string) => (
    <button
      type="button"
      onClick={() => setVue(cible)}
      aria-current={vue === cible ? "true" : undefined}
      className={`rounded-lg px-3 py-1.5 text-sm transition ${
        vue === cible ? "bg-surface text-content" : "text-muted hover:text-content"
      }`}
    >
      {libelle}
    </button>
  );

  return (
    <main className="min-h-screen px-6 pb-16 pt-6">
      <div className="mx-auto max-w-5xl">
        <Navigation />

        <header className="mb-6">
          <p className="mb-2 flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] text-teal">
            <Send size={13} aria-hidden="true" /> Outreach
          </p>
          <h1 className="text-[30px] font-semibold leading-[1.1] sm:text-[36px]">
            Vos campagnes d&apos;emails
          </h1>
          {!configure && !chargement && (
            <p className="mt-3 rounded-lg border border-warn/30 bg-warn/5 px-3 py-2 text-xs text-warn">
              Aucun serveur d&apos;envoi configuré. Renseignez vos accès dans
              Réglages avant de lancer une campagne.
            </p>
          )}
        </header>

        <div className="mb-5 flex gap-1">
          {onglet("campagnes", "Campagnes")}
          {onglet("creation", "Nouvelle campagne")}
          {onglet("reglages", "Réglages")}
        </div>

        {message && (
          <p
            role="status"
            className="mb-4 rounded-lg border border-ok/30 bg-ok/5 px-3 py-2 text-xs text-ok"
          >
            {message}
          </p>
        )}

        {erreur && (
          <p
            role="alert"
            className="mb-4 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger"
          >
            {erreur}
          </p>
        )}

        {chargement ? (
          <div className="flex flex-col gap-2" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl border border-line bg-surface"
              />
            ))}
          </div>
        ) : vue === "campagnes" ? (
          <ListeCampagnes
            campagnes={campagnes}
            onChangement={() =>
              recupererCampagnes().then(setCampagnes).catch(() => {})
            }
          />
        ) : vue === "creation" ? (
          <CreationCampagne
            modeleInitial={modeleDemande}
            sourceInitiale={source}
            smtpConfigure={configure}
            onCreee={(destinataires) => {
              setMessage(
                `Campagne créée : ${destinataires} destinataire${destinataires > 1 ? "s" : ""} en file d'envoi.`,
              );
              setVue("campagnes");
              recupererCampagnes().then(setCampagnes).catch(() => {});
            }}
          />
        ) : (
          <FormulaireSmtp
            initiale={config}
            dejaConfigure={configure}
            onEnregistrer={enregistrer}
          />
        )}
        <PiedDePage />
      </div>
    </main>
  );
}

export default function PageOutreach() {
  return (
    <Suspense fallback={null}>
      <Outreach />
    </Suspense>
  );
}
