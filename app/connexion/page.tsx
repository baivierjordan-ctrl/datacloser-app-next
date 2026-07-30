"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { MarqueEnTete } from "@/components/Marque";
import { seConnecter } from "@/lib/api";
import { ecrireSession } from "@/lib/session";

export default function PageConnexion() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState(false);

  async function valider() {
    if (!email.trim() || !motDePasse) {
      setErreur("Renseignez votre email et votre mot de passe.");
      return;
    }
    setErreur("");
    setEnCours(true);
    try {
      const session = await seConnecter(email.trim(), motDePasse);
      ecrireSession(session);
      router.push("/radar");
    } catch (e) {
      setErreur((e as Error).message);
      setEnCours(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <MarqueEnTete />
        <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-teal">
          DataCloser
        </p>
        <h1 className="mb-8 text-2xl font-semibold">Connexion</h1>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && valider()}
              autoComplete="email"
              className="rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-teal/50"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted">Mot de passe</span>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && valider()}
              autoComplete="current-password"
              className="rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-teal/50"
            />
          </label>

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
            disabled={enCours}
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-teal px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-teal-hover disabled:opacity-50"
          >
            <LogIn size={15} aria-hidden="true" />
            {enCours ? "Connexion…" : "Se connecter"}
          </button>
        </div>

        <p className="mt-5 text-center text-xs">
          <Link
            href="/mot-de-passe-oublie"
            className="text-muted transition hover:text-content"
          >
            Mot de passe oublié ?
          </Link>
        </p>

        <p className="mt-3 text-center text-xs text-muted">
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="text-teal hover:underline">
            Créez-en un
          </Link>
        </p>
      </div>
    </main>
  );
}
