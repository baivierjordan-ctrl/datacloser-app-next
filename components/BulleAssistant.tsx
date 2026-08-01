"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUp,
  Maximize2,
  MessageSquare,
  Paperclip,
  Wand2,
  X,
} from "lucide-react";
import {
  SessionExpiree,
  interrogerAssistant,
  interrogerAvecFichier,
} from "@/lib/api";
import {
  formaterContexte,
  useContexteAssistant,
} from "@/lib/contexte-assistant";
import { lireSession } from "@/lib/session";
import type { ActionAssistant, TourConversation } from "@/lib/types";

/**
 * Assistant accessible depuis n'importe quel écran.
 *
 * La conversation vit dans ce composant et se perd à la fermeture de
 * l'onglet : c'est délibéré. Une bulle sert à poser une question dans
 * le fil du travail, pas à tenir un historique — celui-ci a sa place
 * sur l'écran Assistant, vers lequel un bouton renvoie.
 *
 * Les pièces jointes sont lues côté serveur et leur contenu joint à la
 * question. Le moteur ne voit pas les images : il le dit plutôt que de
 * faire semblant.
 */

const TAILLE_MAX_MO = 5;

function Attente() {
  return (
    <span className="flex gap-1 py-1" aria-label="L'assistant rédige">
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

export function BulleAssistant() {
  const contexte = useContexteAssistant();
  const [connecte, setConnecte] = useState(false);
  const [ouvert, setOuvert] = useState(false);
  const [tours, setTours] = useState<TourConversation[]>([]);
  // Les actions se rapportent à la dernière réponse : les conserver
  // au-delà proposerait un bouton sans rapport avec ce qui est affiché.
  const [actions, setActions] = useState<ActionAssistant[]>([]);
  const [saisie, setSaisie] = useState("");
  const [fichier, setFichier] = useState<File | null>(null);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");

  const bas = useRef<HTMLDivElement>(null);
  const champFichier = useRef<HTMLInputElement>(null);

  useEffect(() => setConnecte(Boolean(lireSession())), []);

  // Le halo attire l'oeil quelques secondes, puis se tait : une
  // animation permanente sur un tableau de bord devient une gêne.
  const [halo, setHalo] = useState(true);
  useEffect(() => {
    if (!halo) return;
    const minuteur = setTimeout(() => setHalo(false), 12_000);
    return () => clearTimeout(minuteur);
  }, [halo]);

  useEffect(() => {
    if (ouvert) bas.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [tours, enCours, ouvert]);

  // Échap ferme le panneau, comme partout ailleurs dans l'application.
  useEffect(() => {
    if (!ouvert) return;
    function auClavier(e: KeyboardEvent) {
      if (e.key === "Escape") setOuvert(false);
    }
    document.addEventListener("keydown", auClavier);
    return () => document.removeEventListener("keydown", auClavier);
  }, [ouvert]);

  async function envoyer(texte?: string) {
    const question = (texte ?? saisie).trim();
    if ((!question && !fichier) || enCours) return;

    setErreur("");
    const avant = tours;
    const libelle = fichier
      ? `${question || "Analyse ce fichier"}\n📎 ${fichier.name}`
      : question;

    setTours([...avant, { role: "utilisateur", contenu: libelle }]);
    setActions([]);
    setSaisie("");
    setEnCours(true);

    try {
      // L'écran est transmis à chaque envoi : l'utilisateur peut avoir
      // navigué entre deux questions.
      const ecran = formaterContexte(contexte);
      const resultat = fichier
        ? await interrogerAvecFichier(question, fichier, avant, ecran)
        : await interrogerAssistant(question, avant, ecran);
      const { reponse } = resultat;
      setTours((p) => [...p, { role: "assistant", contenu: reponse }]);
      setActions(resultat.actions ?? []);
      setFichier(null);
    } catch (e) {
      if (e instanceof SessionExpiree) {
        setConnecte(false);
        return;
      }
      setErreur((e as Error).message);
      // La question reste dans le champ : personne ne doit la retaper.
      setSaisie(question);
      setTours(avant);
    } finally {
      setEnCours(false);
    }
  }

  function choisirFichier(f: File | null) {
    setErreur("");
    if (!f) return;
    if (f.size > TAILLE_MAX_MO * 1024 * 1024) {
      setErreur(`Fichier trop volumineux. Maximum ${TAILLE_MAX_MO} Mo.`);
      return;
    }
    setFichier(f);
  }

  // Rien à proposer à quelqu'un qui n'est pas connecté.
  if (!connecte) return null;

  if (!ouvert) {
    return (
      <button
        type="button"
        onClick={() => {
          setOuvert(true);
          setHalo(false);
        }}
        aria-label="Ouvrir l'assistant"
        className="group fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-teal py-3.5 pl-4 pr-5 text-white shadow-xl shadow-teal/25 transition hover:bg-teal-hover hover:shadow-teal/40"
      >
        {/* Halo pulsant : sur un écran dense, une pastille unie se
            confond avec le reste. Il s'arrête au premier survol pour ne
            pas devenir une gêne permanente. */}
        {halo && (
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10 animate-ping rounded-full bg-teal/40 group-hover:hidden"
            style={{ animationDuration: "2.5s" }}
          />
        )}
        <MessageSquare size={20} aria-hidden="true" />
        <span className="text-sm font-medium">Assistant</span>
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Assistant"
      className="apparition fixed bottom-5 right-5 z-40 flex max-h-[min(32rem,80vh)] w-[min(24rem,calc(100vw-2.5rem))] flex-col rounded-xl border border-line bg-surface shadow-lg shadow-slate-900/20"
    >
      <header className="flex items-center gap-2 border-b border-line px-4 py-3">
        <MessageSquare size={15} className="text-teal" aria-hidden="true" />
        <p className="flex-1 text-sm font-medium">Assistant</p>
        <Link
          href="/assistant"
          onClick={() => setOuvert(false)}
          aria-label="Ouvrir en plein écran"
          className="text-muted transition hover:text-content"
        >
          <Maximize2 size={15} aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={() => setOuvert(false)}
          aria-label="Fermer"
          className="text-muted transition hover:text-content"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {tours.length === 0 && (
          <>
            <p className="text-xs leading-relaxed text-muted">
              {contexte
                ? `Je vois ce que vous avez sous les yeux : ${contexte.ecran}.`
                : "Posez une question sur votre prospection, ou joignez un fichier de leads pour que je l'analyse."}
            </p>

            {/* Les suggestions viennent de l'écran : une question posée
                au bon moment vaut mieux qu'un champ vide. */}
            {contexte?.suggestions?.length ? (
              <div className="mt-3 flex flex-col gap-1.5">
                {contexte.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => envoyer(suggestion)}
                    className="rounded-lg border border-line px-3 py-2 text-left text-xs text-content-soft transition hover:border-teal/40 hover:text-content"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : null}
          </>
        )}

        <div className="flex flex-col gap-3">
          {tours.map((tour, i) => (
            <div
              key={i}
              className={`flex ${tour.role === "utilisateur" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
                  tour.role === "utilisateur"
                    ? "rounded-br-md bg-teal/12 text-content"
                    : "rounded-bl-md border border-line bg-ink text-content-soft"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{tour.contenu}</p>
              </div>
            </div>
          ))}

          {/* Conseiller sans permettre d'agir laisse l'utilisateur
              recopier à la main ce qui vient d'être dit. */}
          {actions.length > 0 && !enCours && (
            <div className="flex flex-wrap gap-2">
              {actions.map((action) => (
                <Link
                  key={action.type}
                  href={action.lien}
                  onClick={() => setOuvert(false)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-teal px-3 py-1.5 text-xs font-medium text-white transition hover:bg-teal-hover"
                >
                  <Wand2 size={12} aria-hidden="true" />
                  {action.libelle}
                </Link>
              ))}
            </div>
          )}

          {enCours && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md border border-line bg-ink px-3 py-2">
                <Attente />
              </div>
            </div>
          )}
          <div ref={bas} />
        </div>
      </div>

      {erreur && (
        <p role="alert" className="px-4 pb-2 text-xs text-danger">
          {erreur}
        </p>
      )}

      {fichier && (
        <div className="mx-4 mb-2 flex items-center gap-2 rounded-lg border border-line bg-ink px-3 py-2">
          <Paperclip size={13} className="shrink-0 text-teal" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate text-xs text-content-soft">
            {fichier.name}
          </span>
          <button
            type="button"
            onClick={() => setFichier(null)}
            aria-label="Retirer le fichier"
            className="shrink-0 text-muted transition hover:text-content"
          >
            <X size={13} aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-1.5 border-t border-line p-2">
        <input
          ref={champFichier}
          type="file"
          className="hidden"
          onChange={(e) => {
            choisirFichier(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => champFichier.current?.click()}
          aria-label="Joindre un fichier"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted transition hover:text-teal"
        >
          <Paperclip size={16} aria-hidden="true" />
        </button>

        <textarea
          rows={1}
          value={saisie}
          onChange={(e) => setSaisie(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              envoyer();
            }
          }}
          placeholder="Votre question…"
          aria-label="Votre question"
          className="max-h-28 flex-1 resize-none bg-transparent px-1 py-1.5 text-[13px] text-content outline-none placeholder:text-muted"
        />

        <button
          type="button"
          onClick={() => envoyer()}
          disabled={(saisie.trim() === "" && !fichier) || enCours}
          aria-label="Envoyer"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-teal text-white transition hover:bg-teal-hover disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowUp size={15} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
