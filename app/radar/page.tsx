"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { ApercuExemple } from "@/components/ApercuExemple";
import { LancementScan } from "@/components/LancementScan";
import { Navigation } from "@/components/Navigation";
import { PiedDePage } from "@/components/PiedDePage";
import { SyntheseChasse } from "@/components/SyntheseChasse";
import { SessionExpiree, recupererLeads, telechargerExport } from "@/lib/api";
import { lireSession } from "@/lib/session";
import type { Lead } from "@/lib/types";

type Etat = "chargement" | "pret" | "vide" | "erreur";

export default function PageRadar() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [etat, setEtat] = useState<Etat>("chargement");
  const [message, setMessage] = useState("");
  const [fichier, setFichier] = useState<string | null>(null);

  const [notification, setNotification] = useState("");
  const [vue, setVue] = useState<"resultats" | "chasse">("resultats");

  function chargerLeads() {
    recupererLeads()
      .then((reponse) => {
        setLeads(reponse.leads);
        setFichier(reponse.fichier);
        setEtat(reponse.leads.length ? "pret" : "vide");
      })
      .catch(() => {});
  }

  useEffect(() => {
    const session = lireSession();
    if (!session) {
      router.replace("/connexion");
      return;
    }
    let annule = false;
    recupererLeads()
      .then((reponse) => {
        if (annule) return;
        setLeads(reponse.leads);
        setFichier(reponse.fichier);
        setEtat(reponse.leads.length ? "pret" : "vide");
      })
      .catch((erreur: Error) => {
        if (annule) return;
        if (erreur instanceof SessionExpiree) {
          router.replace("/connexion");
          return;
        }
        setMessage(erreur.message);
        setEtat("erreur");
      });

    return () => {
      annule = true;
    };
  }, [router]);


  return (
    <main className="min-h-screen px-6 pb-16 pt-6">
      <div className="mx-auto max-w-5xl">
        <Navigation />

        <header className="mb-8">
          <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-teal">
            <Search size={13} aria-hidden="true" /> Radar
          </p>

          <h1 className="text-[30px] font-semibold leading-[1.1] sm:text-[36px]">
            {fichier
              ? fichier.replace(/\.csv$/i, "").replace(/_/g, " ")
              : "Vos leads"}
          </h1>

          <p className="mt-2 text-sm text-muted">
            {etat === "chargement"
              ? "Chargement du dernier scan…"
              : "Le fichier complet est prêt. Voici l'essentiel."}
          </p>

          {etat === "erreur" && (
            <p
              role="alert"
              className="mt-3 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger"
            >
              {message}
            </p>
          )}
        </header>

        <div className="mb-5 flex gap-1">
          {(["resultats", "chasse"] as const).map((cible) => (
            <button
              key={cible}
              type="button"
              onClick={() => setVue(cible)}
              aria-current={vue === cible ? "true" : undefined}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                vue === cible
                  ? "bg-surface text-content"
                  : "text-muted hover:text-content"
              }`}
            >
              {cible === "resultats" ? "Résultats" : "Nouvelle chasse"}
            </button>
          ))}
        </div>

        {vue === "chasse" ? (
          <LancementScan
            onTermine={() => {
              chargerLeads();
              setNotification("Chasse terminée — les résultats sont à jour.");
            }}
          />
        ) : (
        <>
        {etat === "chargement" ? (
          <div className="flex flex-col gap-4" aria-busy="true">
            <div className="grid gap-4 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-xl border border-line bg-surface"
                />
              ))}
            </div>
            <div className="h-32 animate-pulse rounded-xl border border-line bg-surface" />
          </div>
        ) : etat === "vide" ? (
          <ApercuExemple onCommencer={() => setVue("chasse")} />
        ) : (
          <SyntheseChasse
            leads={leads}
            fichier={fichier}
            onExporter={() => {
              if (!fichier) return;
              telechargerExport(fichier)
                .then(() => setNotification("Fichier téléchargé."))
                .catch(() =>
                  setNotification(
                    "Téléchargement impossible. Réessayez dans un instant.",
                  ),
                );
            }}
          />
        )}
        </>
        )}

        {notification && (
          <p role="status" className="mt-3 text-center text-xs text-muted">
            {notification}
          </p>
        )}
        <PiedDePage />
      </div>
    </main>
  );
}
