"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Check, Loader2, Sparkles, Wand2 } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { PiedDePage } from "@/components/PiedDePage";
import {
  SessionExpiree,
  analyserSite,
  enregistrerProfil,
  recupererProfil,
} from "@/lib/api";
import { lireSession } from "@/lib/session";
import {
  LIBELLES_PROFIL,
  type ModeMetier,
  type ProfilEntreprise,
} from "@/lib/types";

const champ =
  "w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-content outline-none transition focus:border-teal";
const etiquette = "mb-1.5 block text-xs text-muted";

const PROFIL_VIDE: ProfilEntreprise = {
  company_name: "",
  website: "",
  sector: "",
  offer_description: "",
  icp_sectors: "",
  icp_company_size: "",
  icp_geography: "",
  differentiator: "",
  keywords: "",
};

export default function PageEntreprise() {
  const router = useRouter();
  const [profil, setProfil] = useState<ProfilEntreprise>(PROFIL_VIDE);
  const [tailles, setTailles] = useState<string[]>([]);
  const [modes, setModes] = useState<ModeMetier[]>([]);
  const [completion, setCompletion] = useState(0);

  const [chargement, setChargement] = useState(true);
  const [enregistrement, setEnregistrement] = useState(false);
  const [analyse, setAnalyse] = useState(false);
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    if (!lireSession()) {
      router.replace("/connexion");
      return;
    }
    recupererProfil()
      .then((r) => {
        setProfil(r.profil);
        setTailles(r.tailles);
        setModes(r.modes);
        setCompletion(r.completion);
        setChargement(false);
      })
      .catch((e: Error) => {
        if (e instanceof SessionExpiree) {
          router.replace("/connexion");
          return;
        }
        setErreur(e.message);
        setChargement(false);
      });
  }, [router]);

  function modifier(cle: keyof ProfilEntreprise, valeur: string) {
    setProfil((p) => ({ ...p, [cle]: valeur }));
    setMessage("");
  }

  async function enregistrer() {
    setErreur("");
    setMessage("");
    setEnregistrement(true);
    try {
      const r = await enregistrerProfil(profil);
      setCompletion(r.completion);
      setMessage("Profil enregistré. Le moteur cible désormais votre activité.");
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setEnregistrement(false);
    }
  }

  async function analyser() {
    setErreur("");
    setMessage("");
    setAnalyse(true);
    try {
      const r = await analyserSite(url.trim());
      setProfil((p) => ({ ...p, ...r.profil }));
      setMessage("Profil pré-rempli depuis votre site. Vérifiez, ajustez, puis enregistrez.");
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setAnalyse(false);
    }
  }

  function appliquerMode(mode: ModeMetier) {
    setProfil((p) => ({ ...p, ...mode.profil }));
    setMessage(`Mode « ${mode.libelle} » appliqué. Ajustez puis enregistrez.`);
  }

  const texte = (cle: keyof ProfilEntreprise, placeholder = "") => (
    <div>
      <label className={etiquette} htmlFor={cle}>
        {LIBELLES_PROFIL[cle]}
      </label>
      <input
        id={cle}
        className={champ}
        value={profil[cle]}
        onChange={(e) => modifier(cle, e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );

  const zone = (cle: keyof ProfilEntreprise, placeholder = "") => (
    <div>
      <label className={etiquette} htmlFor={cle}>
        {LIBELLES_PROFIL[cle]}
      </label>
      <textarea
        id={cle}
        rows={4}
        className={`${champ} resize-y`}
        value={profil[cle]}
        onChange={(e) => modifier(cle, e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <main className="min-h-screen px-6 pb-16 pt-6">
      <div className="mx-auto max-w-5xl">
        <Navigation />

        <header className="mb-6">
          <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-teal">
            <Building2 size={13} aria-hidden="true" /> Mon entreprise
          </p>
          <h1 className="text-[30px] font-semibold leading-[1.1] sm:text-[36px]">
            Votre profil de ciblage
          </h1>
          <p className="mt-2 text-sm text-muted">
            Ce profil nourrit la notation des leads et la rédaction des
            accroches. Plus il est précis, plus le moteur vise juste.
          </p>
        </header>

        {chargement ? (
          <div className="flex flex-col gap-3" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-xl border border-line bg-surface"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <section className="rounded-xl border border-line bg-surface p-5">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted">Profil complété</span>
                <span className="font-mono tabular-nums text-content">
                  {completion} %
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-ink">
                <div
                  className="h-full rounded-full bg-teal transition-all"
                  style={{ width: `${completion}%` }}
                  role="progressbar"
                  aria-valuenow={completion}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Complétion du profil"
                />
              </div>
            </section>

            <section className="rounded-xl border border-line bg-surface p-5">
              <h2 className="mb-1 flex items-center gap-2 text-sm font-medium">
                <Sparkles size={14} className="text-teal" aria-hidden="true" />
                Démarrage rapide
              </h2>
              <p className="mb-4 text-xs text-muted">
                Un modèle de départ selon votre activité. Tout reste modifiable.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {modes.map((mode) => (
                  <button
                    key={mode.cle}
                    type="button"
                    onClick={() => appliquerMode(mode)}
                    className="rounded-lg border border-line p-3 text-left transition hover:border-teal"
                  >
                    <span className="block text-sm font-medium">{mode.libelle}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted">
                      {mode.description}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-line bg-surface p-5">
              <h2 className="mb-1 flex items-center gap-2 text-sm font-medium">
                <Wand2 size={14} className="text-teal" aria-hidden="true" />
                Remplir depuis votre site
              </h2>
              <p className="mb-3 text-xs text-muted">
                Le moteur lit votre site et propose un profil. Rien n&apos;est
                enregistré sans votre validation.
              </p>
              <div className="flex flex-wrap gap-2">
                <input
                  className={`${champ} flex-1`}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && url.trim() && !analyse && analyser()
                  }
                  placeholder="https://votre-site.be"
                  aria-label="Adresse de votre site"
                />
                <button
                  type="button"
                  onClick={analyser}
                  disabled={url.trim() === "" || analyse}
                  className="flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm text-muted transition hover:border-line-hover hover:text-content disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {analyse && (
                    <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                  )}
                  {analyse ? "Analyse…" : "Analyser"}
                </button>
              </div>
            </section>

            <section className="rounded-xl border border-line bg-surface p-5">
              <h2 className="mb-4 text-sm font-medium">Votre activité</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {texte("company_name", "DataCloser")}
                {texte("website", "https://datacloser.com")}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {texte("sector", "SaaS B2B, agence web, conseil…")}
                {texte("differentiator", "Ce qui vous distingue en une phrase")}
              </div>
              <div className="mt-4">
                {zone(
                  "offer_description",
                  "Décrivez en deux ou trois phrases ce que vous vendez et à qui.",
                )}
              </div>
            </section>

            <section className="rounded-xl border border-line bg-surface p-5">
              <h2 className="mb-1 text-sm font-medium">Vos clients idéaux</h2>
              <p className="mb-4 text-xs text-muted">
                Sert à écarter les leads hors cible avant qu&apos;ils ne
                consomment vos crédits.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {texte("icp_sectors", "Agences web, PME industrie, consultants…")}
                <div>
                  <label className={etiquette} htmlFor="icp_company_size">
                    {LIBELLES_PROFIL.icp_company_size}
                  </label>
                  <select
                    id="icp_company_size"
                    className={champ}
                    value={profil.icp_company_size}
                    onChange={(e) => modifier("icp_company_size", e.target.value)}
                  >
                    {tailles.map((taille) => (
                      <option key={taille} value={taille}>
                        {taille || "Non précisé"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {texte("icp_geography", "Belgique, France, Luxembourg…")}
                {texte("keywords", "leads, prospection, cold email…")}
              </div>
            </section>

            {erreur && (
              <p
                role="alert"
                className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger"
              >
                {erreur}
              </p>
            )}
            {message && (
              <p
                role="status"
                className="flex items-center gap-2 rounded-lg border border-ok/30 bg-ok/5 px-3 py-2 text-xs text-ok"
              >
                <Check size={13} aria-hidden="true" /> {message}
              </p>
            )}

            <div className="sticky bottom-6 flex items-center justify-end rounded-xl border border-line bg-surface/95 px-5 py-3.5 backdrop-blur">
              <button
                type="button"
                onClick={enregistrer}
                disabled={enregistrement}
                className="flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-ink transition hover:bg-teal-hover disabled:opacity-50"
              >
                {enregistrement && (
                  <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                )}
                {enregistrement ? "Enregistrement…" : "Enregistrer mon profil"}
              </button>
            </div>
          </div>
        )}
        <PiedDePage />
      </div>
    </main>
  );
}
