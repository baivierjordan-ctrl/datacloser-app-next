"use client";

import { useState } from "react";
import { Check, Lock } from "lucide-react";
import { FOURNISSEURS, JOURS, type ConfigSmtp } from "@/lib/types";
import { useLangue, type Cle } from "@/lib/i18n";

const DEFAUT: ConfigSmtp = {
  smtp_host: "smtp.gmail.com",
  smtp_port: 587,
  smtp_user: "",
  smtp_password: "",
  signature: "",
  delai_min_secondes: 60,
  plage_debut: 8,
  plage_fin: 18,
  jours_actifs: [0, 1, 2, 3, 4],
};

interface Props {
  initiale: ConfigSmtp | null;
  dejaConfigure: boolean;
  onEnregistrer: (config: ConfigSmtp) => Promise<void>;
}

export function FormulaireSmtp({ initiale, dejaConfigure, onEnregistrer }: Props) {
  const { t } = useLangue();
  const [config, setConfig] = useState<ConfigSmtp>({
    ...DEFAUT,
    ...initiale,
    // Une valeur nulle en base survivait à la fusion et partait telle
    // quelle : le serveur refusait la charge sans que rien ne l'explique.
    jours_actifs: initiale?.jours_actifs?.length
      ? initiale.jours_actifs
      : DEFAUT.jours_actifs,
    smtp_password: "",
  });
  const [enCours, setEnCours] = useState(false);
  const [succes, setSucces] = useState(false);
  const [erreur, setErreur] = useState("");

  function modifier<K extends keyof ConfigSmtp>(cle: K, valeur: ConfigSmtp[K]) {
    setConfig((c) => ({ ...c, [cle]: valeur }));
    setSucces(false);
  }

  function choisirFournisseur(nom: string) {
    const f = FOURNISSEURS[nom];
    if (f) setConfig((c) => ({ ...c, smtp_host: f.host, smtp_port: f.port }));
  }

  function basculerJour(jour: number) {
    setConfig((c) => ({
      ...c,
      jours_actifs: c.jours_actifs.includes(jour)
        ? c.jours_actifs.filter((j) => j !== jour)
        : [...c.jours_actifs, jour].sort(),
    }));
    setSucces(false);
  }

  async function valider() {
    if (!config.smtp_user.trim()) {
      setErreur(t("smtp.errExpedition"));
      return;
    }
    if (!dejaConfigure && !config.smtp_password) {
      setErreur(t("smtp.errMotDePasse"));
      return;
    }
    if (config.jours_actifs.length === 0) {
      setErreur(t("smtp.errJour"));
      return;
    }
    if (config.plage_debut >= config.plage_fin) {
      setErreur(t("smtp.errHeures"));
      return;
    }
    setErreur("");
    setEnCours(true);
    try {
      await onEnregistrer(config);
      setSucces(true);
      setConfig((c) => ({ ...c, smtp_password: "" }));
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setEnCours(false);
    }
  }

  const champ =
    "rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none transition focus:border-teal/50";

  return (
    <section className="rounded-xl border border-line bg-surface p-5">
      <h2 className="mb-1 text-[16px] font-medium">{t("smtp.titre")}</h2>
      <p className="mb-5 flex items-center gap-1.5 text-xs text-muted">
        <Lock size={11} aria-hidden="true" />
        {t("smtp.chiffre")}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-muted">{t("smtp.fournisseur")}</span>
          <select
            onChange={(e) => choisirFournisseur(e.target.value)}
            className={champ}
            defaultValue=""
          >
            <option value="">{t("smtp.personnalise")}</option>
            {Object.keys(FOURNISSEURS).map((nom) => (
              <option key={nom} value={nom}>
                {nom}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-muted">{t("smtp.hote")}</span>
          <input
            value={config.smtp_host}
            onChange={(e) => modifier("smtp_host", e.target.value)}
            className={champ}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-muted">{t("smtp.port")}</span>
          <input
            type="number"
            value={config.smtp_port}
            onChange={(e) => modifier("smtp_port", Number(e.target.value))}
            className={champ}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-muted">{t("smtp.expedition")}</span>
          <input
            type="email"
            value={config.smtp_user}
            onChange={(e) => modifier("smtp_user", e.target.value)}
            placeholder={t("smtp.expeditionExemple")}
            className={champ}
          />
        </label>

        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-xs text-muted">
            {t("smtp.motDePasse")}
            {dejaConfigure && t("smtp.motDePasseConserver")}
          </span>
          <input
            type="password"
            value={config.smtp_password ?? ""}
            onChange={(e) => modifier("smtp_password", e.target.value)}
            placeholder={dejaConfigure ? "••••••••" : ""}
            autoComplete="new-password"
            className={champ}
          />
          <span className="text-xs text-muted">
            {t("smtp.gmail")}
          </span>
        </label>

        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-xs text-muted">{t("smtp.signature")}</span>
          <textarea
            value={config.signature}
            onChange={(e) => modifier("signature", e.target.value)}
            rows={4}
            placeholder={"Jordan Baivier\nFondateur — DataCloser\ndatacloser.com"}
            className={`${champ} resize-y`}
          />
        </label>
      </div>

      <h3 className="mb-3 mt-6 text-[16px] font-medium">{t("smtp.rythme")}</h3>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-muted">
            {t("smtp.delaiMin")} — {config.delai_min_secondes}s
          </span>
          <input
            type="range"
            min={30}
            max={300}
            step={10}
            value={config.delai_min_secondes}
            onChange={(e) => modifier("delai_min_secondes", Number(e.target.value))}
            className="cursor-pointer accent-teal"
          />
          <span className="text-xs text-muted">
            {t("smtp.delaiReel")} {config.delai_min_secondes} – {config.delai_min_secondes * 2}s
          </span>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-muted">{t("smtp.debut")}</span>
          <input
            type="number"
            min={6}
            max={12}
            value={config.plage_debut}
            onChange={(e) => modifier("plage_debut", Number(e.target.value))}
            className={champ}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-muted">{t("smtp.fin")}</span>
          <input
            type="number"
            min={13}
            max={22}
            value={config.plage_fin}
            onChange={(e) => modifier("plage_fin", Number(e.target.value))}
            className={champ}
          />
        </label>
      </div>

      <fieldset className="mt-4">
        <legend className="mb-2 text-xs text-muted">{t("smtp.jours")}</legend>
        <div className="flex flex-wrap gap-2">
          {JOURS.map((_libelle, index) => {
            const actif = config.jours_actifs.includes(index);
            return (
              <button
                key={index}
                type="button"
                aria-pressed={actif}
                onClick={() => basculerJour(index)}
                className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                  actif
                    ? "border-teal/40 bg-teal/10 text-teal"
                    : "border-line text-muted hover:border-line-hover hover:text-content"
                }`}
              >
                {t(`jour.${index}` as Cle)}
              </button>
            );
          })}
        </div>
      </fieldset>

      {erreur && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger"
        >
          {erreur}
        </p>
      )}

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={valider}
          disabled={enCours}
          className="rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-hover disabled:opacity-50"
        >
          {enCours ? t("smtp.enregistrement") : t("smtp.enregistrer")}
        </button>
        {succes && (
          <span className="flex items-center gap-1.5 text-xs text-ok">
            <Check size={13} aria-hidden="true" /> {t("smtp.enregistre")}
          </span>
        )}
      </div>
    </section>
  );
}
