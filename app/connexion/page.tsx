"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { IllustrationRadar } from "@/components/IllustrationRadar";
import { MarqueEnTete } from "@/components/Marque";
import { seConnecter } from "@/lib/api";
import { ecrireSession } from "@/lib/session";
import { useLangue } from "@/lib/i18n";

export default function PageConnexion() {
  const router = useRouter();
  const { t } = useLangue();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState(false);

  async function valider() {
    if (!email.trim() || !motDePasse) {
      setErreur(t("connexion.champsManquants"));
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
    <main className="flex min-h-screen">
      <div className="flex flex-1 items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">
        <MarqueEnTete />
        <h1 className="mb-8 text-2xl font-semibold">{t("connexion.titre")}</h1>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted">{t("connexion.email")}</span>
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
            <span className="text-xs text-muted">{t("connexion.motDePasse")}</span>
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
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-teal px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-hover disabled:opacity-50"
          >
            <LogIn size={15} aria-hidden="true" />
            {enCours ? t("connexion.enCours") : t("connexion.valider")}
          </button>
        </div>

        <p className="mt-5 text-center text-xs">
          <Link
            href="/mot-de-passe-oublie"
            className="text-muted transition hover:text-content"
          >
            {t("connexion.motDePasseOublie")}
          </Link>
        </p>

        <p className="mt-3 text-center text-xs text-muted">
          {t("connexion.pasDeCompte")}{" "}
          <Link href="/inscription" className="text-teal hover:underline">
            {t("connexion.creerCompte")}
          </Link>
        </p>
      </div>
      </div>

      <aside
        aria-hidden="true"
        className="relative hidden flex-1 items-center justify-center overflow-hidden bg-encre lg:flex"
      >
        <div className="max-w-md px-12">
          <IllustrationRadar classe="mx-auto mb-8 w-64 text-white/70" />
          <p className="text-center font-display text-xl font-semibold leading-snug text-white">
            {t("connexion.accrocheTitre")}
          </p>
          <p className="mt-3 text-center text-sm leading-relaxed text-white/60">
            {t("connexion.accrocheTexte")}
          </p>
        </div>
      </aside>
    </main>
  );
}
