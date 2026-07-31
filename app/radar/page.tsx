"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { ApercuExemple } from "@/components/ApercuExemple";
import { LancementScan } from "@/components/LancementScan";
import { Navigation } from "@/components/Navigation";
import { PiedDePage } from "@/components/PiedDePage";
import { BarreActions } from "@/components/BarreActions";
import { BarreFiltres } from "@/components/BarreFiltres";
import { LigneLead } from "@/components/LigneLead";
import { SessionExpiree, recupererLeads } from "@/lib/api";
import { exporterSelection } from "@/lib/export-csv";
import { lireSession } from "@/lib/session";
import { estContactable, type FiltresRadar, type Lead } from "@/lib/types";

type Etat = "chargement" | "pret" | "vide" | "erreur";

export default function PageRadar() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [etat, setEtat] = useState<Etat>("chargement");
  const [message, setMessage] = useState("");
  const [fichier, setFichier] = useState<string | null>(null);

  const [filtres, setFiltres] = useState<FiltresRadar>({
    scoreMin: 6,
    verifiesSeuls: false,
  });
  const [selection, setSelection] = useState<Set<number>>(new Set());
  const [deplie, setDeplie] = useState<number | null>(null);
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

  const visibles = useMemo(
    () =>
      leads.filter(
        (l) =>
          l.score >= filtres.scoreMin &&
          (!filtres.verifiesSeuls || l.statut === "verifie"),
      ),
    [leads, filtres],
  );

  const contactables = visibles.filter(estContactable).length;

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

          {etat === "chargement" ? (
            <p className="mt-2 text-sm text-muted">Chargement du dernier scan…</p>
          ) : (
            <p className="mt-2 text-sm text-muted">
              {visibles.length} entreprises · {contactables} contactables ·{" "}
              <span className="text-content">{contactables} crédits</span>
              {" à l'envoi"}
            </p>
          )}

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
        <BarreFiltres filtres={filtres} onChange={setFiltres} />

        {etat === "chargement" ? (
          <div className="flex flex-col gap-2" aria-busy="true">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[74px] animate-pulse rounded-xl border border-line bg-surface"
              />
            ))}
          </div>
        ) : etat === "vide" ? (
          <ApercuExemple onCommencer={() => setVue("chasse")} />
        ) : visibles.length === 0 ? (
          <p className="rounded-xl border border-line bg-surface px-5 py-10 text-center text-sm text-muted">
            Aucune entreprise ne correspond à ces filtres. Baissez le score
            minimum pour élargir la recherche.
          </p>
        ) : (
          <>
          {/* Un en-tête rend l'alignement lisible : sans lui, une colonne
              d'emails n'annonce pas ce qu'elle contient. */}
          <div
            aria-hidden="true"
            className="mb-1.5 hidden items-center gap-4 px-5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted/60 lg:flex"
          >
            <span className="w-4 shrink-0" />
            <span className="min-w-0 flex-1">Entreprise</span>
            <span className="w-56 shrink-0">Email</span>
            <span className="w-[46px] shrink-0">Score</span>
            <span className="w-7 shrink-0" />
          </div>

          <div className="flex flex-col gap-2">
            {visibles.map((lead, rang) => (
              <div
                key={lead.id}
                className="apparition"
                style={{ animationDelay: `${Math.min(rang, 12) * 28}ms` }}
              >
              <LigneLead
                lead={lead}
                selectionne={selection.has(lead.id)}
                deplie={deplie === lead.id}
                onSelection={(id) =>
                  setSelection((p) => {
                    const s = new Set(p);
                    if (s.has(id)) s.delete(id);
                    else s.add(id);
                    return s;
                  })
                }
                onDeplier={(id) => setDeplie((p) => (p === id ? null : id))}
              />
              </div>
            ))}
          </div>
          </>
        )}

        <BarreActions
          nombreSelectionnes={selection.size}
          onExporter={() => {
            const choisis = leads.filter((l) => selection.has(l.id));
            const nombre = exporterSelection(choisis, fichier);
            setNotification(
              nombre === 0
                ? "Sélectionnez au moins une entreprise à exporter."
                : `${nombre} entreprise${nombre > 1 ? "s" : ""} exportée${nombre > 1 ? "s" : ""}.`,
            );
          }}
          onLancerCampagne={() =>
            router.push(`/outreach?source=${encodeURIComponent(fichier ?? "")}`)
          }
        />

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
