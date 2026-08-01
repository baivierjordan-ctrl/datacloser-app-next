"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Check, Loader2, Save, Send } from "lucide-react";
import { Aide } from "@/components/Aide";
import { AmeliorationMessage } from "@/components/AmeliorationMessage";
import { AuditMessageBloc } from "@/components/AuditMessage";
import { ApercuOutreach } from "@/components/ApercuOutreach";
import {
  creerCampagne,
  enregistrerModele,
  recupererModeleCampagne,
  recupererModeles,
  recupererQualifications,
  recupererScans,
} from "@/lib/api";
import { useDeclarerContexte } from "@/lib/contexte-assistant";
import { useLangue, type Cle } from "@/lib/i18n";
import type { Modeles, Qualification, Relance } from "@/lib/types";

interface Props {
  /** Scan présélectionné, transmis depuis l'écran Radar. */
  sourceInitiale?: string;
  /** Un envoi est impossible sans serveur SMTP renseigné. */
  smtpConfigure: boolean;
  onCreee: (destinataires: number) => void;
}

const RELANCE_VIDE: Relance = { sujet: "", corps: "" };

export function CreationCampagne({
  sourceInitiale,
  smtpConfigure,
  onCreee,
  modeleInitial,
  actionInitiale,
}: Props & {
  modeleInitial?: string;
  actionInitiale?: "objets" | "reecrire";
}) {
  const { t } = useLangue();
  const [scans, setScans] = useState<string[]>([]);
  const [fichier, setFichier] = useState(sourceInitiale ?? "");
  const [nom, setNom] = useState("");
  const [modeles, setModeles] = useState<Modeles | null>(null);
  const [sujet, setSujet] = useState("");
  const [corps, setCorps] = useState("");

  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [retenues, setRetenues] = useState<Set<string>>(new Set());

  const [avecRelance, setAvecRelance] = useState(false);
  const [j4, setJ4] = useState<Relance>(RELANCE_VIDE);
  const [avecJ9, setAvecJ9] = useState(false);
  const [j9, setJ9] = useState<Relance>(RELANCE_VIDE);
  const [avecJ14, setAvecJ14] = useState(false);
  const [j14, setJ14] = useState<Relance>(RELANCE_VIDE);

  const [chargementQualifs, setChargementQualifs] = useState(false);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreur, setErreur] = useState("");
  const [modeleEnregistre, setModeleEnregistre] = useState(false);
  const [origineModele, setOrigineModele] = useState("");
  const [remarquesAudit, setRemarquesAudit] = useState<string[]>([]);

  // Modèles et liste des scans : une seule fois au montage.
  useEffect(() => {
    let annule = false;
    Promise.all([recupererModeles(), recupererScans()])
      .then(([m, liste]) => {
        if (annule) return;
        setModeles(m);
        setSujet(m.sujet);
        setCorps(m.corps);
        setJ4(m.relances.j4);
        setJ9(m.relances.j9);
        setJ14(m.relances.j14);
        setScans(liste);
        if (!sourceInitiale && liste.length > 0) setFichier(liste[0]);
      })
      .catch((e: Error) => !annule && setErreur(e.message));
    return () => {
      annule = true;
    };
  }, [sourceInitiale]);

  // Les qualifications dépendent du scan choisi.
  useEffect(() => {
    if (!fichier) return;
    let annule = false;
    setChargementQualifs(true);
    recupererQualifications(fichier)
      .then((liste) => {
        if (annule) return;
        setQualifications(liste);
        setRetenues(
          new Set(liste.filter((q) => q.recommandee).map((q) => q.libelle)),
        );
        setChargementQualifs(false);
      })
      .catch((e: Error) => {
        if (annule) return;
        setErreur(e.message);
        setChargementQualifs(false);
      });
    return () => {
      annule = true;
    };
  }, [fichier]);

  const destinataires = qualifications
    .filter((q) => retenues.has(q.libelle))
    .reduce((total, q) => total + q.nombre, 0);

  const pretALancer =
    smtpConfigure &&
    nom.trim() !== "" &&
    fichier !== "" &&
    sujet.trim() !== "" &&
    corps.trim() !== "" &&
    destinataires > 0 &&
    !envoiEnCours;

  // L'assistant voit le message en cours de rédaction : « ce message
  // est-il bon ? » cesse d'être une question abstraite.
  useDeclarerContexte(
    {
      ecran: "la création d'une campagne d'emails",
      details: [
        sujet ? `Objet rédigé : « ${sujet} »` : "Aucun objet rédigé",
        corps
          ? `Corps du message (${corps.split(/\s+/).filter(Boolean).length} mots) :\n${corps.slice(0, 900)}`
          : "Aucun message rédigé",
        fichier
          ? `Destinataires issus du scan « ${fichier} »`
          : "Aucun scan sélectionné",
        avecRelance
          ? `Relances activées${avecJ9 ? ", J+9" : ""}${avecJ14 ? ", J+14" : ""}`
          : "Relances désactivées",
      ],
      suggestions: [
        "Ce message obtiendra-t-il des réponses ?",
        "Comment améliorer mon objet ?",
        "À quelle fréquence relancer ?",
      ],
    },
    [sujet, corps, fichier, avecRelance, avecJ9, avecJ14],
  );

  async function lancer() {
    setErreur("");
    setEnvoiEnCours(true);
    try {
      const resultat = await creerCampagne({
        nom: nom.trim(),
        fichier,
        sujet,
        corps,
        qualifications: [...retenues],
        relance_j4: avecRelance ? j4 : null,
        relance_j9: avecRelance && avecJ9 ? j9 : null,
        relance_j14: avecRelance && avecJ9 && avecJ14 ? j14 : null,
      });
      setNom("");
      onCreee(resultat.destinataires);
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setEnvoiEnCours(false);
    }
  }

  const champ =
    "w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-content outline-none transition focus:border-teal";
  const etiquette = "mb-1.5 block text-xs text-muted";

  if (scans.length === 0 && !erreur) {
    return (
      <p className="rounded-xl border border-line bg-surface px-5 py-10 text-center text-sm text-muted">
        {t("campagne.aucunScan")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {!smtpConfigure && (
        <p className="flex items-start gap-2 rounded-lg border border-warn/30 bg-warn/5 px-3 py-2 text-xs text-warn">
          <AlertTriangle size={14} className="mt-px shrink-0" aria-hidden="true" />
          {t("campagne.smtpAvant")}
        </p>
      )}

      <section className="rounded-xl border border-line bg-surface p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={etiquette} htmlFor="nom-campagne">
              {t("campagne.nom")}
            </label>
            <input
              id="nom-campagne"
              className={champ}
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder={t("campagne.nomExemple")}
            />
          </div>
          <div>
            <label className={etiquette} htmlFor="scan-source">
              {t("campagne.scanSource")}
            </label>
            <select
              id="scan-source"
              className={champ}
              value={fichier}
              onChange={(e) => setFichier(e.target.value)}
            >
              {scans.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/\.csv$/i, "").replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="mb-1 flex items-center gap-2 text-sm font-medium">
          {t("campagne.destinataires")}
          <Aide titre={t("campagne.aideQualifTitre")}>
            {t("campagne.aideQualifTexte")}
          </Aide>
        </h2>
        <p className="mb-4 text-xs text-muted">
          {t("campagne.qualifDefaut")}
        </p>

        {chargementQualifs ? (
          <div className="h-16 animate-pulse rounded-lg border border-line" />
        ) : qualifications.length === 0 ? (
          <p className="text-xs text-muted">
            {t("campagne.aucuneAdresse")}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {qualifications.map((q) => (
              <label
                key={q.libelle}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-line px-3 py-2 text-sm transition hover:border-line-hover"
              >
                <input
                  type="checkbox"
                  className="accent-teal"
                  checked={retenues.has(q.libelle)}
                  onChange={() =>
                    setRetenues((p) => {
                      const s = new Set(p);
                      if (s.has(q.libelle)) s.delete(q.libelle);
                      else s.add(q.libelle);
                      return s;
                    })
                  }
                />
                <span className="flex-1">
                  {q.statut ? t(`fichier.${q.statut}` as Cle) : q.libelle}
                </span>
                <span className="font-mono tabular-nums text-xs text-muted">
                  {q.nombre}
                </span>
              </label>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="mb-1 text-sm font-medium">{t("campagne.message")}</h2>
        {modeles && (
          <>
            <p className="mb-2 text-xs text-muted">{t("variable.aide")}</p>
            <p className="mb-4 flex flex-wrap gap-1.5">
              {modeles.variables.map((v) => {
                // Le jeton reste identique dans les trois langues : le
                // moteur le reconnaît à l'identique, et un utilisateur
                // qui recopierait une version traduite verrait la
                // variable partir telle quelle chez son prospect. Seule
                // l'explication au survol suit la langue.
                const nom = v.replace(/[{}]/g, "");
                const explication = t(`variable.${nom}` as Cle);
                return (
                  <code
                    key={v}
                    title={explication ?? undefined}
                    className="cursor-help rounded border border-line px-1.5 py-0.5 font-mono text-[12px] text-teal"
                  >
                    {v}
                  </code>
                );
              })}
            </p>
          </>
        )}

        <label className={etiquette} htmlFor="sujet">
          {t("campagne.objet")}
        </label>
        <input
          id="sujet"
          className={`${champ} mb-4`}
          value={sujet}
          onChange={(e) => setSujet(e.target.value)}
        />

        <label className={etiquette} htmlFor="corps">
          {t("campagne.corps")}
        </label>
        <textarea
          id="corps"
          rows={12}
          className={`${champ} resize-y font-mono text-[14px] leading-relaxed`}
          value={corps}
          onChange={(e) => {
            setCorps(e.target.value);
            setModeleEnregistre(false);
          }}
        />

        <button
          type="button"
          onClick={async () => {
            try {
              await enregistrerModele(sujet, corps);
              setModeleEnregistre(true);
            } catch (e) {
              setErreur((e as Error).message);
            }
          }}
          disabled={!sujet.trim() || !corps.trim()}
          className="mt-3 flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-xs text-muted transition hover:border-line-hover hover:text-content disabled:cursor-not-allowed disabled:opacity-40"
        >
          {modeleEnregistre ? (
            <>
              <Check size={13} aria-hidden="true" /> {t("campagne.modeleEnregistre")}
            </>
          ) : (
            <>
              <Save size={13} aria-hidden="true" /> {t("campagne.enregistrerModele")}
            </>
          )}
        </button>

        {origineModele && (
          <p className="mt-3 rounded-lg border border-teal/30 bg-teal/5 px-3 py-2 text-xs text-muted">
            {t("campagne.origineAvant")} {origineModele}{t("campagne.origineApres")}
          </p>
        )}

        <AmeliorationMessage
          sujet={sujet}
          corps={corps}
          onAppliquer={(s, c) => {
            setSujet(s);
            setCorps(c);
            setModeleEnregistre(false);
          }}
          onChangerSujet={(s) => {
            setSujet(s);
            setModeleEnregistre(false);
          }}
          actionAuChargement={actionInitiale}
          remarques={remarquesAudit}
        />

        <AuditMessageBloc
          sujet={sujet}
          corps={corps}
          onAppliquer={(s, c) => {
            setSujet(s);
            setCorps(c);
            setModeleEnregistre(false);
            setRemarquesAudit([]);
          }}
          onRemarques={setRemarquesAudit}
        />
      </section>

      <ApercuOutreach fichier={fichier} sujet={sujet} corps={corps} />

      <section className="rounded-xl border border-line bg-surface p-5">
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            className="accent-teal"
            checked={avecRelance}
            onChange={(e) => setAvecRelance(e.target.checked)}
          />
          {t("campagne.activerRelances")}
          <Aide titre={t("campagne.aideRelanceTitre")}>
            {t("campagne.aideRelanceTexte")}
          </Aide>
        </label>
        <p className="mt-1.5 text-xs text-muted">
          {t("campagne.relanceDetail")}
        </p>

        {avecRelance && (
          <div className="mt-4 flex flex-col gap-4 border-l border-line pl-4">
            <ChampsRelance titre={t("campagne.relanceJ4")} valeur={j4} onChange={setJ4} />

            <label className="flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                className="accent-teal"
                checked={avecJ9}
                onChange={(e) => setAvecJ9(e.target.checked)}
              />
              {t("campagne.ajouterJ9")}
            </label>
            {avecJ9 && (
              <ChampsRelance titre={t("campagne.relanceJ9")} valeur={j9} onChange={setJ9} />
            )}

            {avecJ9 && (
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  className="accent-teal"
                  checked={avecJ14}
                  onChange={(e) => setAvecJ14(e.target.checked)}
                />
                {t("campagne.ajouterJ14")}
              </label>
            )}
            {avecJ9 && avecJ14 && (
              <ChampsRelance titre={t("campagne.relanceJ14")} valeur={j14} onChange={setJ14} />
            )}
          </div>
        )}
      </section>

      {erreur && (
        <p
          role="alert"
          className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger"
        >
          {erreur}
        </p>
      )}

      <div className="sticky bottom-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface/95 px-5 py-3.5 shadow-lg shadow-black/5 backdrop-blur">
        <div className="min-w-0 text-sm">
          <p className="text-content">
            <span className="font-mono tabular-nums">{destinataires}</span>{" "}
            {destinataires > 1 ? t("outreach.destinataires") : t("outreach.destinataire")} ·{" "}
            <span className="font-mono tabular-nums text-teal">
              {destinataires}
            </span>{" "}
            {destinataires > 1 ? t("campagne.credits") : t("campagne.credit")}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {t("campagne.factureRappel")}
          </p>
        </div>
        <button
          type="button"
          onClick={lancer}
          disabled={!pretALancer}
          className="flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {envoiEnCours ? (
            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
          ) : (
            <Send size={14} aria-hidden="true" />
          )}
          {envoiEnCours ? t("campagne.creation") : t("campagne.lancer")}
        </button>
      </div>
    </div>
  );
}

function ChampsRelance({
  titre,
  valeur,
  onChange,
}: {
  titre: string;
  valeur: Relance;
  onChange: (r: Relance) => void;
}) {
  const { t } = useLangue();
  const champ =
    "w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-content outline-none transition focus:border-teal";
  return (
    <div>
      <h3 className="mb-2 text-xs font-medium text-muted">{titre}</h3>
      <input
        className={`${champ} mb-2`}
        value={valeur.sujet}
        onChange={(e) => onChange({ ...valeur, sujet: e.target.value })}
        placeholder={t("campagne.objet")}
        aria-label={`${titre} ${t("campagne.suffixeObjet")}`}
      />
      <textarea
        rows={6}
        className={`${champ} resize-y font-mono text-[14px] leading-relaxed`}
        value={valeur.corps}
        onChange={(e) => onChange({ ...valeur, corps: e.target.value })}
        placeholder={t("campagne.corps")}
        aria-label={`${titre} ${t("campagne.suffixeCorps")}`}
      />
    </div>
  );
}
