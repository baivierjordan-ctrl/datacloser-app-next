"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { MarqueEnTete } from "@/components/Marque";
import { validerReset } from "@/lib/api";
import { lireSession } from "@/lib/session";

const champ =
  "w-full rounded-lg border border-line bg-ink px-3 py-2.5 text-sm text-content outline-none transition focus:border-teal";

/**
 * Le mail de réinitialisation pointe vers la racine avec ?reset_token=,
 * même forme d'URL que l'application actuelle. Basculer le front revient
 * donc à changer une variable d'environnement, sans toucher au mail.
 */
function Racine() {
  const router = useRouter();
  const jeton = useSearchParams().get("reset_token");

  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [fait, setFait] = useState(false);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    if (!jeton) router.replace(lireSession() ? "/accueil" : "/connexion");
  }, [jeton, router]);

  if (!jeton) return null;

  const assezLong = motDePasse.length >= 8;
  const identiques = motDePasse !== "" && motDePasse === confirmation;
  const pret = assezLong && identiques && !enCours;

  async function valider() {
    setErreur("");
    setEnCours(true);
    try {
      await validerReset(jeton!, motDePasse);
      setFait(true);
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
        <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-teal">
          <KeyRound size={13} aria-hidden="true" /> Réinitialisation
        </p>

        {fait ? (
          <>
            <h1 className="mb-3 text-[28px] font-semibold leading-[1.12] sm:text-[32px]">
              Mot de passe modifié
            </h1>
            <p className="mb-6 rounded-lg border border-ok/30 bg-ok/5 px-3 py-3 text-sm text-ok">
              Vous pouvez maintenant vous connecter avec votre nouveau mot de
              passe.
            </p>
            <Link
              href="/connexion"
              className="flex items-center justify-center gap-2 rounded-lg bg-teal px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-teal-hover"
            >
              Se connecter
            </Link>
          </>
        ) : (
          <>
            <h1 className="mb-1 text-[28px] font-semibold leading-[1.12] sm:text-[32px]">
              Choisissez un nouveau mot de passe
            </h1>
            <p className="mb-6 text-sm text-muted">
              Le lien reçu par email reste valable une heure.
            </p>

            <div className="flex flex-col gap-4">
              <div>
                <input
                  type="password"
                  autoComplete="new-password"
                  className={champ}
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  placeholder="Nouveau mot de passe"
                  aria-label="Nouveau mot de passe"
                />
                <p
                  className={`mt-1.5 text-xs ${
                    motDePasse === ""
                      ? "text-muted"
                      : assezLong
                        ? "text-ok"
                        : "text-warn"
                  }`}
                >
                  8 caractères minimum
                </p>
              </div>

              <div>
                <input
                  type="password"
                  autoComplete="new-password"
                  className={champ}
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && pret && valider()}
                  placeholder="Confirmez le mot de passe"
                  aria-label="Confirmation du mot de passe"
                />
                {confirmation !== "" && !identiques && (
                  <p className="mt-1.5 text-xs text-warn">
                    Les deux saisies diffèrent
                  </p>
                )}
              </div>

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
                disabled={!pret}
                className="flex items-center justify-center gap-2 rounded-lg bg-teal px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-teal-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                <KeyRound size={15} aria-hidden="true" />
                {enCours ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function Accueil() {
  return (
    <Suspense fallback={null}>
      <Racine />
    </Suspense>
  );
}
