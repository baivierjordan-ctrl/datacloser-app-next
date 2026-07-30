"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, MessageSquare, Sparkles } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { PiedDePage } from "@/components/PiedDePage";
import {
  SessionExpiree,
  interrogerAssistant,
  recupererSuggestions,
} from "@/lib/api";
import { lireSession } from "@/lib/session";
import type { TourConversation } from "@/lib/types";

/**
 * Trois points qui respirent pendant l'attente.
 *
 * Le moteur met plusieurs secondes à répondre et ne diffuse pas son
 * texte au fil de l'eau : sans repère visible, l'attente passe pour une
 * panne. C'est la seule animation de l'écran.
 */
function Attente() {
  return (
    <span className="flex gap-1 py-1" aria-label="L'assistant rédige sa réponse">
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
  const [tours, setTours] = useState<TourConversation[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [saisie, setSaisie] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");
  const bas = useRef<HTMLDivElement>(null);

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
    if (!propre || enCours) return;

    setErreur("");
    setSaisie("");
    const avant = tours;
    setTours([...avant, { role: "utilisateur", contenu: propre }]);
    setEnCours(true);

    try {
      const { reponse } = await interrogerAssistant(propre, avant);
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
          <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-teal">
            <MessageSquare size={13} aria-hidden="true" /> Assistant
          </p>
          <h1 className="text-[30px] font-semibold leading-[1.1] sm:text-[36px]">
            Une question sur votre prospection ?
          </h1>
          <p className="mt-2 text-sm text-muted">
            L&apos;assistant connaît votre activité : ses réponses portent sur
            votre cas, pas sur la prospection en général.
          </p>
        </header>

        {tours.length === 0 && suggestions.length > 0 && (
          <div className="mb-6">
            <p className="mb-3 flex items-center gap-2 text-xs text-muted">
              <Sparkles size={13} className="text-teal" aria-hidden="true" />
              Pour commencer
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
                <Attente />
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
          <div className="flex items-end gap-2 rounded-xl border border-line bg-surface/95 p-2 backdrop-blur">
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
              placeholder="Posez votre question…"
              aria-label="Votre question"
              className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-content outline-none placeholder:text-muted"
            />
            <button
              type="button"
              onClick={() => envoyer(saisie)}
              disabled={saisie.trim() === "" || enCours}
              aria-label="Envoyer la question"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal text-ink transition hover:bg-teal-hover disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowUp size={16} aria-hidden="true" />
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-muted">
            Les réponses peuvent comporter des erreurs. Vérifiez ce qui compte.
          </p>
        </div>

        <PiedDePage />
      </div>
    </main>
  );
}
