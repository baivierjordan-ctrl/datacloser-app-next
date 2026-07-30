"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { demanderReset } from "@/lib/api";

const champ =
  "w-full rounded-lg border border-line bg-ink px-3 py-2.5 text-sm text-content outline-none transition focus:border-teal";

export default function PageMotDePasseOublie() {
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
        <p className="mb-1.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-teal">
          <KeyRound size={13} aria-hidden="true" /> Mot de passe
        </p>
        <h1 className="mb-1 text-[26px] font-semibold leading-tight">
          Mot de passe oublié
        </h1>

        {envoye ? (
          <>
            <p className="mb-6 mt-3 rounded-lg border border-ok/30 bg-ok/5 px-3 py-3 text-sm text-ok">
              Si un compte existe pour cette adresse, un lien vient d&apos;être
              envoyé. Il reste valable une heure.
            </p>
            <p className="text-xs text-muted">
              Pensez à regarder dans les indésirables si rien n&apos;arrive.
            </p>
          </>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted">
              Indiquez votre adresse : vous recevrez un lien pour en choisir un
              nouveau.
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
                aria-label="Adresse email"
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
                className="flex items-center justify-center gap-2 rounded-lg bg-teal px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-teal-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                <KeyRound size={15} aria-hidden="true" />
                {enCours ? "Envoi…" : "Recevoir le lien"}
              </button>
            </div>
          </>
        )}

        <p className="mt-6 text-center text-xs text-muted">
          <Link href="/connexion" className="text-teal hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </main>
  );
}
