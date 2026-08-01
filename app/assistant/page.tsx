"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, MessageSquare, Paperclip, Sparkles, X } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { PiedDePage } from "@/components/PiedDePage";
import {
  SessionExpiree,
  interrogerAssistant,
  interrogerAvecFichier,
  recupererSuggestions,
} from "@/lib/api";
import { lireSession } from "@/lib/session";
import { useLangue } from "@/lib/i18n";
import type { TourConversation } from "@/lib/types";

/**
 * Trois points qui respirent pendant l'attente.
 *
 * Le moteur met plusieurs secondes à répondre et ne diffuse pas son
 * texte au fil de l'eau : sans repère visible, l'attente passe pour une
 * panne. C'est la seule animation de l'écran.
 */
function Attente({ libelle }: { libelle: string }) {
  return (
    <span className="flex gap-1 py-1" aria-label={libelle}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 rounded-full bg-teal"
          style={{
            animation: "apparition 0.9s ease-in-out infinite alternate",
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </span>
  );
}

export default function PageAssistant() {
  const router = useRouter();
  const { t } = useLangue();
  const [tours, setTours] = useState<TourConversation[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [saisie, setSaisie] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");
  const [fichier, setFichier] = useState<File | null>(null);
  const bas = useRef<HTMLDivElement>(null);
  const champFichier = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!lireSession()) {
      router.replace("/connexion");
      return;
    }
    recupererSuggestions()
      .then(setSuggestions)
      .catch((e: Error) => {
        if (e instanceof SessionExpiree) router.replace("/connexion");
      });
  }, [router]);

  useEffect(() => {
    bas.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [tours, enCours]);

  async function envoyer(question: string) {
    const propre = question.trim();
    if ((!propre && !fichier) || enCours) return;

    setErreur("");
    setSaisie("");
    const avant = tours;
    const libelle = fichier
      ? `${propre || t("assistant.analyseFichier")}\n📎 ${fichier.name}`
      : propre;
    setTours([...avant, { role: "utilisateur", contenu: libelle }]);
    setEnCours(true);

    try {
      const { reponse } = fichier
        ? await interrogerAvecFichier(propre, fichier, avant)
        : await interrogerAssistant(propre, avant);
      setFichier(null);
      setTours((p) => [...p, { role: "assistant", contenu: reponse }]);
    } catch (e) {
      if (e instanceof SessionExpiree) {
        router.replace("/connexion");
        return;
      }
      setErreur((e as Error).message);
      // La question reste dans le champ : l'utilisateur n'a pas à la retaper.
      setSaisie(propre);
      setTours(avant);
    } finally {
      setEnCours(false);
    }
  }

  return (
    <main className="min-h-screen px-6 pb-16 pt-6">
      <div className="mx-auto max-w-3xl">
        <Navigation />

        <header className="mb-6">
          <p className="mb-2 flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] text-teal">
            <MessageSquare size={13} aria-hidden="true" /> {t("assistant.eyebrow")}
          </p>
          <h1 className="text-[30px] font-semibold leading-[1.1] sm:text-[36px]">
            {t("assistant.titre")}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {t("assistant.intro")}
          </p>
        </header>

        {tours.length === 0 && suggestions.length > 0 && (
          <div className="mb-6">
            <p className="mb-3 flex items-center gap-2 text-xs text-muted">
              <Sparkles size={13} className="text-teal" aria-hidden="true" />
              {t("assistant.pourCommencer")}
            </p>
            <div className="flex flex-col gap-2">
              {suggestions.map((suggestion, rang) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => envoyer(suggestion)}
                  style={{ animationDelay: `${rang * 50}ms` }}
                  className="apparition rounded-xl border border-line bg-surface px-4 py-3 text-left text-sm text-content-soft transition hover:border-teal/40 hover:text-content"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {tours.map((tour, i) => (
            <div
              key={i}
              className={`apparition flex ${
                tour.role === "utilisateur" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  tour.role === "utilisateur"
                    ? "rounded-br-md bg-teal/12 text-content"
                    : "rounded-bl-md border border-line bg-surface text-content-soft"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{tour.contenu}</p>
              </div>
            </div>
          ))}

          {enCours && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md border border-line bg-surface px-4 py-3">
                <Attente libelle={t("assistant.redige")} />
              </div>
            </div>
          )}

          <div ref={bas} />
        </div>

        {erreur && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger"
          >
            {erreur}
          </p>
        )}

        <div className="sticky bottom-6 mt-6">
          {fichier && (
            <div className="mb-2 flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2">
              <Paperclip size={13} className="shrink-0 text-teal" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-xs text-content-soft">
                {fichier.name}
              </span>
              <button
                type="button"
                onClick={() => setFichier(null)}
                aria-label={t("assistant.retirerFichier")}
                className="shrink-0 text-muted transition hover:text-content"
              >
                <X size={13} aria-hidden="true" />
              </button>
            </div>
          )}

          <div className="flex items-end gap-2 rounded-xl border border-line bg-surface/95 p-2 backdrop-blur">
            <input
              ref={champFichier}
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                if (f && f.size > 5 * 1024 * 1024) {
                  setErreur(t("assistant.fichierTropGros"));
                } else if (f) {
                  setErreur("");
                  setFichier(f);
                }
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => champFichier.current?.click()}
              aria-label={t("assistant.joindreFichier")}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted transition hover:text-teal"
            >
              <Paperclip size={16} aria-hidden="true" />
            </button>
            <textarea
              rows={1}
              value={saisie}
              onChange={(e) => setSaisie(e.target.value)}
              onKeyDown={(e) => {
                // Entrée envoie, Maj+Entrée passe à la ligne.
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  envoyer(saisie);
                }
              }}
              placeholder={t("assistant.question")}
              aria-label={t("assistant.questionLabel")}
              className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-content outline-none placeholder:text-muted"
            />
            <button
              type="button"
              onClick={() => envoyer(saisie)}
              disabled={(saisie.trim() === "" && !fichier) || enCours}
              aria-label={t("assistant.envoyer")}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal text-white transition hover:bg-teal-hover disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowUp size={16} aria-hidden="true" />
            </button>
          </div>
          <p className="mt-2 text-center text-[12px] text-muted">
            {t("assistant.reserve")}
          </p>
        </div>

        <PiedDePage />
      </div>
    </main>
  );
}
