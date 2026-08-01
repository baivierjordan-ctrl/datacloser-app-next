"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Plus, Radar, Sparkles, X } from "lucide-react";
import { ConsoleScan } from "@/components/ConsoleScan";
import { DemarrageRapide } from "@/components/DemarrageRapide";
import { HistoriqueChasses } from "@/components/HistoriqueChasses";
import {
  annulerScan,
  lancerScan,
  recupererOptionsRadar,
  recupererScansRadar,
  suggererMetiers,
} from "@/lib/api";
import {
  SCAN_ACTIF,
  type OptionsRadar,
  type PlanIcp,
  type ScanRadar,
  type SecteurRapide,
} from "@/lib/types";
import { useLangue, type Cle } from "@/lib/i18n";

const champ =
  "w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-content outline-none transition focus:border-teal";
const etiquette = "mb-1.5 block text-xs text-muted";

/** En-tête d'étape : un numéro, ce qu'on y fait, et le piège à éviter. */
function EnTeteEtape({
  numero,
  titre,
  detail,
}: {
  numero: number;
  titre: string;
  detail: string;
}) {
  return (
    <div className="mb-4 flex gap-3">
      <span
        aria-hidden="true"
        className="flex size-6 shrink-0 items-center justify-center rounded-full border border-teal/40 font-mono text-[12px] text-teal"
      >
        {numero}
      </span>
      <div className="min-w-0">
        <h2 className="text-sm font-medium">{titre}</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted">{detail}</p>
      </div>
    </div>
  );
}

