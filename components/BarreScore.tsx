/**
 * Score de pertinence en dix segments.
 * Choix délibéré : une jauge segmentée se compare d'un coup d'œil
 * entre plusieurs lignes, contrairement à un chiffre isolé.
 */
export function BarreScore({ valeur }: { valeur: number }) {
  return (
    <div
      className="flex shrink-0 items-center gap-2"
      title={`Pertinence ${valeur}/10`}
    >
      <div className="flex gap-[3px]" aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className={`h-4 w-[3px] rounded-full ${
              i < valeur ? "bg-teal" : "bg-line"
            }`}
          />
        ))}
      </div>
      <span className="w-3 font-mono text-xs tabular-nums text-muted">
        {valeur}
      </span>
    </div>
  );
}
