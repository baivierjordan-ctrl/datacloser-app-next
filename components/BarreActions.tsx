"use client";

import { Download, Send } from "lucide-react";

interface Props {
  nombreSelectionnes: number;
  onExporter: () => void;
  onLancerCampagne: () => void;
}

export function BarreActions({ nombreSelectionnes, onExporter, onLancerCampagne }: Props) {
  const aucun = nombreSelectionnes === 0;

  return (
    <div className="sticky bottom-6 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface/95 px-5 py-3.5 backdrop-blur">
      <span className="text-sm text-muted">
        <span className="font-mono tabular-nums text-content">{nombreSelectionnes}</span>{" "}
        sélectionnés
      </span>

      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={onExporter}
          className="flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm text-muted transition hover:border-line-hover hover:text-content"
        >
          <Download size={14} aria-hidden="true" /> Exporter
        </button>
        <button
          type="button"
          onClick={onLancerCampagne}
          disabled={aucun}
          className="flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-ink transition hover:bg-teal-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={14} aria-hidden="true" /> Lancer la campagne
        </button>
      </div>
    </div>
  );
}