export function LancementScan({
  onTermine,
  declencherIcp,
}: {
  onTermine: () => void;
  declencherIcp?: boolean;
}) {
  const { t } = useLangue();
  const [options, setOptions] = useState<OptionsRadar | null>(null);
  const [scans, setScans] = useState<ScanRadar[]>([]);
  const [actif, setActif] = useState<string | null>(null);

  const [motsCles, setMotsCles] = useState<string[]>([]);
  const [saisieMot, setSaisieMot] = useState("");
  const [pays, setPays] = useState("Belgique");
  const [villes, setVilles] = useState<Set<string>>(new Set());
  const [zones, setZones] = useState("");
  const [mode, setMode] = useState("");
  const [maxParMot, setMaxParMot] = useState(10);
  const [nomExport, setNomExport] = useState("");
  const [enrichirTel, setEnrichirTel] = useState(false);
  const [sansSite, setSansSite] = useState(false);

  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const [proposes, setProposes] = useState<string[]>([]);
  const [chargeProposes, setChargeProposes] = useState(false);
  const etaitActif = useRef(false);

  useEffect(() => {
    recupererOptionsRadar()
      .then((o) => {
        setOptions(o);
        setMode(o.modes[0]);
      })
      .catch((e: Error) => setErreur(e.message));
  }, []);

  // Tant qu'une chasse tourne, on redemande son état toutes les 10 secondes.
  // onTermine est une fonction fléchée recréée à chaque rendu du parent.
  // La passer en dépendance relançait l'effet sans fin, et l'écran
  // finissait par ne plus répondre. La référence, elle, ne change jamais.
  const surTermine = useRef(onTermine);
  useEffect(() => {
    surTermine.current = onTermine;
  }, [onTermine]);

  useEffect(() => {
    let annule = false;

    async function rafraichir() {
      try {
        const r = await recupererScansRadar();
        if (annule) return;
        setScans(r.scans);
        setActif(r.actif);
        // La chasse vient de se terminer : les résultats sont disponibles.
        if (etaitActif.current && !r.actif) surTermine.current();
        etaitActif.current = Boolean(r.actif);
      } catch {
        // Un échec de sondage ne doit pas afficher d'erreur : la chasse
        // continue côté serveur, on retentera au prochain tour.
      }
    }

    rafraichir();
    // Dix secondes pendant une chasse, où chaque seconde compte ; une
    // minute au repos, le temps de repérer une chasse lancée ailleurs
    // sans tenir le serveur éveillé pour rien.
    const minuterie = setInterval(rafraichir, actif ? 10_000 : 60_000);
    return () => {
      annule = true;
      clearInterval(minuterie);
    };
  }, [actif]);

  /** Applique une chasse déduite du profil. Rien n'est lancé. */
  function appliquerPlan(plan: PlanIcp) {
    setMotsCles(plan.mots_cles);
    setPays(plan.pays);
    setVilles(new Set(plan.villes));
    setMode(plan.mode);
    setErreur("");
  }

  /** Applique un secteur tout prêt, en gardant les villes déjà choisies. */
  function appliquerSecteur(secteur: SecteurRapide) {
    setMotsCles(secteur.mots);
    setMode(secteur.mode);
    setErreur("");
  }

  /** Recharge le formulaire avec les réglages d'une chasse passée. */
  function reprendre(scan: ScanRadar) {
    setMotsCles(scan.mots_cles ?? []);
    if (scan.pays) setPays(scan.pays);
    setVilles(new Set(scan.lieux ?? []));
    setZones("");
    if (scan.mode_recherche) setMode(scan.mode_recherche);
    setErreur("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function ajouterMot() {
    const propre = saisieMot.trim();
    if (propre && !motsCles.includes(propre)) setMotsCles([...motsCles, propre]);
    setSaisieMot("");
  }

  const lieux = [
    ...villes,
    ...zones.split(",").map((z) => z.trim()).filter(Boolean),
  ];
  const plafond =
    options && mode.includes("Maps")
      ? Math.min(maxParMot, options.plafond_maps)
      : maxParMot;
  const requetes = motsCles.length * lieux.length * plafond;

  const scanEnCours = scans.find((s) => SCAN_ACTIF.includes(s.statut));

  async function lancer() {
    setErreur("");
    setEnvoi(true);
    try {
      await lancerScan({
        mots_cles: motsCles,
        lieux,
        pays,
        mode_recherche: mode,
        max_par_mot: maxParMot,
        nom_export: nomExport,
        enrichir_tel: enrichirTel,
        verifier_absence_site: sansSite,
      });
      setMotsCles([]);
      setNomExport("");
      const r = await recupererScansRadar();
      setScans(r.scans);
      setActif(r.actif);
      etaitActif.current = Boolean(r.actif);
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setEnvoi(false);
    }
  }

  if (!options) {
    // Un échec de chargement laissait un squelette pulser indéfiniment,
    // masquant le formulaire entier sans le moindre message. L'erreur
    // doit se voir, et proposer une issue.
    if (erreur) {
      return (
        <div className="rounded-xl border border-danger/30 bg-danger/5 px-5 py-8 text-center">
          <p className="text-sm text-content">
            {t("radar.optionsIndisponibles")}
          </p>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted">
            {erreur}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-hover"
          >
            {t("radar.reessayer")}
          </button>
        </div>
      );
    }
    return <div className="h-40 animate-pulse rounded-xl border border-line bg-surface" />;
  }

  // Le contexte d'assistant est retiré de cet écran : il provoquait une
  // boucle de rendu qui rendait le Radar — et donc l'application entière,
  // puisque c'est l'écran d'arrivée — inutilisable. Il sera rétabli une
  // fois la cause établie avec certitude. L'assistant fonctionne sans,
  // il répond simplement de façon moins ciblée ici.

  const villesProposees = options.villes[pays] ?? [];
  const pret = motsCles.length > 0 && lieux.length > 0 && !actif && !envoi;

  return (
    <div className="flex flex-col gap-5">
      {scanEnCours && (
        <section className="balayage relative overflow-hidden rounded-xl border border-teal/30 bg-teal/5 p-5">
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-medium text-teal">
                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                {t(`scan.${scanEnCours.statut}` as Cle) ?? scanEnCours.statut}
              </p>
              <p className="mt-1 truncate text-xs text-muted">
                {scanEnCours.mots_cles.join(", ")} — {scanEnCours.lieux.join(", ")}
              </p>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-[32px] font-semibold leading-none tabular-nums text-content">
                  {scanEnCours.leads_analyses}
                </span>
                <span className="text-xs text-muted">{t("radar.entreprisesAnalysees")}</span>
              </p>
            </div>
            {scanEnCours.statut !== "annulation_demandee" && (
              <button
                type="button"
                onClick={() => annulerScan(scanEnCours.id).catch(() => {})}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs text-muted transition hover:border-danger/40 hover:text-danger"
              >
                <X size={12} aria-hidden="true" /> {t("radar.arreter")}
              </button>
            )}
          </div>
          <div className="relative z-10">
            <ConsoleScan id={scanEnCours.id} actif />
          </div>

          <p className="relative z-10 mt-3 text-xs text-muted">
            {t("radar.peutFermer")}
          </p>
        </section>
      )}

      <DemarrageRapide
        declencherIcp={declencherIcp}
        onPlan={appliquerPlan}
        onSecteur={appliquerSecteur}
      />

      <section className="rounded-xl border border-line bg-surface p-5">
        <EnTeteEtape
          numero={1}
          titre={t("radar.etape1Titre")}
          detail={t("radar.etape1Detail")}
        />
        <label className={etiquette} htmlFor="mot-cle">
          {t("radar.metiers")}
        </label>
        <div className="flex gap-2">
          <input
            id="mot-cle"
            className={champ}
            value={saisieMot}
            onChange={(e) => setSaisieMot(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                ajouterMot();
              }
            }}
            placeholder={t("radar.metiersExemple")}
          />
          <button
            type="button"
            onClick={ajouterMot}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-line px-3 text-sm text-muted transition hover:border-line-hover hover:text-content"
          >
            <Plus size={14} aria-hidden="true" /> {t("radar.ajouter")}
          </button>
        </div>

        {motsCles.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {motsCles.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMotsCles(motsCles.filter((x) => x !== m))}
                className="flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs text-content transition hover:border-danger/40 hover:text-danger"
              >
                {m} <X size={11} aria-hidden="true" />
              </button>
            ))}
          </div>
        )}

        {motsCles.length > 0 && (
          <div className="mt-4 border-t border-line pt-4">
            <button
              type="button"
              disabled={chargeProposes}
              onClick={async () => {
                setChargeProposes(true);
                try {
                  setProposes(await suggererMetiers(motsCles));
                } catch {
                  setProposes([]);
                } finally {
                  setChargeProposes(false);
                }
              }}
              className="flex items-center gap-2 text-xs text-muted transition hover:text-teal disabled:opacity-50"
            >
              {chargeProposes ? (
                <Loader2 size={13} className="animate-spin" aria-hidden="true" />
              ) : (
                <Sparkles size={13} aria-hidden="true" />
              )}
              {chargeProposes ? t("radar.recherche") : t("radar.proposerMetiers")}
            </button>

            {proposes.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {proposes.map((mot) => (
                  <button
                    key={mot}
                    type="button"
                    onClick={() => {
                      setMotsCles((p) => [...p, mot]);
                      setProposes((p) => p.filter((x) => x !== mot));
                    }}
                    className="flex items-center gap-1.5 rounded-full border border-dashed border-line-hover px-2.5 py-1 text-xs text-muted transition hover:border-teal hover:text-teal"
                  >
                    <Plus size={11} aria-hidden="true" /> {mot}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-line bg-surface p-5">
        <EnTeteEtape
          numero={2}
          titre={t("radar.etape2Titre")}
          detail={t("radar.etape2Detail")}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={etiquette} htmlFor="pays">
              {t("radar.pays")}
            </label>
            <select
              id="pays"
              className={champ}
              value={pays}
              onChange={(e) => {
                setPays(e.target.value);
                setVilles(new Set());
              }}
            >
              {options.pays.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={etiquette} htmlFor="mode">
              {t("radar.mode")}
            </label>
            <select
              id="mode"
              className={champ}
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              {options.modes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {villesProposees.length > 0 && (
          <div className="mt-4">
            <span className={etiquette}>{t("radar.villes")}</span>
            <div className="flex flex-wrap gap-1.5">
              {villesProposees.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() =>
                    setVilles((p) => {
                      const s = new Set(p);
                      if (s.has(v)) s.delete(v);
                      else s.add(v);
                      return s;
                    })
                  }
                  className={`rounded-full border px-2.5 py-1 text-xs transition ${
                    villes.has(v)
                      ? "border-teal bg-teal/10 text-teal"
                      : "border-line text-muted hover:border-line-hover hover:text-content"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <label className={etiquette} htmlFor="zones">
            {t("radar.zones")}
          </label>
          <input
            id="zones"
            className={champ}
            value={zones}
            onChange={(e) => setZones(e.target.value)}
            placeholder={t("radar.zonesExemple")}
          />
        </div>
      </section>

      <section className="rounded-xl border border-line bg-surface p-5">
        <EnTeteEtape
          numero={3}
          titre={t("radar.etape3Titre")}
          detail={t("radar.etape3Detail")}
        />
        <label className={etiquette} htmlFor="max">
          {t("radar.resultatsPar")}{" "}
          <span className="font-mono tabular-nums text-content">{plafond}</span>
          {mode.includes("Maps") && maxParMot > options.plafond_maps && (
            <span className="text-warn">
              {" "}
              {t("radar.mapsLimite")} {options.plafond_maps}
            </span>
          )}
        </label>
        <input
          id="max"
          type="range"
          min={5}
          max={100}
          step={5}
          value={maxParMot}
          onChange={(e) => setMaxParMot(Number(e.target.value))}
          className="w-full accent-teal"
        />

        <div className="mt-4">
          <label className={etiquette} htmlFor="nom-export">
            {t("radar.nomFichier")}
          </label>
          <input
            id="nom-export"
            className={champ}
            value={nomExport}
            onChange={(e) => setNomExport(e.target.value)}
            placeholder={t("radar.nomFichierExemple")}
          />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="accent-teal"
              checked={enrichirTel}
              onChange={(e) => setEnrichirTel(e.target.checked)}
            />
            {t("radar.chercherTel")}
            <span className="text-xs text-muted">{t("radar.chercherTelCout")}</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="accent-teal"
              checked={sansSite}
              onChange={(e) => setSansSite(e.target.checked)}
            />
            {t("radar.sansSite")}
          </label>
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

      {/* Récapitulatif avant lancement : le calcul est montré plutôt
          qu'un total opaque, et le coût est dit en toutes lettres. Un
          utilisateur ne devrait jamais découvrir la facture après coup. */}
      <div className="sticky bottom-6 z-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface/95 px-5 py-3.5 shadow-lg shadow-black/5 backdrop-blur">
        <div className="min-w-0 text-sm">
          {motsCles.length === 0 || lieux.length === 0 ? (
            <span className="text-muted">
              {t("radar.incomplet")}
            </span>
          ) : (
            <>
              <p className="text-content">
                <span className="font-mono tabular-nums">{motsCles.length}</span>{" "}
                {motsCles.length > 1 ? t("radar.metierPluriel") : t("radar.metierSingulier")} ×{" "}
                <span className="font-mono tabular-nums">{lieux.length}</span>{" "}
                {lieux.length > 1 ? t("radar.zonePluriel") : t("radar.zoneSingulier")} ×{" "}
                <span className="font-mono tabular-nums">{plafond}</span> {t("radar.resultats")}
                {" = "}
                <span className="font-mono tabular-nums text-teal">{requetes}</span>{" "}
                {t("radar.recherches")}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {t("radar.coutRappel")}
              </p>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={lancer}
          disabled={!pret}
          className="flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {envoi ? (
            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
          ) : (
            <Radar size={14} aria-hidden="true" />
          )}
          {actif ? t("radar.dejaEnCours") : t("radar.lancer")}
        </button>
      </div>

      <section className="mt-4">
        <h2 className="mb-3 text-sm font-medium">{t("radar.vosChasses")}</h2>
        <HistoriqueChasses onRelancer={reprendre} />
      </section>
    </div>
  );
}
