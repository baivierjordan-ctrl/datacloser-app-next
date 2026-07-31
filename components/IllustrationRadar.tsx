/**
 * Illustration « radar » propriétaire.
 *
 * Un SVG dessiné pour la marque plutôt qu'une photo de banque d'images :
 * les photos génériques datent une interface plus vite que tout le
 * reste, et celle-ci pèse moins d'un kilooctet. Cercles concentriques,
 * balayage, trois échos — le produit en une image.
 *
 * Purement décorative : aria-hidden, et aucune information n'y vit.
 */
export function IllustrationRadar({ classe = "" }: { classe?: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      fill="none"
      aria-hidden="true"
      className={classe}
    >
      {/* Cercles de portée */}
      {[150, 112, 74, 36].map((rayon, i) => (
        <circle
          key={rayon}
          cx="160"
          cy="160"
          r={rayon}
          stroke="currentColor"
          strokeOpacity={0.08 + i * 0.03}
          strokeWidth="1"
        />
      ))}

      {/* Axes */}
      <path
        d="M160 10v300M10 160h300"
        stroke="currentColor"
        strokeOpacity="0.06"
        strokeWidth="1"
      />

      {/* Balayage : un quart de disque en dégradé qui tourne */}
      <g style={{ transformOrigin: "160px 160px" }} className="animation-balayage">
        <path
          d="M160 160 L160 12 A148 148 0 0 1 264 56 Z"
          fill="url(#degrade-balayage)"
        />
        <line
          x1="160"
          y1="160"
          x2="160"
          y2="12"
          stroke="#00e5b0"
          strokeOpacity="0.5"
          strokeWidth="1.5"
        />
      </g>

      {/* Échos détectés */}
      <circle cx="212" cy="98" r="4" fill="#00e5b0" />
      <circle cx="212" cy="98" r="9" stroke="#00e5b0" strokeOpacity="0.3" />
      <circle cx="118" cy="204" r="3" fill="#00e5b0" fillOpacity="0.7" />
      <circle cx="96" cy="120" r="2.5" fill="#00e5b0" fillOpacity="0.45" />

      {/* Centre */}
      <circle cx="160" cy="160" r="3" fill="#00e5b0" />

      <defs>
        <linearGradient
          id="degrade-balayage"
          x1="160"
          y1="12"
          x2="240"
          y2="160"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00e5b0" stopOpacity="0.22" />
          <stop offset="1" stopColor="#00e5b0" stopOpacity="0" />
        </linearGradient>
      </defs>

      <style>{`
        .animation-balayage {
          animation: rotation-radar 6s linear infinite;
        }
        @keyframes rotation-radar {
          to { transform: rotate(1turn); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animation-balayage { animation: none; }
        }
      `}</style>
    </svg>
  );
}
