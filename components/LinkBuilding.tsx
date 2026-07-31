"use client";

import { useEffect, useRef, useState } from "react";
import { Link2, Loader2, Play } from "lucide-react";
import { etatBacklinks, lancerBacklinks } from "@/lib/api";
import type { EtatBacklinks } from "@/lib/types";

const champ =
  "w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-content outline-none transition focus:border-teal";
const etiquette = "mb-1.5 block text-xs text-muted";

const SUJETS_PAR_DEFAUT: Record<string, string> = {
  fr: "prospection B2B\ngénération de leads\ncold email\nCRM PME\nautomatisation commerciale",
  nl: "B2B prospectie\nleadgeneratie\ncold e-mail Nederland\nCRM KMO",
};

/**
 * Recherche de domaines pour le référencement de DataCloser.
 *
 * Le pipeline dure plusieurs minutes : il tourne côté serveur et
 * l'écran interroge son journal, comme pour une chasse. Fermer la page
 * ne l'interrompt pas.
 */
export function LinkBuilding() {
  const [langue, setLangue] = useState("fr");
  const [sujets, setSujets] = useState(SUJETS_PAR_DEFAUT.fr);
  const [maximum, setMaximum] = useState(20);
  const [daMin, setDaMin] = useState(10);
  const [scoreMin, setScoreMin] = useState(5);

  const [etat, setEtat] = useState<EtatBacklinks | null>(null);
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const finJournal = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let annule = false;

    function interroger() {
      etatBacklinks()
        .then((r) => {
          if (!annule) setEtat(r);
        })
        .catch(() => {});
    }

    interroger();
    // Tant qu'une recherche tourne, on suit son avancement.
    const minuteur = setInterval(interroger, 4000);
    return () => {
      annule = true;
      clearInterval(minuteur);
    };
  }, []);

  useEffect(() => {
    if (etat?.en_cours) {
      finJournal.current?.scrollIntoView({ block: "end" });
    }
  }, [etat?.journal.length, etat?.en_cours]);

  async function lancer() {
    setErreur("");
    setEnvoi(true);
    try {
      await lancerBacklinks({
        sujets: sujets.split("\n").map((s) => s.trim()).filter(Boolean),
        langue,
        maximum,
        da_min: daMin,
        score_min: scoreMin,
      });
      setEtat(await etatBacklinks());
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setEnvoi(false);
    }
  }

  const actif = etat?.en_cours ?? false;
  const prospects = etat?.resultat?.prospects ?? [];

  return (
    <section className="rounded-xl border border-line bg-surface p-5">
      <h2 className="mb-1 flex items-center gap-2 text-sm font-medium">
        <Link2 size={14} className="text-teal" aria-hidden="true" />
        Link Building
      </h2>
      <p className="mb-4 text-xs leading-relaxed text-muted">
        Cherche des sites susceptibles d&apos;accepter un lien vers
        DataCloser, vérifie leur autorité et trouve un contact. La recherche
        continue si vous fermez cette page.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={etiquette} htmlFor="lb-sujets">
            Sujets, un par ligne
          </label>
          <textarea
            id="lb-sujets"
            rows={6}
            className={`${champ} resize-y font-mono text-xs`}
            value={sujets}
            onChange={(e) => setSujets(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className={etiquette} htmlFor="lb-langue">
              Langue cible
            </label>
            <select
              id="lb-langue"
              className={champ}
              value={langue}
              onChange={(e) => {
                setLangue(e.target.value);
                setSujets(SUJETS_PAR_DEFAUT[e.target.value] ?? "");
              }}
            >
              <option value="fr">Français</option>
              <option value="nl">Néerlandais</option>
            </select>
          </div>

          {[
            {
              id: "lb-max",
              libelle: `Domaines à qualifier : ${maximum}`,
              valeur: maximum,
              min: 5,
              max: 80,
              set: setMaximum,
            },
            {
              id: "lb-da",
              libelle: `Autorité minimale : ${daMin}`,
              valeur: daMin,
              min: 0,
              max: 60,
              set: setDaMin,
            },
            {
              id: "lb-score",
              libelle: `Pertinence minimale : ${scoreMin}/10`,
              valeur: scoreMin,
              min: 1,
              max: 10,
              set: setScoreMin,
            },
          ].map((curseur) => (
            <div key={curseur.id}>
              <label className={etiquette} htmlFor={curseur.id}>
                {curseur.libelle}
              </label>
              <input
                id={curseur.id}
                type="range"
                min={curseur.min}
                max={curseur.max}
                value={curseur.valeur}
                onChange={(e) => curseur.set(Number(e.target.value))}
                className="w-full accent-teal"
              />
            </div>
          ))}
        </div>
      </div>

      {erreur && (
        <p role="alert" className="mt-3 text-xs text-danger">
          {erreur}
        </p>
      )}

      <button
        type="button"
        onClick={lancer}
        disabled={actif || envoi || sujets.trim() === ""}
        className="mt-4 flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-hover disabled:opacity-40"
      >
        {actif || envoi ? (
          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
        ) : (
          <Play size={14} aria-hidden="true" />
        )}
        {actif ? "Recherche en cours…" : "Lancer la recherche"}
      </button>

      {etat && etat.journal.length > 0 && (
        <div className="mt-4 max-h-56 overflow-y-auto rounded-lg border border-line bg-ink p-3">
          <pre className="whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed text-muted">
            {etat.journal.join("\n")}
          </pre>
          <div ref={finJournal} />
        </div>
      )}

      {prospects.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs text-muted">
            <span className="font-mono tabular-nums text-content">
              {prospects.length}
            </span>{" "}
            domaines avec contact
          </p>
          <div className="max-h-72 overflow-auto rounded-lg border border-line">
            <table className="w-full text-xs">
              <tbody>
                {prospects.map((p, i) => (
                  <tr key={i} className="border-b border-line/40 last:border-0">
                    <td className="px-3 py-2 text-content-soft">
                      {String(p.domain ?? p.domaine ?? "—")}
                    </td>
                    <td className="px-3 py-2 font-mono text-muted">
                      {String(p.email ?? "—")}
                    </td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums text-muted">
                      {p.da != null ? `DA ${p.da}` : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
