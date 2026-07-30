"use client";

import { Filter } from "lucide-react";
import type { FiltresRadar } from "@/lib/types";

interface Props {
  filtres: FiltresRadar;
  onChange: (f: FiltresRadar) => void;
}

export function BarreFiltres({ filtres, onChange }: Props) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-5 rounded-xl border border-line bg-surface px-5 py-3.5">
      <span className="flex items-center gap-2 text-xs text-muted">
        <Filter size={13} aria-hidden="true" /> Filtrer
      </span>

      <label className="flex items-center gap-3 text-sm">
        <span className="text-muted">Score min.</span>
        <input
          type="range"
          min={1}
          max={10}
          value={filtres.scoreMin}
          onChange={(e) => onChange({ ...filtres, scoreMin: Number(e.target.value) })}
          className="w-28 cursor-pointer accent-teal"
        />
        <span className="w-4 font-mono text-xs tabular-nums text-teal">
          {filtres.scoreMin}
        </span>
      </label>

      <button
        type="button"
        aria-pressed={filtres.verifiesSeuls}
        onClick={() => onChange({ ...filtres, verifiesSeuls: !filtres.verifiesSeuls })}
        className={`rounded-full border px-3 py-1 text-xs transition ${
          filtres.verifiesSeuls
            ? "border-teal/40 bg-teal/10 text-teal"
            : "border-line text-muted hover:border-line-hover hover:text-content"
        }`}
      >
        Emails vérifiés uniquement
      </button>
    </div>
  );
}
