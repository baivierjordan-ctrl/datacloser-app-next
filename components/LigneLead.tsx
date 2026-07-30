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
      <div className="flex items-center gap-4 px-5 py-4">
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
            {lead.site && (
              <span className="flex items-center gap-1">
                <Globe size={11} aria-hidden="true" />
                {lead.site}
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
            <span className="flex items-center gap-1.5">
              <Mail size={11} aria-hidden="true" />
              {lead.email}
            </span>
            {lead.tel && <span>{lead.tel}</span>}
          </div>
        </div>
      )}
    </article>
  );
}
