/**
 * Marque DataCloser.
 *
 * Reprise exacte du traitement de la landing : Space Grotesk en graisse
 * 700, interlettrage resserré, « Closer » en teal. Le site et
 * l'application doivent porter le même nom de la même façon — c'est ce
 * qui fait qu'on les reconnaît comme un seul produit.
 */
export function Marque({
  taille = "normale",
}: {
  taille?: "normale" | "grande";
}) {
  const corps = taille === "grande" ? "text-[26px]" : "text-[19px]";

  return (
    <span
      className={`font-display font-bold tracking-[-0.02em] text-content ${corps}`}
    >
      Data<span className="text-teal">Closer</span>
    </span>
  );
}

/**
 * Marque avec le filet vertical repris du visuel de partage : une barre
 * teal de deux pixels sur l'arête gauche. Sert d'en-tête aux écrans
 * d'authentification, où il n'y a pas de navigation pour porter le nom.
 */
export function MarqueEnTete() {
  return (
    <div className="mb-8 flex items-center gap-3">
      <span aria-hidden="true" className="h-7 w-[2px] rounded-full bg-teal" />
      <Marque taille="grande" />
    </div>
  );
}
