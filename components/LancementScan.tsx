"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Plus, Radar, X } from "lucide-react";
import {
  annulerScan,
  lancerScan,
  recupererOptionsRadar,
  recupererScansRadar,
} from "@/lib/api";
import {
  LIBELLES_SCAN,
  SCAN_ACTIF,
  type OptionsRadar,
  type ScanRadar,
} from "@/lib/types";

const champ =
  "w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-content outline-none transition focus:border-teal";
const etiquette = "mb-1.5 block text-xs text-muted";

export function LancementScan({ onTermine }: { onTermine: () => void }) {
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
  useEffect(() => {
    let annule = false;

    async function rafraichir() {
      try {
        const r = await recupererScansRadar();
        if (annule) return;
        setScans(r.scans);
        setActif(r.actif);
        // La chasse vient de se terminer : les résultats sont disponibles.
        if (etaitActif.current && !r.actif) onTermine();
        etaitActif.current = Boolean(r.actif);
      } catch {
        // Un échec de sondage ne doit pas afficher d'erreur : la chasse
        // continue côté serveur, on retentera au prochain tour.
      }
    }

    rafraichir();
    const minuterie = setInterval(rafraichir, 10_000);
    return () => {
      annule = true;
      clearInterval(minuterie);
    };
  }, [onTermine]);

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
    return <div className="h-40 animate-pulse rounded-xl border border-line bg-surface" />;
  }

  const villesProposees = options.villes[pays] ?? [];
  const pret = motsCles.length > 0 && lieux.length > 0 && !actif && !envoi;

  return (
    <div className="flex flex-col gap-5">
      {scanEnCours && (
        <section className="rounded-xl border border-teal/30 bg-teal/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-medium text-teal">
                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                {LIBELLES_SCAN[scanEnCours.statut] ?? scanEnCours.statut}
              </p>
              <p className="mt-1 truncate text-xs text-muted">
                {scanEnCours.mots_cles.join(", ")} — {scanEnCours.lieux.join(", ")}
              </p>
              <p className="mt-2 text-xs text-muted">
                <span className="font-mono tabular-nums text-content">
                  {scanEnCours.leads_analyses}
                </span>{" "}
                entreprises analysées
              </p>
            </div>
            {scanEnCours.statut !== "annulation_demandee" && (
              <button
                type="button"
                onClick={() => annulerScan(scanEnCours.id).catch(() => {})}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs text-muted transition hover:border-danger/40 hover:text-danger"
              >
                <X size={12} aria-hidden="true" /> Arrêter
              </button>
            )}
          </div>
          <p className="mt-3 text-xs text-muted">
            Vous pouvez fermer cette page : la chasse continue sur nos serveurs.
          </p>
        </section>
      )}

      <section className="rounded-xl border border-line bg-surface p-5">
        <label className={etiquette} htmlFor="mot-cle">
          Métiers ou mots-clés
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
            placeholder="chauffagiste, plombier, couvreur…"
          />
          <button
            type="button"
            onClick={ajouterMot}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-line px-3 text-sm text-muted transition hover:border-line-hover hover:text-content"
          >
            <Plus size={14} aria-hidden="true" /> Ajouter
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
      </section>

      <section className="rounded-xl border border-line bg-surface p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={etiquette} htmlFor="pays">
              Pays
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
              Mode de recherche
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
            <span className={etiquette}>Villes</span>
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
            Codes postaux ou communes, séparés par des virgules
          </label>
          <input
            id="zones"
            className={champ}
            value={zones}
            onChange={(e) => setZones(e.target.value)}
            placeholder="6180, 7100, Trazegnies"
          />
        </div>
      </section>

      <section className="rounded-xl border border-line bg-surface p-5">
        <label className={etiquette} htmlFor="max">
          Résultats par mot-clé et par lieu :{" "}
          <span className="font-mono tabular-nums text-content">{plafond}</span>
          {mode.includes("Maps") && maxParMot > options.plafond_maps && (
            <span className="text-warn">
              {" "}
              — Maps est limité à {options.plafond_maps}
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
            Nom du fichier, facultatif
          </label>
          <input
            id="nom-export"
            className={champ}
            value={nomExport}
            onChange={(e) => setNomExport(e.target.value)}
            placeholder="chauffagistes_hainaut"
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
            Chercher aussi les numéros de téléphone
            <span className="text-xs text-muted">(+10 crédits par numéro trouvé)</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="accent-teal"
              checked={sansSite}
              onChange={(e) => setSansSite(e.target.checked)}
            />
            Vérifier l&apos;absence de site web
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

      <div className="sticky bottom-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface/95 px-5 py-3.5 backdrop-blur">
        <span className="text-sm text-muted">
          {motsCles.length === 0 || lieux.length === 0 ? (
            "Ajoutez au moins un mot-clé et un lieu"
          ) : (
            <>
              <span className="font-mono tabular-nums text-content">{requetes}</span>{" "}
              requêtes estimées
            </>
          )}
        </span>
        <button
          type="button"
          onClick={lancer}
          disabled={!pret}
          className="flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-ink transition hover:bg-teal-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {envoi ? (
            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
          ) : (
            <Radar size={14} aria-hidden="true" />
          )}
          {actif ? "Une chasse est en cours" : "Lancer la chasse"}
        </button>
      </div>
    </div>
  );
}
