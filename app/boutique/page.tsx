"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Coins, Ticket } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { SessionExpiree, recupererBoutique, verifierPromo } from "@/lib/api";
import { lireSession } from "@/lib/session";
import type { Boutique, Offre } from "@/lib/types";

const champ =
  "w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-content outline-none transition focus:border-teal";

function CarteOffre({ offre, mise }: { offre: Offre; mise: boolean }) {
  return (
    <div
      className={`flex flex-col rounded-xl border p-5 ${
        mise ? "border-teal/40 bg-teal/5" : "border-line bg-surface"
      }`}
    >
      <h3 className="text-sm font-medium">{offre.nom}</h3>
      <p className="mt-2">
        <span className="text-[26px] font-semibold leading-none">{offre.prix}</span>
        <span className="ml-1.5 text-xs text-muted">{offre.periode}</span>
      </p>

      <ul className="mt-4 flex flex-1 flex-col gap-2 text-xs text-muted">
        {offre.avantages.map((avantage) => (
          <li key={avantage} className="flex items-start gap-2">
            <Check size={13} className="mt-px shrink-0 text-teal" aria-hidden="true" />
            {avantage}
          </li>
        ))}
      </ul>

      <a
        href={offre.lien}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-5 rounded-lg px-4 py-2 text-center text-sm font-medium transition ${
          mise
            ? "bg-teal text-ink hover:bg-teal-hover"
            : "border border-line text-content hover:border-teal"
        }`}
      >
        Choisir {offre.nom}
      </a>
    </div>
  );
}

export default function PageBoutique() {
  const router = useRouter();
  const [donnees, setDonnees] = useState<Boutique | null>(null);
  const [vue, setVue] = useState<"abonnements" | "packs">("abonnements");
  const [code, setCode] = useState("");
  const [promo, setPromo] = useState<{
    libelle: string;
    message: string;
    lien: string;
  } | null>(null);
  const [erreurPromo, setErreurPromo] = useState("");
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    if (!lireSession()) {
      router.replace("/connexion");
      return;
    }
    recupererBoutique()
      .then(setDonnees)
      .catch((e: Error) => {
        if (e instanceof SessionExpiree) {
          router.replace("/connexion");
          return;
        }
        setErreur(e.message);
      });
  }, [router]);

  async function appliquer() {
    setErreurPromo("");
    setPromo(null);
    try {
      setPromo(await verifierPromo(code));
    } catch (e) {
      setErreurPromo((e as Error).message);
    }
  }

  const offres = donnees
    ? vue === "abonnements"
      ? donnees.abonnements
      : donnees.packs
    : [];

  return (
    <main className="min-h-screen px-6 pb-16 pt-6">
      <div className="mx-auto max-w-5xl">
        <Navigation />

        <header className="mb-6">
          <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-teal">
            <Coins size={13} aria-hidden="true" /> Boutique
          </p>
          <h1 className="text-[30px] font-semibold leading-[1.1] sm:text-[36px]">
            Recharger vos crédits
          </h1>
          {donnees && (
            <p className="mt-2 text-sm text-muted">
              Solde actuel :{" "}
              <span className="font-mono tabular-nums text-content">
                {donnees.credits}
              </span>{" "}
              crédits. Les crédits achetés n&apos;expirent pas.
            </p>
          )}
        </header>

        {erreur && (
          <p
            role="alert"
            className="mb-4 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger"
          >
            {erreur}
          </p>
        )}

        <section className="mb-5 rounded-xl border border-line bg-surface p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-medium">
            <Ticket size={14} className="text-teal" aria-hidden="true" />
            Vous avez un code promotionnel ?
          </h2>
          <div className="flex flex-wrap gap-2">
            <input
              className={`${champ} flex-1`}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && code.trim() && appliquer()}
              placeholder="PRODUCTHUNT"
              aria-label="Code promotionnel"
            />
            <button
              type="button"
              onClick={appliquer}
              disabled={code.trim() === ""}
              className="rounded-lg border border-line px-4 py-2 text-sm text-muted transition hover:border-line-hover hover:text-content disabled:cursor-not-allowed disabled:opacity-40"
            >
              Appliquer
            </button>
          </div>

          {erreurPromo && (
            <p role="alert" className="mt-3 text-xs text-danger">
              {erreurPromo}
            </p>
          )}

          {promo && (
            <div className="mt-3 rounded-lg border border-ok/30 bg-ok/5 p-3">
              <p className="text-sm font-medium text-ok">{promo.libelle}</p>
              <p className="mt-1 text-xs text-muted">{promo.message}</p>
              <a
                href={promo.lien}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block rounded-lg bg-teal px-4 py-2 text-sm font-medium text-ink transition hover:bg-teal-hover"
              >
                En profiter
              </a>
            </div>
          )}
        </section>

        <div className="mb-5 flex gap-1">
          {(["abonnements", "packs"] as const).map((cible) => (
            <button
              key={cible}
              type="button"
              onClick={() => setVue(cible)}
              aria-current={vue === cible ? "true" : undefined}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                vue === cible
                  ? "bg-surface text-content"
                  : "text-muted hover:text-content"
              }`}
            >
              {cible === "abonnements" ? "Abonnements" : "Recharges ponctuelles"}
            </button>
          ))}
        </div>

        {donnees ? (
          <div
            className={`grid gap-4 ${
              vue === "abonnements" ? "sm:grid-cols-3" : "sm:grid-cols-2"
            }`}
          >
            {offres.map((offre) => (
              <CarteOffre
                key={offre.cle}
                offre={offre}
                mise={offre.cle === "pro"}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-60 animate-pulse rounded-xl border border-line bg-surface"
              />
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-muted">
          Le paiement est traité par Stripe. Nous n&apos;avons accès à aucune
          donnée bancaire.
        </p>
      </div>
    </main>
  );
}
