"use client";

import { useEffect, useState } from "react";
import { Check, Link2, Loader2, Send } from "lucide-react";
import {
  enregistrerWebhook,
  envoyerVersCrm,
  recupererWebhook,
  testerWebhook,
} from "@/lib/api";
import { useLangue } from "@/lib/i18n";

const champ =
  "w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-content outline-none transition focus:border-teal";

/**
 * Connexion CRM par webhook.
 *
 * L'adresse est enregistrée sur le compte, pas seulement en mémoire :
 * elle survit à la fermeture de l'onglet. Une adresse pointant vers un
 * réseau interne est refusée par le serveur.
 */
export function ConnexionCrm({ fichiers }: { fichiers: string[] }) {
  const { t } = useLangue();
  const [url, setUrl] = useState("");
  const [enregistree, setEnregistree] = useState("");
  const [fichier, setFichier] = useState("");
  const [occupe, setOccupe] = useState<"" | "test" | "sauvegarde" | "envoi">("");
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    recupererWebhook()
      .then((u) => {
        setUrl(u);
        setEnregistree(u);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!fichier && fichiers.length > 0) setFichier(fichiers[0]);
    // Comparaison sur le contenu : un tableau reçu en prop change
    // d'identité à chaque rendu du parent, et relancerait l'effet sans fin.
  }, [fichiers.join("|"), fichier]);

  async function agir(
    quoi: "test" | "sauvegarde" | "envoi",
    action: () => Promise<string>,
  ) {
    setErreur("");
    setMessage("");
    setOccupe(quoi);
    try {
      setMessage(await action());
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setOccupe("");
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="mb-1 flex items-center gap-2 text-sm font-medium">
          <Link2 size={14} className="text-teal" aria-hidden="true" />
          {t("crm.adresse")}
        </h2>
        <p className="mb-4 text-xs leading-relaxed text-muted">
          {t("crm.adresseDetail")}
        </p>

        <input
          className={champ}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t("crm.webhookExemple")}
          aria-label={t("crm.webhookLabel")}
          autoComplete="off"
          spellCheck={false}
        />

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={occupe !== "" || url.trim() === enregistree}
            onClick={() =>
              agir("sauvegarde", async () => {
                const r = await enregistrerWebhook(url.trim());
                setEnregistree(r.url);
                setUrl(r.url);
                return r.url
                  ? t("crm.enregistree")
                  : t("crm.effacee");
              })
            }
            className="flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {occupe === "sauvegarde" ? (
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            ) : (
              <Check size={14} aria-hidden="true" />
            )}
            {t("crm.enregistrer")}
          </button>

          <button
            type="button"
            disabled={url.trim() === "" || occupe !== ""}
            onClick={() =>
              agir("test", async () => (await testerWebhook(url.trim())).message)
            }
            className="flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm text-muted transition hover:border-line-hover hover:text-content disabled:cursor-not-allowed disabled:opacity-40"
          >
            {occupe === "test" && (
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            )}
            Tester la connexion
          </button>
        </div>

        {enregistree && (
          <p className="mt-3 truncate font-mono text-[12px] text-muted">
            Enregistrée : {enregistree}
          </p>
        )}
      </section>

      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="mb-1 text-sm font-medium">{t("crm.envoyerFichier")}</h2>
        <p className="mb-4 text-xs text-muted">
          {t("crm.envoyerDetail")}
        </p>

        {fichiers.length === 0 ? (
          <p className="text-xs text-muted">
            {t("crm.aucunFichier")}
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            <select
              className={`${champ} flex-1`}
              value={fichier}
              onChange={(e) => setFichier(e.target.value)}
              aria-label={t("crm.fichierLabel")}
            >
              {fichiers.map((f) => (
                <option key={f} value={f}>
                  {f.replace(/\.csv$/i, "").replace(/_/g, " ")}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!enregistree || fichier === "" || occupe !== ""}
              onClick={() =>
                agir("envoi", async () => {
                  const r = await envoyerVersCrm(fichier);
                  return `${r.envoyes} ${r.envoyes > 1 ? t("crm.lignesEnvoyees") : t("crm.ligneEnvoyee")}`;
                })
              }
              className="flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm text-muted transition hover:border-teal/40 hover:text-teal disabled:cursor-not-allowed disabled:opacity-40"
            >
              {occupe === "envoi" ? (
                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              ) : (
                <Send size={14} aria-hidden="true" />
              )}
              {t("crm.envoyer")}
            </button>
          </div>
        )}

        {!enregistree && fichiers.length > 0 && (
          <p className="mt-3 text-xs text-muted">
            {t("crm.adresseDabord")}
          </p>
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
      {message && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-lg border border-ok/30 bg-ok/5 px-3 py-2 text-xs text-ok"
        >
          <Check size={13} aria-hidden="true" /> {message}
        </p>
      )}
    </div>
  );
}
