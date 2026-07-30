"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { MarqueEnTete } from "@/components/Marque";
import { sInscrire } from "@/lib/api";
import { ecrireSession } from "@/lib/session";

const champ =
  "w-full rounded-lg border border-line bg-ink px-3 py-2.5 text-sm text-content outline-none transition focus:border-teal";
const etiquette = "mb-1.5 block text-xs text-muted";

export default function PageInscription() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [societe, setSociete] = useState("");
  const [adresse, setAdresse] = useState("");
  const [tva, setTva] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");

  const assezLong = motDePasse.length >= 8;
  const pret = email.trim() !== "" && assezLong && societe.trim() !== "" && !enCours;

  async function valider() {
    setErreur("");
    setEnCours(true);
    try {
      const session = await sInscrire({
        email: email.trim(),
        mot_de_passe: motDePasse,
        societe: societe.trim(),
        adresse: adresse.trim(),
        tva: tva.trim(),
      });
      ecrireSession(session);
      router.replace("/radar");
    } catch (e) {
      setErreur((e as Error).message);
      setEnCours(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">
        <MarqueEnTete />
        <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-teal">
          <UserPlus size={13} aria-hidden="true" /> Inscription
        </p>
        <h1 className="mb-1 text-[28px] font-semibold leading-[1.12] sm:text-[32px]">
          Créez votre compte
        </h1>
        <p className="mb-6 text-sm text-muted">
          50 crédits vous sont offerts pour démarrer.
        </p>

        <div className="flex flex-col gap-4">
          <div>
            <label className={etiquette} htmlFor="email">
              Adresse email professionnelle
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={champ}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className={etiquette} htmlFor="mdp">
              Mot de passe
            </label>
            <input
              id="mdp"
              type="password"
              autoComplete="new-password"
              className={champ}
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && pret && valider()}
            />
            <p
              className={`mt-1.5 text-xs ${
                motDePasse === "" ? "text-muted" : assezLong ? "text-ok" : "text-warn"
              }`}
            >
              8 caractères minimum
            </p>
          </div>

          <div>
            <label className={etiquette} htmlFor="societe">
              Société
            </label>
            <input
              id="societe"
              className={champ}
              value={societe}
              onChange={(e) => setSociete(e.target.value)}
            />
          </div>

          <div>
            <label className={etiquette} htmlFor="adresse">
              Adresse, facultatif
            </label>
            <input
              id="adresse"
              className={champ}
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
            />
          </div>

          <div>
            <label className={etiquette} htmlFor="tva">
              Numéro de TVA, facultatif
            </label>
            <input
              id="tva"
              className={champ}
              value={tva}
              onChange={(e) => setTva(e.target.value)}
              placeholder="BE0123456789"
            />
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
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-teal px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-teal-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            <UserPlus size={15} aria-hidden="true" />
            {enCours ? "Création…" : "Créer mon compte"}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Déjà inscrit ?{" "}
          <Link href="/connexion" className="text-teal hover:underline">
            Connectez-vous
          </Link>
        </p>
      </div>
    </main>
  );
}
