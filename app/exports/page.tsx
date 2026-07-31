"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Download, FileSpreadsheet } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { ConnexionCrm } from "@/components/ConnexionCrm";
import { PiedDePage } from "@/components/PiedDePage";
import {
  SessionExpiree,
  recupererScansDetails,
  telechargerExport,
  type ScanDetail,
} from "@/lib/api";
import { lireSession } from "@/lib/session";

type Etat = "chargement" | "pret" | "vide" | "erreur";

export default function PageExports() {
  const router = useRouter();
  const [scans, setScans] = useState<ScanDetail[]>([]);
  const [etat, setEtat] = useState<Etat>("chargement");
  const [message, setMessage] = useState("");
  const [tronque, setTronque] = useState(false);
  const [enCours, setEnCours] = useState<string | null>(null);
  const [vue, setVue] = useState<"fichiers" | "crm">("fichiers");

  useEffect(() => {
    if (!lireSession()) {
      router.replace("/connexion");
      return;
    }

    let annule = false;
    recupererScansDetails()
      .then((reponse) => {
        if (annule) return;
        setScans(reponse.scans);
        setTronque(reponse.tronque);
        setEtat(reponse.scans.length ? "pret" : "vide");
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

  async function telecharger(fichier: string) {
    setEnCours(fichier);
    setMessage("");
    try {
      await telechargerExport(fichier);
    } catch (erreur) {
      if (erreur instanceof SessionExpiree) {
        router.replace("/connexion");
        return;
      }
      setMessage((erreur as Error).message);
    } finally {
      setEnCours(null);
    }
  }

  return (
    <main className="min-h-screen px-6 pb-16 pt-6">
      <div className="mx-auto max-w-5xl">
        <Navigation />

        <div className="mb-6">
          <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-teal">
            <FileSpreadsheet size={13} aria-hidden="true" /> Exports
          </p>
          <h1 className="text-[30px] font-semibold leading-[1.1] sm:text-[36px]">
            Vos fichiers de leads
          </h1>
          <p className="mt-2 text-sm text-muted">
            Chaque scan produit un fichier CSV réutilisable dans votre CRM.
          </p>
        </div>

        <div className="mb-5 flex gap-1">
          {(["fichiers", "crm"] as const).map((cible) => (
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
              {cible === "fichiers" ? "Fichiers" : "Connexion CRM"}
            </button>
          ))}
        </div>

        {vue === "crm" ? (
          <ConnexionCrm fichiers={scans.map((s) => s.fichier)} />
        ) : (
        <>
        {message && (
          <p
            role="alert"
            className="mb-4 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger"
          >
            {message}
          </p>
        )}

        {etat === "chargement" ? (
          <div className="flex flex-col gap-2" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-xl border border-line bg-surface"
              />
            ))}
          </div>
        ) : etat === "vide" ? (
          <div className="rounded-xl border border-line bg-surface px-5 py-10 text-center">
            <p className="text-sm text-content">Aucun fichier pour l&apos;instant.</p>
            <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-muted">
              Chaque chasse produit un fichier téléchargeable, à ouvrir dans un
              tableur ou à verser dans votre CRM.
            </p>
            <Link
              href="/radar"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-ink transition hover:bg-teal-hover"
            >
              Lancer une chasse
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              {scans.map((scan) => (
                <article
                  key={scan.fichier}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface px-5 py-4 transition-colors hover:border-line-hover"
                >
                  <div className="min-w-0">
                    <h2 className="truncate text-[15px] font-medium">
                      {scan.titre}
                    </h2>
                    <p className="mt-1 text-xs text-muted">
                      <span className="font-mono tabular-nums">{scan.total}</span>{" "}
                      entreprises ·{" "}
                      <span className="font-mono tabular-nums text-content">
                        {scan.contactables}
                      </span>{" "}
                      contactables
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => telecharger(scan.fichier)}
                    disabled={enCours === scan.fichier}
                    className="flex shrink-0 items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm text-muted transition hover:border-line-hover hover:text-content disabled:opacity-50"
                  >
                    <Download size={14} aria-hidden="true" />
                    {enCours === scan.fichier ? "Préparation…" : "Télécharger"}
                  </button>
                </article>
              ))}
            </div>

            {tronque && (
              <p className="mt-4 text-center text-xs text-muted">
                Seuls les 12 scans les plus récents sont affichés.
              </p>
            )}
          </>
        )}
        </>
        )}

        <PiedDePage />
      </div>
    </main>
  );
}
