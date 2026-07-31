"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Crown, Database, Loader2, Trash2, Zap } from "lucide-react";
import { ExportCache } from "@/components/ExportCache";
import { LinkBuilding } from "@/components/LinkBuilding";
import { Navigation } from "@/components/Navigation";
import { PiedDePage } from "@/components/PiedDePage";
import {
  SessionExpiree,
  basculerAgent,
  crediterCompte,
  purgerCache,
  recupererEtatAdmin,
} from "@/lib/api";
import { dateSeule } from "@/lib/dates";
import { lireSession } from "@/lib/session";
import type { EtatAdmin } from "@/lib/types";

const champ =
  "w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-content outline-none transition focus:border-teal";
const etiquette = "mb-1.5 block text-xs text-muted";

export default function PageAdmin() {
  const router = useRouter();
  const [etat, setEtat] = useState<EtatAdmin | null>(null);
  const [refuse, setRefuse] = useState(false);
  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");
  const [occupe, setOccupe] = useState("");

  const [cible, setCible] = useState("");
  const [montant, setMontant] = useState(1000);
  const [confirmation, setConfirmation] = useState("");
  const [emailAgent, setEmailAgent] = useState("");

  const charger = useCallback(() => {
    recupererEtatAdmin()
      .then(setEtat)
      .catch((e: Error) => {
        if (e instanceof SessionExpiree) {
          router.replace("/connexion");
          return;
        }
        // Un compte non administrateur reçoit un refus du serveur : on
        // l'affiche tel quel plutôt que de laisser un écran vide.
        if (e.message.toLowerCase().includes("administration")) {
          setRefuse(true);
          return;
        }
        setErreur(e.message);
      });
  }, [router]);

  useEffect(() => {
    if (!lireSession()) {
      router.replace("/connexion");
      return;
    }
    charger();
  }, [router, charger]);

  async function agir(quoi: string, action: () => Promise<string>) {
    setErreur("");
    setMessage("");
    setOccupe(quoi);
    try {
      setMessage(await action());
      charger();
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setOccupe("");
    }
  }

  if (refuse) {
    return (
      <main className="min-h-screen px-6 pb-16 pt-6">
        <div className="mx-auto max-w-5xl">
          <Navigation />
          <p className="rounded-xl border border-line bg-surface px-5 py-10 text-center text-sm text-muted">
            Cette page est réservée à l&apos;administration.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 pb-16 pt-6">
      <div className="mx-auto max-w-5xl">
        <Navigation />

        <header className="mb-8">
          <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-teal">
            <Crown size={13} aria-hidden="true" /> Administration
          </p>
          <h1 className="text-[30px] font-semibold leading-[1.1] sm:text-[36px]">
            Tour de contrôle
          </h1>
        </header>

        {erreur && (
          <p
            role="alert"
            className="mb-4 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger"
          >
            {erreur}
          </p>
        )}
        {message && (
          <p
            role="status"
            className="mb-4 rounded-lg border border-ok/30 bg-ok/5 px-3 py-2 text-xs text-ok"
          >
            {message}
          </p>
        )}

        {!etat ? (
          <div className="h-40 animate-pulse rounded-xl border border-line bg-surface" />
        ) : (
          <div className="flex flex-col gap-5">
            <section className="grid gap-4 sm:grid-cols-3">
              {[
                { valeur: etat.leads_caches, libelle: "leads en cache global" },
                { valeur: etat.comptes.length, libelle: "comptes" },
                {
                  valeur: etat.agents_actifs.length,
                  libelle: "agents autonomes actifs",
                },
              ].map((carte) => (
                <div
                  key={carte.libelle}
                  className="rounded-xl border border-line bg-surface p-5"
                >
                  <p className="font-display text-[30px] font-semibold leading-none tabular-nums">
                    {carte.valeur}
                  </p>
                  <p className="mt-2 text-xs text-muted">{carte.libelle}</p>
                </div>
              ))}
            </section>

            <section className="rounded-xl border border-line bg-surface p-5">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-medium">
                <Zap size={14} className="text-teal" aria-hidden="true" />
                Créditer un compte
              </h2>
              <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
                <div>
                  <label className={etiquette} htmlFor="cible">
                    Compte
                  </label>
                  <input
                    id="cible"
                    list="comptes"
                    className={champ}
                    value={cible}
                    onChange={(e) => setCible(e.target.value)}
                    placeholder="client@exemple.be"
                  />
                  <datalist id="comptes">
                    {etat.comptes.map((c) => (
                      <option key={c.email} value={c.email} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className={etiquette} htmlFor="montant">
                    Crédits
                  </label>
                  <input
                    id="montant"
                    type="number"
                    min={1}
                    max={100000}
                    className={`${champ} w-32`}
                    value={montant}
                    onChange={(e) => setMontant(Number(e.target.value))}
                  />
                </div>
                <button
                  type="button"
                  disabled={!cible.trim() || occupe !== ""}
                  onClick={() =>
                    agir("credit", async () => {
                      const r = await crediterCompte(cible.trim(), montant);
                      return `${r.ajoutes} crédits ajoutés à ${r.email} — nouveau solde : ${r.solde}.`;
                    })
                  }
                  className="flex h-[38px] items-center gap-2 rounded-lg bg-teal px-4 text-sm font-medium text-ink transition hover:bg-teal-hover disabled:opacity-40"
                >
                  {occupe === "credit" && (
                    <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                  )}
                  Créditer
                </button>
              </div>
            </section>

            <section className="rounded-xl border border-line bg-surface p-5">
              <h2 className="mb-1 flex items-center gap-2 text-sm font-medium">
                <Bot size={14} className="text-teal" aria-hidden="true" />
                Agent autonome
              </h2>
              <p className="mb-4 text-xs leading-relaxed text-muted">
                Chaque nuit, l&apos;agent lit le profil du compte, lance une
                chasse et met les meilleurs leads en file d&apos;envoi. Il
                n&apos;envoie jamais lui-même.
              </p>

              {etat.agents_actifs.length > 0 && (
                <ul className="mb-4 flex flex-col gap-1.5">
                  {etat.agents_actifs.map((a) => (
                    <li
                      key={a.email}
                      className="flex flex-wrap items-baseline gap-x-3 text-xs"
                    >
                      <span className="text-content">{a.email}</span>
                      <span className="font-mono text-muted">
                        {a.credits} crédits
                      </span>
                      <span className="text-muted">
                        actif depuis le {dateSeule(a.depuis)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap items-end gap-3">
                <div className="min-w-[16rem] flex-1">
                  <label className={etiquette} htmlFor="agent">
                    Compte
                  </label>
                  <input
                    id="agent"
                    list="comptes"
                    className={champ}
                    value={emailAgent}
                    onChange={(e) => setEmailAgent(e.target.value)}
                    placeholder="client@exemple.be"
                  />
                </div>
                {([true, false] as const).map((actif) => (
                  <button
                    key={String(actif)}
                    type="button"
                    disabled={!emailAgent.trim() || occupe !== ""}
                    onClick={() =>
                      agir("agent", async () => {
                        const r = await basculerAgent(emailAgent.trim(), actif);
                        return `Agent ${r.actif ? "activé" : "désactivé"} pour ${r.email}.`;
                      })
                    }
                    className={`h-[38px] rounded-lg border px-4 text-sm transition ${
                      actif
                        ? "border-teal/40 text-teal hover:bg-teal/10"
                        : "border-line text-muted hover:text-content"
                    } disabled:opacity-40`}
                  >
                    {actif ? "Activer" : "Désactiver"}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-line bg-surface p-5">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-medium">
                <Database size={14} className="text-teal" aria-hidden="true" />
                Comptes
              </h2>
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0">
                    <tr>
                      <th className="border-b border-line bg-surface py-2 text-left font-mono text-[10px] uppercase tracking-[0.1em] font-normal text-muted">
                        Compte
                      </th>
                      <th className="border-b border-line bg-surface py-2 text-right font-mono text-[10px] uppercase tracking-[0.1em] font-normal text-muted">
                        Crédits
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {etat.comptes.map((c) => (
                      <tr key={c.email} className="border-b border-line/40">
                        <td className="py-2 text-content-soft">{c.email}</td>
                        <td className="py-2 text-right font-mono tabular-nums text-content">
                          {c.credits}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <LinkBuilding />

            <ExportCache />

            <section className="rounded-xl border border-danger/30 bg-danger/5 p-5">
              <h2 className="mb-1 flex items-center gap-2 text-sm font-medium text-danger">
                <Trash2 size={14} aria-hidden="true" />
                Purger le cache des leads non vérifiés
              </h2>
              <p className="mb-4 text-xs leading-relaxed text-muted">
                Supprime définitivement du cache global les leads dont
                l&apos;email n&apos;a jamais été vérifié. Ils seront
                re-soumises à l&apos;enrichissement au prochain scan.
                Irréversible.
              </p>
              <div className="flex flex-wrap items-end gap-3">
                <div className="min-w-[14rem] flex-1">
                  <label className={etiquette} htmlFor="confirmation">
                    Recopiez PURGER pour confirmer
                  </label>
                  <input
                    id="confirmation"
                    className={champ}
                    value={confirmation}
                    onChange={(e) => setConfirmation(e.target.value)}
                    placeholder="PURGER"
                    autoComplete="off"
                  />
                </div>
                <button
                  type="button"
                  disabled={
                    confirmation.trim().toUpperCase() !== "PURGER" ||
                    occupe !== ""
                  }
                  onClick={() =>
                    agir("purge", async () => {
                      const r = await purgerCache(confirmation.trim());
                      setConfirmation("");
                      return r.message;
                    })
                  }
                  className="flex h-[38px] items-center gap-2 rounded-lg bg-danger px-4 text-sm font-medium text-ink transition hover:opacity-90 disabled:opacity-40"
                >
                  {occupe === "purge" && (
                    <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                  )}
                  Purger
                </button>
              </div>
            </section>
          </div>
        )}

        <PiedDePage />
      </div>
    </main>
  );
}
