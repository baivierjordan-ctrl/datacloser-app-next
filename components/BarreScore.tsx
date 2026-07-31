/**
 * Score de pertinence en dix segments.
 *
 * Choix délibéré : une jauge segmentée se compare d'un coup d'œil
 * entre plusieurs lignes, contrairement à un chiffre isolé. C'est le
 * motif « signal » de l'application — la même grammaire visuelle
 * revient partout où une intensité doit se lire d'un regard.
 *
 * Les segments allumés montent en hauteur : la barre a une silhouette,
 * lisible même du coin de l'œil.
 */
export function BarreScore({ valeur }: { valeur: number }) {
  return (
    <div
      className="flex shrink-0 items-center gap-2"
      title={`Pertinence ${valeur}/10`}
    >
      <div className="flex items-end gap-[3px]" aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            style={{ height: `${8 + i * 0.9}px` }}
            className={`w-[3px] rounded-full transition-colors ${
              i < valeur ? "bg-vif" : "bg-line"
            }`}
          />
        ))}
      </div>
      <span className="w-4 font-mono text-sm tabular-nums text-content-soft">
        {valeur}
      </span>
    </div>
  );
}
