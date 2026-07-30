"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, FileSpreadsheet } from "lucide-react";
import { Navigation } from "@/components/Navigation";
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
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-4xl">
        <Navigation />

        <div className="mb-6">
          <p className="mb-1.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-teal">
            <FileSpreadsheet size={13} aria-hidden="true" /> Exports
          </p>
          <h1 className="text-[28px] font-semibold leading-tight">
            Vos fichiers de leads
          </h1>
          <p className="mt-2 text-sm text-muted">
            Chaque scan produit un fichier CSV réutilisable dans votre CRM.
          </p>
        </div>

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
          <p className="rounded-xl border border-line bg-surface px-5 py-10 text-center text-sm text-muted">
            Aucun export pour le moment. Lancez une recherche pour créer votre
            premier fichier.
          </p>
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
      </div>
    </main>
  );
}
