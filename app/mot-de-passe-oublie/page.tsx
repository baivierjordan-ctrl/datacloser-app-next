"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { MarqueEnTete } from "@/components/Marque";
import { demanderReset } from "@/lib/api";
import { useLangue } from "@/lib/i18n";

const champ =
  "w-full rounded-lg border border-line bg-ink px-3 py-2.5 text-sm text-content outline-none transition focus:border-teal";

export default function PageMotDePasseOublie() {
  const { t } = useLangue();
  const [email, setEmail] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState("");

  async function valider() {
    setErreur("");
    setEnCours(true);
    try {
      await demanderReset(email.trim());
      setEnvoye(true);
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setEnCours(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">
        <MarqueEnTete />
        <p className="mb-2 flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] text-teal">
          <KeyRound size={13} aria-hidden="true" /> {t("oubli.eyebrow")}
        </p>
        <h1 className="mb-1 text-[28px] font-semibold leading-[1.12] sm:text-[32px]">
          {t("oubli.titre")}
        </h1>

        {envoye ? (
          <>
            <p className="mb-6 mt-3 rounded-lg border border-ok/30 bg-ok/5 px-3 py-3 text-sm text-ok">
              {t("oubli.envoye")}
            </p>
            <p className="text-xs text-muted">
              {t("oubli.indesirables")}
            </p>
          </>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted">
              {t("oubli.consigne")}
            </p>

            <div className="flex flex-col gap-4">
              <input
                type="email"
                autoComplete="email"
                className={champ}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && email.trim() && valider()}
                placeholder="vous@societe.be"
                aria-label={t("oubli.champEmail")}
              />

              {erreur && (
                <p
                  role="alert"
                  className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger"
                >
                  {erreur}
                </p>
              )}

              <button
                type="button"
                onClick={valider}
                disabled={email.trim() === "" || enCours}
                className="flex items-center justify-center gap-2 rounded-lg bg-teal px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                <KeyRound size={15} aria-hidden="true" />
                {enCours ? t("oubli.enCours") : t("oubli.valider")}
              </button>
            </div>
          </>
        )}

        <p className="mt-6 text-center text-xs text-muted">
          <Link href="/connexion" className="text-teal hover:underline">
            {t("oubli.retour")}
          </Link>
        </p>
      </div>
    </main>
  );
}
