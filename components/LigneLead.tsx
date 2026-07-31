"use client";

import { ChevronDown, Globe, Mail, MapPin } from "lucide-react";
import { BarreScore } from "./BarreScore";
import { LIBELLES_STATUT, estContactable, type Lead, type StatutEmail } from "@/lib/types";

const COULEUR_STATUT: Record<StatutEmail, string> = {
  verifie: "text-ok",
  catchall: "text-warn",
  introuvable: "text-danger",
};

const PASTILLE_STATUT: Record<StatutEmail, string> = {
  verifie: "bg-ok",
  catchall: "bg-warn",
  introuvable: "bg-danger",
};

interface Props {
  lead: Lead;
  selectionne: boolean;
  deplie: boolean;
  onSelection: (id: number) => void;
  onDeplier: (id: number) => void;
}

export function LigneLead({ lead, selectionne, deplie, onSelection, onDeplier }: Props) {
  const contactable = estContactable(lead);

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-surface transition-colors ${
        deplie ? "border-teal/30" : "border-line hover:border-line-hover"
      }`}
    >
      <div className="flex items-center gap-4 px-5 py-3">
        <input
          type="checkbox"
          checked={selectionne}
          onChange={() => onSelection(lead.id)}
          disabled={!contactable}
          aria-label={`Sélectionner ${lead.societe}`}
          className="size-4 shrink-0 cursor-pointer accent-teal disabled:cursor-not-allowed disabled:opacity-30"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <h2 className="text-[15px] font-medium">{lead.societe}</h2>
            {lead.contact && (
              <span className="text-xs text-muted">
                {lead.contact}
                {lead.role ? ` · ${lead.role}` : ""}
              </span>
            )}
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
            {lead.ville && (
              <span className="flex items-center gap-1">
                <MapPin size={11} aria-hidden="true" />
                {lead.ville}
              </span>
            )}
            <span className={`flex items-center gap-1.5 ${COULEUR_STATUT[lead.statut]}`}>
              <span
                className={`size-1.5 rounded-full ${PASTILLE_STATUT[lead.statut]}`}
                aria-hidden="true"
              />
              {LIBELLES_STATUT[lead.statut]}
            </span>
          </div>
        </div>

        {/* L'email est ce qu'on vient chercher : il occupait la place
            d'un secret alors qu'il devrait tenir la colonne. Aligné à
            largeur fixe, il se lit en descendant la liste. Masqué sur
            écran étroit, où il passerait à la ligne. */}
        <span
          className={`hidden w-56 shrink-0 truncate font-mono text-xs lg:block ${
            contactable ? "text-content-soft" : "text-muted/50"
          }`}
          title={lead.email || undefined}
        >
          {lead.email || "—"}
        </span>

        <BarreScore valeur={lead.score} />

        <button
          type="button"
          onClick={() => onDeplier(lead.id)}
          disabled={!lead.accroche}
          aria-expanded={deplie}
          aria-label={deplie ? "Masquer l'accroche" : "Voir l'accroche"}
          className="shrink-0 rounded-lg p-1.5 text-muted transition hover:bg-line hover:text-content disabled:opacity-25 disabled:hover:bg-transparent"
        >
          <ChevronDown
            size={16}
            className={`transition-transform ${deplie ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {deplie && lead.accroche && (
        <div className="border-t border-line bg-ink/60 py-4 pl-[52px] pr-5">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-teal">
            Accroche générée
          </p>
          <p className="mb-3.5 text-sm leading-relaxed text-content-soft">
            « {lead.accroche} »
          </p>
          <div className="flex flex-wrap gap-4 font-mono text-xs text-muted">
            <span className="flex items-center gap-1.5 lg:hidden">
              <Mail size={11} aria-hidden="true" />
              {lead.email}
            </span>
            {lead.site && (
              <a
                href={lead.site.startsWith("http") ? lead.site : `https://${lead.site}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition hover:text-teal"
              >
                <Globe size={11} aria-hidden="true" />
                {lead.site}
              </a>
            )}
            {lead.tel && <span>{lead.tel}</span>}
          </div>
        </div>
      )}
    </article>
  );
}
